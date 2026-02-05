import"./assets/layout-CNiZW9Jz.js";document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("favorites-container");if(!e){console.error("Element #favorites-container not found!");return}const r=JSON.parse(localStorage.getItem("favorites"))||[];if(r.length===0){e.innerHTML=`
      <div class="empty-state">
        <div class="empty-text">
          <p>
            It appears that you haven't added any exercises to your favorites yet.  
            To get started, you can add exercises that you like to your favorites for easier access in the future.
          </p>
        </div>
      </div>
    `;return}const s=r.map(t=>`
    <div class="workout-card" data-id="${t.id}">
      <div class="workout-meta">
        <span class="tag workout">WORKOUT</span>
        <button class="btn-delete" title="Remove from favorites">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 6h18M19 6v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
      <h3 class="workout-name">${t.name}</h3>
      <div class="workout-details">
        <div class="detail-row">
          <svg width="14" height="14"><use href="#icon-runner"/></svg>
          <span>Burned calories: <strong>${t.burnedCalories} / ${t.time||3} min</strong></span>
        </div>
        <div class="detail-row">
          <span>Body part: <strong>${t.bodyPart||"N/A"}</strong></span>
          <span>Target: <strong>${t.target||"N/A"}</strong></span>
        </div>
      </div>
      <button class="btn-start">Start →</button>
    </div>
  `).join("");e.innerHTML=s,document.querySelectorAll(".btn-start").forEach(t=>{t.addEventListener("click",()=>{const a=t.closest(".workout-card").querySelector(".workout-name").textContent;alert(`Starting workout: ${a}`)})}),document.querySelectorAll(".btn-delete").forEach(t=>{t.addEventListener("click",()=>{const a=t.closest(".workout-card"),n=a.dataset.id;let o=JSON.parse(localStorage.getItem("favorites"))||[];o=o.filter(i=>i.id!==n),localStorage.setItem("favorites",JSON.stringify(o)),a.remove(),o.length===0&&(e.innerHTML=`
          <div class="empty-state">
            <div class="empty-text">
              <p>
                It appears that you haven't added any exercises to your favorites yet.  
                To get started, you can add exercises that you like to your favorites for easier access in the future.
              </p>
            </div>
          </div>
        `)})})});
//# sourceMappingURL=favorites.js.map
