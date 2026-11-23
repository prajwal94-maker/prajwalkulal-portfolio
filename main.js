/**
 * PRAJWAL KULAL - DEVELOPER PORTFOLIO
 * Main JavaScript Interactions
 * - Theme Toggle (Light / Dark with localStorage)
 * - Mobile Drawer Navigation
 * - Active Scroll Spy
 * - Project Category Filtering
 * - Resume Modal & Print trigger
 * - Copy Email to Clipboard
 * - Contact Form Validation & Mailto dispatcher
 * - Animated Skill Meter Bars on viewport intersection
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  initScrollSpy();
  initProjectFilters();
  initResumeModal();
  initCopyEmail();
  initContactForm();
  initSkillMeterAnimations();
});

/* --------------------------------------------------------------------------
   1. Theme Management (Light / Dark Mode)
   -------------------------------------------------------------------------- */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;
  
  // Default appearance mode: Light Theme per design preference
  const savedTheme = localStorage.getItem('pk_portfolio_theme') || 'light';
  html.setAttribute('data-theme', savedTheme);
  updateThemeButtonAria(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('pk_portfolio_theme', newTheme);
      updateThemeButtonAria(newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} theme`);
    });
  }

  function updateThemeButtonAria(theme) {
    if (!themeToggle) return;
    const isDark = theme === 'dark';
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    themeToggle.setAttribute('title', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  }
}

/* --------------------------------------------------------------------------
   2. Mobile Navigation Drawer
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('close-drawer-btn');
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const mobileResumeBtn = document.getElementById('mobile-resume-btn');

  if (!menuBtn || !drawer || !backdrop) return;

  function openDrawer() {
    drawer.classList.add('open');
    backdrop.classList.add('active');
    menuBtn.classList.add('active');
    drawer.setAttribute('aria-hidden', 'false');
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('active');
    menuBtn.classList.remove('active');
    drawer.setAttribute('aria-hidden', 'true');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function toggleDrawer(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (drawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  }

  menuBtn.addEventListener('click', toggleDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  if (mobileResumeBtn) {
    mobileResumeBtn.addEventListener('click', closeDrawer);
  }

  // Close drawer on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/* --------------------------------------------------------------------------
   3. Active Section Scroll Spy
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!sections.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        setActiveNav(id);
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  function setActiveNav(id) {
    desktopLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${id}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    mobileLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${id}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

/* --------------------------------------------------------------------------
   4. Project Filtering Tabs
   -------------------------------------------------------------------------- */
function initProjectFilters() {
  const tabButtons = document.querySelectorAll('.project-tabs .tab-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!tabButtons.length || !projectCards.length) return;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = (card.getAttribute('data-category') || '').split(' ');
        
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. Resume Modal Dialog & Print Handler
   -------------------------------------------------------------------------- */
function initResumeModal() {
  const modal = document.getElementById('resume-modal');
  const openDesktopBtn = document.getElementById('open-resume-btn');
  const openMobileBtn = document.getElementById('mobile-resume-btn');
  const heroResumeBtn = document.getElementById('hero-resume-btn');
  const closeBtn = document.getElementById('close-resume-btn');
  const printBtn = document.getElementById('print-resume-btn');

  if (!modal) return;

  function openModal() {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const modalBody = modal.querySelector('.modal-body');
    if (modalBody) modalBody.scrollTop = 0;
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (openDesktopBtn) openDesktopBtn.addEventListener('click', openModal);
  if (openMobileBtn) openMobileBtn.addEventListener('click', openModal);
  if (heroResumeBtn) heroResumeBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Close when clicking backdrop outside dialog
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // Print button with zero-cutoff scroll reset
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.scrollTo(0, 0);
      const modalBody = modal.querySelector('.modal-body');
      if (modalBody) modalBody.scrollTop = 0;
      document.body.style.overflow = 'visible';
      setTimeout(() => {
        window.print();
      }, 120);
    });
  }

  // Pre-print hook to ensure print begins from absolute top
  window.addEventListener('beforeprint', () => {
    window.scrollTo(0, 0);
    const modalBody = modal ? modal.querySelector('.modal-body') : null;
    if (modalBody) modalBody.scrollTop = 0;
    document.body.style.overflow = 'visible';
  });

  // Copy ATS Plain-Text Resume
  const copyResumeBtn = document.getElementById('copy-resume-btn');
  if (copyResumeBtn) {
    copyResumeBtn.addEventListener('click', async () => {
      const plainTextResume = `PRAJWAL KULAL
MCA Student | Aspiring Software Engineer | Interested in Cloud Computing & AI
Location: Udupi, Karnataka, India
Phone: +91 8970261630 | Email: prajwalkulal94@gmail.com
LinkedIn: https://www.linkedin.com/in/prajwal-kulal-5104aa331/
GitHub: https://github.com/prajwal94-maker

==================================================
1. PROFESSIONAL SUMMARY
==================================================
First-year Master of Computer Applications (MCA) student at Poornaprajna Institute of Management (PIM) with a strong foundation in Python, Java, web development, and relational database management. Graduated BCA with distinction (9.21 CGPA), demonstrating consistent academic excellence and disciplined algorithmic problem-solving. Currently expanding hands-on knowledge in AWS Cloud Computing and backend application development to engineer reliable, scalable software solutions. Seeking entry-level software engineering, web development, or cloud-related roles.

==================================================
2. TECHNICAL SKILLS
==================================================
• Programming Languages: Java (Intermediate), Python (Intermediate), C (Intermediate), JavaScript (Intermediate), PHP (Basic), R (Basic)
• Web & Frontend: HTML5, CSS3, JavaScript (ES6+), Bootstrap, Responsive Web Design
• Backend & Databases: Node.js, Express.js, MySQL, Relational Schema Design, SQL Queries & Optimization
• Cloud & Deployment: AWS (EC2, S3, IAM), Vercel, GitHub Pages
• Development Tools: Git, GitHub, Linux (Kali Linux), Visual Studio Code, Jupyter Notebook, Google Antigravity
• Core Competencies: Data Structures & Algorithms, Object-Oriented Programming (OOP), Problem Solving, Testing & Debugging

==================================================
3. PROJECTS
==================================================
• Event-Hall-Management-System
  Technologies: Node.js, Express.js, MySQL, JavaScript, HTML5, CSS3
  Repository: https://github.com/prajwal94-maker/Event-Hall-Management-System
  - Developed a full-stack web application to simplify event hall reservation, eliminate double bookings, and digitize venue management workflows.
  - Implemented real-time hall availability checks, dynamic booking cost calculations (including catering and stage decorations), and advance payment workflows.
  - Designed normalized relational MySQL database tables with integrity constraints to reliably store reservation schedules, payments, and client records.

• AWS Cloud Architecture & AI Pipeline (Active Study)
  Technologies: AWS (EC2, S3, IAM), Python, NumPy, Pandas, Linux
  - Configuring cloud infrastructure to explore serverless deployment, access control policies, and automated pipelines using AWS services.
  - Writing analytical data processing and manipulation scripts in Python using NumPy and Pandas within Linux server environments.

==================================================
4. EDUCATION
==================================================
• Master of Computer Applications (MCA)
  Poornaprajna Institute of Management (PIM) — Udupi, Karnataka
  Duration: 2026 – 2028 (Pursuing)
  Specialization: Computer Applications & Software Development

• Bachelor of Computer Applications (BCA)
  Milagres College, Kallianpur — Udupi, Karnataka
  Duration: 2023 – 2026
  Academic Score: CGPA 9.21 / 10.0 (Distinction)
  Specialization: Computer Applications

==================================================
5. CERTIFICATIONS
==================================================
• Full-Stack Web Development Bootcamp – Udemy (2026)
  Credential: https://www.udemy.com/certificate/UC-d0ff519b-1311-403d-b706-c7d6e01a322a/
• Introduction to SQL – Simplilearn (2026)
• Introduction to Kali Linux Basic – Simplilearn (2026)

==================================================
6. LANGUAGES
==================================================
• English: Professional Working Proficiency
• Kannada: Native
• Hindi: Conversational`;

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(plainTextResume);
        } else {
          const temp = document.createElement('textarea');
          temp.value = plainTextResume;
          document.body.appendChild(temp);
          temp.select();
          document.execCommand('copy');
          document.body.removeChild(temp);
        }

        const span = copyResumeBtn.querySelector('span');
        if (span) span.textContent = 'Copied!';
        showToast('ATS Plain-text resume copied to clipboard!');
        setTimeout(() => {
          if (span) span.textContent = 'Copy Text';
        }, 2500);
      } catch (err) {
        showToast('Failed to copy text. Please select manually.');
      }
    });
  }

  // Ensure body overflow does not truncate print pages and scroll is at the top
  window.addEventListener('beforeprint', () => {
    const modalBody = document.querySelector('.modal-body');
    if (modalBody) modalBody.scrollTop = 0;
    window.scrollTo(0, 0);
    document.body.style.overflow = 'visible';
  });

  window.addEventListener('afterprint', () => {
    if (modal.classList.contains('open')) {
      document.body.style.overflow = 'hidden';
    }
  });
}

/* --------------------------------------------------------------------------
   6. Copy Email to Clipboard
   -------------------------------------------------------------------------- */
function initCopyEmail() {
  const copyBtn = document.getElementById('copy-email-btn');
  const emailToCopy = 'prajwalkulal94@gmail.com';

  if (!copyBtn) return;

  copyBtn.addEventListener('click', async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(emailToCopy);
      } else {
        // Fallback for older browsers
        const tempInput = document.createElement('input');
        tempInput.value = emailToCopy;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }

      const copyText = copyBtn.querySelector('.copy-text');
      if (copyText) copyText.textContent = 'Copied!';
      copyBtn.style.borderColor = 'var(--accent-green)';
      copyBtn.style.color = 'var(--accent-green)';

      showToast('Email address copied to clipboard!');

      setTimeout(() => {
        if (copyText) copyText.textContent = 'Copy';
        copyBtn.style.borderColor = '';
        copyBtn.style.color = '';
      }, 2500);
    } catch (err) {
      showToast('Please copy: ' + emailToCopy);
    }
  });
}

/* --------------------------------------------------------------------------
   7. Contact Form Validation & Mailto Trigger
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    let isValid = true;

    // Reset previous error states
    form.querySelectorAll('.form-group').forEach(group => group.classList.remove('has-error'));

    // Validate Name
    if (!nameInput.value.trim()) {
      showError(nameInput);
      isValid = false;
    }

    // Validate Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailPattern.test(emailInput.value.trim())) {
      showError(emailInput);
      isValid = false;
    }

    // Validate Subject
    if (!subjectInput.value.trim()) {
      showError(subjectInput);
      isValid = false;
    }

    // Validate Message
    if (!messageInput.value.trim()) {
      showError(messageInput);
      isValid = false;
    }

    if (!isValid) return;

    // Construct Mailto URI to Prajwal Kulal
    const recipient = 'prajwalkulal94@gmail.com';
    const subject = encodeURIComponent(`[Portfolio Contact] ${subjectInput.value.trim()}`);
    const bodyContent = `Name: ${nameInput.value.trim()}\nEmail: ${emailInput.value.trim()}\n\nMessage:\n${messageInput.value.trim()}`;
    const body = encodeURIComponent(bodyContent);

    const mailtoUrl = `mailto:${recipient}?subject=${subject}&body=${body}`;

    showToast('Opening your email client to send message to Prajwal...');

    setTimeout(() => {
      window.location.href = mailtoUrl;
      form.reset();
    }, 400);
  });

  function showError(inputElement) {
    const group = inputElement.closest('.form-group');
    if (group) group.classList.add('has-error');
  }

  // Clear error on input
  form.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('input', () => {
      const group = input.closest('.form-group');
      if (group && group.classList.contains('has-error')) {
        group.classList.remove('has-error');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   8. Skill Meter Bar Animation
   -------------------------------------------------------------------------- */
function initSkillMeterAnimations() {
  const skillsSection = document.getElementById('skills');
  const meterFills = document.querySelectorAll('.meter-fill');

  if (!skillsSection || !meterFills.length) return;

  // Store target widths
  const targetWidths = Array.from(meterFills).map(fill => fill.style.width);

  // Set initial width to 0
  meterFills.forEach(fill => {
    fill.style.width = '0%';
  });

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        meterFills.forEach((fill, index) => {
          setTimeout(() => {
            fill.style.width = targetWidths[index];
          }, index * 40);
        });
      }
    });
  }, { threshold: 0.2 });

  observer.observe(skillsSection);
}

/* --------------------------------------------------------------------------
   9. Toast Notification Helper
   -------------------------------------------------------------------------- */
let toastTimeout;
function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

