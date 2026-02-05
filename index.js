import"./assets/layout-CNiZW9Jz.js";document.addEventListener("DOMContentLoaded",()=>{const t=document.querySelectorAll(".filter-btn"),n=document.querySelectorAll(".exercise-card");t.forEach(e=>{e.addEventListener("click",()=>{const i=e.getAttribute("data-filter");t.forEach(s=>s.classList.remove("active")),e.classList.add("active"),n.forEach(s=>{const r=s.getAttribute("data-filter");i==="all"||r===i?s.style.display="block":s.style.display="none"})})}),document.querySelectorAll(".page-btn").forEach(e=>{e.addEventListener("click",()=>{document.querySelectorAll(".page-btn").forEach(i=>i.classList.remove("active")),e.classList.add("active")})});const o=document.getElementById("subscribe-form");o&&o.addEventListener("submit",e=>{e.preventDefault();const i=o.querySelector("input").value;if(!i||!c(i)){a("Please enter a valid email address!","error");return}setTimeout(()=>{a(`Thank you! You've been subscribed with: ${i}`,"success"),o.reset()},500)}),l()});function c(t){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)}function a(t,n="info"){const o=document.querySelector(".notification");o&&o.remove();const e=document.createElement("div");e.className=`notification notification-${n}`,e.textContent=t,e.style.cssText=`
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${n==="success"?"#4CAF50":"#f44336"};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    animation: slideInRight 0.3s ease;
  `,document.body.appendChild(e),setTimeout(()=>{e.parentNode&&e.remove()},3e3);const i=document.createElement("style");i.textContent=`
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `,document.head.appendChild(i)}function l(){const t=document.querySelectorAll(".nav-link");if(t.length>=2&&(t[0].href="./index.html",t[1].href="./exercises.html",t[1].textContent="Exercises",t.length===2)){const n=document.createElement("a");n.href="./favorites.html",n.className="nav-link",n.textContent="Favorites",t[1].parentNode.appendChild(n)}}
//# sourceMappingURL=index.js.map
