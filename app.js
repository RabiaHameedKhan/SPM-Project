// Shared UI bootstrapping for every page in the static mockup.
document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
  initRevealAnimations();
  initPageTransitions();
  initMobileNav();
  initCounters();
  initSearchTabs();
  initSearchChips();
  initPostTaskFlow();
  initToastTriggers();
  initCountdown();
  initTabs();
  initHelpButton();
  initAutoResize();
});

function initParticles() {
  // Canvas-based ambient background particles with connective lines.
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const colors = ["#00d4ff", "#7c3aed", "#00ffaa"];
  const particleCount = 60;
  const particles = [];
  let width = 0;
  let height = 0;
  let animationFrame;

  const resize = () => {
    width = canvas.width = window.innerWidth * window.devicePixelRatio;
    height = canvas.height = window.innerHeight * window.devicePixelRatio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  };

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = initial ? Math.random() * window.innerWidth : Math.random() * window.innerWidth;
      this.y = initial ? Math.random() * window.innerHeight : Math.random() * window.innerHeight;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.size = Math.random() * 2 + 1;
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x <= 0 || this.x >= window.innerWidth) this.vx *= -1;
      if (this.y <= 0 || this.y >= window.innerHeight) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = 0.7;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  resize();
  for (let i = 0; i < particleCount; i += 1) {
    particles.push(new Particle());
  }

  const render = () => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particles.forEach((particle, index) => {
      particle.update();
      particle.draw();

      for (let j = index + 1; j < particles.length; j += 1) {
        const other = particles[j];
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = `rgba(140, 180, 255, ${1 - distance / 120})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    });

    animationFrame = window.requestAnimationFrame(render);
  };

  render();
  window.addEventListener("resize", resize);
  window.addEventListener("beforeunload", () => window.cancelAnimationFrame(animationFrame), { once: true });
}

function initCursor() {
  // Glowing dual-layer cursor for desktop devices only.
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  if (coarsePointer) return;

  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  if (!dot || !ring) return;

  const position = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const ringPosition = { x: position.x, y: position.y };

  window.addEventListener("mousemove", (event) => {
    position.x = event.clientX;
    position.y = event.clientY;
    dot.style.transform = `translate(${position.x - 6}px, ${position.y - 6}px)`;
  });

  const interactive = document.querySelectorAll("a, button, input, textarea, select, .chip, .tab-btn, .toggle-pill");
  interactive.forEach((element) => {
    element.addEventListener("mouseenter", () => ring.classList.add("is-hovering"));
    element.addEventListener("mouseleave", () => ring.classList.remove("is-hovering"));
  });

  const animateRing = () => {
    ringPosition.x += (position.x - ringPosition.x) * 0.16;
    ringPosition.y += (position.y - ringPosition.y) * 0.16;
    ring.style.transform = `translate(${ringPosition.x - ring.offsetWidth / 2}px, ${ringPosition.y - ring.offsetHeight / 2}px)`;
    requestAnimationFrame(animateRing);
  };

  animateRing();
}

function initTiltCards() {
  // Apply lightweight 3D tilt and glare movement to every glass card.
  const cards = document.querySelectorAll(".glass-card");
  cards.forEach((card) => {
    const glare = card.querySelector(".card-glare");

    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const rotateY = (px - 0.5) * 16;
      const rotateX = (0.5 - py) * 16;
      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;

      if (glare) {
        glare.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.24), transparent 34%)`;
      }
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

function initRevealAnimations() {
  // Scroll-triggered reveal animations with simple stagger logic.
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const siblings = Array.from(entry.target.parentElement?.children || []);
          const index = Math.max(siblings.indexOf(entry.target), 0);
          entry.target.style.animationDelay = `${index * 90}ms`;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  items.forEach((item) => observer.observe(item));
}

function initPageTransitions() {
  const page = document.querySelector(".page-transition");
  const links = document.querySelectorAll("[data-transition]");
  if (!page || !links.length) return;

  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#")) return;

    link.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      page.classList.add("is-leaving");
      setTimeout(() => {
        window.location.href = href;
      }, 360);
    });
  });
}

function initMobileNav() {
  const button = document.querySelector("[data-mobile-toggle]");
  const drawer = document.querySelector(".mobile-drawer");
  if (!button || !drawer) return;

  button.addEventListener("click", () => {
    drawer.classList.toggle("is-open");
  });

  drawer.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => drawer.classList.remove("is-open"));
  });
}

