(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".menu-toggle");
  var menu = document.getElementById("site-menu");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function closeMenu() {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
    menu.classList.remove("open");
    document.body.classList.remove("nav-open");
    if (header) header.classList.remove("menu-open");
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      menu.classList.toggle("open", open);
      document.body.classList.toggle("nav-open", open);
      if (header) header.classList.toggle("menu-open", open);
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 760) closeMenu();
    });
  }

  function updateHeader() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 12);
  }

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  var reveals = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (item) { item.classList.add("visible"); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -28px" });

    reveals.forEach(function (item) { revealObserver.observe(item); });
  }

  var lightbox = document.querySelector(".lightbox");
  var lightboxImage = lightbox ? lightbox.querySelector("img") : null;
  var lightboxClose = lightbox ? lightbox.querySelector(".lightbox-close") : null;

  document.querySelectorAll("[data-lightbox]").forEach(function (button) {
    button.addEventListener("click", function () {
      if (!lightbox || !lightboxImage || typeof lightbox.showModal !== "function") return;
      var image = button.querySelector("img");
      lightboxImage.src = button.getAttribute("data-lightbox");
      lightboxImage.alt = image ? image.alt : "Expanded project screenshot";
      lightbox.showModal();
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

  document.querySelectorAll("#year").forEach(function (year) {
    year.textContent = String(new Date().getFullYear());
  });

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

  function setError(field, errorText) {
    var error = form.querySelector('[data-error-for="' + field.name + '"]');
    if (error) error.textContent = errorText;
    field.classList.toggle("invalid", Boolean(errorText));
    field.setAttribute("aria-invalid", errorText ? "true" : "false");
  }

  function validate() {
    var valid = true;
    form.querySelectorAll("input, textarea").forEach(function (field) {
      var value = field.value.trim();
      var errorText = "";

      if (!value) errorText = "This field is required.";
      if (value && field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errorText = "Enter a valid email address.";
      }

      setError(field, errorText);
      if (errorText) valid = false;
    });
    return valid;
  }

  form.querySelectorAll("input, textarea").forEach(function (field) {
    field.addEventListener("input", function () {
      if (field.classList.contains("invalid")) setError(field, "");
    });
  });

  function showStatus(kind, messageText) {
    if (!status) return;
    status.hidden = false;
    status.className = "form-status " + kind;
    status.textContent = messageText;
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
