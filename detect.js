;(() => {
  if (!window.localStorage.getItem("eduquiz_system_config"))
    return console.log("you're not on an eduquiz.vn's instance");

  const instance_test = JSON.parse(window.localStorage.getItem("eduquiz_system_config"));
  if (!instance_test?.schoolName || !instance_test?.academicYear)
    return console.log("you are not on an eduquiz.vn's instance");

  console.log("[success]: yes, you are on an eduquiz's instance, you can use the scripts in the repository.");
})();