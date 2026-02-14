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

  /* ================= INITIAL POSITION ================= */
  drone.style.left = "50%";
  drone.style.top = "40%";
  drone.style.transition = "all 3s ease-in-out";

  /* ================= RANDOM FLYING ================= */
  function flyRandom() {
    const { width, height } = hero.getBoundingClientRect();
    drone.style.left = Math.random() * (width - 120) + "px";
    drone.style.top = Math.random() * (height - 120) + "px";
    setTimeout(flyRandom, 3000);
  }

  setTimeout(() => {
    drone.style.opacity = "1";
    drone.style.pointerEvents = "auto";
    flyRandom();
  }, 10000); // show drone after 10s

  /* ================= CLICK REACTION ================= */
  drone.addEventListener("click", () => {
    eyes.forEach(eye => eye.classList.add("angry"));
    drone.classList.add("dash");

    const { width, height } = hero.getBoundingClientRect();
    drone.style.left = Math.random() * (width - 120) + "px";
    drone.style.top = Math.random() * (height - 120) + "px";

    setTimeout(() => drone.classList.remove("dash"), 500);
    setTimeout(() => eyes.forEach(eye => eye.classList.remove("angry")), 1500);
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
