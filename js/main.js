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
      const link = event.target.closest("a");
      // Close mobile nav when clicking a normal link, but not when clicking a dropdown toggle
      if (link && !link.classList.contains("dropdown-toggle")) {
        setOpen(false);
      }
    });

    // Toggle dropdown menus (accordion behavior) on mobile/tablet viewports (<= 1200px)
    const dropdownToggles = nav.querySelectorAll(".dropdown-toggle");
    dropdownToggles.forEach((toggle) => {
      toggle.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent page jump to "#"
        if (window.innerWidth <= 1200) {
          const parent = toggle.closest(".nav-dropdown");
          const isOpen = parent.classList.contains("is-open");

          // Close other dropdowns
          nav.querySelectorAll(".nav-dropdown").forEach((item) => {
            if (item !== parent) {
              item.classList.remove("is-open");
              item.querySelector(".dropdown-toggle")?.setAttribute("aria-expanded", "false");
            }
          });

          // Toggle current dropdown
          parent.classList.toggle("is-open", !isOpen);
          toggle.setAttribute("aria-expanded", String(!isOpen));
        }
      });
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
    let isTransitioning = false;

    const render = () => {
      if (isTransitioning) return;
      isTransitioning = true;
      carousel.classList.add("is-animating");
      setTimeout(() => {
        quoteEl.textContent = quotes[current].text;
        nameEl.textContent = quotes[current].name;
        carousel.classList.remove("is-animating");
        isTransitioning = false;
      }, 220);
    };

    carousel.querySelector("[data-carousel-next]")?.addEventListener("click", () => {
      if (isTransitioning) return;
      current = (current + 1) % quotes.length;
      render();
    });

    carousel.querySelector("[data-carousel-prev]")?.addEventListener("click", () => {
      if (isTransitioning) return;
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
        const keywords = (item.dataset.keywords || "").toLowerCase();
        item.hidden = query.length > 0 && !keywords.includes(query);
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
  const projectCards = [...document.querySelectorAll(".project-card[data-category]")];
  const projectTabs = [...document.querySelectorAll(".project-tab")];

  const projectCategoryData = {
    simulations: {
      description: "סימולציות אינטראקטיביות המאפשרות תרגול מעשי של מיומנויות בסביבה בטוחה ומבוקרת."
    },
    lessons: {
      description: "לומדות אינטראקטיביות מובנות להקניית ידע ותרגול בנושאים מגוונים."
    },
    sites: {
      description: "אתרי אינטרנט ואפליקציות רשת המונגשים למשתמשים ומספקים פתרונות למידה ומידע."
    },
    other: {
      description: "משחקי למידה אינטראקטיביים ופיתוחים מגוונים נוספים מתחום טכנולוגיות הלמידה."
    }
  };

  const setActiveProjectCategory = (category) => {
    const selected = projectCategoryData[category] || projectCategoryData.simulations;
    projectCategoryDescription.textContent = selected.description;

    projectCards.forEach((card) => {
      const isVisible = card.dataset.category === category;
      card.hidden = !isVisible;
      card.setAttribute("aria-hidden", String(!isVisible));
      card.setAttribute("aria-expanded", "false");
      card.querySelector(".project-more")?.setAttribute("aria-hidden", "true");
    });
  };

  if (projectCategoryDescription) {
    projectTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        setActiveProjectCategory(tab.dataset.category);
      });
    });

    setActiveProjectCategory("simulations");
  }

  const initContactAutoScroll = () => {
    const contactSection = document.querySelector(".contact-section");
    const contactFormContainer = document.querySelector(".contact-form-container");
    if (!contactSection || !contactFormContainer) {
      return;
    }

    const canScrollContainer = (deltaY) => {
      const currentScroll = contactFormContainer.scrollTop;
      const maxScroll = contactFormContainer.scrollHeight - contactFormContainer.clientHeight;
      return deltaY > 0
        ? currentScroll < maxScroll - 1
        : currentScroll > 0;
    };

    const isSectionVisible = () => {
      const rect = contactSection.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight;
    };

    const redirectScrollToForm = (deltaY) => {
      if (window.innerWidth < 980) {
        return false;
      }
      if (!isSectionVisible()) {
        return false;
      }
      return canScrollContainer(deltaY);
    };

    document.addEventListener("wheel", (event) => {
      if (!redirectScrollToForm(event.deltaY)) {
        return;
      }

      event.preventDefault();
      contactFormContainer.scrollBy({
        top: event.deltaY,
        behavior: "auto"
      });
    }, { passive: false });

    let touchStartY = 0;
    document.addEventListener("touchstart", (event) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
    }, { passive: true });

    document.addEventListener("touchmove", (event) => {
      if (window.innerWidth < 980) {
        return;
      }
      const touchCurrentY = event.touches[0]?.clientY ?? 0;
      const deltaY = touchStartY - touchCurrentY;
      if (!redirectScrollToForm(deltaY)) {
        touchStartY = touchCurrentY;
        return;
      }
      event.preventDefault();
      contactFormContainer.scrollBy({
        top: deltaY,
        behavior: "auto"
      });
      touchStartY = touchCurrentY;
    }, { passive: false });
  };

  initContactAutoScroll();

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

  // מניעת פעפוע בלחיצה על קישורים בתוך הכרטיסיות (כדי שהכרטיסייה לא תיסגר)
  document.querySelectorAll(".project-card-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.stopPropagation();
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
    const roleLabels = calculator.querySelectorAll('[data-role-group]');
    const form = calculator.querySelector("form");

    const salaryRanges = {
      training: {
        student_1: "5,500–6,500",
        student_2: "6,000–7,500",
        student_3: "7,000–8,500",
        exp_1: "8,000–10,000",
        exp_2: "10,000–12,000"
      },
      design: {
        student_1: "6,000–7,500",
        student_2: "7,000–8,500",
        student_3: "8,000–10,000",
        exp_1: "10,000–12,000",
        exp_2: "12,000–15,000"
      },
      dev: {
        student_1: "7,000–8,500",
        student_2: "8,000–10,000",
        student_3: "9,000–12,000",
        exp_1: "12,000–15,000",
        exp_2: "15,000–18,000"
      }
    };

    const fieldNames = {
      training: "הדרכה",
      design: "עיצוב",
      dev: "פיתוח"
    };

    const fieldCompanies = {
      training: ["גיל אור הדרכה", "מטח", "Matrix"],
      design: ["Wix", "monday.com", "Playtika"],
      dev: ["Check Point", "Amdocs", "Matrix"]
    };

    const updateRolesVisibility = () => {
      const fieldInput = form.querySelector('input[name="field"]:checked');
      if (!fieldInput) return;
      
      const selectedField = fieldInput.value;

      let hasCheckedRole = false;
      roleLabels.forEach(label => {
        const isMatch = label.dataset.roleGroup === selectedField;
        label.hidden = !isMatch;
        const input = label.querySelector('input');
        
        if (!isMatch) {
          input.checked = false;
        } else if (input.checked) {
          hasCheckedRole = true;
        }
      });

      if (!hasCheckedRole) {
        const firstVisibleLabel = Array.from(roleLabels).find(l => l.dataset.roleGroup === selectedField);
        if (firstVisibleLabel) {
          firstVisibleLabel.querySelector('input').checked = true;
        }
      }
    };

    const calculateSalary = () => {
      const fieldInput = form.querySelector('input[name="field"]:checked');
      const expInput = form.querySelector('input[name="experience"]:checked');
      const roleInput = form.querySelector('input[name="role"]:checked');
      
      if (!fieldInput || !expInput || !roleInput) return;
      
      const selectedField = fieldInput.value;
      const selectedExp = expInput.value;
      const selectedRoleName = roleInput.parentElement.textContent.trim();
      const selectedFieldName = fieldNames[selectedField];

      const output = calculator.querySelector("[data-salary-output]");
      const placeholder = calculator.querySelector("[data-result-placeholder]");
      const content = calculator.querySelector("[data-result-content]");
      const descOutput = calculator.querySelector("[data-salary-desc]");
      const companiesOutput = calculator.querySelector("[data-companies-list]");

      // Update salary text
      const range = salaryRanges[selectedField]?.[selectedExp] || "לא ידוע";
      output.textContent = `${range} ש״ח`;

      // Generate dynamic description
      let descText = "";
      if (selectedExp.startsWith("student")) {
        descText = `נראה שאתם מתאימים למשרת Junior בתחום ה${selectedFieldName} (לדוגמה: ${selectedRoleName}), עם בסיס טוב להשתלבות בעולם העבודה והזדמנות להתחיל לצבור ניסיון מקצועי כבר במהלך התואר.`;
      } else {
        descText = `נראה שעם הניסיון שצברתם, אתם מתאימים למשרת ${selectedRoleName} בתחום ה${selectedFieldName}. יש לכם בסיס מצוין להשתלבות מהירה בצוותים מקצועיים והמשך צמיחה בקריירה.`;
      }
      descOutput.textContent = descText;

      // Populate companies list
      companiesOutput.innerHTML = "";
      const companies = fieldCompanies[selectedField] || [];
      companies.forEach(company => {
        const span = document.createElement("span");
        span.className = "company-tag";
        span.textContent = company;
        companiesOutput.appendChild(span);
      });

      // Show result, hide placeholder
      placeholder.hidden = true;
      content.hidden = false;
    };

    const calcBtn = calculator.querySelector("[data-calculate-btn]");
    const resetBtn = calculator.querySelector("[data-reset-btn]");

    form.addEventListener("change", (e) => {
      if (e.target.name === "field") {
        updateRolesVisibility();
      }
    });

    if (calcBtn) {
      calcBtn.addEventListener("click", calculateSalary);
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        form.reset();
        updateRolesVisibility();
        const placeholder = calculator.querySelector("[data-result-placeholder]");
        const content = calculator.querySelector("[data-result-content]");
        if (placeholder && content) {
          placeholder.hidden = false;
          content.hidden = true;
        }
      });
    }

    updateRolesVisibility();
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
  const clearButton = document.querySelector('[data-job-action="clear"]');

  if (jobTabs.length && jobPanels.length) {
    const getCurrentPanel = () => jobPanels.find((panel) => !panel.hasAttribute('hidden')) || jobPanels[0];

    const hidePanel = (panel) => {
      panel.classList.remove('fade-in');
      panel.classList.add('fade-out');
      
      let hasCompleted = false;
      const completeTransition = () => {
        if (hasCompleted) return;
        hasCompleted = true;
        panel.removeEventListener('transitionend', onTransitionEnd);
        panel.setAttribute('hidden', '');
        panel.setAttribute('aria-hidden', 'true');
      };
      
      const onTransitionEnd = (event) => {
        if (event.target !== panel) return;
        completeTransition();
      };
      
      panel.addEventListener('transitionend', onTransitionEnd);
      
      // Fallback timer: if transition does not fire within 300ms, trigger completion manually
      setTimeout(completeTransition, 300);
    };

    const showPanel = (panel) => {
      panel.removeAttribute('hidden');
      panel.setAttribute('aria-hidden', 'false');
      panel.classList.remove('fade-out');
      panel.classList.add('fade-in');
    };

    const activateJob = (target) => {
      const nextPanel = document.getElementById(target);
      if (!nextPanel) return;

      jobTabs.forEach((tab) => {
        const isActive = tab.dataset.jobTarget === target;
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', String(isActive));
        tab.setAttribute('tabindex', isActive ? '0' : '-1');
      });

      const currentPanel = getCurrentPanel();
      const multipleVisible = jobPanels.filter(p => !p.hasAttribute('hidden')).length > 1;
      if (currentPanel === nextPanel && !multipleVisible) return;

      if (!nextPanel.hasAttribute('hidden')) {
        jobPanels.forEach((panel) => {
          panel.hidden = panel.id !== target;
          panel.setAttribute('aria-hidden', String(panel.id !== target));
        });
        return;
      }

      hidePanel(currentPanel);
      showPanel(nextPanel);
    };

    const clearSelection = () => {
      // Remove is-active class from all tabs
      jobTabs.forEach((tab) => {
        tab.classList.remove('is-active');
        tab.setAttribute('aria-selected', 'false');
        tab.setAttribute('tabindex', '-1');
      });

      // Show all panels
      jobPanels.forEach((panel) => {
        panel.removeAttribute('hidden');
        panel.setAttribute('aria-hidden', 'false');
        panel.classList.remove('fade-out');
        panel.classList.add('fade-in');
      });
    };

    jobTabs.forEach((tab) => {
      // Skip the clear button - it will have its own handler
      if (tab.dataset.jobAction === 'clear') {
        return;
      }

      tab.addEventListener('click', () => activateJob(tab.dataset.jobTarget));
      tab.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          activateJob(tab.dataset.jobTarget);
        }
      });
    });

    // Handle clear button click
    if (clearButton) {
      clearButton.addEventListener('click', clearSelection);
      clearButton.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          clearSelection();
        }
      });
    }

    activateJob(jobTabs.find(tab => tab.dataset.jobTarget)?.dataset.jobTarget || 'training');
  }

  // Setup interactive flip cards for CV keywords section
  const cvFlipCards = document.querySelectorAll('.cv-keywords-section .cv-flip-card');
  cvFlipCards.forEach(card => {
    // Flip on click
    card.addEventListener('click', () => {
      card.classList.toggle('is-flipped');
    });

    // Flip on Enter or Space for accessibility
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('is-flipped');
      }
    });
  });

  // Setup companies carousel accessibility controls
  const carouselToggle = document.querySelector("[data-carousel-toggle]");
  if (carouselToggle) {
    const track = document.querySelector(".companies-carousel-track");
    if (track) {
      carouselToggle.addEventListener("click", () => {
        const isPaused = track.classList.toggle("is-paused");
        carouselToggle.classList.toggle("is-paused", isPaused);
        
        if (isPaused) {
          carouselToggle.setAttribute("aria-label", "המשך תנועת קרוסלה");
          carouselToggle.setAttribute("aria-pressed", "true");
        } else {
          carouselToggle.setAttribute("aria-label", "עצור תנועת קרוסלה");
          carouselToggle.setAttribute("aria-pressed", "false");
        }
      });
    }
  }

  window.addEventListener("DOMContentLoaded", () => {
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  });
})();
