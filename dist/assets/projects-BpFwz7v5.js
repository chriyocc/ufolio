const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-Jw77f9GB.js","assets/index-AEfKb-nm.css"])))=>i.map(i=>d[i]);
import{_ as s}from"./index-Jw77f9GB.js";import{p as i}from"./animation-c2PSssWq.js";async function l(){try{const o=await fetch("/projects.json");if(!o.ok)throw new Error(`HTTP ${o.status}`);const e=await o.json(),t=n(e);document.getElementById("content-page").innerHTML=t,i(),a()}catch(o){console.error("Failed to load projects",o)}}function n(o){return`
    <div class="page-wrapper">
      <div class="project-container">
        ${o.map(t=>`
    <div class="project-card pop-up" data-project-id="${t.id}">
      <img class="thumbnail" src="${t.image}">
      <div class="project-info">
        <p class="project-date">${t.date}</p>
        <div class="project-title-bar">
          <p class="project-title">${t.title}</p>
          <div class="logo-container">
            ${t.tool_icon1}
            ${t.tool_icon2}
          </div>
        </div>
        <p class="project-description">${t.description}</p>
      </div>
    </div>
  `).join("")}
      </div>
    </div>
  `}function a(){document.querySelector(".project-container").addEventListener("click",o=>{const e=o.target.closest(".project-card");if(e){const t=e.dataset.projectId;s(async()=>{const{router:r}=await import("./index-Jw77f9GB.js").then(c=>c.m);return{router:r}},__vite__mapDeps([0,1])).then(({router:r})=>{r.navigate("project",!0,t,null)})}})}export{l as renderProjects};
