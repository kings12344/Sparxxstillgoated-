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
