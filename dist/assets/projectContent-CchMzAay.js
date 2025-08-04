const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-Jw77f9GB.js","assets/index-AEfKb-nm.css"])))=>i.map(i=>d[i]);
import{_ as a}from"./index-Jw77f9GB.js";import{marked as i}from"https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";import{p as s}from"./animation-c2PSssWq.js";async function p(r){try{const e=await fetch(`/projects/${r}.md`);if(console.log(e.headers.get("content-type")),!e.ok)throw new Error("File not found");const t=await e.text();if(t.includes("<!DOCTYPE html>"))throw new Error("File not found - received HTML instead of markdown");const n=`
      <div class="markdown-body pop-up">
        ${i.parse(t)}
      </div>
    `;document.getElementById("content-page").innerHTML=n,s()}catch(e){console.error(`Error loading file: ${e.message}`),a(async()=>{const{router:t}=await import("./index-Jw77f9GB.js").then(o=>o.m);return{router:t}},__vite__mapDeps([0,1])).then(({router:t})=>{t.navigate("projects")})}}export{p as renderProjectContent};
