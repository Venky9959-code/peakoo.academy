/**
 * PEAKOO ACADEMY - MAIN JAVASCRIPT
 * Matching Tharun Speaks Interactions, Transitions & Spotlight Effects
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCurriculumTabs();
  initFaqAccordion();
  initModal();
  initCourseCardLinks();
  initCardSpotlights();
  initScrollReveals();
  initCountdownTimer();
  initVideoModal();
});

/**
 * 1. Floating Pill Navbar & Mobile Drawer
 */
function initNavbar() {
  const navbar = document.getElementById('floatingNavbar');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawerWrap = document.getElementById('mobileDrawerWrap');
  const mobileLinks = document.querySelectorAll('.mobile-menu-link');

  // Smooth scroll handler for navbar appearance
  window.addEventListener('scroll', () => {
    if (navbar) {
      if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  });

  function toggleMobileMenu() {
    if (mobileDrawerWrap && mobileMenuBtn) {
      const isOpen = mobileDrawerWrap.classList.toggle('open');
      mobileMenuBtn.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }
  }

  function closeMobileMenu() {
    if (mobileDrawerWrap && mobileMenuBtn) {
      mobileDrawerWrap.classList.remove('open');
      mobileMenuBtn.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }

  if (mobileDrawerWrap) {
    mobileDrawerWrap.addEventListener('click', (e) => {
      if (e.target === mobileDrawerWrap) {
        closeMobileMenu();
      }
    });
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawerWrap && mobileDrawerWrap.classList.contains('open')) {
      closeMobileMenu();
    }
  });
}

/**
 * 2. Curriculum Pillars Switcher ("What you'll learn in this Cohort")
 */
function initCurriculumTabs() {
  const pillarBtns = document.querySelectorAll('.pillar-tab-btn');

  pillarBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTrack = btn.getAttribute('data-track');
      switchCurriculumTrack(targetTrack);
    });
  });
}

