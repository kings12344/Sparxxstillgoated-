const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".navigation");
if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
  }));
}
document.getElementById("year").textContent = new Date().getFullYear();
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(element => observer.observe(element));

// Keep the visual field tied to the visitor's scroll position.
let scrollTick = false;
const updateScrollProgress = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? window.scrollY / max : 0;
  document.documentElement.style.setProperty("--scroll-progress", progress.toFixed(4));
  document.body.style.setProperty("--scroll-y", window.scrollY + "px");
  scrollTick = false;
};
window.addEventListener("scroll", () => {
  if (!scrollTick) {
    window.requestAnimationFrame(updateScrollProgress);
    scrollTick = true;
  }
}, { passive: true });
updateScrollProgress();

// Gentle depth response for release artwork; no movement is applied on touch-only devices.
if (window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
  document.querySelectorAll(".release-card").forEach(card => {
    card.addEventListener("pointermove", event => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      const cover = card.querySelector(".cover");
      if (cover) cover.style.transform = `perspective(900px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-5px)`;
    });
    card.addEventListener("pointerleave", () => {
      const cover = card.querySelector(".cover");
      if (cover) cover.style.transform = "";
    });
  });
}


// Tactile 3D music showroom: scroll depth, touch selection and record detail.
(() => {
  const stage=document.querySelector("#showroom-stage");
  if(!stage)return;
  const cards=[...stage.querySelectorAll(".showroom-card")];
  const consoleRoot=document.querySelector("#showroom-console");
  const title=consoleRoot?.querySelector("h3");
  const copy=consoleRoot?.querySelector(".console-copy p");
  const kicker=consoleRoot?.querySelector(".console-kicker");
  const count=consoleRoot?.querySelector(".console-track-count");
  const listen=consoleRoot?.querySelector(".console-listen");
  let selected=null, raf=0;
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile=window.matchMedia("(max-width:760px)");
  const updateDepth=()=>{
    raf=0;
    if(reduced)return;
    const vh=window.innerHeight;
    cards.forEach((card,index)=>{
      const r=card.getBoundingClientRect();
      const center=r.top+r.height*.5;
      const distance=(center-vh*.52)/(vh*.72);
      const bounded=Math.max(-1.2,Math.min(1.2,distance));
      const x=mobile.matches?bounded*3:bounded*5;
      const y=mobile.matches?0:Math.max(-1,Math.min(1,(r.left+r.width*.5-window.innerWidth*.5)/(window.innerWidth*.55)))*-5;
      card.style.setProperty("--tilt-x",x.toFixed(2)+"deg");
      card.style.setProperty("--tilt-y",y.toFixed(2)+"deg");
      card.style.setProperty("--lift",(Math.max(0,1-Math.abs(bounded))*(-12)).toFixed(1)+"px");
      card.style.zIndex=String(10-Math.round(Math.abs(bounded)*4));
    });
  };
  const scheduleDepth=()=>{if(!raf)raf=requestAnimationFrame(updateDepth)};
  const choose=(card)=>{
    if(selected===card){card.classList.remove("is-selected");selected=null;return}
    cards.forEach(item=>{item.classList.toggle("is-selected",item===card);item.setAttribute("aria-pressed",String(item===card))});
    selected=card;
    const name=card.dataset.track||"Selected record";
    const kind=card.dataset.kind||"FROM THE CATALOGUE";
    if(kicker)kicker.textContent="NOW SELECTED / "+String(cards.indexOf(card)+1).padStart(3,"0");
    if(title)title.innerHTML=name.toUpperCase()+"<br><span>IN THE SPOTLIGHT.</span>";
    if(copy)copy.textContent=card.dataset.description||"Explore this record from the official catalogue.";
    if(count)count.textContent=kind.toUpperCase();
    if(listen)listen.innerHTML='LISTEN TO THE ARTIST <b>↗</b>';
    if(mobile.matches)card.scrollIntoView({behavior:reduced?"auto":"smooth",block:"nearest",inline:"center"});
  };
  cards.forEach(card=>{
    card.setAttribute("aria-pressed","false");
    card.addEventListener("click",()=>choose(card));
    card.addEventListener("pointermove",event=>{
      if(event.pointerType!=="mouse"||reduced)return;
      const r=card.getBoundingClientRect();
      const x=(event.clientX-r.left)/r.width-.5;
      const y=(event.clientY-r.top)/r.height-.5;
      card.style.setProperty("--tilt-y",(x*13).toFixed(2)+"deg");
      card.style.setProperty("--tilt-x",(-y*11).toFixed(2)+"deg");
    });
    card.addEventListener("pointerleave",scheduleDepth);
  });
  window.addEventListener("scroll",scheduleDepth,{passive:true});
  window.addEventListener("resize",scheduleDepth,{passive:true});
  stage.addEventListener("scroll",scheduleDepth,{passive:true});
  updateDepth();
})();
