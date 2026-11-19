/**
 * BRANDYCE × ARAMANE ROYAL BUILDER
 * Interactive Proposal Experience Engine
 * Architecture Meets Digital Experience
 */

document.addEventListener('DOMContentLoaded', () => {
  initAudio();
  initNavigation();
  initScrollAnimations();
  initProjectShowcase();
  initDeliverablesTabs();
  initRoadmap();
  initSignaturePad();
  initModals();
  initCustomCursor();
  initCounters();
  initHeroParticles();
  initHeroParallax();
});

/* -------------------------------------------------------------------------- */
/* AUDIO HAPTICS (Web Audio API - Pure synthesized, zero external files)      */
/* -------------------------------------------------------------------------- */
let audioCtx = null;
let soundEnabled = false;

function initAudio() {
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  if (!soundToggleBtn) return;

  soundToggleBtn.addEventListener('click', () => {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    soundEnabled = !soundEnabled;
    soundToggleBtn.classList.toggle('text-white', soundEnabled);
    soundToggleBtn.classList.toggle('text-stone-400', !soundEnabled);
    const label = soundToggleBtn.querySelector('.sound-label');
    if (label) label.textContent = soundEnabled ? 'AUDIO: ON' : 'AUDIO: OFF';
    playHapticSound(soundEnabled ? 880 : 440, 0.05);
  });
}

function playHapticSound(freq = 600, duration = 0.04) {
  if (!soundEnabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Graceful fallback
  }
}

/* -------------------------------------------------------------------------- */
/* NAVIGATION & DYNAMIC COLOR THEME SHIFT                                     */
/* -------------------------------------------------------------------------- */
function initNavigation() {
  const navbar = document.getElementById('mainNavbar');
  const progressBar = document.getElementById('scrollProgressBar');
  const navLinks = document.querySelectorAll('.nav-anchor');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.getElementById('backToTopBtn');

  // Track scroll for navbar theme shift & progress bar
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollY / docHeight) * 100;

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    // Check if we are in Hero (Section 01) or in Architectural sections
    const heroSection = document.getElementById('section-hero');
    const heroBottom = heroSection ? heroSection.offsetHeight - 80 : 600;

    if (scrollY > heroBottom) {
      // In architectural light sections
      navbar.classList.remove('scrolled-dark');
      navbar.classList.add('scrolled-light');
      navbar.classList.remove('text-white');
      navbar.classList.add('text-stone-900');
    } else if (scrollY > 50) {
      // In hero dark section
      navbar.classList.remove('scrolled-light');
      navbar.classList.add('scrolled-dark');
      navbar.classList.remove('text-stone-900');
      navbar.classList.add('text-white');
    } else {
      // At top of hero
      navbar.classList.remove('scrolled-light', 'scrolled-dark');
      navbar.classList.remove('text-stone-900');
      navbar.classList.add('text-white');
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollY > 600) {
        backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
        backToTopBtn.classList.add('opacity-100', 'pointer-events-auto');
      } else {
        backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
        backToTopBtn.classList.remove('opacity-100', 'pointer-events-auto');
      }
    }

    // Active Section Spy
    let currentSectionId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('text-stone-900', 'font-semibold', 'text-brand-red');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('font-semibold');
      }
    });
  });

  // Smooth scroll links with sound
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      playHapticSound(520, 0.05);
      const targetId = link.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      playHapticSound(700, 0.06);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* -------------------------------------------------------------------------- */
