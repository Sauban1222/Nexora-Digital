document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  const setMenuState = (isOpen) => {
    if (!navToggle || !navMenu) return;

    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    navMenu.classList.toggle("is-open", isOpen);
  };

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      setMenuState(!isOpen);
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => setMenuState(false));
    });

    document.addEventListener("click", (event) => {
      if (!navMenu.classList.contains("is-open")) return;
      if (navMenu.contains(event.target) || navToggle.contains(event.target)) return;
      setMenuState(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && navMenu.classList.contains("is-open")) {
        setMenuState(false);
        navToggle.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 992) setMenuState(false);
    });
  }

  const currentFile = window.location.pathname.split("/").pop() || "index.html";
  navLinks.forEach((link) => {
    link.classList.remove("is-active");
    link.removeAttribute("aria-current");

    const linkFile = link.getAttribute("href").split("#")[0].split("?")[0];
    if (linkFile === currentFile) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });

  const updateHeader = () => {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const rotatingText = document.querySelector(".hero-rotating-text");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (rotatingText && !reducedMotion) {
    const phrases = ["Digital Experiences", "Digital Products", "Digital Brands"];
    let phraseIndex = 0;
    let characterIndex = phrases[0].length;
    let deleting = false;

    const typeNextCharacter = () => {
      const phrase = phrases[phraseIndex];

      if (deleting) {
        characterIndex -= 1;
        rotatingText.textContent = phrase.slice(0, characterIndex);
      } else {
        characterIndex += 1;
        rotatingText.textContent = phrase.slice(0, characterIndex);
      }

      let delay = deleting ? 38 : 82;
      if (!deleting && characterIndex === phrase.length) {
        deleting = true;
        delay = 1500;
      } else if (deleting && characterIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 280;
      }

      window.setTimeout(typeNextCharacter, delay);
    };

    window.setTimeout(typeNextCharacter, 1800);
  }

  const faqQuestions = document.querySelectorAll(".faq-question");
  faqQuestions.forEach((question) => {
    question.addEventListener("click", () => {
      const shouldExpand = question.getAttribute("aria-expanded") !== "true";

      faqQuestions.forEach((item) => {
        const answer = document.getElementById(item.getAttribute("aria-controls"));
        const isExpanded = item === question && shouldExpand;

        item.setAttribute("aria-expanded", String(isExpanded));
        if (answer) answer.hidden = !isExpanded;
      });
    });
  });

  const portfolioFilters = document.querySelectorAll(".portfolio-filter");
  const portfolioProjects = document.querySelectorAll(".portfolio-project-card");
  const portfolioResults = document.querySelector("#portfolio-results");

  if (portfolioFilters.length && portfolioProjects.length) {
    portfolioProjects.forEach((project) => {
      project.addEventListener("animationend", (event) => {
        if (event.animationName !== "portfolio-card-exit" || !project.classList.contains("is-filtered-out")) return;
        project.hidden = true;
        project.classList.remove("is-filtered-out");
      });
    });

    portfolioFilters.forEach((filterButton) => {
      filterButton.addEventListener("click", () => {
        const selectedFilter = filterButton.dataset.filter || "all";
        const filterLabel = filterButton.textContent.trim();
        const reducePortfolioMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let visibleCount = 0;

        portfolioFilters.forEach((button) => {
          const isActive = button === filterButton;
          button.classList.toggle("is-active", isActive);
          button.setAttribute("aria-pressed", String(isActive));
        });

        portfolioProjects.forEach((project) => {
          const categories = (project.dataset.categories || "").split(/\s+/);
          const shouldShow = selectedFilter === "all" || categories.includes(selectedFilter);
          const wasHidden = project.hidden || project.classList.contains("is-filtered-out");

          if (shouldShow) {
            project.hidden = false;
            project.removeAttribute("aria-hidden");
            project.classList.remove("is-filtered-out", "is-filtered-in");

            visibleCount += 1;
            if (!reducePortfolioMotion && wasHidden) {
              window.requestAnimationFrame(() => {
                if (!project.hidden && !project.classList.contains("is-filtered-out")) {
                  project.classList.add("is-filtered-in");
                }
              });
            }
          } else {
            project.setAttribute("aria-hidden", "true");
            project.classList.remove("is-filtered-in");

            if (reducePortfolioMotion) {
              project.hidden = true;
              project.classList.remove("is-filtered-out");
            } else if (!project.hidden) {
              project.classList.add("is-filtered-out");
            }
          }
        });

        if (portfolioResults) {
          portfolioResults.textContent = selectedFilter === "all"
            ? `Showing all ${visibleCount} demonstration concepts.`
            : `Showing ${visibleCount} ${filterLabel} concepts.`;
        }
      });
    });
  }
});