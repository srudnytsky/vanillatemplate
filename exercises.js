import"./assets/modulepreload-polyfill-B5Qt9EMX.js";/* empty css                    *//* empty css                      */async function r(){try{const t=await(await fetch("https://your-energy.b.goit.study/quote")).json();document.getElementById("daily-quote").textContent=t.quote,document.getElementById("quote-author").textContent=t.author}catch(e){console.error("Failed to load quote",e)}}async function o(){try{const t=await(await fetch("https://your-energy.b.goit.study/filters")).json(),i=document.getElementById("filter-tabs");i.innerHTML="",t.forEach(s=>{const a=document.createElement("button");a.className="filter-tab",s==="Body parts"&&a.classList.add("active"),a.dataset.filter=s,a.textContent=s,a.addEventListener("click",()=>d(s)),i.appendChild(a)})}catch(e){console.error("Failed to load filters",e)}}async function n(e="Waist"){try{const i=await(await fetch(`https://your-energy.b.goit.study/exercises?bodyPart=${encodeURIComponent(e)}`)).json(),s=document.getElementById("exercises-container");s.innerHTML="",i.forEach(a=>{const c=l(a);s.appendChild(c)})}catch(t){console.error("Failed to load exercises",t)}}function l(e){const t=document.createElement("div");return t.className="exercise-item",t.innerHTML=`
    <div class="exercise-badge">${e.bodyPart}</div>
    <div class="exercise-rating">
      <span class="rating-value">${e.rating||"0"}</span>
      <span class="star-rating">★</span>
    </div>
    <div class="exercise-title">
      <div class="title-icon">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="#F4F4F4"><circle cx="12" cy="12" r="10"/></svg>
      </div>
      <h3>${e.name}</h3>
    </div>
    <div class="exercise-details">
      <div class="detail-row">
        <span class="detail-label">Burned calories:</span>
        <span class="detail-value">${e.calories} / 3 min</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Body part:</span>
        <span class="detail-value">${e.bodyPart}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Target:</span>
        <span class="detail-value">${e.target}</span>
      </div>
    </div>
    <div class="exercise-footer">
      <button class="btn-start" onclick="startExercise('${e._id}')">Start →</button>
    </div>
  `,t}document.addEventListener("DOMContentLoaded",()=>{r(),o(),n("Waist")});function d(e){document.querySelectorAll(".filter-tab").forEach(t=>t.classList.remove("active")),event.target.classList.add("active"),n("Waist")}
//# sourceMappingURL=exercises.js.map