/* SCROLL REVEAL ANIMATIONS                                                   */
/* -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.arch-reveal');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* -------------------------------------------------------------------------- */
/* NUMERICAL COUNTERS                                                         */
/* -------------------------------------------------------------------------- */
function initCounters() {
  const counterElements = document.querySelectorAll('.animate-counter');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-target'), 10) || 0;
        const prefix = entry.target.getAttribute('data-prefix') || '';
        const suffix = entry.target.getAttribute('data-suffix') || '';
        const duration = 1800;
        const startTime = performance.now();

        const updateCount = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out exponential
          const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const currentVal = Math.floor(easeProgress * target);
          entry.target.textContent = `${prefix}${currentVal.toLocaleString('en-IN')}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            entry.target.textContent = `${prefix}${target.toLocaleString('en-IN')}${suffix}`;
          }
        };

        requestAnimationFrame(updateCount);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counterElements.forEach(el => observer.observe(el));
}

/* -------------------------------------------------------------------------- */
/* PROJECT PAGES SHOWCASE (Section 04 — The Digital Experience)               */
/* -------------------------------------------------------------------------- */
const PROJECT_PAGES_DATA = [
  {
    id: 'home',
    num: '01',
    title: 'HOME PAGE',
    subtitle: 'The Gateway of First Impressions',
    desc: 'A high-impact, premium introduction to Aramane Royal Builder. Features a full-screen hero showcase, distinctive architectural geometry, company credentials, high-level service summaries, featured ongoing projects, and strategic consultation triggers.',
    highlights: ['Cinematic Full-Width Video/Hero Banner', 'Interactive Featured Projects Showcase', 'Core Brand Pillars & Statistics Bar', 'Instant WhatsApp & Call Action Buttons'],
    tag: 'CORE LANDING',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop'
  },
  {
    id: 'about',
    num: '02',
    title: 'ABOUT US',
    subtitle: 'Heritage, Vision & Craftsmanship',
    desc: 'An authoritative brand narrative presenting Aramane Royal Builder’s history, leadership vision, structural philosophy, and unwavering commitment to engineering excellence. Builds profound emotional and financial trust.',
    highlights: ['Founder & Leadership Narrative', 'Company Vision, Mission & Core Values', 'Year-by-Year Growth Milestones', 'Accreditations & Structural Quality Standards'],
    tag: 'CREDIBILITY',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1600&auto=format&fit=crop'
  },
  {
    id: 'services',
    num: '03',
    title: 'OUR SERVICES',
    subtitle: 'Comprehensive Real Estate & Construction',
    desc: 'Detailed presentation of construction, residential real estate development, commercial spaces, architectural contracting, and custom villa construction. Clarifies end-to-end capabilities with dedicated enquiry call-to-actions.',
    highlights: ['Residential & Villa Construction', 'Commercial Developments & Turnkey Projects', 'Architectural Planning & Engineering Consulting', 'Renovation & Property Development Services'],
    tag: 'CAPABILITIES',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1600&auto=format&fit=crop'
  },
  {
    id: 'ongoing',
    num: '04',
    title: 'ONGOING PROJECTS',
    subtitle: 'Active Developments & Live Progress',
    desc: 'Showcase current developments with crisp site photography, construction progress timelines, architectural blueprints, unit specifications, and location landmarks to capture active buyer enquiries.',
    highlights: ['Interactive Project Filtering by Location/Budget', 'Live Construction Progress Bar & Site Photos', 'Downloadable Project Floorplans & Brochures', 'Direct Booking & Site Visit Scheduling'],
    tag: 'BUYER ACQUISITION',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1600&auto=format&fit=crop'
  },
  {
    id: 'completed',
    num: '05',
    title: 'COMPLETED PROJECTS',
    subtitle: 'Portfolio of Proven Excellence',
    desc: 'A permanent showcase of successfully delivered landmarks. Demonstrates punctuality, architectural fidelity, and client satisfaction through rich before/after visuals and handover records.',
    highlights: ['High-Resolution As-Built Galleries', 'Delivery Timelines & Structural Statistics', 'Client Testimonial Snippets on Every Project', 'Architectural Specifications & Materials Used'],
    tag: 'PROOF OF WORK',
    image: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?q=80&w=1600&auto=format&fit=crop'
  },
  {
    id: 'details',
    num: '06',
    title: 'PROJECT DETAILS PAGES',
    subtitle: 'Deep-Dive Interactive Experiences',
    desc: 'Dedicated individual pages for each flagship project. Includes interactive 360-style galleries, downloadable PDF brochures, floor plan tabs, Google Maps vicinity guides, and quick enquiry drawers.',
    highlights: ['Comprehensive Floor Plan Viewer', 'Specifications (Flooring, Electrical, Structure)', 'Google Maps Geo-Location & Proximity Landmarks', 'Dedicated Sticky Lead Capture Form'],
    tag: 'CONVERSION DRIVER',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600&auto=format&fit=crop'
  },
  {
    id: 'gallery',
    num: '07',
    title: 'GALLERY',
    subtitle: 'Visual Craftsmanship Archive',
    desc: 'A curated visual experience celebrating construction milestones, structural detailing, luxurious interior finishes, and drone landscape photography. Filterable by project category.',
    highlights: ['Filterable Categories (Exteriors, Interiors, Construction)', 'Lightbox Fullscreen Zoom & Pan', 'Drone Aerial Footage Showcase', 'Optimized WebP High-Speed Lazy Loading'],
    tag: 'VISUAL ASSET',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop'
  },
  {
    id: 'testimonials',
    num: '08',
    title: 'TESTIMONIALS',
    subtitle: 'Client Validation & Real Trust',
    desc: 'Authentic feedback, homeowner stories, and institutional partner reviews that disarm investor skepticism. Quotes are paired with actual property photography and verified buyer badges.',
    highlights: ['Verified Buyer & Investor Quotes', 'Video Testimonial Embed Support', 'Google Review Integration & Trust Badges', 'Case Studies of On-Time Delivery'],
    tag: 'TRUST ENGINE',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1600&auto=format&fit=crop'
  },
  {
    id: 'contact',
    num: '09',
    title: 'CONTACT US',
    subtitle: 'Frictionless Customer Connections',
    desc: 'A streamlined conversion hub featuring direct WhatsApp chat, one-touch mobile dialing, customized inquiry forms with budget selection, and interactive Google Maps office directions.',
    highlights: ['One-Click WhatsApp Consultation Link', 'Direct Phone Call Button for Mobile Users', 'Interactive Google Maps with Driving Directions', 'Lead Data Directly Routed to Email & CMS'],
    tag: 'ENQUIRY HUB',
    image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=1600&auto=format&fit=crop'
  }
];

function initProjectShowcase() {
  const tabsContainer = document.getElementById('projectTabsContainer');
  const previewImg = document.getElementById('showcasePreviewImg');
  const previewTitle = document.getElementById('showcaseTitle');
  const previewNum = document.getElementById('showcaseNum');
  const previewSubtitle = document.getElementById('showcaseSubtitle');
  const previewDesc = document.getElementById('showcaseDesc');
  const previewHighlights = document.getElementById('showcaseHighlights');
  const previewTag = document.getElementById('showcaseTag');

  if (!tabsContainer || !previewTitle) return;

  function setPage(index) {
    const page = PROJECT_PAGES_DATA[index];
    if (!page) return;

    playHapticSound(560, 0.04);

    // Update active tab styling
    const allTabs = tabsContainer.querySelectorAll('.project-tab-btn');
    allTabs.forEach((tab, i) => {
      if (i === index) {
        tab.classList.add('bg-stone-900', 'text-white', 'border-stone-900');
        tab.classList.remove('bg-white', 'text-stone-800', 'border-stone-300');
      } else {
        tab.classList.remove('bg-stone-900', 'text-white', 'border-stone-900');
        tab.classList.add('bg-white', 'text-stone-800', 'border-stone-300');
      }
    });

    // Animate content change
    previewTitle.textContent = page.title;
    previewNum.textContent = page.num;
    previewSubtitle.textContent = page.subtitle;
    previewDesc.textContent = page.desc;
    if (previewTag) previewTag.textContent = page.tag;

    if (previewImg) {
      previewImg.style.opacity = '0.3';
      setTimeout(() => {
        previewImg.src = page.image;
        previewImg.style.opacity = '1';
      }, 150);
    }

    if (previewHighlights) {
      previewHighlights.innerHTML = page.highlights
        .map(h => `<li class="flex items-center gap-2 text-stone-700 text-sm font-medium"><span class="w-1.5 h-1.5 rounded-full bg-stone-900"></span>${h}</li>`)
        .join('');
    }
  }

  // Populate tabs
  tabsContainer.innerHTML = PROJECT_PAGES_DATA.map((p, idx) => `
    <button class="project-tab-btn px-4 py-3 text-left border text-xs font-mono tracking-wider transition-all duration-200 flex items-center justify-between gap-4 ${idx === 0 ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-800 border-stone-300 hover:border-stone-500'}" data-index="${idx}">
      <span class="font-bold">${p.num}. ${p.title}</span>
      <span class="opacity-60 text-[10px] uppercase">${p.tag}</span>
    </button>
  `).join('');

  tabsContainer.querySelectorAll('.project-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      setPage(idx);
    });
  });

  // Initial load
  setPage(0);
}

/* -------------------------------------------------------------------------- */
/* DELIVERABLES ACCORDION & TABS (Section 05 — The Build)                     */
/* -------------------------------------------------------------------------- */
function initDeliverablesTabs() {
  const deliverableHeaders = document.querySelectorAll('.deliverable-toggle');
  deliverableHeaders.forEach(header => {
    header.addEventListener('click', () => {
      playHapticSound(480, 0.04);
      const content = header.nextElementSibling;
      const icon = header.querySelector('.deliverable-icon');
      const isExpanded = content.classList.contains('active-content');

      // Close other accordions in this view
      document.querySelectorAll('.deliverable-body').forEach(b => {
        b.classList.remove('active-content');
        b.style.maxHeight = null;
      });
      document.querySelectorAll('.deliverable-icon').forEach(ic => {
        ic.style.transform = 'rotate(0deg)';
      });

      if (!isExpanded) {
        content.classList.add('active-content');
        content.style.maxHeight = content.scrollHeight + 'px';
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });
}

/* -------------------------------------------------------------------------- */
/* ROADMAP INTERACTIVE TIMELINE (Section 07 — The Roadmap)                    */
/* -------------------------------------------------------------------------- */
function initRoadmap() {
  const roadmapCards = document.querySelectorAll('.roadmap-phase-card');
  roadmapCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      playHapticSound(580, 0.03);
    });
  });
}

/* -------------------------------------------------------------------------- */
/* DIGITAL SIGNATURE CANVAS & APPROVAL AREA                                   */
/* -------------------------------------------------------------------------- */
function initSignaturePad() {
  const canvas = document.getElementById('signaturePadCanvas');
  const clearBtn = document.getElementById('clearSignatureBtn');
  const confirmBtn = document.getElementById('confirmApprovalBtn');
  const signeeNameInput = document.getElementById('signeeNameInput');
  const signatureDateInput = document.getElementById('signatureDateInput');
  const approvalStatusBadge = document.getElementById('approvalStatusBadge');

  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let isDrawing = false;
  let hasSigned = false;

  // Auto-fill today's date in Indian / International formal format
  if (signatureDateInput && !signatureDateInput.value) {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    signatureDateInput.value = today.toLocaleDateString('en-GB', options);
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#181716';
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function getCanvasPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  function startDraw(e) {
    isDrawing = true;
    hasSigned = true;
    const pos = getCanvasPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    e.preventDefault();
  }

  function draw(e) {
    if (!isDrawing) return;
    const pos = getCanvasPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    e.preventDefault();
  }

  function stopDraw() {
    if (isDrawing) {
      isDrawing = false;
      ctx.closePath();
    }
  }

  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mousemove', draw);
  window.addEventListener('mouseup', stopDraw);

  canvas.addEventListener('touchstart', startDraw, { passive: false });
  canvas.addEventListener('touchmove', draw, { passive: false });
  window.addEventListener('touchend', stopDraw);

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      playHapticSound(400, 0.05);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      hasSigned = false;
      if (approvalStatusBadge) {
        approvalStatusBadge.innerHTML = `<span class="inline-block w-2 h-2 rounded-full bg-amber-500 mr-2"></span>Awaiting Signature`;
        approvalStatusBadge.className = 'inline-flex items-center text-xs font-mono px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200';
      }
    });
  }

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      const name = signeeNameInput ? signeeNameInput.value.trim() : '';
      if (!name) {
        alert('Please enter your full authorised name before confirming.');
        if (signeeNameInput) signeeNameInput.focus();
        return;
      }
      if (!hasSigned) {
        alert('Please draw your authorised signature on the signature pad above.');
        return;
      }

      playHapticSound(780, 0.1);

      if (approvalStatusBadge) {
        approvalStatusBadge.innerHTML = `<span class="inline-block w-2 h-2 rounded-full bg-emerald-600 mr-2"></span>APPROVED & DIGITALLY STAMPED — ${new Date().toLocaleDateString('en-GB')}`;
        approvalStatusBadge.className = 'inline-flex items-center text-xs font-mono px-4 py-2 bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold';
      }

      confirmBtn.innerHTML = `✓ PROPOSAL OFFICIALLY APPROVED`;
      confirmBtn.classList.remove('bg-stone-900');
      confirmBtn.classList.add('bg-emerald-800');
      confirmBtn.disabled = true;

      // Offer immediate print or PDF download
      setTimeout(() => {
        const wantsPrint = confirm('Proposal approved! Would you like to print or save the stamped proposal as a PDF now?');
        if (wantsPrint) {
          window.print();
        }
      }, 500);
    });
  }
}

/* -------------------------------------------------------------------------- */
/* MODALS (Admin Dashboard Simulator & Consultation Dialog)                   */
/* -------------------------------------------------------------------------- */
function initModals() {
  // Admin Demo Modal
  const openAdminBtn = document.getElementById('openAdminDemoBtn');
  const closeAdminBtn = document.getElementById('closeAdminDemoBtn');
  const adminModal = document.getElementById('adminDemoModal');

  if (openAdminBtn && adminModal) {
    openAdminBtn.addEventListener('click', () => {
      playHapticSound(620, 0.05);
      adminModal.classList.add('active');
    });
  }
  if (closeAdminBtn && adminModal) {
    closeAdminBtn.addEventListener('click', () => {
      playHapticSound(440, 0.04);
      adminModal.classList.remove('active');
    });
  }

  // Consultation Modal
  const openDiscussBtns = document.querySelectorAll('.open-discuss-btn');
  const closeDiscussBtn = document.getElementById('closeDiscussBtn');
  const discussModal = document.getElementById('discussModal');

  openDiscussBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playHapticSound(620, 0.05);
      if (discussModal) discussModal.classList.add('active');
    });
  });
  if (closeDiscussBtn && discussModal) {
    closeDiscussBtn.addEventListener('click', () => {
      playHapticSound(440, 0.04);
      discussModal.classList.remove('active');
    });
  }

  // Close modals on overlay background click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });

  // Admin Panel Simulation Interactive Actions
  const adminAddProjectBtn = document.getElementById('adminSimAddProjectBtn');
  const adminProjectsList = document.getElementById('adminSimProjectsList');
  if (adminAddProjectBtn && adminProjectsList) {
    adminAddProjectBtn.addEventListener('click', () => {
      playHapticSound(720, 0.05);
      const projectName = prompt('Enter project title to add to live CMS:', 'Aramane Royal Heights');
      if (projectName) {
        const newRow = document.createElement('tr');
        newRow.className = 'border-b border-stone-200 bg-emerald-50/50 transition-colors duration-500';
        newRow.innerHTML = `
          <td class="p-3 font-medium text-stone-900">${projectName}</td>
          <td class="p-3 text-xs font-mono text-emerald-800"><span class="px-2 py-0.5 bg-emerald-100 rounded">Ongoing</span></td>
          <td class="p-3 text-stone-600 text-xs">Bangalore Urban</td>
          <td class="p-3 text-right"><span class="text-xs text-stone-400">Just added</span></td>
        `;
        adminProjectsList.prepend(newRow);
      }
    });
  }

  // Download Proposal PDF Button
  const downloadPdfBtns = document.querySelectorAll('.download-proposal-pdf-btn');
  downloadPdfBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playHapticSound(640, 0.06);
      const link = document.createElement('a');
      link.href = 'assets/docs/Aramane_Royal_Builder_Proposal_BRD-2026-001.pdf';
      link.download = 'Aramane_Royal_Builder_Proposal_BRD-2026-001.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  });
}

/* -------------------------------------------------------------------------- */
/* CUSTOM INTERACTIVE CURSOR                                                  */
/* -------------------------------------------------------------------------- */
function initCustomCursor() {
  if (window.innerWidth < 1024) return;

  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  const follower = document.createElement('div');
  follower.className = 'custom-cursor-follower';

  document.body.appendChild(cursor);
  document.body.appendChild(follower);

  let mouseX = -100, mouseY = -100;
  let followerX = -100, followerY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  function renderFollower() {
    followerX += (mouseX - followerX) * 0.18;
    followerY += (mouseY - followerY) * 0.18;
    follower.style.left = `${followerX}px`;
    follower.style.top = `${followerY}px`;
    requestAnimationFrame(renderFollower);
  }
  requestAnimationFrame(renderFollower);

  // Hover states for links and buttons
  const interactiveEls = document.querySelectorAll('a, button, input, textarea, canvas, .interactive-card');
  interactiveEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovering');
      follower.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovering');
      follower.classList.remove('hovering');
    });
  });
}


/* -------------------------------------------------------------------------- */
/* HERO PARTICLES & INTERACTIVE AMBIENT ANIMATION                            */
/* -------------------------------------------------------------------------- */
function initHeroParticles() {
  const canvas = document.getElementById('heroParticlesCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const PARTICLE_COUNT = 45;

  function resize() {
    const parent = canvas.parentElement;
    width = canvas.width = parent ? parent.offsetWidth : window.innerWidth;
    height = canvas.height = parent ? parent.offsetHeight : window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.5,
      color: Math.random() > 0.3 ? 'rgba(255, 255, 255, ' : 'rgba(211, 47, 47, ',
      alpha: Math.random() * 0.6 + 0.2,
      baseAlpha: Math.random() * 0.6 + 0.2,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35 - 0.15,
      pulseSpeed: Math.random() * 0.02 + 0.01
    });
  }

  let animationFrameId;
  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha = p.baseAlpha + Math.sin(Date.now() * p.pulseSpeed) * 0.2;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.max(0, p.alpha) + ')';
      ctx.fill();
    }

    animationFrameId = requestAnimationFrame(animate);
  }
  animate();
}

function initHeroParallax() {
  const hero = document.getElementById('section-hero');
  const watermark = document.querySelector('.brandyce-watermark');
  const aura = document.querySelector('.hero-crimson-aura');
  const logoBox = document.querySelector('.hero-logo-box');
  if (!hero || window.innerWidth < 1024) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width - 0.5;
    const yRatio = (e.clientY - rect.top) / rect.height - 0.5;

    if (watermark) {
      watermark.style.transform = 	ranslate(px, px);
    }
    if (aura) {
      aura.style.transform = 	ranslate(px, px);
    }
    if (logoBox) {
      logoBox.style.transform = 	ranslate(px, px);
    }
  });

  hero.addEventListener('mouseleave', () => {
    if (watermark) watermark.style.transform = '';
    if (aura) aura.style.transform = '';
    if (logoBox) logoBox.style.transform = '';
  });
}
