document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. Navbar Scroll & Responsive Burger Menu
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  const burgerMenu = document.getElementById('burger-menu');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const dropdownTrigger = document.getElementById('services-dropdown');

  // Add shadow / shrink header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Toggle Mobile Menu
  burgerMenu.addEventListener('click', () => {
    burgerMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close Mobile Menu when clicking navigation link
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // If it is the services dropdown link on mobile, toggle it instead of closing menu
      if (window.innerWidth <= 768 && link.parentElement.classList.contains('nav-dropdown')) {
        e.preventDefault();
        link.parentElement.classList.toggle('active');
        return;
      }
      
      burgerMenu.classList.remove('active');
      navMenu.classList.remove('active');
      
      // Remove active states from other links and add to clicked
      navLinks.forEach(nl => nl.classList.remove('active'));
      link.classList.add('active');
    });
  });

  /* ==========================================================================
     2. Active Section Highlighter on Scroll
     ========================================================================== */
  const sections = document.querySelectorAll('section');
  
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.pageYOffset || document.documentElement.scrollTop;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120; // Offset for sticky nav
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    if (current) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${current}`) {
          link.classList.add('active');
        }
      });
    }
  });

  /* ==========================================================================
     3. Scroll-In Reveal Animation (Intersection Observer)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Stop observing once animated
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  /* ==========================================================================
     4. Process Timeline Sequential Animation
     ========================================================================== */
  const processSection = document.getElementById('process');
  const progressBar = document.getElementById('process-progress-line');
  const steps = document.querySelectorAll('.process-step');
  let timelineAnimated = false;

  const processObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !timelineAnimated) {
        timelineAnimated = true;
        
        // Draw the connecting progress line
        if (progressBar) {
          progressBar.style.width = '100%';
        }

        // Activate step circles one by one with a delay
        steps.forEach((step, index) => {
          setTimeout(() => {
            step.classList.add('active');
          }, index * 400); // 400ms delay between each step activation
        });
        
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });

  if (processSection) {
    processObserver.observe(processSection);
  }

  /* ==========================================================================
     5. Stats Counter Animation
     ========================================================================== */
  const statsSection = document.getElementById('stats-section');
  const statNumbers = document.querySelectorAll('.stat-num');
  let statsAnimated = false;

  const countUp = (element) => {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const duration = 2000; // Animation duration in milliseconds
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Ease out quad formula for smooth decelerating count
      const easeProgress = progress * (2 - progress);
      const currentCount = Math.floor(easeProgress * target);
      
      element.textContent = currentCount + (target >= 500 ? '+' : (target === 50 ? '+' : '+'));
      if (target === 1000) {
        element.textContent = currentCount + '+';
      }

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        element.textContent = target + '+';
      }
    };

    requestAnimationFrame(updateCount);
  };

  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        statNumbers.forEach(num => countUp(num));
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.3
  });

  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  /* ==========================================================================
     6. Testimonials Auto-Play Carousel Slider
     ========================================================================== */
  const track = document.getElementById('testimonial-track');
  const dots = document.querySelectorAll('.testimonial-dot');
  let currentSlide = 0;
  const slideCount = dots.length;
  let autoplayInterval;

  const updateSlider = (slideIndex) => {
    if (!track) return;
    currentSlide = slideIndex;
    
    // Slide transition
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Dot update
    dots.forEach((dot, index) => {
      if (index === currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  };

  const startAutoplay = () => {
    autoplayInterval = setInterval(() => {
      let nextSlide = (currentSlide + 1) % slideCount;
      updateSlider(nextSlide);
    }, 5000); // Transitions slide every 5 seconds
  };

  const resetAutoplay = () => {
    clearInterval(autoplayInterval);
    startAutoplay();
  };

  // Add click events to Dots
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const slideIndex = parseInt(dot.getAttribute('data-slide'), 10);
      updateSlider(slideIndex);
      resetAutoplay();
    });
  });

  // Touch Swipe Support for Testimonials (Premium feel on Mobile devices)
  let touchStartX = 0;
  let touchEndX = 0;
  const sliderContainer = document.getElementById('testimonial-slider');

  if (sliderContainer) {
    sliderContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      clearInterval(autoplayInterval); // Pause auto-play on touch
    }, { passive: true });

    sliderContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      startAutoplay(); // Resume autoplay
    }, { passive: true });
  }

  const handleSwipe = () => {
    const swipeThreshold = 50;
    if (touchStartX - touchEndX > swipeThreshold) {
      // Swipe Left -> Next Slide
      let nextSlide = (currentSlide + 1) % slideCount;
      updateSlider(nextSlide);
    } else if (touchEndX - touchStartX > swipeThreshold) {
      // Swipe Right -> Prev Slide
      let prevSlide = (currentSlide - 1 + slideCount) % slideCount;
      updateSlider(prevSlide);
    }
  };

  // Start slider
  if (track && dots.length > 0) {
    startAutoplay();
  }

  /* ==========================================================================
     7. Contact Form Handling (Validation & Success Feedback)
     ========================================================================== */
  const form = document.getElementById('enquiry-form');
  const successBox = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault(); // Stop default form submit action
      
      // Grab inputs to validate/simulate submission
      const name = document.getElementById('form-name').value.trim();
      const phone = document.getElementById('form-phone').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const dimensions = document.getElementById('form-dimensions').value.trim();
      const service = document.getElementById('form-service').value;

      if (!name || !phone || !email || !dimensions || !service) {
        alert('Please fill out all required fields.');
        return;
      }

      // Simple visual check for phone number (at least 10 characters)
      const cleanedPhone = phone.replace(/[^0-9+]/g, '');
      if (cleanedPhone.length < 10) {
        alert('Please enter a valid phone number with at least 10 digits.');
        return;
      }

      // Submit Button Loading state representation
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      submitBtn.textContent = 'Submitting Details...';
      submitBtn.disabled = true;

      // Simulate network request duration
      setTimeout(() => {
        // Hide form and show beautiful success box
        form.reset();
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
        
        if (successBox) {
          successBox.style.display = 'block';
          // Smooth scroll to success message
          successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          // Automatically hide success notification after 7 seconds
          setTimeout(() => {
            successBox.style.display = 'none';
          }, 7000);
        }
      }, 1500);
    });
  }

});
