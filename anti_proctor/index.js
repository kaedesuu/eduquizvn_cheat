;(() => {
  const o_fetch = window.fetch;
  const in_exam_url = () =>
    (
      window?.location?.href?.toString().includes("hoc-sinh/luyen-de") ||
      window?.location?.href?.toString().includes("hoc-sinh/bai-tap-ve-nha")
    ) &&
     window.location.href.split("?")[0].split("/").splice(-1)[0].split("-").length === 2 // most exam code in format: "AB-12345678";

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

  const main = () => {
    // hook fetch() function
    window.fetch = async (...data) => {
      if (!in_exam_url()) {
        return o_fetch(...data);
      }

      // check if body exist
      if (!data[1])
        return o_fetch(...data);

      if (!data[1]?.body || !is_json(data[1]?.body))
        return o_fetch(...data);

      const body = JSON.parse(data[1]?.body);

      // array type must have at least one child
      if (body.length <= 0)
        return o_fetch(...data);

      // set those keys to normal data
      body[0].proctoringLogs = [];
      body[0].violationCount = 0;
      body[0].isAutoSubmittedByViolation = false;

      // turn into string and send request
      data[1].body = JSON.stringify(body);
      return o_fetch(...data);
    }
  }

  const _o_replace_state = window?.history?.replaceState || history?.replaceState;
  window.history.replaceState = (...data) => {
    if (in_exam_url()) {
      main();
    } else {
      // clean all hooks and watchers
      window.fetch = o_fetch;
    }

    return _o_replace_state.apply(window.history, data);
  }

  if (in_exam_url()) { main(); }
})();