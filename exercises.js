/* empty css                      */(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const a of e)if(a.type==="childList")for(const n of a.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&r(n)}).observe(document,{childList:!0,subtree:!0});function i(e){const a={};return e.integrity&&(a.integrity=e.integrity),e.referrerPolicy&&(a.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?a.credentials="include":e.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(e){if(e.ep)return;e.ep=!0;const a=i(e);fetch(e.href,a)}})();async function c(){try{const s=await(await fetch("https://your-energy.b.goit.study/quote")).json();document.getElementById("daily-quote").textContent=s.quote,document.getElementById("quote-author").textContent=s.author}catch(t){console.error("Failed to load quote",t)}}async function l(){try{const s=await(await fetch("https://your-energy.b.goit.study/filters")).json(),i=document.getElementById("filter-tabs");i.innerHTML="",s.forEach(r=>{const e=document.createElement("button");e.className="filter-tab",r==="Body parts"&&e.classList.add("active"),e.dataset.filter=r,e.textContent=r,e.addEventListener("click",()=>u(r)),i.appendChild(e)})}catch(t){console.error("Failed to load filters",t)}}async function o(t="Waist"){try{const i=await(await fetch(`https://your-energy.b.goit.study/exercises?bodyPart=${encodeURIComponent(t)}`)).json(),r=document.getElementById("exercises-container");r.innerHTML="",i.forEach(e=>{const a=d(e);r.appendChild(a)})}catch(s){console.error("Failed to load exercises",s)}}function d(t){const s=document.createElement("div");return s.className="exercise-item",s.innerHTML=`
    <div class="exercise-badge">${t.bodyPart}</div>
    <div class="exercise-rating">
      <span class="rating-value">${t.rating||"0"}</span>
      <span class="star-rating">★</span>
    </div>
    <div class="exercise-title">
      <div class="title-icon">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="#F4F4F4"><circle cx="12" cy="12" r="10"/></svg>
      </div>
      <h3>${t.name}</h3>
    </div>
    <div class="exercise-details">
      <div class="detail-row">
        <span class="detail-label">Burned calories:</span>
        <span class="detail-value">${t.calories} / 3 min</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Body part:</span>
        <span class="detail-value">${t.bodyPart}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Target:</span>
        <span class="detail-value">${t.target}</span>
      </div>
    </div>
    <div class="exercise-footer">
      <button class="btn-start" onclick="startExercise('${t._id}')">Start →</button>
    </div>
  `,s}document.addEventListener("DOMContentLoaded",()=>{c(),l(),o("Waist")});function u(t){document.querySelectorAll(".filter-tab").forEach(s=>s.classList.remove("active")),event.target.classList.add("active"),o("Waist")}
//# sourceMappingURL=exercises.js.map
