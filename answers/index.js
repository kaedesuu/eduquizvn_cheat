;(async () => {
  const o_fetch = window.fetch;
  let status_ob = null;
  let student_code = "";
  const question_id = [];
  const question_map = new Map();

  const is_num = (n) => !isNaN(Number(n));
  const in_exam_url = (_url) =>
    (
      (_url ?? window?.location?.href)?.toString().includes("hoc-sinh/luyen-de") ||
      (_url ?? window?.location?.href)?.toString().includes("hoc-sinh/bai-tap-ve-nha")
    ) && // the .length === 2 check shouldn't use _url since the application code can send in full url or routes, it's unpredictable.
     window.location.href?.toString().split("?")[0].split("/").splice(-1)[0].split("-").length === 2; // most exam code in format: "AB-12345678";

  // from stackoverflow
  const is_json = (item) => {
    let value = typeof item !== "string" ? JSON.stringify(item) : item;    
    try {
      value = JSON.parse(value);
    } catch (e) {
      return false;
    }
      
    return typeof value === "object" && value !== null;
  }

  const main = async () => {
    // create a listener if question status got updated
    const is_valid_status_reporter = (status_reports, i) => {
      // make sure still in exam
      if (!in_exam_url()) return;

      if ( (Number((status_reports ?? { length: 0 })["length"]) ?? 0) <= 0 ) return;
      if (
        !status_reports[i] ||
        !status_reports[i]?.innerText ||
        !status_reports[i].innerText
          ?.toString()
          .toLowerCase()
          .includes("câu")
      ) return false;

      const removed_c = status_reports[i].innerText
          ?.toString()
          .toLowerCase()
          .split(" ")
          .splice(1)
          .join("")
          .replaceAll(" ", "")
          .split("/");

      if (!is_num(removed_c[0]) || !is_num(removed_c[1]))
        return false;

      return removed_c.map((_page) => Number(_page));
    }

    const get_working_question_status = async (status_elements, retries) => {
      // make sure still in exam
      if (!in_exam_url()) return;

      // already in the exam but failed to get due to missing element?
      // if *-question-id-* id exist but can't find group/badge => the exam removes it on purpose?
      if (
        document.querySelectorAll(`button[id*="-question-dot-"]`).length > 0 &&
        retries > 2
        // && status_elements.length <= 0 // this check isn't really needed
      ) {
        console.log("failed to get normal question status element, retry with a different element...")
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return get_working_question_status(
          document.querySelectorAll(`span[class*="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-md"]`),
          0
        )
      }

      if (status_elements.length <= 0) {
        console.log("failed to get question status, retry...");
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return get_working_question_status(
          document.getElementsByClassName("group/badge"),
          (retries || 0) + 1
        );
      }

      let valid_status = [];
      for (let i = 0; i < status_elements.length; i++) {
        if (!is_valid_status_reporter(status_elements, i)) continue;
        valid_status.push(status_elements[i]);
      }

      if (valid_status.length <= 0) {
        console.log("failed to get question status, retry...");
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return get_working_question_status(
          document.getElementsByClassName("group/badge"),
          (retries || 0) + 1
        );
      }

      return valid_status;
    }

    let exam_code = window.location.href.split("?")[0].split("/").splice(-1)[0];
    let raw_shuffled_question_key = Object.keys(window.sessionStorage).filter(
      (k) => k.includes(`exam_shuffled_order_${exam_code}_${student_code}`)
    ).splice(-1)[0] ?? "";
    let raw_shuffled_question_order = window.sessionStorage.getItem(raw_shuffled_question_key);
    let shuffled_question_order = null;

    const get_shuffled_question_order = async () => {
      // make sure still in exam
      if (!in_exam_url()) return;

      // update variable before getting the question order 
      exam_code = window.location.href.split("?")[0].split("/").splice(-1)[0];
      raw_shuffled_question_key = Object.keys(window.sessionStorage).filter(
        (k) => k.includes(`exam_shuffled_order_${exam_code}_${student_code}`)
      ).splice(-1)[0] ?? "";
      raw_shuffled_question_order = window.sessionStorage.getItem(raw_shuffled_question_key);

      // maybe no shuffle for the exam?
      if (
        typeof raw_shuffled_question_order !== "string" &&
        typeof exam_code !== "undefined" &&
        typeof student_code !== "undefined"
      ) {
        raw_shuffled_question_order = JSON.stringify(question_id);
      }

      // checks      
      if (typeof raw_shuffled_question_order !== "string") {
        console.log("failed to get shuffled question order, retry...");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const data = await get_shuffled_question_order();
        return new Promise((resolve) => resolve(data));
      }

      if (!is_json(raw_shuffled_question_order))
        return console.log("failed to parse shuffled question order data");

      console.log("successfully get the shuffled question order")
      shuffled_question_order = JSON.parse(raw_shuffled_question_order);
    }

    // call function to update the question order variable
    get_shuffled_question_order();

    const answer_buttons_order = {"A": 0, "B": 1, "C": 2, "D": 3};
    let prev_status = -1;

    const on_status_change = (status_arr) => {
      if (!in_exam_url()) return;
      if (question_map.size <= 0) return;
      const question_status = status_arr[0];
      if (question_status === prev_status) return;

      try {
        // get current question's answer
        const curr_answer = question_map.get(
          shuffled_question_order[question_status - 1]
        );

        switch(curr_answer?.type) {
          case "single-choice":
            // clear all answer highlight
            for (const _button of document.querySelectorAll(`label[class*="flex items-center gap-3"]`)) {
              _button.style.borderColor = "var(--border)";
            }

            // get all answer buttons
            document.querySelectorAll(`label[class*="flex items-center gap-3"]`)[ answer_buttons_order[curr_answer?.correctKey] ].style.borderColor = "#ffffff";
            break;
          case "true-false":
            const sub_items = curr_answer?.subItems;
            const true_false_arr = sub_items.map((el) => el.isCorrect === true);

            // clear all true-false highlight
            for (const _button of document.querySelectorAll(`div[class*="flex items-center gap-2 shrink-0"]`)) {
              const true_false_div = _button[0];
              const true_button = true_false_div[0] ?? { "style": {} };
              const false_button = true_false_div[1] ?? { "style": {} };

              true_button.style.borderColor = "var(--border)";
              false_button.style.borderColor = "var(--border)";
            }
            
            for (let i = 0; i < true_false_arr.length; i++) {
              const true_false_div =
                document.querySelectorAll(`div[class*="flex items-center gap-2 shrink-0"]`)[i]
                  ?? { children: [] };

              const c_option = true_false_arr[i];
              const true_false_button = true_false_div[c_option === true ? 0 : 1] ?? { "style": {} };
              true_false_button.style.borderColor = "#ffffff";
            }
            break;
          case "short-answer":
            const _answer = curr_answer?.shortAnswerCorrectKey;
            const input_box = document.querySelectorAll(`input[class*="w-full min-w-0 border border-input"]`)[0];

            // the main program is written in nextjs, so use this method
            Object.getOwnPropertyDescriptor(
              HTMLInputElement.prototype, 
              "value"
            ).set.call(input_box, _answer?.toString());

            // fake input event
            input_box.dispatchEvent(
              new InputEvent("input", {
                bubbles: true,
                cancelable: true,
                inputType: "insertText",
                data: input_box
              })
            );
            break;
        }

        // update prev status
        prev_status = question_status;
      } catch {}
    }

    const question_status_element = document.getElementsByClassName("group/badge");
    const working_status_elements = await get_working_question_status(question_status_element);
    on_status_change(is_valid_status_reporter(working_status_elements, 0));

    status_ob = new MutationObserver((mutation_list) => {
      // make sure still in exam
      if (!in_exam_url()) return;

      // normal checking
      for (const mutation of mutation_list) {
        if (mutation?.type !== "characterData" && imutation?.type !== "childList")
          continue;

        const _valid_status_report = is_valid_status_reporter(working_status_elements, 0);
        if (!_valid_status_report) return;
        on_status_change(_valid_status_report);
      }
    })
      .observe(
        working_status_elements[0],
        { childList: true, characterData: true, subtree: true }
      );
  }

  window.fetch = async (...data) => {
    const input_url = data[0] instanceof Request ? data[0].url : data[0]?.toString();
    if (
      !in_exam_url(input_url) &&
      !(
        input_url.includes("hoc-sinh") &&
        ((data[1]?.method) ?? "GET") === "POST" &&
        (
          is_json(data[1]?.body) ? JSON.parse(data[1]?.body) : { length: 0 }
        ).length <= 0
      )
    ) {
      return o_fetch(...data);
    }

    const res = await o_fetch(...data);
    const res_text = await res.text();

    const data_body = res_text.split("\n");
    if (data_body.length >= 2) {
      // this method to find safe string is really buggy, but it works
      // i hate RSC stuff, RSC parsing is hard.
      const exam_data_raw_unsafe = data_body.filter((el) => el?.toString()?.includes("1:"));
      let _exam_data_raw = null;

      // find safe json string
      for (let i = 0; i < exam_data_raw_unsafe.length; i++) {
        if (!exam_data_raw_unsafe[i].includes("{")) continue;
        _exam_data_raw = exam_data_raw_unsafe.splice(i).join(":").split("1:");
        break;
      }

      for (let i = 0; i < _exam_data_raw.length; i++) {
        if (!_exam_data_raw[i].includes("{")) continue;
        exam_data_raw = _exam_data_raw.splice(i).join(":");
        break;
      }

      // parse json
      if (!is_json(exam_data_raw))
        return new Response(res_text, {
          status: res.status,
          statusText: res.statusText,
          headers: res.headers
        });

      const exam_data = JSON.parse(exam_data_raw);

      // get student code
      const _student_code = exam_data?.user?.sbd;
      if (
        typeof _student_code === "string" &&
        (student_code === "" || typeof student_code === "undefined" || student_code === null)
      )
        student_code = _student_code;

      // get question data
      let question_data = null;
      if (exam_data?.exam) {
        question_data = exam_data?.exam?.questions ?? null;
      } else if (exam_data?.homework) {
        question_data = exam_data?.homework?.questions ?? null;
      }

      // return the response when failed to get the question data
      if (
        exam_data?.success !== true ||
        typeof question_data !== "object" ||
        !Array.isArray(question_data)
      )
        return new Response(res_text, {
          status: res.status,
          statusText: res.statusText,
          headers: res.headers
        });

      // clear the question_map
      question_map.clear();
      
      // O(n) loop to recreate the map for faster O(1) access in the future
      for (const _data of question_data) {
        // for shuffle
        question_map.set(_data?.id, _data);

        // for non-shuffle
        question_id.push(_data?.id);
      }
    }

    return new Response(res_text, {
      status: res.status,
      statusText: res.statusText,
      headers: res.headers
    })
  }

  const _o_replace_state = window?.history?.replaceState || history?.replaceState;
  window.history.replaceState = (...data) => {
    if (in_exam_url()) {
      main();
    } else {
      // clean all watchers and variables
      question_map.clear();
      if (status_ob && typeof status_ob["disconnect"] === "function") {
        status_ob.disconnect();
        status_ob = null;
      }
    }

    return _o_replace_state.apply(window.history, data);
  }

  if (in_exam_url()) { main(); }
})();