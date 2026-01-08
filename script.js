// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Create overlay element if it doesn't exist
let overlay = document.querySelector('.menu-overlay');
if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);
    
    // Close menu when clicking overlay
    overlay.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
}

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
    overlay.classList.toggle('active');
    
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
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
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
                title: 'About Us',
                card1: {
                    title: 'Leading Georgian Crewing Agency',
                    text:
                        'Ocean Line LLC is a premier maritime recruitment agency based in Batumi, Georgia. We specialize in providing highly experienced, STCW certified Georgian seafarers for Tankers, Bulk Carriers, Container Ships, and General Cargo vessels worldwide.'
                },
                card2: {
                    title: 'Professional Excellence',
                    text:
                        'Our crew members are well-trained, reliable and ready to join your fleet. We specialize in the recruitment and selection of Georgian crew to serve as mariners aboard foreign-flagged vessels.'
                },
                card3: {
                    title: 'Global Experience',
                    text:
                        'We have an extensive database of qualified Georgian mariners of all ranks. All our seafarers are certified in accordance with the STCW convention standards.'
                },
                stats: {
                    certified: 'STCW Certified',
                    support: '24/7 Support',
                    network: 'Global Network',
                    vessels: 'Vessel Types'
                },
                goals: {
                    header: 'We aim to provide qualified seafarers to our clients by:',
                    goal1: {
                        title: 'Global Promotion',
                        text: 'Promoting our network of top-quality Georgian seafarers worldwide.'
                    },
                    goal2: {
                        title: 'Industry Leadership',
                        text:
                            'Promoting the Georgian maritime sector internationally to become the new benchmark by taking advantage of the strategic position of our country.'
                    },
                    goal3: {
                        title: 'Career Opportunities',
                        text: 'Creating opportunities for Georgian officers and crew to work in the best possible environment.'
                    }
                },
                cert: {
                    title: 'Fully Certified & Compliant',
                    text1:
                        'Ocean Line LLC is proud to be fully certified with MLC 2006 and ISO certifications. Our certifications demonstrate our commitment to international maritime standards and quality service delivery.',
                    text2:
                        'As a certified maritime recruitment agency, we provide professional and competent crew members, ensuring the best solutions for your vessels with full compliance to international regulations.',
                    cta: 'Partner with a certified agency you can trust!'
                }
            },
            services: {
                title: 'Our Services',
                card1: {
                    title: 'Professional Maritime Crew Recruitment',
                    text:
                        'Our crewing agency provides comprehensive maritime recruitment services, personally selecting and screening all crew members. We verify experience, competence, fitness, and English proficiency. All seafarers hold valid certificates compliant with IMO and STCW regulations for international maritime operations.'
                },
                card2: {
                    title: 'Crew Management Services',
                    text:
                        'We offer a full range of services for effective management of a high quality, professional crew, whether it be for a specific vessel or operation or across your entire fleet. We always hold ourselves and the seafarers we recommend to the highest standards of professionalism and conduct, and are always sure to pay special attention to the preferences of our clients.'
                },
                card3: {
                    title: 'Visa Services',
                    text:
                        'We offer assistance in obtaining various kinds of visas for our seafarers, including consultation on all necessary paperwork and documentation. We will work with crew members at every step along the way, from the start of the request to the final receipt of the visa.'
                },
                learnMore: 'Learn More →'
            },
            vessels: {
                title: 'We can provide marine specialists for the following types of vessel:',
                bulk: 'BULK CARRIERS',
                containers: 'CONTAINERS',
                tankers: 'ALL TYPES OF TANKERS',
                passenger: 'PASSENGER VESSELS',
                etc: 'E.T.C'
            },
            values: {
                title: 'Our Values',
                intro:
                    'Our values are highly important to our daily work and drive what we do. Every decision and face-to-face meeting with our partners around the world should reflect our corporate values.',
                card1: {
                    title: 'INTEGRITY',
                    text:
                        'Honesty with our employees, sailors, and clients is a primary value for "OCEAN LINE LLC". We seek to build long-standing relationships with all our partners by pursuing open communication, building trust, admitting our mistakes, and using those opportunities to grow.'
                },
                card2: {
                    title: 'RELIABILITY',
                    text:
                        'At OCEAN LINE LLC, you can count on us to deliver quality results every time. We hold ourselves and our sailors to high standards, all in the interest of building enduring relationships with our clients and partners. We hold each other accountable and follow through on our commitments.'
                },
                card3: {
                    title: 'TEAMWORK',
                    text:
                        'Here, our team is everything. We work together to bring our clients the results they want and promote a spirit of teamwork and collaboration in the process. The members of our team are our greatest asset, and each one of them has the opportunity to meaningfully contribute to the work we do here.'
                },
                card4: {
                    title: 'PASSION',
                    text:
                        'OCEAN LINE LLC takes great pride in bringing our partners the results they deserve, and it is this passion that drives us as a company. This energy pushes us to make a positive impact in the lives of our clients, our employees, and our sailors every day.'
                },
                card5: {
                    title: 'INNOVATION',
                    text:
                        'We are always looking for new ways to innovate, learn, and grow as a company. We constantly explore new ideas and concepts to help bring our clients even better results.'
                },
                readMore: 'Read More →'
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
            },
            overview: {
                heading: 'Leading Georgian Maritime Excellence',
                lead:
                    'Ocean Line LLC is a newly established, fully certified crewing agency based in the strategic port city of Batumi, Georgia. We specialize in providing highly experienced Georgian seafarers for international maritime operations.',
                p1:
                    'Our agency represents the pinnacle of Georgian maritime talent, offering skilled crew members for Tankers, Bulk Carriers, Container Ships, and General Cargo vessels. Every member of our crew is well-trained, reliable, and ready to join your fleet with the highest standards of professionalism.',
                p2:
                    'We have built an extensive database of qualified Georgian mariners of all ranks, all certified in accordance with the STCW convention standards. Our seafarers bring a wealth of experience gained at sea on various vessel types and under multiple international flags.'
            },
            story: {
                heading: 'Our Story',
                p1:
                    "Founded in the heart of Georgia's maritime capital, Ocean Line LLC emerged from a vision to bridge Georgian maritime expertise with global opportunities. Our founders, with decades of combined experience in the shipping industry, recognized the untapped potential of Georgian seafarers and their exceptional skills.",
                p2:
                    "What started as a local initiative has grown into a trusted international partner for maritime recruitment. We've successfully placed Georgian officers and crew members on vessels operating across all major shipping routes, earning recognition for our commitment to quality and professionalism.",
                p3:
                    'Today, Ocean Line LLC stands as a testament to Georgian maritime excellence, connecting skilled seafarers with rewarding career opportunities while providing ship owners and operators with reliable, competent crew members.',
                feature1: {
                    title: 'Strategic Location',
                    text: 'Based in Batumi, Georgia - a key maritime hub connecting Europe and Asia'
                },
                feature2: {
                    title: 'Expert Team',
                    text: 'Industry veterans with deep knowledge of maritime operations and crew management'
                },
                feature3: {
                    title: 'Global Reach',
                    text: 'Connecting Georgian talent with international opportunities worldwide'
                }
            },
            mission: {
                title: 'Our Mission',
                text:
                    'To provide exceptional maritime recruitment services by connecting highly skilled Georgian seafarers with international opportunities, while maintaining the highest standards of professionalism, safety, and compliance in all our operations.'
            },
            vision: {
                title: 'Our Vision',
                text:
                    'To become the leading Georgian crewing agency, recognized globally for our commitment to excellence, innovation, and the professional development of maritime personnel.'
            },
            commitment: {
                title: 'Our Commitment',
                text:
                    'We are dedicated to fostering long-term partnerships with our clients and crew members, ensuring mutual success through transparent communication, ethical practices, and continuous improvement.'
            },
            differentiators: {
                title: 'What Sets Us Apart',
                diff1: {
                    title: 'Full Certification',
                    text:
                        'We are fully certified with MLC 2006 and ISO certifications, ensuring compliance with all international maritime standards and regulations.'
                },
                diff2: {
                    title: 'Quality Assurance',
                    text:
                        'Every crew member undergoes rigorous screening, including experience verification, competency assessment, and English proficiency evaluation.'
                },
                diff3: {
                    title: 'Personalized Service',
                    text:
                        'We provide tailored solutions for each client, understanding that every vessel and operation has unique requirements.'
                },
                diff4: {
                    title: 'Rapid Response',
                    text: 'Our efficient processes ensure quick crew placement and immediate support for urgent requirements.'
                },
                diff5: {
                    title: 'International Experience',
                    text: 'Our crew members have extensive experience on various vessel types and under different international flags.'
                },
                diff6: {
                    title: '24/7 Support',
                    text: 'Round-the-clock assistance for crew welfare, emergency situations, and operational support needs.'
                }
            },
            goals: {
                title: 'Our Strategic Goals',
                intro:
                    'We aim to provide qualified seafarers to our clients through strategic initiatives that promote excellence and growth in the Georgian maritime sector.'
            },
            bribe: {
                title: 'Zero Tolerance Anti-Bribery Policy',
                text:
                    'Ocean Line LLC maintains a strict zero-tolerance policy against bribery and corruption in all our operations. We are committed to conducting business with the highest ethical standards and integrity.',
                commitmentTitle: 'Our commitment includes:',
                item1: 'No facilitation payments or "grease money" in any form',
                item2: 'Transparent recruitment processes based solely on merit and qualifications',
                item3: 'Fair and equal treatment of all crew members and clients',
                item4: 'Compliance with all international anti-corruption laws and regulations',
                item5: 'Regular training and awareness programs for all staff members',
                item6: 'Clear reporting mechanisms for any suspected violations',
                highlight:
                    'We believe that ethical business practices are the foundation of long-term success and trust in the maritime industry.'
            },
            cta: {
                title: 'Ready to Work with Us?',
                text:
                    'Discover how Ocean Line LLC can provide the skilled, reliable crew members your vessels need to operate at peak performance.',
                secondary: 'View Our Services'
            }
        },
        services: {
            page: {
                title: 'Our Services',
                subtitle: 'Comprehensive Maritime Crew Solutions'
            },
            recruitment: {
                heading: 'Recruitment and Selection of Qualified Crew',
                tagline: 'Building Your Perfect Maritime Team',
                intro:
                    'At Ocean Line LLC, we understand that the success of any maritime operation depends on having the right crew. Our comprehensive recruitment service ensures that every seafarer we recommend meets the highest standards of competence, experience, and professionalism.',
                processTitle: 'Our Recruitment Process',
                features: {
                    f1: {
                        title: 'Rigorous Screening',
                        text:
                            'Every applicant undergoes thorough background checks, credential verification, and competency assessments to ensure they meet international maritime standards.'
                    },
                    f2: {
                        title: 'Qualification Verification',
                        text:
                            'We verify all certificates, licenses, and endorsements to ensure compliance with STCW convention standards and IMO regulations.'
                    },
                    f3: {
                        title: 'Fitness Assessment',
                        text:
                            'All crew members undergo medical examinations and fitness evaluations to ensure they are physically and mentally prepared for maritime duties.'
                    },
                    f4: {
                        title: 'English Proficiency',
                        text:
                            'We assess English language comprehension to ensure effective communication aboard international vessels, promoting safety and efficiency.'
                    },
                    f5: {
                        title: 'Experience Verification',
                        text:
                            'We review sea service records and previous employment history to match the right experience level with your vessel requirements.'
                    },
                    f6: {
                        title: 'Pre-Joining Preparation',
                        text:
                            'Selected crew members receive comprehensive briefings about vessel specifications, company policies, and voyage requirements before joining.'
                    }
                },
                highlights: {
                    title: 'Why Choose Our Recruitment Service?',
                    item1: 'Access to extensive database of qualified Georgian mariners of all ranks',
                    item2: 'All seafarers hold valid certificates in accordance with STCW and IMO requirements',
                    item3: 'Proven track record with experience on various vessel types and under multiple flags',
                    item4: 'Quick response time for urgent crew requirements',
                    item5: 'Competitive rates with transparent pricing',
                    item6: '24/7 support for crew placement and emergency replacements'
                }
            },
            management: {
                title: 'Crew Management Services',
                tagline: 'Complete Maritime Personnel Solutions',
                intro:
                    'Our crew management services go beyond simple placement. We provide comprehensive support to ensure your crew operates at peak performance, maintaining the highest standards of professionalism throughout their tenure aboard your vessels.',
                features: {
                    title: 'Complete Management Solutions',
                    f1: {
                        title: 'Crew Planning & Rotation',
                        text:
                            'Strategic planning of crew rotations to ensure seamless transitions, minimize operational disruptions, and maintain optimal crew performance.'
                    },
                    f2: {
                        title: 'Documentation Management',
                        text:
                            'Complete handling of all crew documentation, certificates, licenses, and endorsements with timely renewal reminders and processing.'
                    },
                    f3: {
                        title: 'Payroll Administration',
                        text:
                            'Efficient payroll processing, salary disbursement, tax documentation, and financial record management for all crew members.'
                    },
                    f4: {
                        title: 'Training & Development',
                        text:
                            'Coordination of mandatory training courses, skill upgrades, and professional development programs to keep crew certifications current.'
                    },
                    f5: {
                        title: 'Medical Support',
                        text: 'Arrangement of pre-joining medical examinations, health insurance, and medical repatriation when necessary.'
                    },
                    f6: {
                        title: '24/7 Support',
                        text: 'Round-the-clock assistance for crew welfare issues, emergency situations, and operational support needs.'
                    }
                },
                highlights: {
                    title: 'Our Management Approach',
                    item1: 'Personalized service tailored to your specific vessel and operational requirements',
                    item2: 'Proactive communication with vessel masters and shore management',
                    item3: 'Regular performance evaluations and feedback mechanisms',
                    item4: 'Conflict resolution and crew welfare support',
                    item5: 'Compliance monitoring with international maritime regulations',
                    item6: 'Cost-effective solutions that maintain quality standards',
                    item7: 'Flexible contracts for single vessel or full fleet management'
                }
            },
            visa: {
                title: 'Visa Services',
                tagline: 'Seamless Travel Documentation Support',
                intro:
                    'Navigating international visa requirements can be complex and time-consuming. Our dedicated visa services team takes the burden off your shoulders, ensuring your crew members have all necessary travel documentation to join vessels anywhere in the world.',
                features: {
                    title: 'Comprehensive Visa Assistance',
                    f1: {
                        title: 'Global Visa Processing',
                        text:
                            'Assistance with visa applications for all major maritime jurisdictions, including Schengen, USA, UK, Australia, and Asian countries.'
                    },
                    f2: {
                        title: 'Document Preparation',
                        text:
                            'Complete preparation of visa application forms, supporting documents, invitation letters, and all required paperwork.'
                    },
                    f3: {
                        title: 'Embassy Liaison',
                        text:
                            'Direct communication with embassies and consulates to expedite processing and resolve any issues that may arise.'
                    },
                    f4: {
                        title: 'Urgent Processing',
                        text:
                            'Fast-track visa services for emergency crew changes and urgent vessel requirements with expedited processing options.'
                    },
                    f5: {
                        title: 'Visa Renewals',
                        text:
                            'Proactive monitoring of visa expiration dates with timely renewal applications to prevent travel disruptions.'
                    },
                    f6: {
                        title: 'Seafarer Documentation',
                        text:
                            "Assistance with seafarer's books, continuous discharge certificates, and other maritime-specific travel documents."
                    }
                },
                highlights: {
                    title: 'Our Visa Service Benefits',
                    item1: 'Expert knowledge of maritime visa requirements across multiple countries',
                    item2: 'Established relationships with embassies and consular services',
                    item3: 'End-to-end handling from application to visa receipt',
                    item4: 'Regular status updates throughout the application process',
                    item5: 'Guidance on interview preparation when required',
                    item6: 'Problem resolution for rejected or delayed applications',
                    item7: 'Consultation on transit visa requirements for crew changes',
                    item8: 'Support with travel arrangements and logistics coordination'
                }
            },
            vessels: {
                title: 'Vessel Types We Serve',
                intro: 'Our experienced mariners are qualified to work on various types of vessels',
                bulk: {
                    title: 'Bulk Carriers',
                    text: 'Experienced crew for all sizes of bulk cargo vessels, from Handysize to Capesize carriers.'
                },
                container: {
                    title: 'Container Ships',
                    text: 'Skilled personnel for container vessels of all classifications and trade routes.'
                },
                tanker: {
                    title: 'Tankers',
                    text: 'Specialized crew for oil tankers, chemical tankers, LNG carriers, and product tankers.'
                },
                passenger: {
                    title: 'Passenger Vessels',
                    text: 'Professional crew for cruise ships, ferries, and other passenger-carrying vessels.'
                },
                general: {
                    title: 'General Cargo',
                    text: 'Qualified mariners for general cargo ships and multi-purpose vessels.'
                },
                more: {
                    title: 'And More',
                    text: 'Including offshore vessels, RoRo ships, reefer vessels, and specialized maritime crafts.'
                }
            },
            apply: {
                title: 'Join Our Crew Database',
                text:
                    'Are you a qualified Georgian seafarer looking for your next international opportunity? We are always looking for professional officers and crew members of all ranks.',
                btn: 'Apply Now'
            },
            cta: {
                title: 'Ready to Build Your Perfect Crew?',
                text:
                    'Contact us today to discuss your crew requirements and discover how Ocean Line LLC can support your maritime operations.',
                secondary: 'Learn More About Us'
            }
        },
        values: {
            page: {
                title: 'Our Values',
                subtitle: 'The Principles That Guide Our Every Action'
            },
            intro: {
                heading: 'Our Foundation',
                p1:
                    'At Ocean Line LLC, our values are not just words on a page—they are the principles that guide every decision we make, every relationship we build, and every service we provide. These five core values define who we are as a company and shape the maritime recruitment excellence we deliver to our clients and crew members worldwide.',
                p2:
                    'Our values are highly important to our daily work and drive what we do. Every decision and face-to-face meeting with our partners around the world should reflect our corporate values.'
            }
        },
        gallery: {
            page: {
                title: 'Gallery',
                subtitle: 'Our Fleet in Action'
            },
            intro: {
                title: 'Maritime Operations in Action',
                text: 'Watch our professional crew and vessel operations. Experience the dedication and expertise that defines Ocean Line LLC.'
            },
            videos: {
                title: 'Maritime Videos',
                v1: {
                    title: 'Maritime Operations',
                    text: 'Professional crew operations and vessel management'
                },
                v2: {
                    title: 'Ocean Line Operations',
                    text: 'Behind the scenes of our maritime services'
                }
            }
        },
        legal: {
            disclaimer: {
                title: 'Disclaimer',
                subtitle: 'Important Information About Our Services',
                secTitle: 'Maritime Crewing Services Disclaimer',
                secIntro:
                    'Ocean Line LLC provides maritime crewing services as a recruitment agency. Please read the following disclaimer carefully before engaging our services.',
                sec1Title: '1. Service Scope',
                sec1Text:
                    'Ocean Line LLC acts as an intermediary between ship owners/operators and qualified seafarers. We facilitate the recruitment, placement, and management of maritime personnel but do not directly employ seafarers or operate vessels.',
                sec2Title: '2. Certification and Compliance',
                sec2Text:
                    'While we ensure all recommended crew members hold valid STCW certifications and meet industry standards, ultimate responsibility for vessel compliance, safety, and operations rests with the ship owner/operator and the master of the vessel.',
                sec3Title: '3. Liability Limitations',
                sec3Text: "Ocean Line LLC's liability is limited to the scope of our recruitment services. We are not liable for:",
                sec3L1: 'Actions or conduct of placed crew members while on board',
                sec3L2: 'Vessel operations, safety, or performance',
                sec3L3: 'Changes in international maritime regulations',
                sec3L4: 'Delays in visa processing or travel arrangements',
                sec3L5: 'Medical conditions that develop after placement',
                sec3L6: 'Political or economic factors affecting shipping',
                sec4Title: '4. Visa and Travel',
                sec4Text:
                    'We provide assistance with visa applications and travel arrangements but cannot guarantee approval. Visa decisions remain with relevant government authorities. Travel restrictions and requirements may change without notice.',
                sec5Title: '5. Employment Terms',
                sec5Text:
                    'Employment terms, including salary, working conditions, and contract duration, are negotiated directly between the seafarer and the ship owner/operator. Ocean Line LLC facilitates but does not guarantee specific employment conditions.',
                sec6Title: '6. Regulatory Compliance',
                sec6Text:
                    'Maritime regulations vary by jurisdiction and vessel type. While we maintain awareness of major international standards, clients must ensure compliance with all applicable laws in their areas of operation.',
                sec7Title: '7. Information Accuracy',
                sec7Text:
                    'We strive to provide accurate information about crew qualifications and availability. However, information may change, and we recommend verification of all details before final placement decisions.',
                sec8Title: '8. Force Majeure',
                sec8Text:
                    'Ocean Line LLC is not liable for delays or failures caused by circumstances beyond our reasonable control, including but not limited to natural disasters, pandemics, political unrest, or government actions.',
                sec9Title: '9. Professional Advice',
                sec9Text:
                    'This website and our services provide general information. For specific legal, financial, or technical advice regarding maritime operations, consult qualified professionals in those fields.',
                sec10Title: '10. Contact Information',
                sec10Text: 'For questions about this disclaimer or our services:',
                lastUpdated: 'Last updated: January 2025'
            },
            terms: {
                title: 'Terms of Service',
                subtitle: 'Terms and Conditions',
                secTitle: 'Terms and Conditions for Maritime Crewing Services',
                secIntro:
                    "These terms and conditions govern the use of Ocean Line LLC's maritime crewing services. By engaging our services, you agree to be bound by these terms.",
                sec1Title: '1. Service Agreement',
                sec1Text:
                    'Ocean Line LLC provides maritime crewing services including but not limited to crew recruitment, placement, management, and visa assistance. Services are provided subject to these terms and any specific agreements entered into with clients.',
                sec2Title: '2. Client Obligations',
                sec2Text: 'Clients agree to:',
                sec2L1: 'Provide accurate information about vessel requirements and operating conditions',
                sec2L2: 'Comply with all applicable maritime laws and regulations',
                sec2L3: 'Maintain proper insurance coverage for crew members',
                sec2L4: 'Provide safe working conditions and adequate provisions',
                sec2L5: 'Honor employment contracts and payment obligations',
                sec2L6: 'Notify us promptly of any issues or changes in requirements',
                sec3Title: '3. Seafarer Obligations',
                sec3Text: 'Seafarers agree to:',
                sec3L1: 'Maintain valid certifications and medical fitness',
                sec3L2: 'Perform duties competently and professionally',
                sec3L3: 'Comply with vessel rules and international maritime law',
                sec3L4: 'Report for duty as scheduled',
                sec3L5: 'Provide accurate information about qualifications and experience',
                sec3L6: 'Follow safety procedures and emergency protocols',
                sec4Title: '4. Fees and Payments',
                sec4Text: 'Service fees are as agreed in individual contracts. Payment terms typically include:',
                sec4L1: 'Recruitment fees payable upon successful placement',
                sec4L2: 'Management fees for ongoing crew support',
                sec4L3: 'Additional charges for visa processing and travel arrangements',
                sec4L4: 'Late payment fees may apply for overdue accounts',
                sec5Title: '5. Cancellation and Refunds',
                sec5Text: 'Cancellation policies vary by service type. Generally:',
                sec5L1: 'Recruitment fees are non-refundable once placement is confirmed',
                sec5L2: 'Visa processing fees may be partially refundable if processing hasn’t begun',
                sec5L3: 'Management fees are prorated based on service duration',
                sec6Title: '6. Confidentiality',
                sec6Text:
                    'Both parties agree to maintain confidentiality of sensitive information including vessel details, crew personal information, and business operations.',
                sec7Title: '7. Compliance and Regulations',
                sec7Text: 'All parties must comply with:',
                sec7L1: 'International Maritime Organization (IMO) regulations',
                sec7L2: 'Maritime Labour Convention (MLC) 2006',
                sec7L3: 'STCW Convention requirements',
                sec7L4: 'Local and international immigration laws',
                sec7L5: 'Anti-discrimination and equal opportunity laws',
                sec8Title: '8. Dispute Resolution',
                sec8Text: 'Disputes will be resolved through:',
                sec8L1: 'Direct negotiation between parties',
                sec8L2: 'Mediation if negotiation fails',
                sec8L3: 'Arbitration under Georgian law if mediation fails',
                sec8L4: 'Legal action as a last resort',
                sec9Title: '9. Force Majeure',
                sec9Text:
                    'Neither party is liable for delays or failures due to circumstances beyond reasonable control, including natural disasters, pandemics, government actions, or labor disputes.',
                sec10Title: '10. Modifications',
                sec10Text:
                    'These terms may be modified at any time. Continued use of services constitutes acceptance of modified terms.',
                sec11Title: '11. Contact Information',
                sec11Text: 'For questions about these terms:',
                lastUpdated: 'Last updated: January 2025'
            },
            privacy: {
                title: 'Privacy Policy',
                subtitle: 'Your Privacy Matters to Us',
                sec1Title: '1. Information We Collect',
                sec1Intro:
                    'Ocean Line LLC collects personal information from seafarers, ship owners, and other clients to provide maritime crewing services. This may include:',
                sec1L1: 'Personal identification information (name, date of birth, passport details)',
                sec1L2: 'Maritime certificates and qualifications (STCW, medical certificates)',
                sec1L3: 'Employment history and references',
                sec1L4: 'Contact information (email, phone, address)',
                sec1L5: 'Visa and travel documentation',
                sec1L6: 'Banking information for salary payments',
                sec2Title: '2. How We Use Your Information',
                sec2Intro: 'We use collected information to:',
                sec2L1: 'Provide crewing and recruitment services',
                sec2L2: 'Process visa applications and travel arrangements',
                sec2L3: 'Communicate about job opportunities and placements',
                sec2L4: 'Maintain compliance with maritime regulations',
                sec2L5: 'Process payments and maintain financial records',
                sec2L6: 'Provide ongoing support and assistance',
                sec3Title: '3. Information Sharing',
                sec3Intro: 'We may share your information with:',
                sec3L1: 'Ship owners and operators for crew placement',
                sec3L2: 'Government authorities for visa and immigration purposes',
                sec3L3: 'Maritime authorities for certification verification',
                sec3L4: 'Medical facilities for health assessments',
                sec3L5: 'Legal and regulatory bodies as required by law',
                sec4Title: '4. Data Security',
                sec4Text:
                    'We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. All data is stored securely and accessed only by authorized personnel.',
                sec5Title: '5. Your Rights',
                sec5Intro: 'You have the right to:',
                sec5L1: 'Access your personal information',
                sec5L2: 'Request correction of inaccurate data',
                sec5L3: 'Request deletion of your data (subject to legal requirements)',
                sec5L4: 'Withdraw consent for data processing',
                sec5L5: 'File complaints with relevant authorities',
                sec6Title: '6. Contact Information',
                sec6Text: 'For privacy-related inquiries, contact us at:',
                lastUpdated: 'Last updated: January 2025'
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
                sec2P2: 'Ocean Line LLC\nAkhmed Melashvili Str 24,\nBatumi, Georgia',
                sec3Title: '3. Data Protection Officer & Contact for Complaints',
                sec3P1:
                    'We have appointed a Data Protection Officer (DPO) who is responsible for overseeing questions and complaints in relation to this notice and our processing of personal data.',
                sec3NameLabel: 'Name:',
                sec3Name: 'RUSUDAN PALAVANDISHVILI',
                sec3PosLabel: 'Position:',
                sec3Pos: 'Data Protection Officer',
                sec3PhoneLabel: 'Phone:',
                sec3EmailLabel: 'Email:',
                sec3AddrLabel: 'Address:',
                sec3Addr: 'Akhmed Melashvili Str 24, Batumi, Georgia',
                sec3P2:
                    'This person is responsible for receiving and reviewing any claims, complaints, requests and inquiries related to personal data processing. You may contact the DPO at any time using the details above.',
                sec4Title: '4. Categories of Personal Data We Process',
                sec4P1:
                    'We process personal data necessary to provide maritime crewing, recruitment and related services, including:',
                sec4L1: 'Identification data (name, date of birth, nationality, passport and ID details);',
                sec4L2: 'Contact details (address, phone number, email);',
                sec4L3: 'Professional and employment data (CV, rank, maritime experience, references);',
                sec4L4: 'Qualification and certification data (e.g. STCW, medical certificates, training records);',
                sec4L5: 'Financial data (bank details for salary payments where applicable);',
                sec4L6: 'Visa and travel data (visas, tickets, travel history related to employment);',
                sec4L7: 'Any other information you choose to share with us in the recruitment / crewing process.',
                sec5Title: '5. Purposes and Legal Bases for Processing',
                sec5P1:
                    'We process your personal data for the following purposes and on the following legal bases under GDPR:',
                sec5L1:
                    'Recruitment and placement of seafarers on vessels – processing is necessary for the performance of a contract or to take steps at your request prior to entering into a contract (GDPR Art. 6(1)(b)).',
                sec5L2:
                    'Crew management and HR administration – performance of a contract and our legitimate interests to manage our operations (GDPR Art. 6(1)(b), 6(1)(f)).',
                sec5L3:
                    'Compliance with legal and regulatory obligations (e.g. maritime, immigration, tax, employment laws) – compliance with a legal obligation (GDPR Art. 6(1)(c)).',
                sec5L4:
                    'Communication with you about job opportunities, assignments, and support – performance of a contract and legitimate interests (GDPR Art. 6(1)(b), 6(1)(f)).',
                sec5L5:
                    'Record keeping, safety and security – legitimate interests in ensuring effective management, safety and security (GDPR Art. 6(1)(f)).',
                sec5L6:
                    'Processing based on your consent (where required, e.g. for certain marketing communications) – consent (GDPR Art. 6(1)(a)), which you may withdraw at any time.',
                sec6Title: '6. Data Processing Warning',
                sec6P1:
                    'Important: Ocean Line LLC does process personal data of seafarers, ship owners, partners and other individuals in the course of providing crewing and recruitment services. All such processing is carried out in accordance with GDPR and applicable Georgian law, based on the purposes and legal grounds described in this notice.',
                sec7Title: '7. Data Sharing and International Transfers',
                sec7P1: 'We may share your personal data with:',
                sec7L1: 'Ship owners, operators and managers for the purpose of crew recruitment and placement;',
                sec7L2: 'Maritime authorities, flag state administrations and port state control, where required;',
                sec7L3: 'Immigration and other governmental authorities in connection with visas and travel;',
                sec7L4: 'Medical facilities and insurance providers for medical examinations and coverage;',
                sec7L5: 'Professional advisers (lawyers, auditors, consultants) where necessary;',
                sec7L6: 'IT and system providers who support our business operations.',
                sec7P2:
                    'Where personal data is transferred outside the European Economic Area (EEA), we will ensure that appropriate safeguards are in place (such as Standard Contractual Clauses or equivalent measures) in accordance with GDPR requirements.',
                sec8Title: '8. Data Retention',
                sec8P1:
                    'We keep your personal data only for as long as necessary to fulfil the purposes for which it was collected, including satisfying any legal, regulatory, accounting or reporting requirements. As a general rule:',
                sec8L1:
                    'Recruitment and crewing records are retained for the duration of your cooperation with us and for a reasonable period thereafter;',
                sec8L2:
                    'Documents required by law (e.g. accounting, tax, employment) are retained for the periods specified in applicable legislation;',
                sec8L3: 'Where processing is based on consent, data may be deleted earlier if you withdraw your consent.',
                sec9Title: '9. Your Rights as a Data Subject',
                sec9P1: 'Subject to the conditions and applicable limitations under GDPR, you have the right to:',
                sec9L1: 'Request access to your personal data and obtain a copy;',
                sec9L2: 'Request rectification of inaccurate or incomplete data;',
                sec9L3: 'Request erasure of your data (“right to be forgotten”) where applicable;',
                sec9L4: 'Request restriction of processing in certain circumstances;',
                sec9L5: 'Object to processing based on our legitimate interests;',
                sec9L6:
                    'Receive your data in a structured, commonly used and machine-readable format and have it transmitted to another controller where technically feasible (data portability);',
                sec9L7:
                    'Withdraw consent at any time, where processing is based on consent, without affecting the lawfulness of processing prior to withdrawal;',
                sec9L8: 'Lodge a complaint with a competent data protection authority.',
                sec9P2:
                    'To exercise any of your rights, please contact our Data Protection Officer using the details provided above.',
                sec10Title: '10. Complaints',
                sec10P1:
                    'If you believe that your data protection rights have been violated, you may first contact our Data Protection Officer who is responsible for receiving and reviewing all complaints related to personal data processing. You also have the right to lodge a complaint with your local supervisory authority or any other competent data protection authority.',
                sec10DPO: 'Data Protection Officer',
                sec11Title: '11. Changes to This Notice',
                sec11P1:
                    'We may update this GDPR & Data Protection Notice from time to time to reflect changes in our practices, legal requirements or other operational reasons. The updated version will always be available on this page.',
                lastUpdated: 'Last updated: January 2025'
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
            subtitle: 'საქართველოს წამყვანი საკრუინგო სააგენტო | პროფესიული საზღვაო რეკრუტინგი',
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
                title: 'ჩვენს შესახებ',
                card1: {
                    title: 'საქართველოს წამყვანი საქრუინგო სააგენტო',
                    text:
                        'Ocean Line LLC არის პრემიუმ კლასის საზღვაო რეკრუიტინგის სააგენტო, რომელიც მდებარეობს ბათუმში. ჩვენ სპეციალიზებულები ვართ მაღალკვალიფიციური, STCW სერტიფიცირებული ქართველი მეზღვაურების შერჩევაში ტანკერების, ბულკერების, კონტეინერმზიდებისა და ზოგადი ტვირთის გემებისთვის მთელ მსოფლიოში.'
                },
                card2: {
                    title: 'პროფესიული სრულყოფილება',
                    text:
                        'ჩვენი ეკიპაჟის წევრები არიან კარგად მომზადებულები, საიმედონი და მზად არიან შეუერთდნენ თქვენს ფლოტს. ჩვენ სპეციალიზებულები ვართ ქართველი მეზღვაურების შერჩევასა და დასაქმებაში უცხოეთის დროშის ქვეშ მცურავ გემებზე.'
                },
                card3: {
                    title: 'გლობალური გამოცდილება',
                    text:
                        'ჩვენ გვაქვს ყველა რანგის კვალიფიციური ქართველი მეზღვაურების ვრცელი ბაზა. ყველა ჩვენი მეზღვაური სერტიფიცირებულია STCW კონვენციის სტანდარტების შესაბამისად.'
                },
                stats: {
                    certified: 'STCW სერტიფიცირებული',
                    support: '24/7 მხარდაჭერა',
                    network: 'გლობალური ქსელი',
                    vessels: 'გემის ტიპები'
                },
                goals: {
                    header: 'ჩვენი მიზანია კლიენტებს მივაწოდოთ კვალიფიციური მეზღვაურები შემდეგი გზით:',
                    goal1: {
                        title: 'გლობალური პოპულარიზაცია',
                        text: 'ჩვენი მაღალი ხარისხის ქართველი მეზღვაურების ქსელის პოპულარიზაცია მთელ მსოფლიოში.'
                    },
                    goal2: {
                        title: 'ინდუსტრიის ლიდერობა',
                        text:
                            'ქართული საზღვაო სექტორის საერთაშორისო დონეზე პოპულარიზაცია, რათა იგი გახდეს ახალი ეტალონი ჩვენი ქვეყნის სტრატეგიული პოზიციის გამოყენებით.'
                    },
                    goal3: {
                        title: 'კარიერული შესაძლებლობები',
                        text: 'ქართველი ოფიცრებისა და ეკიპაჟისთვის საუკეთესო სამუშაო გარემოს შექმნა.'
                    }
                },
                cert: {
                    title: 'სრულად სერტიფიცირებული და შესაბამისი',
                    text1:
                        'Ocean Line LLC ამაყობს, რომ ფლობს MLC 2006 და ISO სერტიფიკატებს. ჩვენი სერტიფიკატები ადასტურებს ჩვენს ერთგულებას საერთაშორისო საზღვაო სტანდარტებისა და ხარისხიანი მომსახურების მიმართ.',
                    text2:
                        'როგორც სერტიფიცირებული საზღვაო რეკრუიტინგის სააგენტო, ჩვენ გთავაზობთ პროფესიონალ და კომპეტენტურ ეკიპაჟის წევრებს, რაც უზრუნველყოფს საუკეთესო გადაწყვეტილებებს თქვენი გემებისთვის საერთაშორისო რეგულაციების სრული დაცვით.',
                    cta: 'ითანამშრომლეთ სერტიფიცირებულ სააგენტოსთან, რომელსაც ენდობით!'
                }
            },
            services: {
                title: 'ჩვენი სერვისები',
                card1: {
                    title: 'პროფესიონალური საზღვაო ეკიპაჟის რეკრუიტინგი',
                    text:
                        'ჩვენი საქრუინგო სააგენტო გთავაზობთ საზღვაო რეკრუიტინგის სრულყოფილ სერვისებს, ეკიპაჟის ყველა წევრის პერსონალურად შერჩევითა და შემოწმებით. ჩვენ ვამოწმებთ გამოცდილებას, კომპეტენციას, ჯანმრთელობის მდგომარეობასა და ინგლისური ენის ცოდნას. ყველა მეზღვაური ფლობს ვალიდურ სერტიფიკატებს IMO და STCW რეგულაციების შესაბამისად.'
                },
                card2: {
                    title: 'ეკიპაჟის მართვის სერვისები',
                    text:
                        'ჩვენ გთავაზობთ სერვისების სრულ სპექტრს მაღალი ხარისხის, პროფესიონალური ეკიპაჟის ეფექტური მართვისთვის, იქნება ეს კონკრეტული გემისთვის თუ მთელი ფლოტისთვის. ჩვენ ყოველთვის ვიცავთ პროფესიონალიზმისა და ქცევის უმაღლეს სტანდარტებს და განსაკუთრებულ ყურადღებას ვაქცევთ ჩვენი კლიენტების პრეფერენციებს.'
                },
                card3: {
                    title: 'სავიზო მომსახურება',
                    text:
                        'ჩვენ ვეხმარებით მეზღვაურებს სხვადასხვა სახის ვიზების მიღებაში, მათ შორის კონსულტაციებს ვუწევთ ყველა საჭირო დოკუმენტაციასთან დაკავშირებით. ჩვენ ვმუშაობთ ეკიპაჟის წევრებთან ყოველ ეტაპზე, მოთხოვნის დაწყებიდან ვიზის საბოლოო მიღებამდე.'
                },
                learnMore: 'გაიგეთ მეტი →'
            },
            vessels: {
                title: 'ჩვენ შეგვიძლია მივაწოდოთ საზღვაო სპეციალისტები შემდეგი ტიპის გემებისთვის:',
                bulk: 'ბულკერები',
                containers: 'კონტეინერმზიდები',
                tankers: 'ყველა ტიპის ტანკერი',
                passenger: 'სამგზავრო გემები',
                etc: 'და სხვა'
            },
            values: {
                title: 'ჩვენი ფასეულობები',
                intro:
                    'ჩვენი ფასეულობები უმნიშვნელოვანესია ჩვენი ყოველდღიური საქმიანობისთვის. ყოველი გადაწყვეტილება და შეხვედრა ჩვენს პარტნიორებთან მთელ მსოფლიოში უნდა ასახავდეს ამ კორპორატიულ პრინციპებს.',
                card1: {
                    title: 'კეთილსინდისიერება',
                    text:
                        'ჩვენს თანამშრომლებთან, მეზღვაურებთან და კლიენტებთან პატიოსნება Ocean Line LLC-ის უპირველესი ღირებულებაა. ჩვენ ვცდილობთ დავამყაროთ გრძელვადიანი ურთიერთობები ყველა ჩვენს პარტნიორთან ღია კომუნიკაციის, ნდობის მოპოვების, შეცდომების აღიარებისა და ამ შესაძლებლობების განვითარებისთვის გამოყენების გზით.'
                },
                card2: {
                    title: 'საიმედოობა',
                    text:
                        'Ocean Line LLC-ში შეგიძლიათ გქონდეთ ჩვენი იმედი, რომ ყოველთვის მოგაწვდით ხარისხიან შედეგებს. ჩვენ საკუთარ თავს და ჩვენს მეზღვაურებს მაღალ სტანდარტებს ვუყენებთ, რაც ემსახურება ჩვენს კლიენტებთან და პარტნიორებთან მყარი ურთიერთობების დამყარებას. ჩვენ პასუხისმგებელნი ვართ ერთმანეთის წინაშე და ვასრულებთ ჩვენს ვალდებულებებს.'
                },
                card3: {
                    title: 'გუნდური მუშაობა',
                    text:
                        'აქ ჩვენი გუნდი ყველაფერია. ჩვენ ერთად ვმუშაობთ, რათა ჩვენს კლიენტებს მივაწოდოთ სასურველი შედეგები და ხელი შევუწყოთ გუნდურობისა და თანამშრომლობის სულს. ჩვენი გუნდის წევრები ჩვენი უდიდესი აქტივია და თითოეულ მათგანს აქვს შესაძლებლობა მნიშვნელოვანი წვლილი შეიტანოს ჩვენს საქმიანობაში.'
                },
                card4: {
                    title: 'ენთუზიაზმი',
                    text:
                        'Ocean Line LLC დიდ სიამაყეს გრძნობს თავისი პარტნიორებისთვის იმ შედეგების მიწოდებით, რასაც ისინი იმსახურებენ, და სწორედ ეს ენთუზიაზმი გვამოძრავებს ჩვენ, როგორც კომპანიას. ეს ენერგია გვაიძულებს ყოველდღიურად დადებითი გავლენა მოვახდინოთ ჩვენი კლიენტების, თანამშრომლებისა და მეზღვაურების ცხოვრებაზე.'
                },
                card5: {
                    title: 'ინოვაცია',
                    text:
                        'ჩვენ ყოველთვის ვეძებთ ახალ გზებს ინოვაციებისთვის, სწავლისა და ზრდისთვის. ჩვენ მუდმივად ვიკვლევთ ახალ იდეებსა და კონცეფციებს, რათა ჩვენს კლიენტებს კიდევ უფრო უკეთესი შედეგები შევთავაზოთ.'
                },
                readMore: 'გაიგეთ მეტი →'
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
            },
            overview: {
                heading: 'ქართული საზღვაო გამოცდილების ლიდერი',
                lead:
                    'Ocean Line LLC არის ახლად დაფუძნებული, სრულად სერტიფიცირებული საქრუინგო სააგენტო ბათუმში, საქართველოს სტრატეგიულ პორტ ქალაქში. ჩვენ სპეციალიზირებულები ვართ საერთაშორისო გადაზიდვებისთვის მაღალი გამოცდილების მქონე ქართველ მეზღვაურებში.',
                p1:
                    'ჩვენი სააგენტო წარმოადგენს ქართული საზღვაო რესურსის საუკეთესო მხარეს – ვთავაზობთ კვალიფიციურ ეკიპაჟს ტანკერებისთვის, ბულკერისა და კონტეინერის ტიპის გემებისთვის, ასევე ზოგადი ტვირთის გემებისთვის. ეკიპაჟის თითოეული წევრი მომზადებულია, საიმედოა და მზადაა თქვენი ფლოტის უმაღლესი პროფესიონალიზმით მომსახურებისთვის.',
                p2:
                    'ჩვენ შევქმენით კვალიფიციური ქართველი მეზღვაურების ვრცელი ბაზა ყველა რანგისათვის. ჩვენი მეზღვაურები ფლობენ STCW კონვენციასთან შესაბამის სერტიფიკატებს და აქვთ მრავალწლიანი გამოცდილება სხვადასხვა ტიპის გემებზე, სხვადასხვა საერთაშორისო დროშის ქვეშ.'
            },
            story: {
                heading: 'ჩვენი ისტორია',
                p1:
                    'Ocean Line LLC დაფუძნდა საქართველოს საზღვაო დედაქალაქში ხედვით – ქართული საზღვაო გამოცდილების დაკავშირება გლობალურ შესაძლებლობებთან. ათწლეულების გამოცდილების მქონე დამფუძნებლებმა დაინახეს ქართველი მეზღვაურების დიდი პოტენციალი და უნიკალური უნარები.',
                p2:
                    'რაც დაიწყო როგორც ადგილობრივი ინიციატივა, გაიზარდა საზღვაო რეკრუიტინგის სანდო საერთაშორისო პარტნიორად. ჩვენ წარმატებით დავასაქმეთ ქართველი ოფიცრები და ეკიპაჟის წევრები გემებზე, რომლებიც მოძრაობენ ყველა ძირითად საზღვაო მარშრუტზე.',
                p3:
                    'დღეს Ocean Line LLC წარმოადგენს ქართული საზღვაო სრულყოფილების დასტურს, აკავშირებს კვალიფიციურ მეზღვაურებს კარიერულ შესაძლებლობებთან, ხოლო გემთმფლობელებს აწვდის საიმედო ეკიპაჟს.',
                feature1: {
                    title: 'სტრატეგიული მდებარეობა',
                    text: 'ბაზირებული ბათუმში, საქართველო - ევროპისა და აზიის დამაკავშირებელი ძირითადი საზღვაო ჰაბი'
                },
                feature2: {
                    title: 'ექსპერტთა გუნდი',
                    text: 'ინდუსტრიის ვეტერანები საზღვაო ოპერაციებისა და ეკიპაჟის მართვის ღრმა ცოდნით'
                },
                feature3: {
                    title: 'გლობალური მასშტაბი',
                    text: 'ქართული ნიჭის დაკავშირება საერთაშორისო შესაძლებლობებთან მთელ მსოფლიოში'
                }
            },
            mission: {
                title: 'ჩვენი მისია',
                text:
                    'გამოვიყენოთ ჩვენი გამოცდილება ქართველი მეზღვაურების საერთაშორისო დონეზე დასაქმებისთვის, უზრუნველვყოთ პროფესიონალიზმის, უსაფრთხოებისა და შესაბამისობის უმაღლესი სტანდარტები.'
            },
            vision: {
                title: 'ჩვენი ხედვა',
                text:
                    'გავხდეთ საქართველოს წამყვანი საქრუინგო სააგენტო, რომელიც აღიარებულია გლობალურად სრულყოფილების, ინოვაციებისა და საზღვაო პერსონალის პროფესიული განვითარების გამო.'
            },
            commitment: {
                title: 'ჩვენი ვალდებულება',
                text:
                    'ჩვენ ორიენტირებულნი ვართ ჩვენს კლიენტებთან და ეკიპაჟის წევრებთან გრძელვადიანი პარტნიორობის ჩამოყალიბებაზე, გამჭვირვალე კომუნიკაციისა და ეთიკური პრაქტიკის მეშვეობით.'
            },
            differentiators: {
                title: 'რა განგვასხვავებს ჩვენ',
                diff1: {
                    title: 'სრული სერტიფიცირება',
                    text:
                        'ჩვენ სრულად ვართ სერტიფიცირებული MLC 2006 და ISO სტანდარტებით, რაც უზრუნველყოფს ყველა საერთაშორისო საზღვაო რეგულაციის დაცვას.'
                },
                diff2: {
                    title: 'ხარისხის გარანტია',
                    text:
                        'ეკიპაჟის თითოეული წევრი გადის მკაცრ შერჩევას, მათ შორის გამოცდილების ვერიფიკაციას და კომპეტენციის შეფასებას.'
                },
                diff3: {
                    title: 'პერსონალიზებული მომსახურება',
                    text:
                        'ჩვენ ვთავაზობთ ინდივიდუალურ გადაწყვეტილებებს თითოეული კლიენტისთვის, მათი სპეციფიკური მოთხოვნების გათვალისწინებით.'
                },
                diff4: {
                    title: 'სწრაფი რეაგირება',
                    text: 'ჩვენი ეფექტური პროცესები უზრუნველყოფს ეკიპაჟის სწრაფ შერჩევას და დაუყოვნებელ მხარდაჭერას.'
                },
                diff5: {
                    title: 'საერთაშორისო გამოცდილება',
                    text: 'ჩვენს მეზღვაურებს აქვთ მრავალწლიანი გამოცდილება სხვადასხვა ტიპის გემებზე საერთაშორისო დროშების ქვეშ.'
                },
                diff6: {
                    title: '24/7 მხარდაჭერა',
                    text: 'სადღეღამისო დახმარება ეკიპაჟის კეთილდღეობისთვის და საოპერაციო საჭიროებებისთვის.'
                }
            },
            goals: {
                title: 'ჩვენი სტრატეგიული მიზნები',
                intro:
                    'ჩვენი მიზანია კვალიფიციური მეზღვაურების მიწოდება სტრატეგიული ინიციატივების მეშვეობით, რაც ხელს უწყობს ქართული საზღვაო სექტორის ზრდას.'
            },
            bribe: {
                title: 'ანტიკორუფციული პოლიტიკა',
                text:
                    'Ocean Line LLC ინარჩუნებს ნულოვან ტოლერანტობას კორუფციისა და ქრთამის მიმართ. ჩვენ ვმუშაობთ უმაღლესი ეთიკური სტანდარტების დაცვით.',
                commitmentTitle: 'ჩვენი ვალდებულება მოიცავს:',
                item1: 'არანაირი არაოფიციალური გადახდები ნებისმიერი ფორმით',
                item2: 'გამჭვირვალე რეკრუიტინგის პროცესი, რომელიც დაფუძნებულია მხოლოდ კვალიფიკაციაზე',
                item3: 'სამართლიანი და თანაბარი მოპყრობა ყველა მეზღვაურისა და კლიენტის მიმართ',
                item4: 'საერთაშორისო ანტიკორუფციო კანონმდებლობის სრული დაცვა',
                item5: 'პერსონალის რეგულარული ტრენინგი და ინფორმირებულობა',
                item6: 'ნებისმიერი ეჭვის შემთხვევაში შეტყობინების მკაფიო მექანიზმები',
                highlight: 'ჩვენ გვჯერა, რომ ეთიკური ბიზნესი არის საზღვაო ინდუსტრიაში წარმატების საფუძველი.'
            },
            cta: {
                title: 'მზად ხართ ჩვენთან თანამშრომლობისთვის?',
                text: 'გაიგეთ, როგორ შეუძლია Ocean Line LLC-ს უზრუნველყოს თქვენი გემები კვალიფიციური ეკიპაჟით.',
                secondary: 'ჩვენი სერვისები'
            }
        },
        services: {
            page: {
                title: 'ჩვენი სერვისები',
                subtitle: 'გაერთიანებული საზღვაო ეკიპაჟის გადაწყვეტილებები'
            },
            recruitment: {
                heading: 'კვალიფიციური ეკიპაჟის შერჩევა და რეკრუტინგი',
                tagline: 'იდეალური საზღვაო გუნდის შექმნა თქვენი ფლოტისთვის',
                intro:
                    'Ocean Line LLC‑ში გვესმის, რომ ნებისმიერი საზღვაო ოპერაციის წარმატება სწორ ეკიპაჟზეა დამოკიდებული. ჩვენი ყოვლისმომცველი რეკრუტინგის სერვისი უზრუნველყოფს, რომ თითოეული საზღვაო სპეციალისტი, რომელსაც გირჩევთ, აკმაყოფილებდეს კომპეტენციის, გამოცდილებისა და პროფესიონალიზმის უმაღლეს სტანდარტებს.',
                processTitle: 'ჩვენი შერჩევის პროცესი',
                features: {
                    f1: {
                        title: 'მკაცრი შერჩევა',
                        text:
                            'თითოეული განმცხადებელი გადის საფუძვლიან შემოწმებას, დოკუმენტების ვერიფიკაციას და კომპეტენციის შეფასებას საერთაშორისო საზღვაო სტანდარტებთან შესაბამისობის უზრუნველსაყოფად.'
                    },
                    f2: {
                        title: 'კვალიფიკაციის ვერიფიკაცია',
                        text:
                            'ჩვენ ვამოწმებთ ყველა სერტიფიკატს, ლიცენზიასა და უფლებამოსილებას STCW კონვენციისა და IMO რეგულაციების შესაბამისად.'
                    },
                    f3: {
                        title: 'ფიზიკური მდგომარეობის შეფასება',
                        text:
                            'ეკიპაჟის ყველა წევრი გადის სამედიცინო შემოწმებას, რათა დავრწმუნდეთ მათ ფიზიკურ და ფსიქიკურ მზადყოფნაში საზღვაო სამსახურისთვის.'
                    },
                    f4: {
                        title: 'ინგლისური ენის ცოდნა',
                        text:
                            'ჩვენ ვაფასებთ ინგლისური ენის ცოდნას, რათა უზრუნველვყოთ ეფექტური კომუნიკაცია საერთაშორისო გემებზე უსაფრთხოების მიზნით.'
                    },
                    f5: {
                        title: 'გამოცდილების შემოწმება',
                        text:
                            'ჩვენ განვიხილავთ ნაოსნობისა და წინა სამუშაო გამოცდილებას, რათა შევარჩიოთ თქვენი გემის მოთხოვნებთან შესაბამისი პერსონალი.'
                    },
                    f6: {
                        title: 'გამგზავრებისწინა მომზადება',
                        text:
                            'შერჩეული ეკიპაჟის წევრები გადიან დეტალურ ინსტრუქტაჟს გემის სპეციფიკაციების, კომპანიის პოლიტიკისა და მოთხოვნების შესახებ.'
                    }
                },
                highlights: {
                    title: 'რატომ უნდა აირჩიოთ ჩვენი რეკრუიტინგის სერვისი?',
                    item1: 'წვდომა ყველა რანგის კვალიფიციური ქართველი მეზღვაურების ვრცელ ბაზასთან',
                    item2: 'ყველა მეზღვაური ფლობს ვალიდურ სერტიფიკატებს STCW და IMO მოთხოვნების შესაბამისად',
                    item3: 'დადასტურებული გამოცდილება სხვადასხვა ტიპის გემებზე და საერთაშორისო დროშების ქვეშ',
                    item4: 'სწრაფი რეაგირება ეკიპაჟის სასწრაფო შერჩევის საჭიროებისას',
                    item5: 'კონკურენტული ტარიფები გამჭვირვალე ფასწარმოქმნით',
                    item6: '24/7 მხარდაჭერა ეკიპაჟის განთავსებისა და გადაუდებელი შეცვლისთვის'
                }
            },
            management: {
                title: 'ეკიპაჟის მართვის სერვისები',
                tagline: 'საზღვაო პერსონალის მართვის სრული გადაწყვეტილებები',
                intro:
                    'ჩვენი ეკიპაჟის მართვის სერვისები სცილდება უბრალო დასაქმებას. ჩვენ ვთავაზობთ სრულ მხარდაჭერას, რათა თქვენმა ეკიპაჟმა იმუშაოს მაქსიმალური ეფექტურობით.',
                features: {
                    title: 'მართვის სრული გადაწყვეტილებები',
                    f1: {
                        title: 'დაგეგმვა და როტაცია',
                        text:
                            'ეკიპაჟის როტაციების სტრატეგიული დაგეგმვა უწყვეტი მუშაობის უზრუნველსაყოფად და ოპერაციული შეფერხებების შესამცირებლად.'
                    },
                    f2: {
                        title: 'დოკუმენტაციის მართვა',
                        text:
                            'ეკიპაჟის ყველა დოკუმენტის, სერტიფიკატისა და ლიცენზიის მართვა, განახლების ვადების კონტროლი და დამუშავება.'
                    },
                    f3: {
                        title: 'სახელფასო ადმინისტრირება',
                        text: 'ხელფასების ეფექტური გაცემა, საგადასახადო დოკუმენტაცია და ფინანსური აღრიცხვა ეკიპაჟის წევრებისთვის.'
                    },
                    f4: {
                        title: 'ტრენინგი და განვითარება',
                        text:
                            'სავალდებულო ტრენინგების კოორდინაცია, კვალიფიკაციის ამაღლება და პროფესიული განვითარების პროგრამები.'
                    },
                    f5: {
                        title: 'სამედიცინო მხარდაჭერა',
                        text: 'გამგზავრებისწინა სამედიცინო შემოწმების ორგანიზება, ჯანმრთელობის დაზღვევა და საჭიროების შემთხვევაში რეპატრიაცია.'
                    },
                    f6: {
                        title: '24/7 მხარდაჭერა',
                        text: 'სადღეღამისო დახმარება ეკიპაჟის კეთილდღეობის, საგანგებო სიტუაციებისა და საოპერაციო საჭიროებებისთვის.'
                    }
                },
                highlights: {
                    title: 'მართვის ჩვენი მიდგომა',
                    item1: 'პერსონალიზებული მომსახურება თქვენი გემისა და ოპერაციული მოთხოვნების შესაბამისად',
                    item2: 'პროაქტიული კომუნიკაცია გემის კაპიტნებთან და მენეჯმენტთან',
                    item3: 'მუშაობის რეგულარული შეფასება და უკუკავშირის მექანიზმები',
                    item4: 'კონფლიქტების მოგვარება და ეკიპაჟის კეთილდღეობაზე ზრუნვა',
                    item5: 'საერთაშორისო საზღვაო რეგულაციებთან შესაბამისობის მონიტორინგი',
                    item6: 'ხარჯთეფექტური გადაწყვეტილებები ხარისხის სტანდარტების დაცვით',
                    item7: 'მოქნილი კონტრაქტები ერთი გემისთვის ან მთელი ფლოტისთვის'
                }
            },
            visa: {
                title: 'სავიზო მომსახურება',
                tagline: 'მოგზაურობის დოკუმენტაციის შეუფერხებელი მხარდაჭერა',
                intro:
                    'საერთაშორისო სავიზო მოთხოვნების დაცვა შეიძლება იყოს რთული და შრომატევადი. ჩვენი გუნდი უზრუნველყოფს ყველა საჭირო დოკუმენტაციის მომზადებას მეზღვაურებისთვის.',
                features: {
                    title: 'სავიზო მხარდაჭერა',
                    f1: {
                        title: 'გლობალური სავიზო მომსახურება',
                        text:
                            'დახმარება ვიზების მიღებაში ყველა ძირითადი იურისდიქციისთვის, მათ შორის შენგენი, აშშ, დიდი ბრიტანეთი და ავსტრალია.'
                    },
                    f2: {
                        title: 'დოკუმენტების მომზადება',
                        text: 'სავიზო განაცხადის ფორმების, თანმხლები დოკუმენტებისა და მოწვევის წერილების სრული მომზადება.'
                    },
                    f3: {
                        title: 'კომუნიკაცია საელჩოებთან',
                        text: 'პირდაპირი კავშირი საელჩოებთან და საკონსულოებთან პროცესის დასაჩქარებლად.'
                    },
                    f4: {
                        title: 'სასწრაფო მომსახურება',
                        text: 'ვიზების დაჩქარებული დამუშავება ეკიპაჟის გადაუდებელი შეცვლის საჭიროებისას.'
                    },
                    f5: {
                        title: 'ვიზების განახლება',
                        text: 'ვიზის ვადების პროაქტიული მონიტორინგი და დროული განახლება შეფერხებების თავიდან ასაცილებლად.'
                    },
                    f6: {
                        title: 'მეზღვაურის დოკუმენტაცია',
                        text: 'დახმარება მეზღვაურის წიგნაკის, სერტიფიკატებისა და სხვა საჭირო სამგზავრო დოკუმენტების მიღებაში.'
                    }
                },
                highlights: {
                    title: 'სავიზო მომსახურების უპირატესობები',
                    item1: 'სხვადასხვა ქვეყნის სავიზო მოთხოვნების ღრმა ცოდნა',
                    item2: 'ჩამოყალიბებული ურთიერთობები საელჩოებთან და საკონსულოებთან',
                    item3: 'პროცესის სრული მართვა განაცხადიდან ვიზის მიღებამდე',
                    item4: 'რეგულარული განახლებები განაცხადის სტატუსის შესახებ',
                    item5: 'ინსტრუქტაჟი გასაუბრებისთვის მზადების პროცესში',
                    item6: 'პრობლემების მოგვარება უარყოფილ ან დაგვიანებულ განაცხადებზე',
                    item7: 'კონსულტაციები ტრანზიტულ ვიზებზე ეკიპაჟის შეცვლისას',
                    item8: 'მოგზაურობისა და ლოჯისტიკის კოორდინაციის მხარდაჭერა'
                }
            },
            vessels: {
                title: 'გემების ტიპები, რომლებსაც ვემსახურებით',
                intro: 'ჩვენი გამოცდილი მეზღვაურები კვალიფიცირებულნი არიან სხვადასხვა ტიპის გემებზე მუშაობისთვის',
                bulk: {
                    title: 'ბულკერები',
                    text: 'გამოცდილი ეკიპაჟი ყველა ზომის ბულკერისთვის, Handysize-დან Capesize-მდე.'
                },
                container: {
                    title: 'კონტეინერმზიდები',
                    text: 'კვალიფიციური პერსონალი ყველა კლასიფიკაციის კონტეინერმზიდისთვის.'
                },
                tanker: {
                    title: 'ტანკერები',
                    text: 'სპეციალიზებული ეკიპაჟი ნავთობის, ქიმიური და გაზის ტანკერებისთვის საჭირო სერტიფიკატებით.'
                },
                passenger: {
                    title: 'სამგზავრო გემები',
                    text: 'პროფესიონალი ეკიპაჟის წევრები საკრუიზო გემებისა და ბორნებისთვის.'
                },
                general: {
                    title: 'ზოგადი ტვირთი',
                    text: 'მრავალმხრივი ეკიპაჟის წევრები ზოგადი და მრავალფუნქციური გემებისთვის.'
                },
                more: {
                    title: 'და სხვა',
                    text: 'მათ შორის ოფშორული გემები, RoRo, რეფერები და სხვა სპეციალიზებული გემები.'
                }
            },
            apply: {
                title: 'შეუერთდით ჩვენს ბაზას',
                text:
                    'ხართ კვალიფიციური ქართველი მეზღვაური და ეძებთ საერთაშორისო შესაძლებლობებს? ჩვენ მუდმივად ვეძებთ პროფესიონალებს ყველა რანგისთვის.',
                btn: 'გამოაგზავნეთ განაცხადი'
            },
            cta: {
                title: 'მზად ხართ საუკეთესო ეკიპაჟის შესაქმნელად?',
                text: 'დაგვიკავშირდით დღესვე თქვენი მოთხოვნების განსახილველად.',
                secondary: 'გაიგეთ მეტი ჩვენს შესახებ'
            }
        },
        values: {
            page: {
                title: 'ჩვენი ფასეულობები',
                subtitle: 'პრინციპები, რომლებიც ჩვენს ყველა ნაბიჯს მართავს'
            },
            intro: {
                heading: 'ჩვენი საფუძველი',
                p1:
                    'Ocean Line LLC‑ში ჩვენი ფასეულობები მხოლოდ სიტყვები არაა – ისინი პრინციპებია, რომლებიც განსაზღვრავს თითოეულ გადაწყვეტილებას, ურთიერთობას და მომსახურებას. ეს ხუთი ძირითადი ღირებულება ქმნის ჩვენი კომპანიის იდენტობას და უზრუნველყოფს მაღალ სტანდარტებს საზღვაო რეკრუტინგში.',
                p2:
                    'ეს ფასეულობები უმნიშვნელოვანესია ჩვენი ყოველდღიური საქმიანობისთვის. ყოველი შეხვედრა და კომუნიკაცია ჩვენს პარტნიორებთან მთელ მსოფლიოში უნდა ასახავდეს ამ კორპორატიულ პრინციპებს.'
            }
        },
        gallery: {
            page: {
                title: 'გალერეა',
                subtitle: 'ჩვენი ფლოტი მოქმედებაში'
            },
            intro: {
                title: 'საზღვაო ოპერაციები მოქმედებაში',
                text: 'ნახეთ ჩვენი პროფესიონალური ეკიპაჟისა და გემის ოპერაციები. გაეცანით იმ თავდადებასა და გამოცდილებას, რომელიც განსაზღვრავს Ocean Line LLC-ს.'
            },
            videos: {
                title: 'საზღვაო ვიდეოები',
                v1: {
                    title: 'საზღვაო ოპერაციები',
                    text: 'პროფესიონალური ეკიპაჟის ოპერაციები და გემის მართვა'
                },
                v2: {
                    title: 'Ocean Line-ის ოპერაციები',
                    text: 'ჩვენი საზღვაო სერვისების კულისებს მიღმა'
                }
            }
        },
        legal: {
            disclaimer: {
                title: 'პასუხისმგებლობის შეზღუდვა',
                subtitle: 'მნიშვნელოვანი ინფორმაცია ჩვენი სერვისების შესახებ',
                secTitle: 'საზღვაო ეკიპაჟის მომსახურების პასუხისმგებლობის შეზღუდვა',
                secIntro:
                    'Ocean Line LLC საზღვაო ეკიპაჟის დაკომპლექტების მომსახურებას ეწევა, როგორც რეკრუიტირების სააგენტო. გთხოვთ, ყურადღებით წაიკითხოთ პასუხისმგებლობის შეზღუდვის პირობები ჩვენი სერვისებით სარგებლობამდე.',
                sec1Title: '1. მომსახურების სფერო',
                sec1Text:
                    'Ocean Line LLC მოქმედებს როგორც შუამავალი გემთმფლობელებს/ოპერატორებსა და კვალიფიციურ მეზღვაურებს შორის. ჩვენ ხელს ვუწყობთ საზღვაო პერსონალის შერჩევას, განთავსებასა და მართვას, მაგრამ უშუალოდ არ ვასაქმებთ მეზღვაურებს და არ ვმართავთ გემებს.',
                sec2Title: '2. სერტიფიცირება და შესაბამისობა',
                sec2Text:
                    'მიუხედავად იმისა, რომ ჩვენ უზრუნველვყოფთ ყველა რეკომენდებული ეკიპაჟის წევრის STCW სერტიფიკატების ვალიდურობასა და ინდუსტრიის სტანდარტებთან შესაბამისობას, გემის შესაბამისობაზე, უსაფრთხოებასა და ოპერაციებზე საბოლოო პასუხისმგებლობა ეკისრება გემთმფლობელს/ოპერატორს და გემის კაპიტანს.',
                sec3Title: '3. პასუხისმგებლობის შეზღუდვა',
                sec3Text:
                    'Ocean Line LLC-ის პასუხისმგებლობა შემოიფარგლება მხოლოდ ჩვენი რეკრუიტირების მომსახურებით. ჩვენ არ ვართ პასუხისმგებელნი:',
                sec3L1: 'გემზე განთავსებული ეკიპაჟის წევრების ქმედებებსა თუ ქცევაზე',
                sec3L2: 'გემის ოპერაციებზე, უსაფრთხოებაზე ან მუშაობაზე',
                sec3L3: 'საერთაშორისო საზღვაო რეგულაციების ცვლილებებზე',
                sec3L4: 'სავიზო პროცესის ან მგზავრობის დაგვიანებაზე',
                sec3L5: 'სამედიცინო მდგომარეობაზე, რომელიც განვითარდება დასაქმების შემდეგ',
                sec3L6: 'პოლიტიკურ ან ეკონომიკურ ფაქტორებზე, რომლებიც გავლენას ახდენს ნაოსნობაზე',
                sec4Title: '4. ვიზა და მგზავრობა',
                sec4Text:
                    'ჩვენ ვეხმარებით მეზღვაურებს სავიზო განაცხადებისა და მგზავრობის ორგანიზებაში, თუმცა ვერ გავცემთ ვიზის მიღების გარანტიას. სავიზო გადაწყვეტილებებს იღებენ შესაბამისი სამთავრობო ორგანოები. მგზავრობის შეზღუდვები და მოთხოვნები შეიძლება შეიცვალოს გაფრთხილების გარეშე.',
                sec5Title: '5. დასაქმების პირობები',
                sec5Text:
                    'დასაქმების პირობები, მათ შორის ხელფასი, სამუშაო გარემო და კონტრაქტის ხანგრძლივობა, თანხმდება უშუალოდ მეზღვაურსა და გემთმფლობელს/ოპერატორს შორის. Ocean Line LLC ხელს უწყობს ამ პროცესს, მაგრამ ვერ იძლევა კონკრეტული დასაქმების პირობების გარანტიას.',
                sec6Title: '6. მარეგულირებელი შესაბამისობა',
                sec6Text:
                    'საზღვაო რეგულაციები განსხვავდება იურისდიქციისა და გემის ტიპის მიხედვით. მიუხედავად იმისა, რომ ჩვენ თვალყურს ვადევნებთ ძირითად საერთაშორისო სტანდარტებს, კლიენტებმა უნდა უზრუნველყონ ყველა მოქმედი კანონის დაცვა მათი საქმიანობის სფეროში.',
                sec7Title: '7. ინფორმაციის სიზუსტე',
                sec7Text:
                    'ჩვენ ვცდილობთ მოგაწოდოთ ზუსტი ინფორმაცია ეკიპაჟის კვალიფიკაციისა და ხელმისაწვდომობის შესახებ. თუმცა, ინფორმაცია შეიძლება შეიცვალოს და ჩვენ გირჩევთ ყველა დეტალის გადამოწმებას საბოლოო გადაწყვეტილების მიღებამდე.',
                sec8Title: '8. ფორსმაჟორი',
                sec8Text:
                    'Ocean Line LLC არ არის პასუხისმგებელი დაგვიანებაზე ან შეუსრულებლობაზე, რომელიც გამოწვეულია ჩვენი კონტროლის მიღმა არსებული გარემოებებით, მათ შორის, ბუნებრივი კატასტროფებით, პანდემიებით, პოლიტიკური არეულობით ან სამთავრობო ქმედებებით.',
                sec9Title: '9. პროფესიული რჩევა',
                sec9Text:
                    'ეს ვებ-გვერდი და ჩვენი სერვისები მოგაწვდით ზოგად ინფორმაციას. საზღვაო ოპერაციებთან დაკავშირებული კონკრეტული იურიდიული, ფინანსური ან ტექნიკური რჩევისთვის, მიმართეთ შესაბამისი სფეროს კვალიფიციურ პროფესიონალებს.',
                sec10Title: '10. საკონტაქტო ინფორმაცია',
                sec10Text: 'ამ პასუხისმგებლობის შეზღუდვასთან ან ჩვენს სერვისებთან დაკავშირებული კითხვებისთვის:',
                lastUpdated: 'ბოლო განახლება: იანვარი 2025'
            },
            terms: {
                title: 'მომსახურების პირობები',
                subtitle: 'წესები და პირობები',
                secTitle: 'საზღვაო ეკიპაჟის მომსახურების წესები და პირობები',
                secIntro:
                    'ეს წესები და პირობები არეგულირებს Ocean Line LLC-ის საზღვაო ეკიპაჟის მომსახურებით სარგებლობას. ჩვენი სერვისების გამოყენებით თქვენ ეთანხმებით ამ პირობებს.',
                sec1Title: '1. მომსახურების ხელშეკრულება',
                sec1Text:
                    'Ocean Line LLC ეწევა საზღვაო ეკიპაჟის მომსახურებას, რაც მოიცავს, მაგრამ არ შემოიფარგლება ეკიპაჟის რეკრუიტირებით, განთავსებით, მართვითა და სავიზო მხარდაჭერით. მომსახურება ხორციელდება ამ პირობებისა და კლიენტებთან დადებული კონკრეტული ხელშეკრულებების საფუძველზე.',
                sec2Title: '2. კლიენტის ვალდებულებები',
                sec2Text: 'კლიენტები თანხმდებიან:',
                sec2L1: 'მოგვაწოდონ ზუსტი ინფორმაცია გემის მოთხოვნებისა და საოპერაციო პირობების შესახებ',
                sec2L2: 'დაიცვან ყველა მოქმედი საზღვაო კანონი და რეგულაცია',
                sec2L3: 'უზრუნველყონ ეკიპაჟის წევრების სათანადო დაზღვევა',
                sec2L4: 'უზრუნველყონ უსაფრთხო სამუშაო პირობები და ადეკვატური მომარაგება',
                sec2L5: 'კეთილსინდისიერად შეასრულონ დასაქმების კონტრაქტები და გადახდის ვალდებულებები',
                sec2L6: 'დაუყოვნებლივ შეგვატყობინონ ნებისმიერი პრობლემის ან მოთხოვნების ცვლილების შესახებ',
                sec3Title: '3. მეზღვაურის ვალდებულებები',
                sec3Text: 'მეზღვაურები თანხმდებიან:',
                sec3L1: 'ჰქონდეთ ვალიდური სერტიფიკატები და იყვნენ სამედიცინოდ ვარგისნი',
                sec3L2: 'შეასრულონ მოვალეობები კომპეტენტურად და პროფესიონალურად',
                sec3L3: 'დაიცვან გემის წესები და საერთაშორისო საზღვაო სამართალი',
                sec3L4: 'გამოცხადდნენ სამსახურში დადგენილ დროს',
                sec3L5: 'მოგვაწოდონ ზუსტი ინფორმაცია კვალიფიკაციისა და გამოცდილების შესახებ',
                sec3L6: 'დაიცვან უსაფრთხოების პროცედურები და საგანგებო სიტუაციების პროტოკოლები',
                sec4Title: '4. მოსაკრებლები და გადახდები',
                sec4Text: 'მომსახურების საფასური განისაზღვრება ინდივიდუალური კონტრაქტებით. გადახდის პირობები ჩვეულებრივ მოიცავს:',
                sec4L1: 'რეკრუიტირების საფასური, რომელიც გადაიხდება წარმატებული განთავსების შემდეგ',
                sec4L2: 'მართვის საფასური ეკიპაჟის მიმდინარე მხარდაჭერისთვის',
                sec4L3: 'დამატებითი ხარჯები სავიზო დამუშავებისა და მგზავრობის ორგანიზებისთვის',
                sec4L4: 'დაგვიანებული გადახდის საფასური შეიძლება დაწესდეს ვადაგადაცილებულ ანგარიშებზე',
                sec5Title: '5. გაუქმება და ანაზღაურება',
                sec5Text: 'გაუქმების პოლიტიკა განსხვავდება მომსახურების ტიპის მიხედვით. ზოგადად:',
                sec5L1: 'რეკრუიტირების საფასური არ ბრუნდება განთავსების დადასტურების შემდეგ',
                sec5L2: 'სავიზო მოსაკრებელი შეიძლება ნაწილობრივ დაბრუნდეს, თუ დამუშავება ჯერ არ დაწყებულა',
                sec5L3: 'მართვის საფასური იანგარიშება მომსახურების გაწევის ხანგრძლივობის მიხედვით',
                sec6Title: '6. კონფიდენციალურობა',
                sec6Text:
                    'ორივე მხარე თანხმდება დაიცვას სენსიტიური ინფორმაციის კონფიდენციალურობა, რაც მოიცავს გემის დეტალებს, ეკიპაჟის პერსონალურ მონაცემებსა და ბიზნეს ოპერაციებს.',
                sec7Title: '7. შესაბამისობა და რეგულაციები',
                sec7Text: 'ყველა მხარემ უნდა დაიცვას:',
                sec7L1: 'საერთაშორისო საზღვაო ორგანიზაციის (IMO) რეგულაციები',
                sec7L2: 'საზღვაო შრომის კონვენცია (MLC) 2006',
                sec7L3: 'STCW კონვენციის მოთხოვნები',
                sec7L4: 'ადგილობრივი და საერთაშორისო საიმიგრაციო კანონები',
                sec7L5: 'ანტიდისკრიმინაციული და თანაბარი შესაძლებლობების კანონები',
                sec8Title: '8. დავების გადაწყვეტა',
                sec8Text: 'დავები გადაწყდება:',
                sec8L1: 'მხარეებს შორის პირდაპირი მოლაპარაკებების გზით',
                sec8L2: 'მედიაციით, თუ მოლაპარაკება ვერ შედგება',
                sec8L3: 'არბიტრაჟით საქართველოს კანონმდებლობის შესაბამისად, თუ მედიაცია ვერ გადაწყვეტს დავას',
                sec8L4: 'სამართლებრივი ქმედებით, როგორც უკანასკნელი საშუალებით',
                sec9Title: '9. ფორსმაჟორი',
                sec9Text:
                    'არცერთი მხარე არ არის პასუხისმგებელი დაგვიანებაზე ან შეუსრულებლობაზე, რომელიც გამოწვეულია ჩვენი კონტროლის მიღმა არსებული გარემოებებით, მათ შორის, ბუნებრივი კატასტროფებით, პანდემიებით, სამთავრობო ქმედებებით ან შრომითი დავებით.',
                sec10Title: '10. ცვლილებები',
                sec10Text:
                    'ეს პირობები შეიძლება შეიცვალოს ნებისმიერ დროს. მომსახურების გაგრძელება ნიშნავს შეცვლილი პირობების მიღებას.',
                sec11Title: '11. საკონტაქტო ინფორმაცია',
                sec11Text: 'ამ პირობებთან დაკავშირებული კითხვებისთვის:',
                lastUpdated: 'ბოლო განახლება: იანვარი 2025'
            },
            privacy: {
                title: 'კონფიდენციალურობის პოლიტიკა',
                subtitle: 'თქვენი კონფიდენციალურობა ჩვენთვის მნიშვნელოვანია',
                sec1Title: '1. ინფორმაცია, რომელსაც ვაგროვებთ',
                sec1Intro:
                    'Ocean Line LLC აგროვებს პერსონალურ ინფორმაციას მეზღვაურებისგან, გემთმფლობელებისგან და სხვა კლიენტებისგან საზღვაო ეკიპაჟის მომსახურების მისაწოდებლად. ეს შეიძლება მოიცავდეს:',
                sec1L1: 'პერსონალური საიდენტიფიკაციო ინფორმაცია (სახელი, დაბადების თარიღი, პასპორტის მონაცემები)',
                sec1L2: 'საზღვაო სერტიფიკატები და კვალიფიკაცია (STCW, სამედიცინო სერტიფიკატები)',
                sec1L3: 'სამუშაო გამოცდილება და რეკომენდაციები',
                sec1L4: 'საკონტაქტო ინფორმაცია (ელ-ფოსტა, ტელეფონი, მისამართი)',
                sec1L5: 'სავიზო და სამგზავრო დოკუმენტაცია',
                sec1L6: 'საბანკო ინფორმაცია ხელფასის გადახდისთვის',
                sec2Title: '2. როგორ ვიყენებთ თქვენს ინფორმაციას',
                sec2Intro: 'ჩვენ ვიყენებთ შეგროვებულ ინფორმაციას:',
                sec2L1: 'ეკიპაჟის დაკომპლექტებისა და რეკრუიტირების მომსახურების მისაწოდებლად',
                sec2L2: 'სავიზო განაცხადებისა და მგზავრობის ორგანიზებისთვის',
                sec2L3: 'სამუშაო შესაძლებლობებისა და ვაკანსიების შესახებ კომუნიკაციისთვის',
                sec2L4: 'საზღვაო რეგულაციებთან შესაბამისობის შესანარჩუნებლად',
                sec2L5: 'გადახდების დასამუშავებლად და ფინანსური ჩანაწერების საწარმოებლად',
                sec2L6: 'მიმდინარე მხარდაჭერისა და დახმარების მისაწოდებლად',
                sec3Title: '3. ინფორმაციის გაზიარება',
                sec3Intro: 'ჩვენ შეიძლება გავუზიაროთ თქვენი ინფორმაცია:',
                sec3L1: 'გემთმფლობელებსა და ოპერატორებს ეკიპაჟის განთავსებისთვის',
                sec3L2: 'სამთავრობო ორგანოებს სავიზო და საიმიგრაციო მიზნებისთვის',
                sec3L3: 'საზღვაო ორგანოებს სერტიფიკატების ვერიფიკაციისთვის',
                sec3L4: 'სამედიცინო დაწესებულებებს ჯანმრთელობის შეფასებისთვის',
                sec3L5: 'იურიდიულ და მარეგულირებელ ორგანოებს კანონით მოთხოვნილ შემთხვევებში',
                sec4Title: '4. მონაცემთა უსაფრთხოება',
                sec4Text:
                    'ჩვენ ვახორციელებთ უსაფრთხოების შესაბამის ზომებს თქვენი პერსონალური ინფორმაციის უნებართვო წვდომისგან, შეცვლისგან, გამჟღავნებისგან ან განადგურებისგან დასაცავად. ყველა მონაცემი ინახება უსაფრთხოდ და მასზე წვდომა აქვთ მხოლოდ უფლებამოსილ პერსონალს.',
                sec5Title: '5. თქვენი უფლებები',
                sec5Intro: 'თქვენ გაქვთ უფლება:',
                sec5L1: 'მიიღოთ წვდომა თქვენს პერსონალურ ინფორმაციაზე',
                sec5L2: 'მოითხოვოთ არაზუსტი მონაცემების გასწორება',
                sec5L3: 'მოითხოვოთ თქვენი მონაცემების წაშლა (სამართლებრივი მოთხოვნების გათვალისწინებით)',
                sec5L4: 'გამოითხოვოთ თანხმობა მონაცემთა დამუშავებაზე',
                sec5L5: 'წარადგინოთ საჩივარი შესაბამის ორგანოებში',
                sec6Title: '6. საკონტაქტო ინფორმაცია',
                sec6Text: 'კონფიდენციალურობასთან დაკავშირებული კითხვებისთვის დაგვიკავშირდით:',
                lastUpdated: 'ბოლო განახლება: იანვარი 2025'
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
                sec2P2: 'Ocean Line LLC\nAkhmed Melashvili Str 24,\nBatumi, Georgia',
                sec3Title: '3. პერსონალურ მონაცემთა დაცვის ოფიცერი და საკონტაქტო პირი საჩივრებისთვის',
                sec3P1:
                    'ჩვენ დავნიშნეთ პერსონალურ მონაცემთა დაცვის ოფიცერი (DPO), რომელიც პასუხისმგებელია ამ შეტყობინებასთან და ჩვენს მიერ პერსონალური მონაცემების დამუშავებასთან დაკავშირებული კითხვებისა და საჩივრების ზედამხედველობაზე.',
                sec3NameLabel: 'სახელი:',
                sec3Name: 'რუსუდან ფალავანდიშვილი',
                sec3PosLabel: 'პოზიცია:',
                sec3Pos: 'პერსონალურ მონაცემთა დაცვის ოფიცერი',
                sec3PhoneLabel: 'ტელეფონი:',
                sec3EmailLabel: 'ელ-ფოსტა:',
                sec3AddrLabel: 'მისამართი:',
                sec3Addr: 'ახმედ მელაშვილის ქ. 24, ბათუმი, საქართველო',
                sec3P2:
                    'ეს პირი პასუხისმგებელია პერსონალური მონაცემების დამუშავებასთან დაკავშირებული ნებისმიერი პრეტენზიის, საჩივრის, მოთხოვნისა და მოკვლევის მიღებასა და განხილვაზე. თქვენ შეგიძლიათ დაუკავშირდეთ DPO-ს ნებისმიერ დროს ზემოთ მოცემული დეტალების გამოყენებით.',
                sec4Title: '4. პერსონალური მონაცემების კატეგორიები, რომლებსაც ვამუშავებთ',
                sec4P1:
                    'ჩვენ ვამუშავებთ პერსონალურ მონაცემებს, რომლებიც აუცილებელია საზღვაო ეკიპაჟის დაკომპლექტების, რეკრუიტირებისა და მასთან დაკავშირებული სერვისების მისაწოდებლად, მათ შორის:',
                sec4L1: 'საიდენტიფიკაციო მონაცემები (სახელი, დაბადების თარიღი, მოქალაქეობა, პასპორტისა და პირადობის მოწმობის მონაცემები);',
                sec4L2: 'საკონტაქტო ინფორმაცია (მისამართი, ტელეფონის ნომერი, ელ-ფოსტა);',
                sec4L3: 'პროფესიული და დასაქმების მონაცემები (CV, რანგი, საზღვაო გამოცდილება, რეკომენდაციები);',
                sec4L4: 'კვალიფიკაციისა და სერტიფიცირების მონაცემები (მაგ. STCW, სამედიცინო სერტიფიკატები, ტრენინგების ჩანაწერები);',
                sec4L5: 'ფინანსური მონაცემები (საბანკო რეკვიზიტები ხელფასის გადახდისთვის, სადაც ეს რელევანტურია);',
                sec4L6: 'სავიზო და სამგზავრო მონაცემები (ვიზები, ბილეთები, დასაქმებასთან დაკავშირებული მოგზაურობის ისტორია);',
                sec4L7: 'ნებისმიერი სხვა ინფორმაცია, რომლის გაზიარებასაც თავად გადაწყვეტთ რეკრუიტირების / დაკომპლექტების პროცესში.',
                sec5Title: '5. დამუშავების მიზნები და სამართლებრივი საფუძვლები',
                sec5P1:
                    'ჩვენ ვამუშავებთ თქვენს პერსონალურ მონაცემებს შემდეგი მიზნებისთვის და შემდეგი სამართლებრივი საფუძვლებით GDPR-ის შესაბამისად:',
                sec5L1:
                    'მეზღვაურების რეკრუიტირება და განთავსება გემებზე – დამუშავება აუცილებელია ხელშეკრულების შესასრულებლად ან თქვენი მოთხოვნით ნაბიჯების გადასადგმელად ხელშეკრულების დადებამდე (GDPR მუხლი 6(1)(b)).',
                sec5L2:
                    'ეკიპაჟის მართვა და HR ადმინისტრირება – ხელშეკრულების შესრულება და ჩვენი ლეგიტიმური ინტერესები ჩვენი საქმიანობის სამართავად (GDPR მუხლი 6(1)(b), 6(1)(f)).',
                sec5L3:
                    'სამართლებრივი და მარეგულირებელი ვალდებულებების შესრულება (მაგ. საზღვაო, საიმიგრაციო, საგადასახადო, შრომითი კანონმდებლობა) – სამართლებრივი ვალდებულების შესრულება (GDPR მუხლი 6(1)(c)).',
                sec5L4:
                    'თქვენთან კომუნიკაცია სამუშაო შესაძლებლობების, დავალებებისა და მხარდაჭერის შესახებ – ხელშეკრულების შესრულება და ლეგიტიმური ინტერესები (GDPR მუხლი 6(1)(b), 6(1)(f)).',
                sec5L5:
                    'ჩანაწერების წარმოება, უსაფრთხოება და დაცვა – ლეგიტიმური ინტერესები ეფექტური მართვის, უსაფრთხოებისა და დაცვის უზრუნველსაყოფად (GDPR მუხლი 6(1)(f)).',
                sec5L6:
                    'დამუშავება თქვენი თანხმობის საფუძველზე (სადაც ეს საჭიროა, მაგ. გარკვეული მარკეტინგული კომუნიკაციებისთვის) – თანხმობა (GDPR მუხლი 6(1)(a)), რომელიც შეგიძლიათ ნებისმიერ დროს გამოითხოვოთ.',
                sec6Title: '6. გაფრთხილება მონაცემთა დამუშავების შესახებ',
                sec6P1:
                    'მნიშვნელოვანია: Ocean Line LLC ახორციელებს მეზღვაურების, გემთმფლობელების, პარტნიორებისა და სხვა პირების პერსონალური მონაცემების დამუშავებას ეკიპაჟის დაკომპლექტებისა და რეკრუიტირების მომსახურების გაწევის პროცესში. ნებისმიერი ასეთი დამუშავება ხორციელდება GDPR-ისა და საქართველოს მოქმედი კანონმდებლობის შესაბამისად, ამ შეტყობინებაში აღწერილი მიზნებისა და სამართლებრივი საფუძვლების გათვალისწინებით.',
                sec7Title: '7. მონაცემთა გაზიარება და საერთაშორისო გადაცემა',
                sec7P1: 'ჩვენ შეიძლება გავუზიაროთ თქვენი პერსონალური მონაცემები:',
                sec7L1: 'გემთმფლობელებს, ოპერატორებსა და მენეჯერებს ეკიპაჟის რეკრუიტირებისა და განთავსების მიზნით;',
                sec7L2: 'საზღვაო ორგანოებს, დროშის სახელმწიფო ადმინისტრაციებსა და პორტის სახელმწიფო კონტროლს, სადაც ეს საჭიროა;',
                sec7L3: 'საიმიგრაციო და სხვა სამთავრობო ორგანოებს ვიზებთან და მგზავრობასთან დაკავშირებით;',
                sec7L4: 'სამედიცინო დაწესებულებებსა და სადაზღვევო პროვაიდერებს სამედიცინო შემოწმებისა და დაზღვევის მიზნით;',
                sec7L5: 'პროფესიონალ მრჩევლებს (იურისტები, აუდიტორები, კონსულტანტები), სადაც ეს აუცილებელია;',
                sec7L6: 'IT და სისტემურ პროვაიდერებს, რომლებიც მხარს უჭერენ ჩვენს ბიზნეს ოპერაციებს.',
                sec7P2:
                    'როდესაც პერსონალური მონაცემები გადაიცემა ევროპის ეკონომიკური ზონის (EEA) გარეთ, ჩვენ უზრუნველვყოფთ შესაბამისი დაცვის მექანიზმების არსებობას (როგორიცაა სტანდარტული სახელშეკრულებო პირობები ან ეკვივალენტური ზომები) GDPR-ის მოთხოვნების შესაბამისად.',
                sec8Title: '8. მონაცემთა შენახვის ვადა',
                sec8P1:
                    'ჩვენ ვინახავთ თქვენს პერსონალურ მონაცემებს მხოლოდ იმ ვადით, რაც აუცილებელია იმ მიზნების მისაღწევად, რისთვისაც ისინი იქნა შეგროვებული, მათ შორის ნებისმიერი სამართლებრივი, მარეგულირებელი, საბუღალტრო ან საანგარიშგებო მოთხოვნების დასაკმაყოფილებლად. როგორც წესი:',
                sec8L1:
                    'რეკრუიტირებისა და დაკომპლექტების ჩანაწერები ინახება ჩვენთან თქვენი თანამშრომლობის განმავლობაში და გონივრული ვადით მას შემდეგ;',
                sec8L2:
                    'კანონით მოთხოვნილი დოკუმენტები (მაგ. საბუღალტრო, საგადასახადო, დასაქმების) ინახება მოქმედი კანონმდებლობით განსაზღვრული ვადით;',
                sec8L3: 'თუ დამუშავება ეფუძნება თანხმობას, მონაცემები შეიძლება უფრო ადრე წაიშალოს, თუ თქვენ გამოითხოვთ თანხმობას.',
                sec9Title: '9. თქვენი უფლებები, როგორც მონაცემთა სუბიექტის',
                sec9P1: 'GDPR-ით გათვალისწინებული პირობებისა და მოქმედი შეზღუდვების გათვალისწინებით, თქვენ გაქვთ უფლება:',
                sec9L1: 'მოითხოვოთ წვდომა თქვენს პერსონალურ მონაცემებზე და მიიღოთ ასლი;',
                sec9L2: 'მოითხოვოთ არაზუსტი ან არასრული მონაცემების გასწორება;',
                sec9L3: 'მოითხოვოთ თქვენი მონაცემების წაშლა („უფლება დავიწყებაზე“), სადაც ეს შესაძლებელია;',
                sec9L4: 'მოითხოვოთ დამუშავების შეზღუდვა გარკვეულ გარემოებებში;',
                sec9L5: 'წინააღმდეგობა გაუწიოთ დამუშავებას, რომელიც ეფუძნება ჩვენს ლეგიტიმურ ინტერესებს;',
                sec9L6:
                    'მიიღოთ თქვენი მონაცემები სტრუქტურირებული, ფართოდ გამოყენებადი და მანქანურად წაკითხვადი ფორმატით და გადასცეთ ისინი სხვა დამმუშავებელს, სადაც ეს ტექნიკურად შესაძლებელია (მონაცემთა პორტაბელურობა);',
                sec9L7:
                    'ნებისმიერ დროს გამოითხოვოთ თანხმობა, თუ დამუშავება ეფუძნება თანხმობას, გამოთხოვამდე განხორციელებული დამუშავების კანონიერებაზე ზეგავლენის გარეშე;',
                sec9L8: 'წარადგინოთ საჩივარი უფლებამოსილ მონაცემთა დაცვის ორგანოში.',
                sec9P2:
                    'თქვენი რომელიმე უფლების გამოსაყენებლად, გთხოვთ, დაუკავშირდეთ ჩვენს პერსონალურ მონაცემთა დაცვის ოფიცერს ზემოთ მითითებული რეკვიზიტების გამოყენებით.',
                sec10Title: '10. საჩივრები',
                sec10P1:
                    'თუ მიგაჩნიათ, რომ თქვენი მონაცემთა დაცვის უფლებები დაირღვა, შეგიძლიათ პირველ რიგში დაუკავშირდეთ ჩვენს პერსონალურ მონაცემთა დაცვის ოფიცერს, რომელიც პასუხისმგებელია პერსონალური მონაცემების დამუშავებასთან დაკავშირებული ყველა საჩივრის მიღებასა და განხილვაზე. თქვენ ასევე გაქვთ უფლება წარადგინოთ საჩივარი თქვენს ადგილობრივ საზედამხედველო ორგანოში ან ნებისმიერ სხვა კომპეტენტურ მონაცემთა დაცვის ორგანოში.',
                sec10DPO: 'პერსონალურ მონაცემთა დაცვის ოფიცერი',
                sec11Title: '11. ცვლილებები ამ შეტყობინებაში',
                sec11P1:
                    'ჩვენ შეიძლება დროდადრო განვაახლოთ ეს GDPR და მონაცემთა დაცვის შეტყობინება, რათა ასახოს ცვლილებები ჩვენს პრაქტიკაში, სამართლებრივ მოთხოვნებში ან სხვა ოპერაციული მიზეზების გამო. განახლებული ვერსია ყოველთვის ხელმისაწვდომი იქნება ამ გვერდზე.',
                lastUpdated: 'ბოლო განახლება: იანვარი 2025'
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

// Use event delegation for language buttons (works even if buttons are added dynamically)
document.addEventListener('click', (e) => {
    // Check if clicked element is a language button or inside one
    const langBtn = e.target.closest('.lang-btn');
    if (langBtn && langBtn.dataset.lang) {
        e.preventDefault();
        e.stopPropagation();
        const lang = langBtn.dataset.lang;
        if (lang && translations[lang]) {
            setLanguage(lang);
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
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