function switchCurriculumTrack(trackId) {
  const pillarBtns = document.querySelectorAll('.pillar-tab-btn');
  const trackPanels = document.querySelectorAll('.track-module-panel');

  pillarBtns.forEach(btn => {
    if (btn.getAttribute('data-track') === trackId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  trackPanels.forEach(panel => {
    if (panel.id === `track-${trackId}`) {
      panel.classList.add('active');
      // Re-trigger staggered animation on module cards
      const cards = panel.querySelectorAll('.module-box-card');
      cards.forEach((card, idx) => {
        card.style.animation = 'none';
        card.offsetHeight; /* trigger reflow */
        card.style.animation = `moduleCardPop 0.45s cubic-bezier(0.16, 1, 0.3, 1) ${0.04 * (idx + 1)}s backwards`;
      });
    } else {
      panel.classList.remove('active');
    }
  });
}

/**
 * 3. Course Box Links to Curriculum
 */
function initCourseCardLinks() {
  const courseBoxes = document.querySelectorAll('.course-track-box[data-target-track]');

  courseBoxes.forEach(box => {
    box.addEventListener('click', () => {
      const trackId = box.getAttribute('data-target-track');
      if (trackId) {
        switchCurriculumTrack(trackId);
        const curriculumEl = document.getElementById('curriculum');
        if (curriculumEl) {
          curriculumEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

/**
 * 4. Interactive Mouse Spotlight Glow on Cards (Signature Framer Effect)
 */
function initCardSpotlights() {
  const spotlightCards = document.querySelectorAll(`
    .stat-card-item,
    .course-track-box,
    .module-box-card,
    .pricing-box-card,
    .community-feature-card,
    .student-story-box,
    .mentor-profile-card
  `);

  spotlightCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/**
 * 5. Scroll-Driven Reveal Animations (Intersection Observer)
 */
function initScrollReveals() {
  const revealElements = document.querySelectorAll(`
    .section-header,
    .courses-showcase-grid,
    .curriculum-pillars-bar,
    .curriculum-banner-card,
    .modules-six-grid,
    .pricing-cards-container,
    .community-cards-grid,
    .testimonials-row-grid,
    .mentors-team-grid,
    .faq-accordion-wrap,
    .final-cta-banner
  `);

  revealElements.forEach(el => {
    el.classList.add('reveal-init');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/**
 * 6. FAQ Accordion
 */
function initFaqAccordion() {
  const faqRows = document.querySelectorAll('.faq-row-item');

  faqRows.forEach(row => {
    const triggerBtn = row.querySelector('.faq-toggle-trigger');
    const contentPanel = row.querySelector('.faq-collapsed-panel');

    if (triggerBtn && contentPanel) {
      triggerBtn.addEventListener('click', () => {
        const isActive = row.classList.contains('active');

        // Close other items
        faqRows.forEach(otherRow => {
          if (otherRow !== row) {
            otherRow.classList.remove('active');
            const otherPanel = otherRow.querySelector('.faq-collapsed-panel');
            if (otherPanel) otherPanel.style.maxHeight = null;
          }
        });

        if (!isActive) {
          row.classList.add('active');
          contentPanel.style.maxHeight = contentPanel.scrollHeight + 30 + 'px';
        } else {
          row.classList.remove('active');
          contentPanel.style.maxHeight = null;
        }
      });
    }
  });
}

/**
 * 7. Enrolment Modal
 */
function initModal() {
  const modalWrap = document.getElementById('enrolModal');
  const closeBtn = document.querySelector('.modal-x-btn');
  const triggerBtns = document.querySelectorAll('[data-enrol-trigger]');
  const enrolForm = document.getElementById('academyEnrolForm');
  const successBox = document.getElementById('formSuccessMessage');
  const courseSelect = document.getElementById('courseSelection');
  const tierSelect = document.getElementById('tierSelection');

  function openModal(course = '', tier = '') {
    if (modalWrap) {
      if (course && courseSelect) courseSelect.value = course;
      if (tier && tierSelect) tierSelect.value = tier;
      modalWrap.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (modalWrap) {
      modalWrap.classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(() => {
        if (enrolForm) enrolForm.style.display = 'block';
        if (successBox) successBox.style.display = 'none';
      }, 300);
    }
  }

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const course = btn.getAttribute('data-course') || '';
      const tier = btn.getAttribute('data-tier') || '';
      openModal(course, tier);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  if (modalWrap) {
    modalWrap.addEventListener('click', (e) => {
      if (e.target === modalWrap) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalWrap && modalWrap.classList.contains('open')) {
      closeModal();
    }
  });

  if (enrolForm) {
    enrolForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('studentName').value.trim();
      const phone = document.getElementById('studentPhone').value.trim();
      const email = document.getElementById('studentEmail').value.trim();
      const course = courseSelect ? courseSelect.value : '';
      const tier = tierSelect ? tierSelect.value : '';

      const leadData = {
        name,
        phone,
        email,
        course,
        tier,
        timestamp: new Date().toISOString()
      };

      try {
        const stored = JSON.parse(localStorage.getItem('peakoo_academy_leads') || '[]');
        stored.push(leadData);
        localStorage.setItem('peakoo_academy_leads', JSON.stringify(stored));
      } catch (err) {
        console.error('Storage error:', err);
      }

      enrolForm.style.display = 'none';
      if (successBox) {
        successBox.style.display = 'block';
        const whatsAppBtn = document.getElementById('whatsAppHandoffBtn');
        if (whatsAppBtn) {
          const prefilled = encodeURIComponent(
            `Hi Peakoo Academy! My name is ${name}. I want to confirm my seat for the ${tier || 'Elite'} tier (${course || 'Website Development'}). My email is ${email}.`
          );
          whatsAppBtn.href = `https://wa.me/919999999999?text=${prefilled}`;
        }
      }
    });
  }
}

/**
 * 8. Live Real-Time Countdown Timer Ticker
 */
function initCountdownTimer() {
  const cntDays = document.getElementById('cntDays');
  const cntHours = document.getElementById('cntHours');
  const cntMins = document.getElementById('cntMins');
  const cntSecs = document.getElementById('cntSecs');
  if (!cntDays || !cntHours || !cntMins || !cntSecs) return;

  // Use persistent target date or set to 12 days 18 hrs ahead
  let targetTimestamp = localStorage.getItem('peakoo_cohort_target');
  if (!targetTimestamp || isNaN(targetTimestamp)) {
    targetTimestamp = Date.now() + (12 * 86400 + 18 * 3600 + 44 * 60 + 20) * 1000;
    localStorage.setItem('peakoo_cohort_target', targetTimestamp);
  } else {
    targetTimestamp = parseInt(targetTimestamp, 10);
    if (targetTimestamp <= Date.now()) {
      targetTimestamp = Date.now() + (7 * 86400 + 14 * 3600 + 32 * 60) * 1000;
      localStorage.setItem('peakoo_cohort_target', targetTimestamp);
    }
  }

  function updateTimer() {
    const now = Date.now();
    let diff = Math.max(0, targetTimestamp - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);

    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);

    const mins = Math.floor(diff / (1000 * 60));
    diff -= mins * (1000 * 60);

    const secs = Math.floor(diff / 1000);

    cntDays.textContent = String(days).padStart(2, '0');
    cntHours.textContent = String(hours).padStart(2, '0');
    cntMins.textContent = String(mins).padStart(2, '0');
    cntSecs.textContent = String(secs).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/**
 * 9. Interactive Video Tour Modal & Chapter Selector
 */
function initVideoModal() {
  const openBtn = document.getElementById('openVideoTourBtn');
  const modal = document.getElementById('videoTourModal');
  const closeBtn = document.getElementById('closeVideoTourBtn');
  const closeSecondaryBtn = document.getElementById('closeVideoTourSecondaryBtn');
  const video = document.getElementById('tourVideoPlayer');
  const chapterBtns = document.querySelectorAll('.video-chapter-pill');

  function openVideo() {
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (video) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
    }
  }

  function closeVideo() {
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      if (video) {
        video.pause();
      }
    }
  }

  if (openBtn) openBtn.addEventListener('click', openVideo);
  if (closeBtn) closeBtn.addEventListener('click', closeVideo);
  if (closeSecondaryBtn) closeSecondaryBtn.addEventListener('click', closeVideo);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeVideo();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeVideo();
    }
  });

  chapterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      chapterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const time = parseFloat(btn.getAttribute('data-time') || 0);
      if (video) {
        video.currentTime = time;
        video.play().catch(() => {});
      }
    });
  });
}
