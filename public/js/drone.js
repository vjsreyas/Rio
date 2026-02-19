/* =========================
   HERO & DRONE SCRIPT
========================= */
window.addEventListener("DOMContentLoaded", () => {
  const drone = document.getElementById("drone");
  const hero = document.querySelector(".hero-section");
  const video = document.getElementById("heroVideo");
  const image = document.getElementById("heroImage");
  const eyes = drone?.querySelectorAll(".eye");
  const brand = document.getElementById("brandText");
  const heroContent = document.querySelector(".hero-content");

  if (!drone || !hero) return;
  function setEyesToCurrentMode() {
    if (isFlying) {
      // Flying → normal
      eyes.forEach(e => e.classList.remove("statue"));
    }
else {
      // Statue → yellow
      eyes.forEach(e => e.classList.add("statue"));
    }
  }
  /* ================= INITIAL POSITION ================= */
  drone.style.left = "50%";
  drone.style.top = "40%";
  drone.style.transition = "all 3s ease-in-out";

  /* ================= RANDOM FLYING (CONTROLLED) ================= */

  let isFlying = true;
  let flyTimer = null;

  function flyRandom() {
    if (!isFlying || isDocked) return;

    const { width, height } = hero.getBoundingClientRect();

    drone.style.left = Math.random() * (width - 120) + "px";
    drone.style.top = Math.random() * (height - 120) + "px";

    flyTimer = setTimeout(flyRandom, 3000);
  }

  function startFlying() {
    if (isFlying) return;
    isFlying = true;
    flyRandom();
  }

  function stopFlying() {
    isFlying = false;
    clearTimeout(flyTimer);
  }


  setTimeout(() => {
    drone.style.opacity = "1";
    drone.style.pointerEvents = "auto";
    flyRandom(); // ✅ correct starter
  }, 10000); // show drone after 10s
  /* ================= BUTTON CONTROL ================= */

  const btn = document.getElementById("toggleBtn");

  if (btn) {
    btn.textContent = "STATUE"; // starts flying

    btn.addEventListener("click", (e) => {
      e.preventDefault();

      if (isFlying) {
        // 🗿 STATUE MODE
        stopFlying();
        btn.textContent = "STARGAZE";

      } else {
        // 🌌 STARGAZE MODE
        startFlying();
        btn.textContent = "STATUE";
      }

      setEyesToCurrentMode(); // update eye color
    });
  }
  /* ================= CLICK REACTION ================= */
  /* ================= CLICK REACTION ================= */
  drone.addEventListener("click", () => {

    // 🧹 Remove mode color first
    eyes.forEach(e => {
      e.classList.remove("statue");
      e.classList.add("angry");   // 🔴 red
    });

    drone.classList.add("dash");

    const { width, height } = hero.getBoundingClientRect();
    drone.style.left = Math.random() * (width - 120) + "px";
    drone.style.top = Math.random() * (height - 120) + "px";

    setTimeout(() => drone.classList.remove("dash"), 500);

    // ⏱️ Restore correct mode color
    setTimeout(() => {
      eyes.forEach(e => e.classList.remove("angry"));
      setEyesToCurrentMode();   // 🧠 restore yellow or normal
    }, 1500);
  });
  /* ================= VIDEO → IMAGE SWITCH ================= */
  if (video && image) {
    const switchToImage = () => {
      video.style.display = "none";
      image.classList.add("show");
    };

    video.addEventListener("ended", switchToImage);
    video.addEventListener("timeupdate", () => {
      if (video.currentTime >= video.duration - 0.1) switchToImage();
    });
  }
/* ================= DRAG → FLY TO DROP (SCREEN SAFE) ================= */

let isDragging = false;
let offsetX = 0;
let offsetY = 0;

// START DRAG (statue mode only)
drone.addEventListener("mousedown", (e) => {

  if (isFlying) return;

  isDragging = true;

  const rect = drone.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;

  drone.style.transition = "none";
  drone.style.cursor = "grabbing";
});


// DROP → FLY TO POSITION (inside viewport)
document.addEventListener("mouseup", (e) => {
  if (!isDragging) return;

  isDragging = false;
  drone.style.cursor = "grab";

  const droneRect = drone.getBoundingClientRect();

  // 👇 Position relative to viewport (NOT hero)
  let x = e.clientX - offsetX;
  let y = e.clientY - offsetY;

  // 🚧 Keep inside screen boundaries
  x = Math.max(0, Math.min(window.innerWidth - droneRect.width, x));
  y = Math.max(0, Math.min(window.innerHeight - droneRect.height, y));

  // ✨ Smooth movement
  drone.style.transition = "all 3.0s ease";
  drone.style.left = `${x}px`;
  drone.style.top = `${y}px`;
});

  /* ================= TEXT "RIO" ================= */
  if (brand) {
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

  /* ================= HERO CONTENT ================= */
  if (heroContent) {
    setTimeout(() => heroContent.classList.add("show"), 10000);
  }

/* ================= PERFECT SUMMON → DOCK SYSTEM ================= */

let isDocked = false;

const station = document.getElementById("station");
const summonBtn = document.querySelector(".station-btn.primary");


if (summonBtn && station && drone) {
  summonBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const batteryText = document.querySelector(".battery-text");
    const batteryRect = batteryText.getBoundingClientRect();
    const heroRect = hero.getBoundingClientRect(); // hero container

    // Center of battery text in viewport
    const centerX = batteryRect.left + batteryRect.width / 2;
    const centerY = batteryRect.top + batteryRect.height / 2;

    // Convert to hero coordinates (absolute inside hero)
    const absX = centerX - heroRect.left;
    const absY = centerY - heroRect.top;

    if (!isDocked) {
      // 🔋 DOCK MODE
      isDocked = true;
      stopFlying(); // stop AI

      // Get current drone position (viewport coordinates)
      const droneRect = drone.getBoundingClientRect();
      const currentX = droneRect.left + droneRect.width / 2;
      const currentY = droneRect.top + droneRect.height / 2;

      // Set drone at current visual position (fixed) so animation starts from here
      drone.style.position = "fixed";
      drone.style.left = currentX + "px";
      drone.style.top = currentY + "px";
      drone.style.transform = "translate(-50%, -50%)";
      drone.style.transition = "all 0.9s cubic-bezier(.50,.61,.36,1)";

      // Animate to battery text
      requestAnimationFrame(() => {
        drone.style.left = centerX + "px";
        drone.style.top = centerY + "px";
      });

      // After animation completes, switch to absolute inside hero
      drone.addEventListener("transitionend", function fixDock() {
        drone.style.transition = ""; // remove animation
        drone.style.position = "absolute"; // now absolute
        drone.style.left = absX + "px";
        drone.style.top = absY + "px";
        drone.style.transform = "translate(-50%, -50%)";
        drone.removeEventListener("transitionend", fixDock);
      });
 eyes.forEach(e => {
      e.classList.add("dock");   // green
    });
      summonBtn.textContent = "Dismiss";

    } else {
    // 🚀 RELEASE MODE
// 🚀 RELEASE MODE
isDocked = false;

// Current viewport position
const droneRect = drone.getBoundingClientRect();
const heroRect = hero.getBoundingClientRect();

// Convert viewport → hero coordinates
const currentX = droneRect.left - heroRect.left + droneRect.width / 2;
const currentY = droneRect.top - heroRect.top + droneRect.height / 2;

// 1️⃣ Freeze visual position
drone.style.transition = "none";
drone.style.position = "absolute";
drone.style.left = currentX + "px";
drone.style.top = currentY + "px";
drone.style.transform = "translate(-50%, -50%)";

// Force layout sync
drone.getBoundingClientRect();

// 2️⃣ Animate fly-off
drone.style.transition = "all 0.6s ease-out";
drone.style.left = currentX + 20 + "px";
drone.style.top = currentY - 40 + "px";

// 3️⃣ After animation → switch to fixed for AI flying
drone.addEventListener("transitionend", function releaseDrone() {

  const rect = drone.getBoundingClientRect();

  drone.style.transition = "none";
  drone.style.position = "fixed";
  drone.style.left = rect.left + rect.width / 2 + "px";
  drone.style.top = rect.top + rect.height / 2 + "px";
  drone.style.transform = "translate(-50%, -50%)";

  drone.getBoundingClientRect(); // flush

  drone.style.transition = "all 3s ease-in-out";
  startFlying();
eyes.forEach(e => {
      e.classList.remove("dock");
    });
  drone.removeEventListener("transitionend", releaseDrone);
});



  summonBtn.textContent = "Summon";
}
  });
}









});
































































































