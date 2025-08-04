const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-Jw77f9GB.js","assets/index-AEfKb-nm.css"])))=>i.map(i=>d[i]);
import{_ as r}from"./index-Jw77f9GB.js";import{f as l}from"./animation-c2PSssWq.js";let a="2025";async function _(t=null){try{const e=await fetch("/journeys.json");if(!e.ok)throw new Error(`HTTP ${e.status}`);const i=await e.json();t&&(a=t);const n=d(i,a);document.getElementById("content-page").innerHTML=n,l(),u(),v()}catch(e){console.error("Failed to load projects",e)}}function d(t,e){const n=t.filter(o=>o.year===e).map(o=>{const c=o.dateContent.map(s=>`
      <div class="timeline-card" data-journey-id="${s.id}" data-action="${s.action}">
        <div class="timeline_title-bar">
          <div class="timeline_title">
            ${s.title}
          </div>
          ${s.type_icon1}
        </div>
        <p class="timeline_text">
          ${s.text}
        </p>
        <div class="timeline-row">
          <div class="timeline_image">
            ${s.image_1}
            ${s.image_2}
          </div>
          <div class="timeline_link_button">
            <img src="/images/icon-rightarrow.svg" class="timeline_link_icon" title="My Project">
          </div>
        </div>
      </div>
    `).join("");return`
      <div class="timeline_item">
        <div class="timeline_left">
          <div class="timeline_date-text">${o.month} ${o.year}</div>
        </div>
        <div class="timeline_centre">
          <div class="timeline_circle"></div>
        </div>
        <div class="timeline_right">
          ${c}
        </div>
      </div>
    `}).join("");return`
    <div class="fade-in">
      <div class="year-selector">
        <div class="year ${e==="2024"?"active":""}">2024</div>
        <div class="year ${e==="2025"?"active":""}">2025</div>
      </div>
      <div class="page-wrapper">
        <div class="section-timeline">
          <div class="container">
            <div class="timeline_component">
              <div class="timeline-progress">
                <div class="timeline-progress-bar"></div>
              </div>
              ${n}
              <div class="overlay-fade-top"></div>
              <div class="overlay-fade-bottom"></div>
            </div>
          </div>
        </div>
        <div style="height: 45vh;"></div>
      </div>
    </div>
  `}function v(){document.querySelector(".year-selector").addEventListener("click",async t=>{const e=t.target.closest(".year");e&&(document.querySelector(".year.active").classList.remove("active"),e.classList.add("active"),r(async()=>{const{router:i}=await import("./index-Jw77f9GB.js").then(n=>n.m);return{router:i}},__vite__mapDeps([0,1])).then(({router:i})=>{i.navigate("journey",!0,null,e.innerHTML)}))})}function u(){document.querySelector(".timeline_component").addEventListener("click",async t=>{const e=t.target.closest(".timeline_link_button");if(e){const i=e.closest(".timeline-card"),n=i.dataset.action,o=i.dataset.journeyId;switch(n){case"popbox":m();break;case"navigate":window.location.href=`/projects/${o}`;break;default:console.warn(`Unknown action: ${n}`)}}})}function m(t){document.querySelector(".pop-overlay").style.display="flex",document.querySelector(".pop-content").innerHTML=t,document.querySelector(".btn-close").addEventListener("click",async e=>{document.querySelector(".pop-overlay").style.display="none"})}export{_ as renderJourney};
