import{marked as p}from"https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const r of s.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function t(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(i){if(i.ep)return;i.ep=!0;const s=t(i);fetch(i.href,s)}})();async function l(){const o=document.querySelectorAll(".pop-up");for(let e=0;e<o.length;e++)await new Promise(t=>{setTimeout(()=>{o[e].classList.add("page-in"),t()},100)});setTimeout(()=>{o.forEach(e=>{e.classList.remove("pop-up"),e.classList.remove("page-in")})},500)}async function m(){const o=document.querySelector(".fade-in");await new Promise(e=>{setTimeout(()=>{o.classList.add("page-in"),e()},100)}),setTimeout(()=>{o.classList.remove("fade-in"),o.classList.remove("page-in")},500)}async function h(){const o=await fetch("/about.html");if(!o.ok)throw new Error(`HTTP ${o.status}`);const e=await o.text();document.getElementById("content-page").innerHTML=e,l()}async function g(){try{const o=await fetch("/projects.json");if(!o.ok)throw new Error(`HTTP ${o.status}`);const e=await o.json(),t=v(e);document.getElementById("content-page").innerHTML=t,l(),f()}catch(o){console.error("Failed to load projects",o)}}function v(o){return`
    <div class="page-wrapper">
      <div class="project-container">
        ${o.map(t=>`
    <div class="project-card pop-up" data-project-id="${t.id}">
      <img class="thumbnail" src="${t.image}" loading="lazy">
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
  `}function f(){document.querySelector(".project-container").addEventListener("click",o=>{const e=o.target.closest(".project-card");if(e){const t=e.dataset.projectId;a.navigate("project",!0,t,null)}})}function y(o){document.querySelector(".pop-overlay").style.display="flex",document.querySelector(".pop-content").innerHTML=o,document.querySelector(".btn-close").addEventListener("click",async e=>{document.querySelector(".pop-overlay").style.display="none"})}let d="2025";async function w(o=null){try{const e=await fetch("/journeys.json");if(!e.ok)throw new Error(`HTTP ${e.status}`);const t=await e.json();o&&(d=o);const n=j(t,d);document.getElementById("content-page").innerHTML=n,m(),L(),b()}catch(e){console.error("Failed to load projects",e)}}function j(o,e){const n=o.filter(i=>i.year===e).map(i=>{const s=i.dateContent.map(r=>`
      <div class="timeline-card" data-journey-id="${r.id}" data-action="${r.action}">
        <div class="timeline_title-bar">
          <div class="timeline_title">
            ${r.title}
          </div>
          ${r.type_icon1}
        </div>
        <p class="timeline_text">
          ${r.text}
        </p>
        <div class="timeline-row">
          <div class="timeline_image" loading="lazy">
            ${r.image_1}
            ${r.image_2}
          </div>
          <div class="timeline_link_button">
            <img src="/images/icon-rightarrow.svg" class="timeline_link_icon" title="My Project">
          </div>
        </div>
      </div>
    `).join("");return`
      <div class="timeline_item">
        <div class="timeline_left">
          <div class="timeline_date-text">${i.month} ${i.year}</div>
        </div>
        <div class="timeline_centre">
          <div class="timeline_circle"></div>
        </div>
        <div class="timeline_right">
          ${s}
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
  `}function b(){document.querySelector(".year-selector").addEventListener("click",async o=>{const e=o.target.closest(".year");e&&(document.querySelector(".year.active").classList.remove("active"),e.classList.add("active"),a.navigate("journey",!0,null,e.innerHTML))})}function L(){document.querySelector(".timeline_component").addEventListener("click",async o=>{const e=o.target.closest(".timeline_link_button");if(e){const t=e.closest(".timeline-card"),n=t.dataset.action,i=t.dataset.journeyId;switch(n){case"popbox":y(`<h1>My Comprehensive Markdown Showcase</h1>
<p>This document is a comprehensive demonstration of various Markdown features. It's designed to be a long, detailed example, covering a wide range of formatting options.</p>
<h2>Section 1: Basic Text Formatting</h2>
<p>Here's a paragraph of text. You can make words <strong>bold</strong> or <em>italic</em>. You can also use a combination like <strong><em>bold and italic</em></strong>. For strikethrough, you can use two tildes: <del>this text is gone</del>.</p>
<ul>
<li>This is a bullet point list.</li>
<li>Another item.
<ul>
<li>You can nest lists by indenting.</li>
<li>Like this.</li>
</ul>
</li>
</ul>
<ol>
<li>This is a numbered list.</li>
<li>The second item.</li>
<li>The third item.</li>
</ol>
<hr>
<h2>Section 2: Links and Images</h2>
<p>This is a regular inline link to <a href="https://www.google.com">Google</a>.</p>
<p>Here is a reference-style link. I can link to <a href="https://www.wikipedia.org">Wikipedia</a> using a short identifier.</p>
<p><img src="https://picsum.photos/600/400" alt="A beautiful landscape image"></p>
<h2>Section 3: Blockquotes and Code</h2>
<blockquote>
<p>This is a blockquote.
It's often used for quoting text from another source.</p>
<blockquote>
<p>You can also nest blockquotes for more complex structures.</p>
</blockquote>
</blockquote>
<p>Here is some <code>inline code</code> within a sentence. It's useful for calling out small snippets like variable names or commands.</p>
<p>And here is a code block, which is used for larger chunks of code.</p>
<pre><code class="language-python">def fibonacci(n):
    a, b = 0, 1
    while a &lt; n:
        print(a, end=' ')
        a, b = b, a+b
    print()

fibonacci(1000)
</code></pre>
<h2>Section 4: Tables</h2>
<p>This is a simple table demonstrating how to organize data.</p>
<table>
<thead>
<tr>
<th style="text-align: left;">Header 1</th>
<th style="text-align: center;">Header 2</th>
<th style="text-align: left;">Header 3</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: left;">Left</td>
<td style="text-align: center;">Center</td>
<td style="text-align: left;">Right</td>
</tr>
<tr>
<td style="text-align: left;">Cell 1</td>
<td style="text-align: center;">Cell 2</td>
<td style="text-align: left;">A longer cell with more text.</td>
</tr>
<tr>
<td style="text-align: left;">Cell 4</td>
<td style="text-align: center;">Cell 5</td>
<td style="text-align: left;">Cell 6</td>
</tr>
<tr>
<td style="text-align: left;">This is a row with a lot of content across multiple columns.</td>
<td style="text-align: center;">Another cell with content.</td>
<td style="text-align: left;">And one more.</td>
</tr>
</tbody>
</table>
<h2>Section 5: Horizontal Rule and Miscellaneous</h2>
<p>You can use three or more hyphens, asterisks, or underscores to create a horizontal rule.</p>
<hr>
<h2>Section 6: More Complex Lists</h2>
<p>Here is a more complex nested list structure, demonstrating how deep and varied you can make your lists.</p>
<ul>
<li><strong>Project Kickoff</strong>
<ul>
<li>Task A
<ol>
<li>Subtask A.1</li>
<li>Subtask A.2</li>
</ol>
</li>
<li>Task B</li>
</ul>
</li>
<li><strong>Implementation Phase</strong>
<ul>
<li>Milestone 1
<ul>
<li>Feature X</li>
<li>Feature Y</li>
</ul>
</li>
<li>Milestone 2
<ul>
<li>Feature Z
<ul>
<li>Detail 1</li>
<li>Detail 2</li>
</ul>
</li>
</ul>
</li>
</ul>
</li>
</ul>
`);break;case"navigate":window.location.href=`/projects/${i}`;break;default:console.warn(`Unknown action: ${n}`)}}})}async function k(o){try{const e=await fetch(`/projects/${o}.md`);if(console.log(e.headers.get("content-type")),!e.ok)throw new Error("File not found");const t=await e.text();if(t.includes("<!DOCTYPE html>"))throw new Error("File not found - received HTML instead of markdown");const i=`
      <div class="markdown-body pop-up">
        ${p.parse(t)}
      </div>
    `;document.getElementById("content-page").innerHTML=i,l()}catch(e){console.error(`Error loading file: ${e.message}`),a.navigate("projects")}}class T{constructor(){this.routes={about:()=>Promise.resolve(h()),projects:()=>Promise.resolve(g()),journey:t=>Promise.resolve(w(t)),project:t=>Promise.resolve(k(t))},this.contentEl=document.getElementById("content-page"),window.addEventListener("popstate",t=>{if(t.state){const{route:n,projectID:i,currentYear:s}=t.state;this.navigate(n,!1,i,s)}else{const n=this.getRouteFromUrl();this.navigate(n.route,!1,n.projectID,n.currentYear)}});const e=this.getRouteFromUrl();this.navigate(e.route,!0,e.projectID,e.currentYear)}getRouteFromUrl(){const e=window.location.pathname.split("/").filter(t=>t);return e.length===0?{route:"about",projectID:null}:e[0]=="projects"&&e[1]?{route:"project",projectID:e[1]}:e[0]=="journey"&&e[1]==="2024"||e[1]==="2025"?{route:"journey",currentYear:e[1]}:e[0]=="journey"?{route:"journey",currentYear:"2025"}:{route:this.routes[e[0]]?e[0]:"about",projectID:null,currentYear:null}}async navigate(e,t=!0,n=null,i="2025"){const s=window.location.pathname;this.needsLoading(e)&&this.showLoading();const{url:c,stateData:u}=this.buildRouteData(e,n,i);t&&s!==c&&history.pushState(u,"",c),await this.executeRoute(e,n,i),this.updateNavBar(e),window.scrollTo(0,0),setTimeout(()=>{this.hideLoading()},1e3)}buildRouteData(e,t,n){return e=="project"&&t?{url:`/projects/${t}`,stateData:{route:e,projectID:t}}:e=="journey"&&n?{url:`/journey/${n}`,stateData:{route:e,currentYear:n}}:{url:`/${e=="projects"?"projects":""}`,stateData:{route:e}}}async executeRoute(e,t,n){e=="project"?this.routes[e].call(this,t):e=="journey"?this.routes[e].call(this,n):this.routes[e].call(this)}needsLoading(e){return e=="projects"||e=="project"||e=="journey"}showLoading(){document.getElementById("pageLoader").classList.remove("hidden")}hideLoading(){pageLoader.classList.add("hidden")}updateNavBar(e){var t;e=="project"?document.querySelector(".nav-bar").style.display="none":(document.querySelector(".nav-bar").style.display="flex",document.querySelector(".nav-item.active").classList.remove("active"),(t=document.getElementById(`${e}`))==null||t.classList.add("active"),document.querySelector(".nav-container").classList.add("active"))}}const a=new T;document.addEventListener("DOMContentLoaded",()=>{document.getElementById("about").addEventListener("click",()=>a.navigate("about")),document.getElementById("projects").addEventListener("click",()=>a.navigate("projects")),document.getElementById("journey").addEventListener("click",()=>a.navigate("journey"))});
