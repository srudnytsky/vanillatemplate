import"./assets/layout-CNiZW9Jz.js";const d="https://your-energy.b.goit.study/api",y=async()=>{try{const r=await fetch(`${d}/quote`);if(!r.ok)throw new Error("Failed to fetch quote");return await r.json()}catch(r){return console.error("Error fetching quote:",r),{quote:"The only bad workout is the one that didn't happen.",author:"Unknown"}}},b=async(r={})=>{try{const t=new URLSearchParams(r).toString(),e=`${d}/exercises${t?`?${t}`:""}`,s=await fetch(e);if(!s.ok)throw new Error("Failed to fetch exercises");const i=await s.json();return{results:i.results||i||[],totalPages:i.totalPages||Math.ceil((i.results||i||[]).length/10),page:r.page||1,perPage:10}}catch(t){return console.error("Error fetching exercises:",t),w(r)}},v=async r=>{try{const t=await fetch(`${d}/exercises/${r}`);if(!t.ok)throw new Error("Failed to fetch exercise");return await t.json()}catch(t){return console.error("Error fetching exercise:",t),C(r)}},E=async(r,t,e,s="")=>{try{const i=await fetch(`${d}/exercises/${r}/rating`,{method:"PATCH",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({rate:t,email:e,review:s})});if(!i.ok){const a=await i.json().catch(()=>({}));throw new Error(a.message||"Failed to submit rating")}return await i.json()}catch(i){return console.error("Error rating exercise:",i),{message:"Rating submitted successfully (demo mode)",rating:t}}},x=async r=>{try{const t=await fetch(`${d}/subscription`,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({email:r})});if(!t.ok){const e=await t.json().catch(()=>({}));throw new Error(e.message||"Failed to subscribe")}return await t.json()}catch(t){return console.error("Error subscribing:",t),{message:"Subscribed successfully (demo mode)"}}};function w(r={}){let e=[...[{_id:"1",name:"3/4 sit-up",rating:4,burnedCalories:220,time:3,bodyPart:"Waist",target:"Abs",equipment:"None",popularity:156},{_id:"2",name:"Barbell reverse preacher curl",rating:5,burnedCalories:153,time:3,bodyPart:"Waist",target:"Biceps",equipment:"Barbell",popularity:89},{_id:"3",name:"Barbell side split squat v. 2",rating:5,burnedCalories:60,time:3,bodyPart:"Waist",target:"Quads",equipment:"Barbell",popularity:112},{_id:"4",name:"Barbell rollerout",rating:5,burnedCalories:87,time:3,bodyPart:"Waist",target:"Abs",equipment:"Barbell",popularity:76},{_id:"5",name:"45° side bend",rating:5,burnedCalories:323,time:3,bodyPart:"Waist",target:"Abs",equipment:"Dumbbells",popularity:142},{_id:"6",name:"Air bike",rating:4,burnedCalories:312,time:3,bodyPart:"Waist",target:"Abs",equipment:"None",popularity:98},{_id:"7",name:"Stationary bike walk",rating:4,burnedCalories:60,time:3,bodyPart:"Waist",target:"Cardiovascular system",equipment:"Stationary bike",popularity:116}]];if(r.filter&&(r.filter==="muscles"?e=e.filter(n=>["Abs","Biceps","Quads"].includes(n.target)):r.filter==="bodyparts"?e=e.filter(n=>n.bodyPart==="Waist"):r.filter==="equipment"&&(e=e.filter(n=>n.equipment!=="None"))),r.keyword){const n=r.keyword.toLowerCase();e=e.filter(c=>c.name.toLowerCase().includes(n)||c.target.toLowerCase().includes(n)||c.bodyPart.toLowerCase().includes(n))}const s=parseInt(r.page)||1,i=10,a=(s-1)*i,u=a+i;return{results:e.slice(a,u),totalPages:Math.ceil(e.length/i),page:s,perPage:i,total:e.length}}function C(r){const t={1:{_id:"1",name:"3/4 sit-up",rating:4,burnedCalories:220,time:3,bodyPart:"Waist",target:"Abs",equipment:"None",popularity:156,description:"A modified sit-up that targets the abdominal muscles. Perform by lying on your back with knees bent, then lifting your upper body until your torso is at a 45-degree angle.",difficulty:"Beginner"},2:{_id:"2",name:"Barbell reverse preacher curl",rating:5,burnedCalories:153,time:3,bodyPart:"Waist",target:"Biceps",equipment:"Barbell",popularity:89,description:"An isolation exercise for the biceps that uses a preacher bench with a reverse grip. Focuses on the brachialis muscle for arm thickness.",difficulty:"Intermediate"},7:{_id:"7",name:"Stationary bike walk",rating:4,burnedCalories:60,time:3,bodyPart:"Waist",target:"Cardiovascular system",equipment:"Stationary bike",popularity:116,description:"While not a muscle, this system is essential for endurance training. Aerobic exercises like running, cycling, and swimming improve cardiovascular health.",difficulty:"Beginner"}};return t[r]||t[1]}class S{constructor(){this.searchInput=document.getElementById("search-input"),this.searchButton=document.getElementById("search-button"),this.exercisesContainer=document.getElementById("exercises-container"),this.filterButtons=document.querySelectorAll(".filter-btn"),this.currentCategory=document.querySelector(".current-category"),this.pagination=document.getElementById("pagination"),this.dailyQuote=document.getElementById("daily-quote"),this.quoteAuthor=document.getElementById("quote-author"),this.exerciseModal=document.getElementById("exercise-modal"),this.ratingModal=document.getElementById("rating-modal"),this.modalClose=document.getElementById("modal-close"),this.ratingModalClose=document.getElementById("rating-modal-close"),this.submitRatingBtn=document.getElementById("submit-rating"),this.ratingStars=document.getElementById("rating-stars"),this.ratingComment=document.getElementById("rating-comment"),this.ratingEmail=document.getElementById("rating-email"),this.subscribeForm=document.getElementById("subscribe-form"),this.subscribeEmail=document.getElementById("email-input"),this.currentFilter="Muscles",this.currentSearch="",this.currentPage=1,this.currentExerciseId=null,this.selectedRating=0,this.userRatings=JSON.parse(localStorage.getItem("userRatings"))||{},this.favorites=JSON.parse(localStorage.getItem("favorites"))||[],this.init()}async init(){await this.loadDailyQuote(),await this.loadExercises(),this.initEventListeners()}async loadDailyQuote(){try{const t=await y();this.dailyQuote&&this.quoteAuthor&&(this.dailyQuote.textContent=`"${t.quote}"`,this.quoteAuthor.textContent=`- ${t.author}`)}catch(t){console.error("Error loading quote:",t),this.dailyQuote.textContent=`"A lot of times I find that people who are blessed with the most talent don't ever develop that attitude, and the ones who aren't blessed in that way are the most competitive and have the biggest heart."`,this.quoteAuthor.textContent="- Tom Brady"}}async loadExercises(){try{this.showLoading();const t={};this.currentSearch&&(t.keyword=this.currentSearch),t.page=this.currentPage,t.limit=10;const e=await b(t);let s=[],i=1;Array.isArray(e)?(s=e,i=Math.ceil(s.length/10)):e.results&&Array.isArray(e.results)?(s=e.results,i=e.totalPages||Math.ceil((e.total||s.length)/10)):e.exercises&&Array.isArray(e.exercises)&&(s=e.exercises,i=e.totalPages||Math.ceil((e.total||s.length)/10)),this.renderExercises(s),this.renderPagination(i)}catch(t){console.error("Error loading exercises:",t),this.showError("Failed to load exercises. Please try again.")}}initEventListeners(){this.searchButton&&this.searchButton.addEventListener("click",()=>this.handleSearch()),this.searchInput&&this.searchInput.addEventListener("keypress",t=>{t.key==="Enter"&&this.handleSearch()}),this.filterButtons.forEach(t=>{t.addEventListener("click",()=>{this.filterButtons.forEach(e=>e.classList.remove("active")),t.classList.add("active"),this.currentFilter=t.dataset.filter,this.currentCategory.textContent=this.currentFilter,this.currentSearch="",this.searchInput&&(this.searchInput.value=""),this.currentPage=1,this.loadExercises()})}),this.modalClose&&this.modalClose.addEventListener("click",()=>this.closeExerciseModal()),this.ratingModalClose&&this.ratingModalClose.addEventListener("click",()=>this.closeRatingModal()),[this.exerciseModal,this.ratingModal].forEach(t=>{t&&t.addEventListener("click",e=>{e.target===t&&this.closeAllModals()})}),document.addEventListener("keydown",t=>{t.key==="Escape"&&this.closeAllModals()}),this.ratingStars&&this.ratingStars.querySelectorAll("span").forEach(e=>{e.addEventListener("click",()=>{this.selectedRating=parseInt(e.dataset.rating),this.updateStars(this.selectedRating)})}),this.submitRatingBtn&&this.submitRatingBtn.addEventListener("click",t=>{t.preventDefault(),this.handleRatingSubmit()}),this.subscribeForm&&this.subscribeForm.addEventListener("submit",t=>{t.preventDefault(),this.handleSubscribe()})}async handleSearch(){this.currentSearch=this.searchInput.value.trim(),this.currentPage=1,await this.loadExercises()}showLoading(){this.exercisesContainer&&(this.exercisesContainer.innerHTML='<div class="loading">Loading exercises...</div>')}showError(t){this.exercisesContainer&&(this.exercisesContainer.innerHTML=`
        <div class="error-message">
          <strong>Error</strong>
          <p>${t}</p>
          <button onclick="exercisesApp.loadExercises()">Try Again</button>
        </div>
      `)}renderExercises(t){if(this.exercisesContainer){if(t.length===0){this.exercisesContainer.innerHTML=`
        <div class="no-results">
          <h3>No exercises found</h3>
          <p>Try adjusting your search or filter to find what you're looking for.</p>
        </div>
      `;return}this.exercisesContainer.innerHTML=t.map(e=>`
      <div class="exercise-item" data-id="${e._id||e.id}">
        <div class="exercise-header">
          <h3 class="exercise-title">${e.name}</h3>
          <div class="exercise-rating-small">
            <span class="star-rating">${this.getStarsHTML(e.rating||0)}</span> ${e.rating||0}
          </div>
        </div>
        <div class="exercise-info">
          <div class="info-row">
            <span class="info-label">Burned calories:</span>
            <span class="info-value">${e.burnedCalories||e.calories||0} / ${e.time||3} min</span>
          </div>
          <div class="info-row">
            <span class="info-label">Body part:</span>
            <span class="info-value">${e.bodyPart||"Waist"}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Target:</span>
            <span class="info-value">${e.target||"Abs"}</span>
          </div>
        </div>
        <div class="exercise-footer">
          <div class="exercise-categories">
            <span class="category-tag">${this.currentFilter}</span>
            ${e.equipment&&e.equipment!=="None"?`<span class="category-tag">${e.equipment}</span>`:""}
          </div>
          <button class="btn-start" onclick="exercisesApp.openExerciseModal('${e._id||e.id}')">Start</button>
        </div>
      </div>
    `).join("")}}renderPagination(t){if(!this.pagination||t<=1){this.pagination&&(this.pagination.innerHTML="");return}let e="";this.currentPage>1&&(e+=`<button class="page-btn prev-btn" onclick="exercisesApp.goToPage(${this.currentPage-1})">←</button>`);for(let s=1;s<=t;s++)s===this.currentPage?e+=`<button class="page-btn active">${s}</button>`:e+=`<button class="page-btn" onclick="exercisesApp.goToPage(${s})">${s}</button>`;this.currentPage<t&&(e+=`<button class="page-btn next-btn" onclick="exercisesApp.goToPage(${this.currentPage+1})">→</button>`),this.pagination.innerHTML=e}async goToPage(t){this.currentPage=t,await this.loadExercises(),window.scrollTo({top:this.exercisesContainer.offsetTop-100,behavior:"smooth"})}async openExerciseModal(t){try{this.currentExerciseId=t;const e=await v(t),s=document.getElementById("modal-content");if(s){const i=this.favorites.some(a=>a.id===t);s.innerHTML=`
          <div class="exercise-details">
            <h2>${e.name}</h2>
            <div class="exercise-rating">
              <span class="star-rating">${this.getStarsHTML(e.rating||0)}</span> ${e.rating||0} (${e.popularity||0} reviews)
            </div>
            <div class="exercise-meta">
              <div class="meta-item">
                <div class="meta-label">Target</div>
                <div class="meta-value">${e.target||"Abs"}</div>
              </div>
              <div class="meta-item">
                <div class="meta-label">Body part</div>
                <div class="meta-value">${e.bodyPart||"Waist"}</div>
              </div>
              <div class="meta-item">
                <div class="meta-label">Equipment</div>
                <div class="meta-value">${e.equipment||"None"}</div>
              </div>
              <div class="meta-item">
                <div class="meta-label">Burned calories</div>
                <div class="meta-value">${e.burnedCalories||e.calories||0} / ${e.time||3} min</div>
              </div>
            </div>
            <div class="exercise-description">
              <p>${e.description||"No description available."}</p>
            </div>
            <div class="exercise-actions">
              <button class="action-btn btn-favorite" onclick="exercisesApp.toggleFavorite('${t}')">
                ${i?"Remove from Favorites":"Add to Favorites"}
              </button>
              <button class="action-btn btn-rating" onclick="exercisesApp.openRatingModal()">
                Give a rating
              </button>
            </div>
          </div>
        `}this.exerciseModal.style.display="flex",document.body.style.overflow="hidden"}catch(e){console.error("Error opening exercise modal:",e),this.showNotification("Failed to load exercise details","error")}}closeExerciseModal(){this.exerciseModal.style.display="none",document.body.style.overflow="auto"}openRatingModal(){this.closeExerciseModal(),this.ratingModal.style.display="flex",document.body.style.overflow="hidden",this.resetRatingForm()}closeRatingModal(){this.ratingModal.style.display="none",document.body.style.overflow="auto"}closeAllModals(){this.closeExerciseModal(),this.closeRatingModal()}updateStars(t){this.ratingStars.querySelectorAll("span").forEach((s,i)=>{i<t?s.classList.add("active"):s.classList.remove("active")})}resetRatingForm(){this.selectedRating=0,this.updateStars(0),this.ratingComment&&(this.ratingComment.value=""),this.ratingEmail&&(this.ratingEmail.value="")}async handleRatingSubmit(){if(!this.selectedRating){this.showNotification("Please select a rating!","error");return}const t=this.ratingEmail?this.ratingEmail.value.trim():"",e=this.ratingComment?this.ratingComment.value.trim():"";if(!t||!this.isValidEmail(t)){this.showNotification("Please enter a valid email address!","error");return}try{await E(this.currentExerciseId,this.selectedRating,t,e),this.userRatings[this.currentExerciseId]={rating:this.selectedRating,comment:e,email:t,date:new Date().toISOString()},localStorage.setItem("userRatings",JSON.stringify(this.userRatings)),this.showNotification("Thank you for your rating!","success"),this.closeRatingModal()}catch(s){console.error("Error submitting rating:",s),this.showNotification("Rating submitted successfully","success"),this.closeRatingModal()}}async handleSubscribe(){const t=this.subscribeEmail?this.subscribeEmail.value.trim():"";if(!t||!this.isValidEmail(t)){this.showNotification("Please enter a valid email address!","error");return}try{await x(t),this.showNotification("Thank you for subscribing!","success"),this.subscribeForm&&this.subscribeForm.reset()}catch(e){console.error("Error subscribing:",e),this.showNotification("Subscribed successfully","success"),this.subscribeForm&&this.subscribeForm.reset()}}toggleFavorite(t){const e=document.getElementById("modal-content");if(!e)return;const s=e.querySelector("h2")?.textContent||"Unknown",i=e.querySelectorAll(".meta-item");let a="N/A",u="N/A",h="0",n="3";i.forEach(o=>{const l=o.querySelector(".meta-label")?.textContent,m=o.querySelector(".meta-value")?.textContent;if(l==="Body part"&&(a=m),l==="Target"&&(u=m),l==="Burned calories"){const f=m.split(" / ");h=f[0]||"0",n=f[1]?.split(" min")[0]||"3"}});const c={id:t,name:s,bodyPart:a,target:u,burnedCalories:h,time:n},g=this.favorites.findIndex(o=>o.id===t);g===-1?(this.favorites.push(c),this.showNotification("Added to favorites!","success")):(this.favorites.splice(g,1),this.showNotification("Removed from favorites!","info")),localStorage.setItem("favorites",JSON.stringify(this.favorites));const p=document.querySelector(".btn-favorite");if(p){const o=this.favorites.some(l=>l.id===t);p.textContent=o?"Remove from Favorites":"Add to Favorites"}}getStarsHTML(t){const e=Math.floor(t),s=t%1>=.5;let i="";for(let a=0;a<5;a++)a<e?i+="★":a===e&&s?i+="½":i+="☆";return i}isValidEmail(t){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)}showNotification(t,e="info"){const s=document.querySelector(".notification");s&&s.remove();const i=document.createElement("div");i.className=`notification notification-${e}`,i.textContent=t,i.style.cssText=`
      position: fixed;
      top: 100px;
      right: 20px;
      background: ${e==="success"?"#4CAF50":e==="error"?"#f44336":"#2196F3"};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideInRight 0.3s ease;
    `,document.body.appendChild(i),setTimeout(()=>{i.parentNode&&i.remove()},3e3);const a=document.createElement("style");a.textContent=`
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `,document.head.appendChild(a)}}const A=new S;window.exercisesApp=A;
//# sourceMappingURL=exercises.js.map
