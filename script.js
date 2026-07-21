(function () {
  "use strict";

  var nav = document.querySelector(".site-nav");
  var toggle = document.querySelector(".nav-toggle");
  var navLinks = document.getElementById("nav-links");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function closeNavigation() {
    if (!toggle || !navLinks) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
    navLinks.classList.remove("open");
    document.body.classList.remove("nav-open");
    if (nav) nav.classList.remove("menu-visible");
  }

  if (toggle && navLinks) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      navLinks.classList.toggle("open", open);
      document.body.classList.toggle("nav-open", open);
      if (nav) nav.classList.toggle("menu-visible", open);
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNavigation);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNavigation();
    });
  }

  function updateNav() {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 16);
  }

  window.addEventListener("scroll", updateNav, { passive: true });
  updateNav();

  var sectionLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  var sections = document.querySelectorAll("main section[id]");

  if ("IntersectionObserver" in window && sectionLinks.length) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach(function (link) {
          link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-32% 0px -60% 0px" });

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  var revealItems = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (item) { item.classList.add("visible"); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -35px" });

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  }

  var lightbox = document.querySelector(".lightbox");
  var lightboxImage = lightbox ? lightbox.querySelector("img") : null;
  var lightboxClose = lightbox ? lightbox.querySelector(".lightbox-close") : null;

  document.querySelectorAll("[data-lightbox]").forEach(function (button) {
    button.addEventListener("click", function () {
      if (!lightbox || !lightboxImage) return;
      lightboxImage.src = button.getAttribute("data-lightbox");
      lightboxImage.alt = button.querySelector("img") ? button.querySelector("img").alt : "Expanded screenshot";
      if (typeof lightbox.showModal === "function") lightbox.showModal();
    });
  });

  function closeLightbox() {
    if (lightbox && lightbox.open) lightbox.close();
  }

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) closeLightbox();
    });
  }

  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  var form = document.getElementById("contact-form");
  if (!form) return;

  var endpoint = "https://formspree.io/f/mqewagzl";
  var status = form.querySelector(".form-status");
  var message = form.querySelector("#message");
  var characterCount = form.querySelector(".char-count");

  if (message && characterCount) {
    message.addEventListener("input", function () {
      characterCount.textContent = message.value.length + " / 1200";
    });
  }

  function setError(field, text) {
    var error = form.querySelector('[data-error-for="' + field.name + '"]');
    if (error) error.textContent = text;
    field.classList.toggle("invalid", Boolean(text));
    field.setAttribute("aria-invalid", text ? "true" : "false");
  }

  function validate() {
    var valid = true;
    form.querySelectorAll("input, textarea").forEach(function (field) {
      var value = field.value.trim();
      var error = "";
      if (!value) error = "This field is required.";
      if (value && field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = "Enter a valid email address.";
      }
      setError(field, error);
      if (error) valid = false;
    });
    return valid;
  }

  form.querySelectorAll("input, textarea").forEach(function (field) {
    field.addEventListener("input", function () {
      if (field.classList.contains("invalid")) setError(field, "");
    });
  });

  function showStatus(kind, text) {
    if (!status) return;
    status.hidden = false;
    status.className = "form-status " + kind;
    status.textContent = text;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (status) status.hidden = true;
    if (!validate()) return;

    var submit = form.querySelector('button[type="submit"]');
    var originalText = submit.textContent;
    submit.disabled = true;
    submit.textContent = "Sending…";

    fetch(endpoint, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(form)
    })
      .then(function (response) {
        if (!response.ok) throw new Error("Submission failed");
        form.reset();
        if (characterCount) characterCount.textContent = "0 / 1200";
        showStatus("success", "Message sent. The lab will be in touch soon.");
      })
      .catch(function () {
        showStatus("error", "The message could not be sent. Please try again in a moment.");
      })
      .finally(function () {
        submit.disabled = false;
        submit.textContent = originalText;
      });
  });
})();
