// ==UserScript==
// @name         eduquiz_inf_time
// @namespace    https://github.com/kaedesuu/eduquizvn_cheat
// @version      2026-09-27
// @description  set timer of the exam to almost infinite
// @author       kaedesuu
// @match        https://lms.eduquiz.vn/hoc-sinh/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lms.eduquiz.vn
// @license      GPL-3.0
// @grant        none
// ==/UserScript==

(()=>{const t=window.fetch,e=(20n**200n-1n).toString();let n=null;const i=()=>(window?.location?.href?.toString().includes("hoc-sinh/luyen-de")||window?.location?.href?.toString().includes("hoc-sinh/bai-tap-ve-nha"))&&2===window.location.href.split("?")[0].split("/").splice(-1)[0].split("-").length,o=()=>{const o=()=>Object.keys(window.localStorage).forEach(t=>{var n;t.includes("_deadline_")&&(n=window.localStorage.getItem(t),isNaN(Number(n))||window.localStorage.setItem(t,e))});n=setInterval(o,1e4),o(),window.fetch=async(...n)=>{if(!i())return t(...n);const o=await t(...n),a=(await o.text()).replaceAll(/"durationMinutes":\s*\d+/g,`"durationMinutes":${e}`);return new Response(a,{status:o.status,statusText:o.statusText,headers:o.headers})}},a=window?.history?.replaceState||history?.replaceState;window.history.replaceState=(...e)=>(i()?(window.fetch=t,n&&(clearInterval(n),n=null)):o(),a.apply(window.history,e)),i()||o()})();