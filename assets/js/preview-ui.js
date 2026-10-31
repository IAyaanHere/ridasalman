(function () {
  "use strict";

  const trigger = document.getElementById("naqshPreviewCta");
  const modal = document.getElementById("naqshCtaModal");
  const closeButton = document.getElementById("naqshCtaClose");
  const backdrop = document.getElementById("naqshCtaBackdrop");

  if (!trigger || !modal || !closeButton || !backdrop) {
    return;
  }

  let isOpen = false;
  let previousBodyOverflow = "";
  let previousFocus = null;

  // Only show the Create Yours CTA button when user is in the last section
  const lastSection = document.getElementById("celebration") || document.querySelector(".footer");
  if (lastSection && "IntersectionObserver" in window) {
    const ctaObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            trigger.classList.add("is-visible");
          } else {
            trigger.classList.remove("is-visible");
          }
        });
      },
      { threshold: 0.08 }
    );
    ctaObserver.observe(lastSection);
  } else {
    trigger.classList.add("is-visible");
  }

  function openModal() {
    if (isOpen) return;

    isOpen = true;
    previousFocus = document.activeElement;
    previousBodyOverflow = document.body.style.overflow;

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    trigger.setAttribute("aria-expanded", "true");

    document.body.style.overflow = "hidden";
    closeButton.focus({ preventScroll: true });
  }

  function closeModal() {
    if (!isOpen) return;

    isOpen = false;

    // Return focus before hiding the dialog.
    const focusTarget =
      previousFocus && previousFocus.isConnected
        ? previousFocus
        : trigger;

    focusTarget.focus({ preventScroll: true });

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    trigger.setAttribute("aria-expanded", "false");

    document.body.style.overflow = previousBodyOverflow;
  }

  trigger.addEventListener("click", openModal);
  closeButton.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);

  document.addEventListener("keydown", function (event) {
    if (!isOpen) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeModal();
      return;
    }

    if (event.key !== "Tab") return;

    const focusableElements = Array.from(
      modal.querySelectorAll(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      )
    ).filter(function (element) {
      return element.getClientRects().length > 0;
    });

    if (!focusableElements.length) {
      event.preventDefault();
      modal.focus();
      return;
    }

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];
    const active = document.activeElement;

    if (!modal.contains(active)) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
    } else if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  });
})();
