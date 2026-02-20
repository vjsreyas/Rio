/* =========================================================
   HERO & DRONE SCRIPT
========================================================= */

window.addEventListener("DOMContentLoaded", initApp);


/* =========================================================
   GLOBAL STATE (same as original)
========================================================= */

let isFlying = true;
let flyTimer = null;
let isDocked = false;
let isDocking = false;
let previousEyeMode = null;
let wasFlyingBeforeDock = true;


/* =========================================================
   INIT APP
========================================================= */

function initApp() {

  const el = getElements();
  if (!el.drone || !el.hero) return;

  setInitialDronePosition(el.drone);

  setupFlyingSystem(el);
  setupToggleButton(el);
  setupClickReaction(el);
  setupVideoSwitch(el);
  setupDragSystem(el);
  setupScanSystem(el);
  setupBrandText(el);
  setupHeroContent(el);
  setupSummonDockSystem(el);

  revealDroneAfterDelay(el.drone, el.hero);

  // Scroll sections
  animateAboutSection();
  window.addEventListener("scroll", animateAboutSection);

  animateServicesSection();
  window.addEventListener("scroll", animateServicesSection);

  setupProjectObservers();
  setupStatsCounter();
}


/* =========================================================
   ELEMENT COLLECTOR
========================================================= */

function getElements() {

  const drone = document.getElementById("drone");

  return {
    drone,
    hero: document.querySelector(".hero-section"),
    video: document.getElementById("heroVideo"),
    image: document.getElementById("heroImage"),
    eyes: drone?.querySelectorAll(".eye"),
    brand: document.getElementById("brandText"),
    heroContent: document.querySelector(".hero-content"),
    scanDiv: document.querySelector(".scan"),
    toggleBtn: document.getElementById("toggleBtn"),
    scanBtn: document.querySelector(".station-btn.secondary"),
    statusText: document.getElementById("stationStatus"),
    station: document.getElementById("station"),
    summonBtn: document.querySelector(".station-btn.primary")
  };
}


/* =========================================================
   UTILITIES
========================================================= */

const wait = ms => new Promise(r => setTimeout(r, ms));
const each = (list, fn) => list && Array.from(list).forEach(fn);


/* =========================================================
   INITIAL POSITION
========================================================= */

function setInitialDronePosition(drone) {
  drone.style.left = "50%";
  drone.style.top = "40%";
  drone.style.transition = "all 3s ease-in-out";
}


/* =========================================================
   FLYING SYSTEM
========================================================= */

function setupFlyingSystem({ drone, hero }) {

  window.flyRandom = function () {

    if (!isFlying || isDocked) return;

    const { width, height } = hero.getBoundingClientRect();

    drone.style.left = Math.random() * (width - 120) + "px";
    drone.style.top = Math.random() * (height - 120) + "px";

    flyTimer = setTimeout(flyRandom, 3000);
  };

  window.startFlying = function () {
    if (isFlying) return;
    isFlying = true;
    flyRandom();
  };

  window.stopFlying = function () {
    isFlying = false;
    clearTimeout(flyTimer);
  };
}


async function revealDroneAfterDelay(drone) {
  await wait(10000);

  drone.style.opacity = "1";
  drone.style.pointerEvents = "auto";
  flyRandom();
}


/* =========================================================
   EYES MODE
========================================================= */

function updateEyesMode(eyes) {
  each(eyes, e => {
    if (isFlying) e.classList.remove("statue");
    else e.classList.add("statue");
  });
}


/* =========================================================
   TOGGLE BUTTON
========================================================= */

function setupToggleButton({ toggleBtn, eyes }) {

  if (!toggleBtn) return;

  toggleBtn.textContent = "STATUE";

  toggleBtn.addEventListener("click", e => {

    e.preventDefault();

    if (isFlying) {
      stopFlying();
wasFlyingBeforeDock = false;
      toggleBtn.textContent = "STARGAZE";
    } else {
      startFlying();
wasFlyingBeforeDock = true;
      toggleBtn.textContent = "STATUE";
    }

    updateEyesMode(eyes);
  });
}


/* =========================================================
   CLICK REACTION
========================================================= */

function setupClickReaction({ drone, hero, eyes }) {

  drone.addEventListener("click", () => {
 if (isDocked||isDocking) {

    // Only red eyes — nothing else
    each(eyes, e => {
      e.classList.remove("dock");
      e.classList.add("angry");
    });

    // Return to dock color after 1 second
    setTimeout(() => {
      each(eyes, e => {
        e.classList.remove("angry");
        e.classList.add("dock");
      });
    }, 1000);

    return; // 🚫 Stop here — no other behavior
  }
    each(eyes, e => {
      e.classList.remove("statue");
      e.classList.add("angry");
    });
 
    drone.classList.add("dash");

    const { width, height } = hero.getBoundingClientRect();

    drone.style.left = Math.random() * (width - 120) + "px";
    drone.style.top = Math.random() * (height - 120) + "px";

    setTimeout(() => drone.classList.remove("dash"), 500);

    setTimeout(() => {
      each(eyes, e => e.classList.remove("angry"));
      updateEyesMode(eyes);
    }, 1500);
  });
}