function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  const animateCounter = (element) => {
    const target = parseFloat(element.dataset.count || "0");
    const prefix = element.dataset.prefix || "";
    const suffix = element.dataset.suffix || "";
    const decimals = Number(element.dataset.decimals || 0);
    const duration = 1100;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      element.textContent = `${prefix}${current.toFixed(decimals)}${suffix}`;
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = "true";
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.35 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

function initSearchTabs() {
  document.querySelectorAll(".search-tabs").forEach((group) => {
    group.querySelectorAll(".search-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        group.querySelectorAll(".search-tab").forEach((item) => item.classList.remove("is-active"));
        tab.classList.add("is-active");
      });
    });
  });
}

function initSearchChips() {
  document.querySelectorAll("[data-chip-group]").forEach((group) => {
    const searchShell = group.closest(".search-shell");
    const searchInput = searchShell?.querySelector(".search-input");
    const cards = Array.from(document.querySelectorAll(".masonry-card"));

    const normalize = (value) => value.trim().toLowerCase();
    const categoryMap = {
      assignments: ["spm", "uml", "documentation", "java", "database", "testing", "python"],
      design: ["presentation", "frontend"],
      coding: ["frontend", "java", "database", "python", "testing"],
      writing: ["documentation", "presentation", "spm"],
      research: ["documentation", "presentation"],
    };

    const applyFilters = () => {
      const activeChip = group.querySelector(".chip.is-active");
      const category = normalize(activeChip?.textContent || "all");
      const query = normalize(searchInput?.value || "");

      cards.forEach((card) => {
        const cardText = normalize(card.textContent);
        const cardCategory = normalize(card.dataset.category || "");
        const mappedCategories = categoryMap[category] || [category];
        const matchesCategory =
          category === "all" ||
          mappedCategories.some((item) => cardCategory.includes(item) || cardText.includes(item));
        const matchesQuery = !query || cardText.includes(query) || cardCategory.includes(query);
        card.classList.toggle("is-hidden", !(matchesCategory && matchesQuery));
      });
    };

    group.querySelectorAll(".chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        group.querySelectorAll(".chip").forEach((item) => item.classList.remove("is-active"));
        chip.classList.add("is-active");
        applyFilters();
      });
    });

    searchInput?.addEventListener("input", applyFilters);
  });
}

