(() => {
  const header = document.querySelector("[data-site-header]");
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#primary-nav");

  if (header && navToggle && nav) {
    const setOpen = (isOpen) => {
      header.classList.toggle("nav-open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
    };

    navToggle.addEventListener("click", () => {
      setOpen(!header.classList.contains("nav-open"));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && header.classList.contains("nav-open")) {
        setOpen(false);
        navToggle.focus();
      }
    });

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        setOpen(false);
      }
    });
  }

  const carousel = document.querySelector("[data-carousel]");
  if (carousel) {
    const quotes = [
      {
        text: "״הבנתי סוף סוף איך להסביר פרויקט מהלימודים כאילו הוא מוצר אמיתי. זה עזר לי לדבר בביטחון בראיון.״",
        name: "נועה, שנה ג׳"
      },
      {
        text: "״המחשבון והמילון עשו לי סדר בין משרות שנראו לי אותו דבר. פתאום ידעתי מה לחפש.״",
        name: "סול, בוגרת טרייה"
      },
      {
        text: "״הבנתי שתיק עבודות לא חייב להיות מושלם. הוא צריך להראות דרך חשיבה, וזה הוריד המון לחץ.״",
        name: "חני, סטודנטית"
      }
    ];
    const quoteEl = carousel.querySelector("[data-carousel-quote]");
    const nameEl = carousel.querySelector("[data-carousel-name]");
    let current = 0;

    const render = () => {
      quoteEl.textContent = quotes[current].text;
      nameEl.textContent = quotes[current].name;
    };

    carousel.querySelector("[data-carousel-next]")?.addEventListener("click", () => {
      current = (current + 1) % quotes.length;
      render();
    });

    carousel.querySelector("[data-carousel-prev]")?.addEventListener("click", () => {
      current = (current - 1 + quotes.length) % quotes.length;
      render();
    });
  }

  const faqItems = [...document.querySelectorAll("[data-faq-item]")];
  const faqChips = [...document.querySelectorAll("[data-faq-chip]")];
  const faqClearButton = document.querySelector("[data-faq-clear]");

  if (faqItems.length) {
    const filterFaq = (value) => {
      const query = value.trim().toLowerCase();
      faqItems.forEach((item) => {
        const text = `${item.textContent} ${item.dataset.keywords || ""}`.toLowerCase();
        item.hidden = query.length > 0 && !text.includes(query);
      });
    };

    const clearFaqSelection = () => {
      faqChips.forEach((item) => item.classList.remove("is-active"));
      filterFaq("");
    };

    faqChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        const isActive = chip.classList.contains("is-active");
        clearFaqSelection();

        if (!isActive) {
          chip.classList.add("is-active");
          filterFaq(chip.dataset.faqChip || "");
        }
      });
    });

    faqClearButton?.addEventListener("click", clearFaqSelection);
  }

  const activatePressedTabGroup = (selector, groupSelector) => {
    document.querySelectorAll(selector).forEach((tab) => {
      tab.addEventListener("click", () => {
        const group = tab.closest(groupSelector);
        group?.querySelectorAll(selector).forEach((item) => {
          item.classList.remove("is-active");
          item.setAttribute("aria-pressed", "false");
          item.setAttribute("aria-selected", "false");
        });
        tab.classList.add("is-active");
        tab.setAttribute("aria-pressed", "true");
        tab.setAttribute("aria-selected", "true");
      });
    });
  };

  activatePressedTabGroup(".project-tab", ".project-tabs");

  const projectCategoryDescription = document.querySelector(".project-category-description");
  const projectCategoryTitle = document.querySelector(".project-category-title");
  const projectCards = [...document.querySelectorAll(".project-card[data-category]")];
  const projectTabs = [...document.querySelectorAll(".project-tab")];

  const projectCategoryData = {
    videos: {
      title: "סרטונים",
      description: "פרוייקטים קצרים עם מבנה ברור: מטרה, קהל יעד, מה למד המשתמש ואיך הוידאו תומך בלמידה."
    },
    lessons: {
      title: "לומדות",
      description: "פרויקט לומדה שמנגיש תהליך, מסביר שלבים ומשלב משוב למשתמש בדרך ברורה ומקצועית."
    },
    websites: {
      title: "אתרים / ווב אפס",
      description: "פרויקט ממשק שמציג זרימה ברורה, גריד מידע טוב ועשייה שמתאימה למובייל ונגישה."
    },
    games: {
      title: "משחקי למידה",
      description: "פרויקט חווייתי שמחבר את המשתמש לאתגר לימודי, משוב מיידי ותובנות מקצועיות."
    }
  };

  const setActiveProjectCategory = (category) => {
    const selected = projectCategoryData[category] || projectCategoryData.videos;
    projectCategoryTitle.textContent = selected.title;
    projectCategoryDescription.textContent = selected.description;

    projectCards.forEach((card) => {
      const isVisible = card.dataset.category === category;
      card.hidden = !isVisible;
      card.setAttribute("aria-hidden", String(!isVisible));
      card.setAttribute("aria-expanded", "false");
      card.querySelector(".project-more")?.setAttribute("aria-hidden", "true");
    });
  };

  projectTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      setActiveProjectCategory(tab.dataset.category);
    });
  });

  setActiveProjectCategory("videos");

  const isKeyboardActivation = (event) => event.key === "Enter" || event.key === " ";
  const expandableCards = [...document.querySelectorAll("[data-expand-card]")];

  expandableCards.forEach((card) => {
    const toggleCard = () => {
      const willOpen = card.getAttribute("aria-expanded") !== "true";

      expandableCards.forEach((item) => {
        item.setAttribute("aria-expanded", "false");
        item.querySelector(".project-more")?.setAttribute("aria-hidden", "true");
      });

      card.setAttribute("aria-expanded", String(willOpen));
      card.querySelector(".project-more")?.setAttribute("aria-hidden", String(!willOpen));
    };

    card.addEventListener("click", toggleCard);
    card.addEventListener("keydown", (event) => {
      if (!isKeyboardActivation(event)) {
        return;
      }

      event.preventDefault();
      toggleCard();
    });
  });

  document.querySelectorAll("[data-flip-card]").forEach((card) => {
    const front = card.querySelector(".flip-card__front");
    const back = card.querySelector(".flip-card__back");
    front?.setAttribute("aria-hidden", "false");
    back?.setAttribute("aria-hidden", "true");

    const flipCard = () => {
      const isFlipped = card.classList.toggle("is-flipped");
      card.setAttribute("aria-pressed", String(isFlipped));
      front?.setAttribute("aria-hidden", String(isFlipped));
      back?.setAttribute("aria-hidden", String(!isFlipped));
    };

    card.addEventListener("click", flipCard);
    card.addEventListener("keydown", (event) => {
      if (!isKeyboardActivation(event)) {
        return;
      }

      event.preventDefault();
      flipCard();
    });
  });

  const calculator = document.querySelector("[data-salary-calculator]");
  if (calculator) {
    const output = calculator.querySelector("[data-salary-output]");
    const values = {
      training: 7800,
      design: 8500,
      tech: 9800,
      junior: 0,
      mid: 1200,
      senior: 2400,
      student: -800,
      graduate: 0,
      plus: 1800
    };

    const formatSalary = (value) => `${value.toLocaleString("he-IL")} ש״ח`;
    const updateSalary = () => {
      const selected = [...calculator.querySelectorAll("input:checked")];
      const total = selected.reduce((sum, input) => sum + (values[input.value] || 0), 0);
      output.textContent = formatSalary(total);
    };

    calculator.addEventListener("change", updateSalary);
    updateSalary();
  }

  const contactForm = document.querySelector("[data-contact-form]");
  if (contactForm) {
    const status = contactForm.querySelector("[data-form-status]");

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const invalid = contactForm.querySelector(":invalid");

      if (invalid) {
        status.textContent = "יש להשלים את שדות החובה לפני השליחה.";
        invalid.focus();
        return;
      }

      contactForm.reset();
      status.textContent = "הטופס נשלח בהצלחה. נחזור אליכם בהקדם.";
    });
  }

  // Jobs tabs: switch visible panel when clicking tabs
  const jobTabs = [...document.querySelectorAll('.job-tab')];
  const jobPanels = [...document.querySelectorAll('[data-job-panel]')];

  if (jobTabs.length && jobPanels.length) {
    const activateJob = (target) => {
      jobTabs.forEach((t) => {
        const isActive = t.dataset.jobTarget === target;
        t.classList.toggle('is-active', isActive);
        t.setAttribute('aria-selected', String(isActive));
      });

      jobPanels.forEach((p) => {
        p.hidden = p.id !== target;
      });
    };

    jobTabs.forEach((tab) => {
      tab.addEventListener('click', () => activateJob(tab.dataset.jobTarget));
    });

    // default to first tab
    activateJob(jobTabs[0].dataset.jobTarget);
  }

  window.addEventListener("DOMContentLoaded", () => {
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  });
})();
