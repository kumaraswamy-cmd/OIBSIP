/* ==========================================================================
   Kumara Swamy Portfolio - Interactions & Animations Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Menu Drawer Toggle
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const navItems = document.querySelectorAll('.nav-item');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when user clicks a link
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // 2. Sticky Navbar Effect on Scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Dynamic Auto-Typing Effect
    const typingText = document.getElementById('typingText');
    const words = [
        "Aspiring Software Engineer",
        "Full Stack Developer",
        "UI/UX Design Enthusiast",
        "Student at MVGR College"
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeDelay = 100;

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            // Delete character
            typingText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeDelay = 50; // Deletes faster than typing
        } else {
            // Type character
            typingText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeDelay = 100;
        }

        // Word completed typing
        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeDelay = 1500; // Pause at the end of the word
        } 
        // Word completed deleting
        else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeDelay = 400; // Pause before typing next word
        }

        setTimeout(type, typeDelay);
    }

    if (typingText) {
        type();
    }

    // 4. Scroll Reveal Animations (Intersection Observer)
    const revealSections = document.querySelectorAll('.scroll-reveal');
    
    if ('IntersectionObserver' in window) {
        const revealCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-active');
                    // Stop observing once revealed to maintain state
                    observer.unobserve(entry.target);
                }
            });
        };

        const revealObserver = new IntersectionObserver(revealCallback, {
            root: null,
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealSections.forEach(section => {
            revealObserver.observe(section);
        });
    } else {
        // Fallback for older browsers
        revealSections.forEach(section => {
            section.classList.add('reveal-active');
        });
    }

    // 5. Contact Form Submitting Simulation
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Clear status
            formStatus.className = 'form-status';
            formStatus.textContent = '';

            // Get form values
            const name = document.getElementById('formName').value.trim();
            const email = document.getElementById('formEmail').value.trim();
            const subject = document.getElementById('formSubject').value.trim();
            const message = document.getElementById('formMessage').value.trim();

            if (!name || !email || !subject || !message) {
                formStatus.classList.add('error');
                formStatus.textContent = 'Please fill out all fields.';
                return;
            }

            // Disable submit button during load simulation
            const submitBtn = contactForm.querySelector('.btn-submit');
            const submitBtnText = submitBtn.querySelector('span');
            const originalBtnText = submitBtnText.textContent;
            
            submitBtn.disabled = true;
            submitBtnText.textContent = 'Sending Message...';

            // Simulate form submission (e.g. Firebase or Formspree post)
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtnText.textContent = originalBtnText;

                // Show success status
                formStatus.classList.add('success');
                formStatus.textContent = `Thank you, ${name}! Your message has been sent successfully.`;
                
                // Clear inputs
                contactForm.reset();
            }, 1500);
        });
    }

    // 6. Resume Download Fallback / Instructions Helper
    const downloadResumeBtn = document.getElementById('downloadResume');
    if (downloadResumeBtn) {
        downloadResumeBtn.addEventListener('click', (e) => {
            // Check if resume.pdf path is reachable (in real host) or alert user
            // Since this runs locally, we can guide them or offer window.print()
            const filePath = downloadResumeBtn.getAttribute('href');
            
            // Simulating check for existence
            fetch(filePath, { method: 'HEAD' })
                .then(res => {
                    if (!res.ok) {
                        e.preventDefault();
                        const userChoice = confirm(
                            "Note: 'resume.pdf' was not found in the root directory.\n\n" +
                            "Would you like to print this portfolio page instead? It contains all your experience details in a neat, printable format!"
                        );
                        if (userChoice) {
                            window.print();
                        }
                    }
                })
                .catch(() => {
                    // Fetch failed, file likely doesn't exist
                    e.preventDefault();
                    const userChoice = confirm(
                        "Note: 'resume.pdf' was not found in the root directory.\n\n" +
                        "Tip: Place your actual resume PDF named 'resume.pdf' in the same folder as index.html to enable direct downloads.\n\n" +
                        "Would you like to print this portfolio page instead? It is designed to be printer-friendly!"
                    );
                    if (userChoice) {
                        window.print();
                    }
                });
        });
    }
});