function initPostTaskFlow() {
  // Simulated multi-step task posting form for the static prototype.
  const postTaskForm = document.querySelector("[data-post-task]");
  if (!postTaskForm) return;

  const stepPills = Array.from(postTaskForm.querySelectorAll(".step-pill"));
  const stepPanels = Array.from(postTaskForm.querySelectorAll(".step-panel"));
  const nextButtons = postTaskForm.querySelectorAll("[data-next-step]");
  const backButtons = postTaskForm.querySelectorAll("[data-prev-step]");
  const range = postTaskForm.querySelector("#budgetRange");
  const rangeText = postTaskForm.querySelector("[data-budget-output]");
  const skillInput = postTaskForm.querySelector("#skillInput");
  const skillWrap = postTaskForm.querySelector("[data-skill-tags]");
  const urgencyButtons = postTaskForm.querySelectorAll(".toggle-pill");
  const charCount = postTaskForm.querySelector("[data-char-count]");
  const description = postTaskForm.querySelector("#taskDescription");
  const review = postTaskForm.querySelector("[data-review-summary]");
  const submit = postTaskForm.querySelector("[data-submit-task]");
  let currentStep = 0;
  let urgency = "Normal";
  const skills = [];

  const updateStep = (index) => {
    currentStep = index;
    stepPills.forEach((pill, pillIndex) => {
      pill.classList.toggle("is-active", pillIndex === index);
      pill.classList.toggle("is-complete", pillIndex < index);
    });
    stepPanels.forEach((panel, panelIndex) => {
      panel.classList.toggle("is-active", panelIndex === index);
    });

    if (index === 2) {
      populateReview();
    }
  };

  const updateBudgetText = () => {
    const max = Number(range.value);
    rangeText.textContent = `PKR 500 - PKR ${max.toLocaleString("en-PK")}`;
  };

  const renderSkills = () => {
    skillWrap.querySelectorAll(".tag").forEach((tag) => tag.remove());
    skills.forEach((skill) => {
      const tag = document.createElement("span");
      tag.className = "tag tag-blue";
      tag.textContent = skill;
      skillWrap.insertBefore(tag, skillInput);
    });
  };

  const populateReview = () => {
    const title = postTaskForm.querySelector("#taskTitle").value || "Untitled Task";
    const category = postTaskForm.querySelector("#taskCategory").value || "General";
    const deadline = postTaskForm.querySelector("#taskDeadline").value || "Not selected";
    const descriptionValue = description.value || "No description provided.";
    review.innerHTML = `
      <div class="summary-row"><span>Task Title</span><strong>${title}</strong></div>
      <div class="summary-row"><span>Category</span><strong>${category}</strong></div>
      <div class="summary-row"><span>Deadline</span><strong>${deadline}</strong></div>
      <div class="summary-row"><span>Budget</span><strong>${rangeText.textContent}</strong></div>
      <div class="summary-row"><span>Urgency</span><strong>${urgency}</strong></div>
      <div class="summary-row"><span>Skills</span><strong>${skills.length ? skills.join(", ") : "None added"}</strong></div>
      <div class="summary-row"><span>Description</span><strong>${descriptionValue}</strong></div>
    `;
  };

  nextButtons.forEach((button) => {
    button.addEventListener("click", () => updateStep(Math.min(currentStep + 1, stepPanels.length - 1)));
  });

  backButtons.forEach((button) => {
    button.addEventListener("click", () => updateStep(Math.max(currentStep - 1, 0)));
  });

  range?.addEventListener("input", updateBudgetText);
  updateBudgetText();

  description?.addEventListener("input", () => {
    charCount.textContent = `${description.value.length}/500`;
  });

  skillInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && skillInput.value.trim()) {
      event.preventDefault();
      const value = skillInput.value.trim();
      if (!skills.includes(value)) skills.push(value);
      skillInput.value = "";
      renderSkills();
    }
  });

  urgencyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      urgencyButtons.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      urgency = button.dataset.urgency;
    });
  });

  submit?.addEventListener("click", () => {
    submit.disabled = true;
    submit.innerHTML = `<i data-lucide="loader-circle"></i> Posting Task...`;
    lucide.createIcons();
    setTimeout(() => {
      submit.innerHTML = `<i data-lucide="check"></i> Task Posted`;
      lucide.createIcons();
      showToast("Task posted!", "Your new marketplace listing is now live.");
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 900);
    }, 1300);
  });

  updateStep(0);
}

function initToastTriggers() {
  document.querySelectorAll("[data-toast-title]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      const href = trigger.getAttribute("href");
      if (href && href !== "#") return;
      event.preventDefault();
      showToast(trigger.dataset.toastTitle, trigger.dataset.toastMessage || "");
    });
  });
}

function initCountdown() {
  const countdown = document.querySelector("[data-countdown]");
  if (!countdown) return;

  const target = new Date(countdown.dataset.countdown);
  const tick = () => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) {
      countdown.textContent = "Deadline reached";
      return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    countdown.textContent = `${days}d ${hours}h ${minutes}m remaining`;
  };

  tick();
  setInterval(tick, 60000);
}

function initTabs() {
  document.querySelectorAll("[data-tab-group]").forEach((group) => {
    const buttons = group.querySelectorAll(".tab-btn");
    const panels = group.querySelectorAll(".tab-panel");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const target = button.dataset.tab;
        buttons.forEach((item) => item.classList.remove("is-active"));
        panels.forEach((panel) => panel.classList.remove("is-active"));
        button.classList.add("is-active");
        group.querySelector(`[data-panel="${target}"]`)?.classList.add("is-active");
      });
    });
  });
}

function initHelpButton() {
  const help = document.querySelector(".help-button");
  if (!help) return;
  help.addEventListener("click", () => {
    showToast("Need a hand?", "This is a static demo, so all actions are simulated for presentation.");
  });
}

function initAutoResize() {
  document.querySelectorAll("textarea[data-autoresize]").forEach((textarea) => {
    const resize = () => {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    };
    textarea.addEventListener("input", resize);
    resize();
  });
}

function showToast(title, message) {
  let stack = document.querySelector(".toast-stack");
  if (!stack) {
    stack = document.createElement("div");
    stack.className = "toast-stack";
    document.body.appendChild(stack);
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<strong>${title}</strong><span>${message}</span>`;
  stack.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("is-leaving");
    toast.addEventListener("animationend", () => toast.remove(), { once: true });
  }, 3000);
}
