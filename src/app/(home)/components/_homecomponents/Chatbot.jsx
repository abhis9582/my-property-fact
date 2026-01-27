"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Chatbot.module.css';

const IMAGE_BASE_URL = `${process.env.NEXT_PUBLIC_IMAGE_URL}properties/`;

export default function Chatbot() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [sessionId, setSessionId] = useState('');
    const [conversationHistory, setConversationHistory] = useState([]);
    const [isInputDisabled, setIsInputDisabled] = useState(true);
    const [placeholder, setPlaceholder] = useState("Please select an option");

    const messagesEndRef = useRef(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Initialize session and welcome message
    useEffect(() => {
        const newSessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
        setSessionId(newSessionId);

        const initialBotMessage = {
            id: 'initial',
            type: 'bot',
            text: "Hi 👋\nWelcome to My Property Fact!\n\nReady to find the perfect property? 🏡✨\n\nPlease select your property type to get started.",
            options: ['Commercial', 'Residential', 'New Launch']
        };
        setMessages([initialBotMessage]);
    }, []);

    // Watch for mobile menu state changes
    useEffect(() => {
        const checkMobileMenu = () => {
            const mobileMenu = document.getElementById('mbdiv');
            if (mobileMenu) {
                setIsMobileMenuOpen(mobileMenu.classList.contains('active'));
            }
        };

        // Check initially
        checkMobileMenu();

        // Watch for changes using MutationObserver
        const mobileMenu = document.getElementById('mbdiv');
        if (mobileMenu) {
            const observer = new MutationObserver(checkMobileMenu);
            observer.observe(mobileMenu, {
                attributes: true,
                attributeFilter: ['class']
            });

            return () => observer.disconnect();
        }
    }, []);

    // Scroll to bottom whenever messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isTyping]);

    // ============================================
    // COMMENTED OUT: Prevent body scroll when chatbot is open (especially on mobile)
    // ============================================
    // useEffect(() => {
    //     if (isOpen) {
    //         // Save current scroll position
    //         const scrollY = window.scrollY;
    //         // Disable body scroll
    //         document.body.style.position = 'fixed';
    //         document.body.style.top = `-${scrollY}px`;
    //         document.body.style.width = '100%';
    //         document.body.style.overflow = 'hidden';
            
    //         return () => {
    //             // Restore scroll position when closing
    //             const scrollY = document.body.style.top;
    //             document.body.style.position = '';
    //             document.body.style.top = '';
    //             document.body.style.width = '';
    //             document.body.style.overflow = '';
    //             if (scrollY) {
    //                 window.scrollTo(0, parseInt(scrollY || '0') * -1);
    //             }
    //         };
    //     }
    // }, [isOpen]);

    const toggleChat = () => setIsOpen(!isOpen);

    const addMessage = (text, sender, options = [], projectCards = [], followUp = null) => {
        const newMessage = {
            id: Date.now(),
            type: sender,
            text,
            options,
            projectCards,
            followUp
        };
        setMessages(prev => [...prev, newMessage]);
        setConversationHistory(prev => [...prev, { sender, message: text }]);
    };

    const sendMessage = async (text = null) => {
        const userText = text || inputValue.trim();
        if (!userText) return;

        // Reset Logic
        if (['restart', 'reset'].includes(userText.toLowerCase())) {
            const initialBotMessage = {
                id: Date.now(),
                type: 'bot',
                text: "Hi 👋\nWelcome to My Property Fact!\n\nReady to find the perfect property? 🏡✨\n\nPlease select your property type to get started.",
                options: ['Commercial', 'Residential', 'New Launch']
            };
            setMessages([initialBotMessage]);
            setConversationHistory([]);
            setInputValue('');
            setIsInputDisabled(true);
            setPlaceholder("Please select an option");
            return;
        }

        // Add user message
        addMessage(userText, 'user');
        setInputValue('');

        // Prepare for bot response
        setIsInputDisabled(false);
        setPlaceholder("Type a message...");
        setIsTyping(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    message: userText,
                })
            });
            const data = await response.json();
            setIsTyping(false);

            if (data.redirectUrl) {
                if (data.reply) addMessage(data.reply, 'bot');
                setTimeout(() => {
                    router.push(data.redirectUrl);
                }, 1500);
            } else if (data.reply) {
                addMessage(data.reply, 'bot', data.options || [], data.projectCards || [], data.followUp);
            }

            if (data.options && data.options.length > 0) {
                setIsInputDisabled(true);
                setPlaceholder("Please select an option");
            } else {
                setIsInputDisabled(false);
                setPlaceholder("Type a message...");
            }

        } catch (error) {
            console.error(error);
            setIsTyping(false);
            addMessage("Error connecting to server.", 'bot');
        }
    };

    const handleEnquirySuccess = (reply, followUp, options) => {
        setMessages(prev => [...prev, {
            id: Date.now(),
            type: 'bot',
            text: reply,
            followUp: followUp,
            options: options
        }]);
        setIsInputDisabled(true);
        setPlaceholder("Please select an option");
    };

    return (
        <>
            {/* Backdrop overlay for mobile */}
            {isOpen && <div className={styles.backdrop} onClick={toggleChat}></div>}

            {/* Launcher */}
            <button
                className={`${styles.launcher} ${isMobileMenuOpen ? styles.hidden : ''}`}
                onClick={toggleChat}
                aria-label="Open Chatbot"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2-2z"></path>
                </svg>
            </button>

            {/* Container */}
            <div className={`${styles.container} ${!isOpen ? styles.hidden : ''}`}>
                <div className={styles.header}>
                    <div className={styles.headerInfo}>
                        <div className={styles.avatar}>
                            <Image src="/logo.png" alt="MPF Logo" width={40} height={40} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>
                        <div>
                            <h3>MyPropertyFact</h3>
                            <span className={styles.status}>Online</span>
                        </div>
                    </div>
                    <button className={styles.closeBtn} onClick={toggleChat} aria-label="Close Chatbot">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className={styles.messages}>
                    {messages.map((msg) => (
                        <React.Fragment key={msg.id}>
                            {msg.text && (
                                <div className={`${styles.message} ${msg.type === 'user' ? styles.userMessage : styles.botMessage}`}>
                                    {msg.text.split('\n').map((line, i) => <div key={i}>{line}</div>)}
                                </div>
                            )}

                            {msg.projectCards && msg.projectCards.length > 0 && (
                                <ProjectSlider 
                                    cards={msg.projectCards} 
                                    styles={styles}
                                    onEnquire={(name) => {
                                        setMessages(prev => [...prev, { id: 'form-' + Date.now(), type: 'form', projectName: name }]);
                                    }} 
                                />
                            )}

                            {msg.followUp && (
                                <div className={`${styles.message} ${styles.botMessage}`}>
                                    {msg.followUp}
                                </div>
                            )}

                            {msg.type === 'form' && (
                                <LeadForm
                                    projectName={msg.projectName}
                                    sessionId={sessionId}
                                    styles={styles}
                                    onSuccess={handleEnquirySuccess}
                                />
                            )}

                            {msg.options && msg.options.length > 0 && (
                                <div className={styles.chatOptions}>
                                    {msg.options.map((opt, i) => (
                                        <button
                                            key={i}
                                            className={styles.optionBtn}
                                            onClick={() => sendMessage(opt)}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                    {isTyping && (
                        <div className={styles.typing}>
                            <span className={styles.dot}></span>
                            <span className={styles.dot}></span>
                            <span className={styles.dot}></span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className={styles.inputArea}>
                    <input
                        type="text"
                        className={styles.userInput}
                        placeholder={placeholder}
                        value={inputValue}
                        disabled={isInputDisabled}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <button
                        className={styles.sendBtn}
                        onClick={() => sendMessage()}
                        disabled={isInputDisabled || !inputValue.trim()}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </div>
            </div>
        </>
    );
}

function ProjectCard({ card, onEnquire, styles }) {
    const [imageError, setImageError] = useState(false);
    const DEFAULT_IMAGE = '/static/no_image.png';
    
    const getImageSrc = () => {
        if (imageError || !card.image) {
            return DEFAULT_IMAGE;
        }
        return card.image;
    };

    return (
        <div className={styles.projectCard}>
            <Image
                src={getImageSrc()}
                alt={card.name}
                width={280}
                height={200}
                onError={() => setImageError(true)}
                unoptimized={imageError || !card.image}
            />
            <div className={styles.pCardContent}>
                <h4>{card.name}</h4>
                <p className={styles.pLoc}>📍 {card.location}</p>
                <div className={styles.pDetails}>
                    <span className={styles.pPrice}>{card.price}</span>
                    <span className={styles.pStatus}>{card.status}</span>
                </div>
                <p className={styles.pBuilder}>By {card.builder}</p>
                <Link href={card.link} target="_blank" rel="noopener noreferrer" className={styles.pCta} style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>View Details</Link>
                <button className={styles.pEnquire} onClick={() => onEnquire(card.name)}>Enquire</button>
            </div>
        </div>
    );
}

function ProjectSlider({ cards, onEnquire, styles }) {
    const sliderRef = useRef(null);
    const [showArrow, setShowArrow] = useState(false);

    const checkScroll = () => {
        if (!sliderRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
        setShowArrow(scrollLeft < scrollWidth - clientWidth - 5);
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [cards]);

    const scrollRight = () => {
        sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    };

    return (
        <div className={styles.sliderWrapper}>
            <div
                className={styles.projectSlider}
                ref={sliderRef}
                onScroll={checkScroll}
            >
                {cards.map((card, i) => (
                    <ProjectCard key={i} card={card} onEnquire={onEnquire} styles={styles} />
                ))}
            </div>
            <button
                className={`${styles.scrollArrow} ${showArrow ? styles.visible : ''}`}
                onClick={scrollRight}
            >
                &#8594;
            </button>
        </div>
    );
}

function LeadForm({ projectName, sessionId, onSuccess, styles }) {
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async () => {
        // Validation
        if (!name || name.length < 3) { setError('Name must be at least 3 characters.'); return; }
        if (!/^[6-9]\d{9}$/.test(mobile)) { setError('Please enter a valid 10-digit mobile number.'); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Please enter a valid email address.'); return; }

        setError('');
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/enquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    name,
                    mobile,
                    email,
                    project: projectName
                })
            });

            const res = await response.json();

            if (res.success) {
                setIsSuccess(true);
                onSuccess(res.reply, res.followUp, res.options);
            } else {
                setError(res.message || 'Submission failed.');
                setIsSubmitting(false);
            }
        } catch (e) {
            console.error(e);
            setError('Connection error.');
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className={styles.customForm}>
                <div className={styles.formSuccess}>Thank you for sharing your details. Our consultant will contact you within 24 hours.</div>
            </div>
        );
    }

    return (
        <div className={styles.customForm}>
            <div className={styles.formTitle}>Please share your details for<br /><strong>{projectName}</strong></div>
            <input
                type="text"
                className={styles.formInput}
                placeholder="Full Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="tel"
                className={styles.formInput}
                placeholder="Mobile Number (10 digits) *"
                maxLength="10"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
            />
            <input
                type="email"
                className={styles.formInput}
                placeholder="Email ID *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button
                className={styles.submitBtn}
                onClick={handleSubmit}
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Submitting... ⏳' : 'Submit'}
            </button>
            {error && <div className={styles.formError}>{error}</div>}
        </div>
    );
}
