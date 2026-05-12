const root = document.documentElement;
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle.querySelector(".theme-icon");
const scrollProgress = document.getElementById("scrollProgress");
const typingText = document.getElementById("typingText");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const year = document.getElementById("year");

year.textContent = new Date().getFullYear();

const savedTheme = localStorage.getItem("portfolio-theme");
const preferredTheme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
setTheme(savedTheme || preferredTheme);

function setTheme(theme) {
  root.dataset.theme = theme;
  themeIcon.textContent = theme === "light" ? "Light" : "Dark";
  localStorage.setItem("portfolio-theme", theme);
}

themeToggle.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "light" ? "dark" : "light";
  setTheme(nextTheme);
});

navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  navToggle.classList.toggle("active", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("menu-open", isOpen);
});

document.querySelectorAll(".nav-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    navToggle.classList.remove("active");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal, .skill-card").forEach((element) => {
  revealObserver.observe(element);
});

const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-menu a");

const activeNavObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-42% 0px -48% 0px" }
);

sections.forEach((section) => activeNavObserver.observe(section));

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;
  scrollProgress.style.width = `${progress}%`;
});

const phrases = [
  "scalable applications.",
  "database-driven systems.",
  "mobile experiences.",
  "cloud-ready solutions.",
  "real-world software."
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeLoop() {
  const phrase = phrases[phraseIndex];
  const typingSpeed = isDeleting ? 36 : 70;

  typingText.textContent = phrase.slice(0, charIndex);

  if (!isDeleting && charIndex < phrase.length) {
    charIndex += 1;
  } else if (isDeleting && charIndex > 0) {
    charIndex -= 1;
  } else if (!isDeleting && charIndex === phrase.length) {
    isDeleting = true;
    setTimeout(typeLoop, 1200);
    return;
  } else {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
  }

  setTimeout(typeLoop, typingSpeed);
}

typeLoop();

document.querySelectorAll(".filter-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    document.querySelectorAll(".filter-btn").forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    document.querySelectorAll(".project-card").forEach((card) => {
      const tech = card.dataset.tech || "";
      const shouldShow = filter === "all" || tech.includes(filter);
      card.classList.toggle("hidden", !shouldShow);
    });
  });
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formStatus.textContent = "";

  const fields = [
    {
      element: document.getElementById("name"),
      message: "Please enter your name.",
      validate: (value) => value.trim().length >= 2
    },
    {
      element: document.getElementById("email"),
      message: "Please enter a valid email address.",
      validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    },
    {
      element: document.getElementById("message"),
      message: "Please enter a message with at least 10 characters.",
      validate: (value) => value.trim().length >= 10
    }
  ];

  let isValid = true;

  fields.forEach(({ element, message, validate }) => {
    const row = element.closest(".form-row");
    const error = row.querySelector(".error-message");
    const valid = validate(element.value);

    row.classList.toggle("invalid", !valid);
    error.textContent = valid ? "" : message;

    if (!valid) {
      isValid = false;
    }
  });

  if (!isValid) {
    return;
  }

  contactForm.reset();
  formStatus.textContent = "Thanks! Your message is ready to be sent.";
});
