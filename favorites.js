import"./assets/modulepreload-polyfill-B5Qt9EMX.js";/* empty css                    */document.addEventListener("DOMContentLoaded",()=>{const l=document.querySelector(".menu-toggle"),a=document.querySelector(".mobile-menu"),d=document.querySelector(".mobile-menu-close");l&&a&&d&&(l.addEventListener("click",()=>{a.classList.add("active"),document.body.style.overflow="hidden"}),d.addEventListener("click",()=>{a.classList.remove("active"),document.body.style.overflow=""}),a.querySelectorAll(".mobile-menu-link").forEach(t=>{t.addEventListener("click",()=>{a.classList.remove("active"),document.body.style.overflow=""})}));const u="https://your-energy.b.goit.study/api",r=document.getElementById("favorites-content"),s=document.getElementById("fav-quote-text"),v=document.getElementById("fav-quote-author"),n=document.getElementById("subscribe-form");function f(){const t=localStorage.getItem("favorites");return t?JSON.parse(t):[]}function p(t){localStorage.setItem("favorites",JSON.stringify(t))}function y(t){let e=f();e=e.filter(o=>o._id!==t),p(e),m()}function m(){if(!r)return;const t=f();if(t.length===0){r.innerHTML=`
        <div class="empty-state">
          It appears that you haven't added any exercises to your favorites yet. To get started, you can add exercises that you like to your favorites for easier access in the future.
        </div>
      `;return}r.innerHTML="",t.forEach(e=>{const o=document.createElement("div");o.className="favorite-exercise-card",o.innerHTML=`
        <div class="favorite-card-header">
          <span class="favorite-workout-badge">WORKOUT</span>
          <button class="favorite-delete-btn" data-id="${e._id}" aria-label="Remove from favorites">
            🗑
          </button>
        </div>
        
        <div class="favorite-exercise-info">
          <div class="favorite-exercise-icon">⚡</div>
          <h3 class="favorite-exercise-name">${e.name}</h3>
        </div>
        
        <div class="favorite-exercise-details">
          <span><span class="label">Burned calories:</span> <span class="value">${e.burnedCalories||0} / ${e.time||0} min</span></span>
          <span><span class="label">Body part:</span> <span class="value">${e.bodyPart||""}</span></span>
          <span><span class="label">Target:</span> <span class="value">${e.target||""}</span></span>
        </div>
        
        <div class="favorite-card-footer">
          <button class="favorite-start-btn" data-id="${e._id}">
            Start
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12.172 7L6.808 1.636L8.222 0.222L16 8L8.222 15.778L6.808 14.364L12.172 9H0V7H12.172Z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      `,r.appendChild(o)}),document.querySelectorAll(".favorite-delete-btn").forEach(e=>{e.addEventListener("click",()=>{const o=e.getAttribute("data-id");confirm("Remove this exercise from favorites?")&&y(o)})}),document.querySelectorAll(".favorite-start-btn").forEach(e=>{e.addEventListener("click",()=>{const o=e.getAttribute("data-id");t.find(c=>c._id===o)&&(window.location.href="index.html")})})}async function b(){try{const t=await fetch(`${u}/quote`);if(!t.ok)throw new Error("Network error");const e=await t.json();e?.quote&&e?.author?(s.textContent=e.quote,v.textContent=e.author):(s.textContent="Quote not available",v.textContent="")}catch(t){console.error("Error loading quote:",t),s.textContent="Failed to load quote"}}n&&n.addEventListener("submit",async t=>{t.preventDefault();const o=n.querySelector('input[type="email"]')?.value.trim();if(!o){alert("Please enter your email");return}try{const c=await(await fetch(`${u}/subscription`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:o})})).json();alert(c.message||"Successfully subscribed!"),n.reset()}catch(i){console.error("Subscription error:",i),alert("Failed to subscribe. Please try again later.")}}),b(),m()});
//# sourceMappingURL=favorites.js.map
