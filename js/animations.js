document.documentElement.classList.add("motion-enabled");

document.addEventListener("DOMContentLoaded", () => {
  const revealItems = document.querySelectorAll(".reveal-on-scroll");
  const counters = document.querySelectorAll("[data-counter]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const setCounterValue = (counter, value) => {
    const suffix = counter.dataset.suffix || "";
    counter.textContent = `${value}${suffix}`;
  };

  const animateCounter = (counter) => {
    if (counter.dataset.animated === "true") return;
    counter.dataset.animated = "true";

    const target = Number(counter.dataset.counter);
    if (!Number.isFinite(target) || target < 0) {
      counter.textContent = `${counter.dataset.counter}${counter.dataset.suffix || ""}`;
      return;
    }

    if (reduceMotion) {
      setCounterValue(counter, target);
      return;
    }

    const startTime = performance.now();
    const duration = 1200;

    const update = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setCounterValue(counter, Math.round(target * easedProgress));
      if (progress < 1) window.requestAnimationFrame(update);
    };

    window.requestAnimationFrame(update);
  };

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    counters.forEach(animateCounter);
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("is-visible");
      if (entry.target.matches("[data-counter]")) animateCounter(entry.target);
      currentObserver.unobserve(entry.target);
    });
  }, {
    threshold: 0.15,
    rootMargin: "0px 0px -30px 0px"
  });

  revealItems.forEach((item) => observer.observe(item));
  counters.forEach((counter) => observer.observe(counter));
});