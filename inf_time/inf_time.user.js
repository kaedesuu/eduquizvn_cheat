// ==UserScript==
// @name         eduquiz_inf_time
// @namespace    https://github.com/kaedesuu/eduquizvn_cheat
// @version      2026-10-01
// @description  set timer of the exam to infinite
// @author       kaedesuu
// @match        https://lms.eduquiz.vn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lms.eduquiz.vn
// @license      GPL-3.0
// @grant        none
// ==/UserScript==

(()=>{const t=window.fetch,e="9999".padEnd(400,"0");let n=null;const a=()=>(window?.location?.href?.toString().includes("hoc-sinh/luyen-de")||window?.location?.href?.toString().includes("hoc-sinh/bai-tap-ve-nha"))&&2===window.location.href.split("?")[0].split("/").splice(-1)[0].split("-").length,i=()=>{const i=()=>Object.keys(window.localStorage).forEach(t=>{var n;t.includes("_deadline_")&&(n=window.localStorage.getItem(t),isNaN(Number(n))||window.localStorage.setItem(t,e))});n=setInterval(i,1e4),i(),window.fetch=async(...n)=>{if(!a())return t(...n);const i=await t(...n),o=(await i.text()).replaceAll(/"durationMinutes":\s*\d+/g,`"durationMinutes":${e}`);return new Response(o,{status:i.status,statusText:i.statusText,headers:i.headers})}},o=window?.history?.replaceState||history?.replaceState;window.history.replaceState=(...e)=>(a()?i():(window.fetch=t,n&&(clearInterval(n),n=null)),o.apply(window.history,e)),a()&&i()})();