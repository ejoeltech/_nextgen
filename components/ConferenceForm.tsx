'use client';

import { useState } from 'react';
import styles from './ConferenceForm.module.css';

interface ConferenceFormProps {
    conferenceId: string;
}

export default function ConferenceForm({ conferenceId }: ConferenceFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        isRegisteredVoter: '',
        referralCode: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/conference/attend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    conference_id: conferenceId,
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    isRegisteredVoter: formData.isRegisteredVoter === 'yes',
                    referralCode: formData.referralCode || undefined,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setSubmitted(true);
            } else {
                setError(data.message || 'Failed to record attendance');
            }
        } catch (err) {
            setError('Failed to submit form. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    if (submitted) {
        return (
            <div className={styles.successMessage}>
                <h3 className="color-green">✓ Attendance Recorded</h3>
                <p>Thank you for registering! We look forward to seeing you at the conference.</p>
            </div>
        );
    }

    return (
        <div className={styles.formContainer}>
            <h3 className="color-green">Register for Conference</h3>
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
                        disabled={loading}
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
                        disabled={loading}
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
                        disabled={loading}
                        placeholder="08012345678"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Are you a registered voter? *</label>
                    <div className={styles.radioGroup}>
                        <label className={styles.radioLabel}>
                            <input
                                type="radio"
                                name="isRegisteredVoter"
                                value="yes"
                                checked={formData.isRegisteredVoter === 'yes'}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                            <span>Yes</span>
                        </label>
                        <label className={styles.radioLabel}>
                            <input
                                type="radio"
                                name="isRegisteredVoter"
                                value="no"
                                checked={formData.isRegisteredVoter === 'no'}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                            <span>No</span>
                        </label>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="referralCode">Referral Code (Optional)</label>
                    <input
                        type="text"
                        id="referralCode"
                        name="referralCode"
                        value={formData.referralCode}
                        onChange={handleChange}
                        className={styles.input}
                        disabled={loading}
                        placeholder="Enter 5-character code"
                        maxLength={5}
                        style={{ textTransform: 'uppercase' }}
                    />
                    <span className={styles.hint}>If you have a referral code, enter it here</span>
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <button type="submit" className={styles.submitButton} disabled={loading}>
                    {loading ? 'Submitting...' : 'Register Now'}
                </button>
            </form>
        </div>
    );
}