//  ================= ABOUT =================
// Function to animate about section when in view
function animateAboutSection() {
  const section = document.querySelector(".about-section");
  if (!section) return;

  const triggerPoint = window.innerHeight * 0.85; // trigger when 85% down the viewport
  const sectionTop = section.getBoundingClientRect().top;

  if (sectionTop <= triggerPoint) {
    const aboutElements = section.querySelectorAll(
      ".about-heading, .about-text, .about-btn, .about-img-wrapper"
    );

    aboutElements.forEach((el, index) => {
      el.style.opacity = 0;
      el.style.transform = "translateY(40px)";
      el.style.transition = `all 0.8s cubic-bezier(0.22,1,0.36,1) ${index * 0.25}s`;

      setTimeout(() => {
        el.style.opacity = 1;
        el.style.transform = "translateY(0)";
      }, 50);
    });

    // Remove scroll listener after animation to prevent re-triggering
    window.removeEventListener("scroll", animateAboutSection);
  }
}

// Trigger on scroll
window.addEventListener("scroll", animateAboutSection);

// Also check immediately in case section is already in view
animateAboutSection();


//  ================= SERVICES =================
function animateServicesSection() {
  const section = document.querySelector("section.px-4.px-md-5.py-5");
  if (!section) return;

  const triggerPoint = window.innerHeight * 0.85;
  const sectionTop = section.getBoundingClientRect().top;

  if (sectionTop <= triggerPoint) {
    // Animate heading & description
    const heading = section.querySelector(".section-title");
    const desc = section.querySelector(".section-desc");

    heading.classList.add("services-show");
    desc.classList.add("services-show");

    // Animate all images & labels with stagger
    const cards = section.querySelectorAll(".service-img-wrap, .service-label");
    cards.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add("services-show"); // matches CSS now
      }, i * 150);
    });

    // Remove scroll listener so it runs only once
    window.removeEventListener("scroll", animateServicesSection);
  }
}