/* =========================================================
   VIDEO → IMAGE SWITCH
========================================================= */

function setupVideoSwitch({ video, image }) {

  if (!video || !image) return;

  const switchToImage = () => {
    video.style.display = "none";
    image.classList.add("show");
  };

  video.addEventListener("ended", switchToImage);

  video.addEventListener("timeupdate", () => {
    if (video.currentTime >= video.duration - 0.1)
      switchToImage();
  });
}


/* =========================================================
   DRAG SYSTEM
========================================================= */

function setupDragSystem({ drone }) {

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  drone.addEventListener("mousedown", e => {

    if (isDocking || isFlying) return;

    isDragging = true;

    const rect = drone.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    drone.style.transition = "none";
    drone.style.cursor = "grabbing";
  });

  document.addEventListener("mouseup", e => {

    if (!isDragging) return;

    isDragging = false;
    drone.style.cursor = "grab";

    const rect = drone.getBoundingClientRect();

    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;

    x = Math.max(0, Math.min(window.innerWidth - rect.width, x));
    y = Math.max(0, Math.min(window.innerHeight - rect.height, y));

    drone.style.transition = "all 3s ease";
    drone.style.left = `${x}px`;
    drone.style.top = `${y}px`;
  });
}


/* =========================================================
   SCAN SYSTEM
========================================================= */

function setupScanSystem({ scanBtn, statusText, scanDiv }) {

  if (!scanBtn) return;

  scanBtn.addEventListener("click", async e => {

    e.preventDefault();

    scanDiv.style.display = "none";
    statusText.textContent = "Scanning...";
    statusText.classList.remove("text-danger");
    statusText.classList.remove("text-success");
      statusText.classList.add("text-dark");

    await wait(2000);

    if (isDocked) {
      statusText.textContent = "Scan completed";
      statusText.classList.remove("text-dark");
      statusText.classList.remove("text-danger");
      statusText.classList.add("text-success");
      scanDiv.style.display = "block";
    } else {
      statusText.textContent = "Pet not docked";
       statusText.classList.remove("text-dark");
      statusText.classList.remove("text-success");
      statusText.classList.add("text-danger");
    }
  });
}


/* =========================================================
   BRAND TEXT
========================================================= */

function setupBrandText({ brand }) {

  if (!brand) return;

  brand.textContent = "";

  const text = "RIO";

  setTimeout(() => {

    text.split("").forEach((letter, i) => {

      const span = document.createElement("span");
      span.textContent = letter;
      span.classList.add("wave-letter");
      span.style.animationDelay = `${i * 0.3}s`;

      brand.appendChild(span);
    });

  }, 9000);
}


/* =========================================================
   HERO CONTENT
========================================================= */

function setupHeroContent({ heroContent }) {
  if (!heroContent) return;
  setTimeout(() => heroContent.classList.add("show"), 10000);
}


/* =========================================================
   SUMMON / DOCK SYSTEM
========================================================= */

