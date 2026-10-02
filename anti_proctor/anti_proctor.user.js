// ==UserScript==
// @name         eduquiz_anti_proctor
// @namespace    https://github.com/kaedesuu/eduquizvn_cheat
// @version      2026-10-03
// @description  allow user to exit fullscreen without trigger proctoring
// @author       kaedesuu
// @match        https://lms.eduquiz.vn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lms.eduquiz.vn
// @license      GPL-3.0
// @grant        none
// ==/UserScript==

(()=>{const t=window.fetch,i=()=>(window?.location?.href?.toString().includes("hoc-sinh/luyen-de")||window?.location?.href?.toString().includes("hoc-sinh/bai-tap-ve-nha"))&&2===window.location.href.split("?")[0].split("/").splice(-1)[0].split("-").length,o=()=>{window.fetch=async(...o)=>{if(!i())return t(...o);if(!o[1])return t(...o);if(!o[1]?.body||!(t=>{let i="string"!=typeof t?JSON.stringify(t):t;try{i=JSON.parse(i)}catch(t){return!1}return"object"==typeof i&&null!==i})(o[1]?.body))return t(...o);const n=JSON.parse(o[1]?.body);return n.length<=0||(n[0].proctoringLogs=[],n[0].violationCount=0,n[0].isAutoSubmittedByViolation=!1,o[1].body=JSON.stringify(n)),t(...o)}},n=window?.history?.replaceState||history?.replaceState;window.history.replaceState=(...e)=>(i()?o():window.fetch=t,n.apply(window.history,e)),i()&&o()})();