;(() => {
  const o_fetch = window.fetch;
  const duration_time = (20n ** 200n - 1n).toString();
  const is_num = (n) => !isNaN(Number(n));
  let interval_storage = null;
  const in_exam_url = () =>
    (
      window?.location?.href?.toString().includes("hoc-sinh/luyen-de") ||
      window?.location?.href?.toString().includes("hoc-sinh/bai-tap-ve-nha")
    ) &&
     window.location.href.split("?")[0].split("/").splice(-1)[0].split("-").length === 2 // most exam code in format: "AB-12345678";

  const main = () => {
    // function to update all stored time in localstorage
    const update_localstorage = () =>
      Object.keys(window.localStorage).forEach((key) => {
        if (!key.includes("_deadline_")) return;
        if (!is_num(window.localStorage.getItem(key))) return;
        window.localStorage.setItem(key, duration_time);
      });
    
    interval_storage = setInterval(update_localstorage, 10000);
    update_localstorage();

    // hook fetch() function
    window.fetch = async (...data) => {
      if (!in_exam_url()) {
        return o_fetch(...data);
      }

      const res = await o_fetch(...data);
      const res_text = await res.text();
      const modified_text = res_text.replaceAll(
        /"durationMinutes":\s*\d+/g,
        `"durationMinutes":${duration_time}`
      );

      return new Response(modified_text, {
        status: res.status,
        statusText: res.statusText,
        headers: res.headers
      })
    }
  }

  const _o_replace_state = window?.history?.replaceState || history?.replaceState;
  window.history.replaceState = (...data) => {
    if (in_exam_url()) {
      main();
    } else {
      // clean all hooks and watchers
      window.fetch = o_fetch;
      if (interval_storage) {
        clearInterval(interval_storage);
        interval_storage = null;
      }
    }

    return _o_replace_state.apply(window.history, data);
  }

  if (in_exam_url()) { main(); }
})();