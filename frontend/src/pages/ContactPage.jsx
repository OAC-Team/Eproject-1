import '../themes/ContactPage.css';
import React, { useState } from 'react';


export default function ContactUs() {
    // 1. Initialize state to store user input data
    const [status, setStatus] = useState('idle');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    // 2. Handle change event when user inputs data
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        // Simulate API call (replace with real API if needed)
        await new Promise((resolve) => setTimeout(resolve, 1500));

        console.log('Contact form submitted:', formData);
        setStatus('success');
    };

    const handleReset = () => {
        setFormData({ name: '', email: '', subject: '', message: '' });
        setStatus('idle');
    };

    return (
        <div className="contact-page">
            <div className="contact-container">
                {/* LEFT COLUMN: CONTACT INFORMATION */}
                <div className="contact-info">
                    <h2>Contact Us</h2>
                    <p className="text">
                        Do you have any questions, suggestions, or want to cooperate in sharing beautiful moments?
                        Send a message to OnlyArtCollection!
                    </p>

                    <div className="info-list">
                        <div className="info-item">
                            <i className="fas fa-map-marker-alt"></i>
                            <span>120 Yên Lãng, TP. Hà Nội</span>
                        </div>
                        <div className="info-item">
                            <i className="fas fa-envelope"></i>
                            <span>KieuLuongTam@skibidi.com</span>
                        </div>
                        <div className="info-item">
                            <i className="fas fa-phone-alt"></i>
                            <span>+84 676 769 693 636</span>
                        </div>
                    </div>

                    <div className="social-media">
                        <p>Follow our photography community:</p>
                        <div className="social-icons">
                            <a href="#facebook"><i className="fab fa-facebook-f"></i></a>
                            <a href="#instagram"><i className="fab fa-instagram"></i></a>
                            <a href="#pinterest"><i className="fab fa-pinterest"></i></a>
                            <a href="#flickr"><i className="fab fa-flickr"></i></a>
                        </div>
                    </div>
                </div>
                {/* RIGHT COLUMN: CONTACT FORM */}
                <div className="contact-form-wrapper">
                    <h3>Send Message</h3>
                    <form onSubmit={handleSubmit} className="contact-form">

                        <div className="input-group">
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="name">Full Name</label>
                        </div>

                        <div className="input-group">
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="email">Your Email</label>
                        </div>

                        <div className="input-group">
                            <select
                                id="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled hidden></option>
                                <option value="support">Account Support / Photo Upload</option>
                                <option value="copyright">Image Copyright Report</option>
                                <option value="business">Business Cooperation</option>
                                <option value="other">Other Feedback</option>
                            </select>
                            <label htmlFor="subject" className="select-label">Contact Subject</label>
                        </div>

                        <div className="input-group">
                            <textarea
                                id="message"
                                rows="5"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            ></textarea>
                            <label htmlFor="message">Your Message...</label>
                        </div>

                        <button type="submit" className="submit-btn">
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}