//  ================= PROJECT =================
// Scroll listener
document.addEventListener("DOMContentLoaded", () => {
  const scrollElements = document.querySelectorAll(".section-title, .section-desc, .service-img-wrap, .service-label");

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        entry.target.style.setProperty('--delay', `${index * 0.15}s`); // stagger
        entry.target.classList.add("services-show");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  scrollElements.forEach(el => observer.observe(el));
});
document.addEventListener("DOMContentLoaded", () => {
  const scrollElements = document.querySelectorAll(".animate-on-scroll .section-title, .animate-on-scroll .section-desc");

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-delay') || 0;
        entry.target.style.setProperty('--delay', delay + 's');
        entry.target.classList.add('services-show');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  scrollElements.forEach(el => observer.observe(el));
});
//  ================= STATUS =================
document.addEventListener("DOMContentLoaded", () => {
  const stats = document.querySelectorAll(".animate-on-scroll");

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Fade in
        entry.target.querySelectorAll(".stats-label, .stats-value").forEach(el => {
          el.classList.add("stats-show");
        });

        // Count-up numbers
        entry.target.querySelectorAll(".stats-value").forEach(el => {
          const target = +el.getAttribute("data-target");
          let current = 0;
          const increment = target / 100; // 100 steps
          const interval = setInterval(() => {
            current += increment;
            if (current >= target) {
              el.textContent = target;
              clearInterval(interval);
            } else {
              el.textContent = Math.floor(current);
            }
          }, 20); // speed of counting
        });

        observer.unobserve(entry.target); // animate once
      }
    });
  }, { threshold: 0.3 });

  stats.forEach(stat => observer.observe(stat));
});