function setupSummonDockSystem({ drone, hero, summonBtn }) {

  if (!summonBtn) return;

  const eyes = drone?.querySelectorAll(".eye"); // ✅ GET EYES

  summonBtn.addEventListener("click", e => {

    e.preventDefault();
    isDocking = true;

    const batteryText = document.querySelector(".battery-text");
    const batteryRect = batteryText.getBoundingClientRect();
    const heroRect = hero.getBoundingClientRect();

    const centerX = batteryRect.left + batteryRect.width / 2;
    const centerY = batteryRect.top + batteryRect.height / 2;

    const absX = centerX - heroRect.left;
    const absY = centerY - heroRect.top;

    if (!isDocked) {

      /* ================= DOCK MODE ================= */

      isDocked = true;
      stopFlying();

      const rect = drone.getBoundingClientRect();

      drone.style.position = "fixed";
      drone.style.left = rect.left + rect.width / 2 + "px";
      drone.style.top = rect.top + rect.height / 2 + "px";
      drone.style.transform = "translate(-50%, -50%)";
      drone.style.transition = "all 0.9s cubic-bezier(.50,.61,.36,1)";

      requestAnimationFrame(() => {
        drone.style.left = centerX + "px";
        drone.style.top = centerY + "px";
      });

      drone.addEventListener("transitionend", function fixDock() {

        drone.style.transition = "";
        drone.style.position = "absolute";
        drone.style.left = absX + "px";
        drone.style.top = absY + "px";

        drone.removeEventListener("transitionend", fixDock);
      });

/* Apply dock color */
eyes?.forEach(e => e.classList.add("dock"));

      summonBtn.textContent = "Dismiss";

    } else {

      /* ================= RELEASE MODE ================= */

      isDocked = false;

      const rect = drone.getBoundingClientRect();
      const heroRect = hero.getBoundingClientRect();

      const currentX = rect.left - heroRect.left + rect.width / 2;
      const currentY = rect.top - heroRect.top + rect.height / 2;

      drone.style.transition = "none";
      drone.style.position = "absolute";
      drone.style.left = currentX + "px";
      drone.style.top = currentY + "px";

      drone.getBoundingClientRect();

      drone.style.transition = "all 0.6s ease-out";
      drone.style.left = currentX + 20 + "px";
      drone.style.top = currentY - 40 + "px";

      drone.addEventListener("transitionend", function release() {

        const r = drone.getBoundingClientRect();

        drone.style.transition = "none";
        drone.style.position = "fixed";
        drone.style.left = r.left + r.width / 2 + "px";
        drone.style.top = r.top + r.height / 2 + "px";

        drone.getBoundingClientRect();

        drone.style.transition = "all 3s ease-in-out";


       if (wasFlyingBeforeDock) {
  startFlying();
} else {
  stopFlying();
}
        isDocking = false;

        drone.removeEventListener("transitionend", release);
      });

      /* ✅ REMOVE DOCK EYE COLOR */
eyes?.forEach(e => {
  e.classList.remove("dock");

});

      summonBtn.textContent = "Summon";
    }
  });
}

/* =========================================================
   ABOUT SECTION ANIMATION (ORIGINAL)
========================================================= */

function animateAboutSection() {

  const section = document.querySelector(".about-section");
  if (!section) return;

  const triggerPoint = window.innerHeight * 0.85;
  const sectionTop = section.getBoundingClientRect().top;

  if (sectionTop <= triggerPoint) {

    const elements = section.querySelectorAll(
      ".about-heading, .about-text, .about-btn, .about-img-wrapper"
    );

    elements.forEach((el, i) => {

      el.style.opacity = 0;
      el.style.transform = "translateY(40px)";
      el.style.transition =
        `all 0.8s cubic-bezier(0.22,1,0.36,1) ${i * 0.25}s`;

      setTimeout(() => {
        el.style.opacity = 1;
        el.style.transform = "translateY(0)";
      }, 50);
    });

    window.removeEventListener("scroll", animateAboutSection);
  }
}


/* =========================================================
   SERVICES ANIMATION (ORIGINAL)
========================================================= */

function animateServicesSection() {

  const section = document.querySelector("section.px-4.px-md-5.py-5");
  if (!section) return;

  const triggerPoint = window.innerHeight * 0.85;
  const sectionTop = section.getBoundingClientRect().top;

  if (sectionTop <= triggerPoint) {

    section.querySelector(".section-title")?.classList.add("services-show");
    section.querySelector(".section-desc")?.classList.add("services-show");

    const cards = section.querySelectorAll(".service-img-wrap, .service-label");

    cards.forEach((el, i) =>
      setTimeout(() => el.classList.add("services-show"), i * 150)
    );

    window.removeEventListener("scroll", animateServicesSection);
  }
}


/* =========================================================
   PROJECT OBSERVERS (ORIGINAL)
========================================================= */

function setupProjectObservers() {

  const scrollElements =
    document.querySelectorAll(
      ".section-title, .section-desc, .service-img-wrap, .service-label"
    );

  const observer = new IntersectionObserver((entries, obs) => {

    entries.forEach((entry, i) => {

      if (entry.isIntersecting) {

        entry.target.style.setProperty('--delay', `${i * 0.15}s`);
        entry.target.classList.add("services-show");

        obs.unobserve(entry.target);
      }
    });

  }, { threshold: 0.2 });

  scrollElements.forEach(el => observer.observe(el));
}


/* =========================================================
   STATS COUNTER (ORIGINAL)
========================================================= */

function setupStatsCounter() {

  const stats = document.querySelectorAll(".animate-on-scroll");

  const observer = new IntersectionObserver((entries, obs) => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {

        entry.target.querySelectorAll(
          ".stats-label, .stats-value"
        ).forEach(el => el.classList.add("stats-show"));

        entry.target.querySelectorAll(".stats-value").forEach(el => {

          const target = +el.getAttribute("data-target");
          let current = 0;
          const increment = target / 100;

          const interval = setInterval(() => {

            current += increment;

            if (current >= target) {
              el.textContent = target;
              clearInterval(interval);
            } else {
              el.textContent = Math.floor(current);
            }

          }, 20);
        });

        obs.unobserve(entry.target);
      }
    });

  }, { threshold: 0.3 });

  stats.forEach(stat => observer.observe(stat));
}
