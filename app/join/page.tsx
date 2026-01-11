'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from './page.module.css';

export default function JoinPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement backend integration
        console.log('Form submitted:', formData);
        setSubmitted(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <>
            <Header />
            <main className={styles.main}>
                <section className={`${styles.section} ${styles.hero}`}>
                    <div className="container">
                        <h1 className="color-green">Join NextGen</h1>
                        <p className={styles.lead}>
                            Take the first step toward active civic participation.
                            Join thousands of young Nigerians building a stronger democracy.
                        </p>
                    </div>
                </section>

                <section className={styles.section}>
                    <div className="container">
                        <div className={styles.formContainer}>
                            {!submitted ? (
                                <>
                                    <div className={styles.formInfo}>
                                        <h2 className="color-green">What Happens Next?</h2>
                                        <ul className={styles.infoList}>
                                            <li>You'll receive a welcome email with resources and next steps</li>
                                            <li>Get updates on upcoming events, campaigns, and opportunities</li>
                                            <li>Connect with other NextGen members in your area</li>
                                            <li>Access civic education materials and organizing toolkits</li>
                                        </ul>
                                        <div className={styles.privacy}>
                                            <p>
                                                <strong>Your Privacy Matters</strong>
                                            </p>
                                            <p>
                                                We will never share your information with third parties.
                                                Your data is protected and used only to support your
                                                participation in NextGen activities.
                                            </p>
                                        </div>
                                    </div>

                                    <div className={styles.formCard}>
                                        <h3 className="color-green">Sign Up</h3>
                                        <form onSubmit={handleSubmit} className={styles.form}>
                                            <div className={styles.formGroup}>
                                                <label htmlFor="name">Full Name *</label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    className={styles.input}
                                                />
                                            </div>

                                            <div className={styles.formGroup}>
                                                <label htmlFor="email">Email Address *</label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    className={styles.input}
                                                />
                                            </div>

                                            <div className={styles.formGroup}>
                                                <label htmlFor="phone">Phone Number *</label>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    required
                                                    className={styles.input}
                                                />
                                            </div>

                                            <button type="submit" className={styles.submitButton}>
                                                Join NextGen
                                            </button>
                                        </form>
                                    </div>
                                </>
                            ) : (
                                <div className={styles.successMessage}>
                                    <h2 className="color-green">Welcome to NextGen!</h2>
                                    <p>
                                        Thank you for joining the movement. Check your email for
                                        next steps and resources to get started.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
