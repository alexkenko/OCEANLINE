// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 70; // Height of fixed navbar
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Add active state to navigation on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });

    // Add shadow to navbar on scroll
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.2)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
});

// Form submission with real email sending
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form values
        const nameInput = contactForm.querySelector('input[type="text"]');
        const emailInput = contactForm.querySelector('input[type="email"]');
        const subjectInput = contactForm.querySelectorAll('input[type="text"]')[1];
        const messageInput = contactForm.querySelector('textarea');
        const submitButton = contactForm.querySelector('button[type="submit"]');
        
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const subject = subjectInput.value.trim();
        const message = messageInput.value.trim();
        
        // Basic validation
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields.', 'error');
            return;
        }
        
        // Disable submit button and show loading state
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        submitButton.style.opacity = '0.7';
        
        try {
            // Send form data to API
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    subject,
                    message
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                showNotification('Thank you for your message! We will get back to you soon.', 'success');
                contactForm.reset();
            } else {
                showNotification(data.error || 'Failed to send message. Please try again or contact us directly.', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Failed to send message. Please try again or contact us directly at crew@oceanline.space', 'error');
        } finally {
            // Re-enable submit button
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
            submitButton.style.opacity = '1';
        }
    });
}

// Notification helper function
function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.form-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `form-notification ${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-family: 'Poppins', sans-serif;
        font-size: 14px;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
        ${type === 'success' ? 'background: #10b981; color: white;' : ''}
        ${type === 'error' ? 'background: #ef4444; color: white;' : ''}
        ${type === 'info' ? 'background: #3b82f6; color: white;' : ''}
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add animation styles
if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
        
        @media (max-width: 768px) {
            .form-notification {
                right: 10px;
                left: 10px;
                max-width: calc(100% - 20px);
            }
        }
    `;
    document.head.appendChild(style);
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all service cards, value cards, and other elements
document.querySelectorAll('.service-card, .value-card, .contact-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Add hover effect for vessel items
document.querySelectorAll('.vessel-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1) rotate(2deg)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Simple i18n (EN / KA)
const translations = {
    en: {
        nav: {
            home: 'Home',
            about: 'About Us',
            services: 'Services',
            values: 'Our Values',
            gallery: 'Gallery',
            gdpr: 'GDPR',
            contact: 'Contact'
        },
        hero: {
            title: 'OCEAN LINE LLC',
            subtitle: 'Leading Georgian Crewing Agency | Professional Maritime Recruitment',
            value: {
                stability: 'STABILITY',
                responsibility: 'RESPONSIBILITY',
                efficiency: 'EFFICIENCY'
            },
            cta: {
                primary: 'Get in Touch'
            }
        },
        home: {
            about: {
                title: 'About Us'
            },
            services: {
                title: 'Our Services'
            },
            values: {
                title: 'Our Values',
                intro: 'Our values are highly important to our daily work and drive what we do. Every decision and face-to-face meeting with our partners around the world should reflect our corporate values.'
            },
            contact: {
                title: 'Contact Information',
                addressTitle: 'Address',
                phoneTitle: 'Phone',
                emailTitle: 'Email'
            }
        },
        footer: {
            contactTitle: 'Contact Info',
            quickLinksTitle: 'Quick Links',
            servicesTitle: 'Services',
            legalTitle: 'Legal',
            copyright: '© 2025 Ocean Line LLC. All rights reserved.'
        },
        about: {
            page: {
                title: 'About Us',
                subtitle: 'Your Trusted Maritime Partner'
            }
        },
        services: {
            page: {
                title: 'Our Services',
                subtitle: 'Comprehensive Maritime Crew Solutions'
            }
        },
        values: {
            page: {
                title: 'Our Values',
                subtitle: 'The Principles That Guide Our Every Action'
            }
        },
        gallery: {
            page: {
                title: 'Gallery',
                subtitle: 'Our Fleet in Action'
            }
        },
        legal: {
            disclaimer: {
                title: 'Disclaimer',
                subtitle: 'Important Information About Our Services'
            },
            terms: {
                title: 'Terms of Service',
                subtitle: 'Terms and Conditions'
            },
            privacy: {
                title: 'Privacy Policy',
                subtitle: 'Your Privacy Matters to Us'
            },
            gdpr: {
                title: 'GDPR & Data Protection',
                subtitle: 'How We Protect Your Personal Data',
                sec1Title: '1. Introduction',
                sec1P1:
                    'This GDPR & Data Protection Notice explains how Ocean Line LLC (“we”, “us”, “our”) collects, uses, stores, and protects personal data in accordance with the General Data Protection Regulation (EU) 2016/679 (GDPR) and applicable Georgian data protection legislation.',
                sec1P2:
                    'By contacting us, submitting your application, or otherwise providing your personal data, you acknowledge that we process your personal data for the purposes described in this notice.',
                sec2Title: '2. Data Controller',
                sec2P1: 'The data controller responsible for the processing of your personal data is:',
                sec2P2: 'Ocean Line LLC\nAkhmed Melashvili Str 24,\nBatumi, Georgia'
            }
        }
    },
    ka: {
        nav: {
            home: 'მთავარი',
            about: 'ჩვენს შესახებ',
            services: 'სერვისები',
            values: 'ჩვენი ფასეულობები',
            gallery: 'გალერეა',
            gdpr: 'GDPR / პერსონალური მონაცემები',
            contact: 'კონტაქტი'
        },
        hero: {
            title: 'OCEAN LINE LLC',
            subtitle: 'საქართველოს წამყვანი ქრომირების სააგენტო | პროფესიული საზღვაო რეკრუტინგი',
            value: {
                stability: 'სტაბილურობა',
                responsibility: 'პასუხისმგებლობა',
                efficiency: 'ეფექტიანობა'
            },
            cta: {
                primary: 'დაგვიკავშირდით'
            }
        },
        home: {
            about: {
                title: 'ჩვენს შესახებ'
            },
            services: {
                title: 'ჩვენი სერვისები'
            },
            values: {
                title: 'ჩვენი ფასეულობები',
                intro: 'ჩვენი ფასეულობები ყოველდღიურ საქმიანობას განსაზღვრავს. თითოეული გადაწყვეტილება და შეხვედრა ჩვენს პარტნიორებთან ამ პრინციპებზეა დაფუძნებული.'
            },
            contact: {
                title: 'საკონტაქტო ინფორმაცია',
                addressTitle: 'მისამართი',
                phoneTitle: 'ტელეფონი',
                emailTitle: 'ელ. ფოსტა'
            }
        },
        footer: {
            contactTitle: 'საკონტაქტო ინფორმაცია',
            quickLinksTitle: 'სწრაფი წვდომა',
            servicesTitle: 'სერვისები',
            legalTitle: 'იურიდიული',
            copyright: '© 2025 Ocean Line LLC. ყველა უფლება დაცულია.'
        },
        about: {
            page: {
                title: 'ჩვენს შესახებ',
                subtitle: 'თქვენი საიმედო საზღვაო პარტნიორი'
            }
        },
        services: {
            page: {
                title: 'ჩვენი სერვისები',
                subtitle: 'გაერთიანებული საზღვაო ეკიპაჟის გადაწყვეტილებები'
            }
        },
        values: {
            page: {
                title: 'ჩვენი ფასეულობები',
                subtitle: 'პრინციპები, რომლებიც ჩვენს ყველა ნაბიჯს მართავს'
            }
        },
        gallery: {
            page: {
                title: 'გალერეა',
                subtitle: 'ჩვენი ფლოტი მოქმედებაში'
            }
        },
        legal: {
            disclaimer: {
                title: 'უარყოფა',
                subtitle: 'მნიშვნელოვანი ინფორმაცია ჩვენს სერვისებზე'
            },
            terms: {
                title: 'გამოყენების პირობები',
                subtitle: 'წესები და პირობები'
            },
            privacy: {
                title: 'კონფიდენციალურობის პოლიტიკა',
                subtitle: 'თქვენი პერსონალური მონაცემების დაცვა'
            },
            gdpr: {
                title: 'GDPR და პერსონალური მონაცემები',
                subtitle: 'როგორ ვიცავთ თქვენს პერსონალურ მონაცემებს',
                sec1Title: '1. შესავალი',
                sec1P1:
                    'ამ GDPR‑ისა და მონაცემთა დაცვის განცხადებაში განიმარტება, თუ როგორ აგროვებს, იყენებს, ინახავს და იცავს Ocean Line LLC („ჩვენ“) პერსონალურ მონაცემებს ევროკავშირის ზოგადი მონაცემთა დაცვის რეგულაციის (GDPR) და საქართველოს მოქმედი კანონმდებლობის შესაბამისად.',
                sec1P2:
                    'ჩვენთან დაკავშირებით, განაცხადის გამოგზავნით ან სხვა ფორმით თქვენი პერსონალური მონაცემების გადმოცემით ადასტურებთ, რომ ჩვენ ვამუშავებთ მონაცემებს ამ განცხადებაში აღწერილი მიზნებისთვის.',
                sec2Title: '2. მონაცემთა დამმუშავებელი',
                sec2P1: 'თქვენი პერსონალური მონაცემების დამმუშავებელი სუბიექტია:',
                sec2P2: 'Ocean Line LLC\nAkhmed Melashvili Str 24,\nBatumi, Georgia'
            }
        }
    }
};

function resolveTranslation(dict, key) {
    const parts = key.split('.');
    return parts.reduce((obj, part) => (obj && obj[part] !== undefined ? obj[part] : undefined), dict);
}

function setLanguage(lang) {
    const dict = translations[lang];
    if (!dict) return;

    // Update html lang attribute
    document.documentElement.lang = lang === 'ka' ? 'ka' : 'en';

    // Update all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const text = resolveTranslation(dict, key);
        if (typeof text === 'string') {
            el.textContent = text;
        }
    });

    // Toggle active state on language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Persist choice
    try {
        localStorage.setItem('oceanline-lang', lang);
    } catch (e) {
        // ignore storage errors
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Attach click handlers
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            setLanguage(lang);
        });
    });

    // Initialize language from storage or default EN
    let initialLang = 'en';
    try {
        const saved = localStorage.getItem('oceanline-lang');
        if (saved && translations[saved]) {
            initialLang = saved;
        }
    } catch (e) {
        // ignore
    }
    setLanguage(initialLang);
});


