document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
  
    // Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
  
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      mobileMenuButton.setAttribute('aria-expanded', !mobileMenu.classList.contains('hidden'));
    });
  
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const themeIconLight = document.getElementById('theme-icon-light');
    const themeIconDark = document.getElementById('theme-icon-dark');
  
    // Check for saved theme preference or use system preference
    if (localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      themeIconLight.classList.add('hidden');
      themeIconDark.classList.remove('hidden');
    } else {
      document.documentElement.classList.remove('dark');
      themeIconLight.classList.remove('hidden');
      themeIconDark.classList.add('hidden');
    }
  
    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
      themeIconLight.classList.toggle('hidden');
      themeIconDark.classList.toggle('hidden');
      
      // Save preference to localStorage
      if (document.documentElement.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
      } else {
        localStorage.setItem('theme', 'light');
      }
    });
  
    // Animate skill progress rings on scroll
    const skillItems = document.querySelectorAll('.skill-item');
  
    function animateSkills() {
      skillItems.forEach(item => {
        const progressRing = item.querySelector('.progress-ring-circle');
        const percent = parseInt(item.querySelector('.skill-progress').dataset.percent);
        const circumference = 2 * Math.PI * 52;
        const offset = circumference - (percent / 100) * circumference;
        
        progressRing.style.strokeDashoffset = offset;
        item.classList.remove('opacity-0', 'translate-y-10');
      });
    }
  
    // Initialize Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('skill-item')) {
            animateSkills();
          }
          entry.target.classList.add('animate-fade-in');
        }
      });
    }, { threshold: 0.1 });
  
    // Observe all sections with animations
    document.querySelectorAll('section, .skill-item').forEach(element => {
      observer.observe(element);
    });
  
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80, // Account for fixed header
            behavior: 'smooth'
          });
          
          // Close mobile menu if open
          mobileMenu.classList.add('hidden');
          mobileMenuButton.setAttribute('aria-expanded', 'false');
        }
      });
    });
  
    // Active nav link based on scroll position
    window.addEventListener('scroll', () => {
      const scrollPosition = window.scrollY + 100;
      
      document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          document.querySelectorAll('.nav-link, .nav-link-mobile').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
  
      // Show/hide back to top button
      const backToTopButton = document.getElementById('back-to-top');
      if (window.scrollY > 300) {
        backToTopButton.classList.remove('hidden');
        backToTopButton.setAttribute('aria-hidden', 'false');
      } else {
        backToTopButton.classList.add('hidden');
        backToTopButton.setAttribute('aria-hidden', 'true');
      }
    });
  
    // Back to top button
    document.getElementById('back-to-top').addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  
    // See More Projects Button
    const seeMoreBtn = document.getElementById('see-more-btn');
    const moreProjects = document.getElementById('more-projects');
    
    if (seeMoreBtn && moreProjects) {
      seeMoreBtn.addEventListener('click', () => {
        moreProjects.classList.toggle('hidden');
        seeMoreBtn.textContent = moreProjects.classList.contains('hidden') ? 'See More Projects' : 'Show Less';
        
        // Scroll to the bottom of the projects section if showing more
        if (!moreProjects.classList.contains('hidden')) {
          moreProjects.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    }
  
    // Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        try {
          const response = await fetch('https://formspree.io/f/mblgzbrn', {
            method: 'POST',
            body: formData,
            headers: {
              'Accept': 'application/json'
            }
          });
          
          if (response.ok) {
            document.getElementById('form-success').classList.remove('hidden');
            contactForm.reset();
            
            // Hide success message after 5 seconds
            setTimeout(() => {
              document.getElementById('form-success').classList.add('hidden');
            }, 5000);
          } else {
            throw new Error('Form submission failed');
          }
        } catch (error) {
          console.error('Error:', error);
          alert('There was an error submitting your form. Please try again.');
        } finally {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
      });
    }
  
    // Newsletter Form Submission
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const submitBtn = newsletterForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Subscribing...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
          submitBtn.textContent = 'Subscribed!';
          emailInput.value = '';
          
          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
          }, 2000);
        }, 1000);
      });
    }
  
    // Lazy load images
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.getAttribute('src');
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        });
      }, { rootMargin: '200px 0px' });
  
      lazyImages.forEach(img => {
        // Set src from data-src if using that pattern
        if (img.hasAttribute('data-src')) {
          img.src = img.getAttribute('data-src');
        }
        imageObserver.observe(img);
      });
    } else {
      // Fallback for browsers without IntersectionObserver
      lazyImages.forEach(img => {
        img.src = img.getAttribute('src') || img.getAttribute('data-src');
        img.classList.add('loaded');
      });
    }
  });