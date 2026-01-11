'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import styles from '../referral-codes.module.css';
import Notification, { NotificationType } from '@/components/admin/Notification';

interface NotificationState {
    message: string;
    type: NotificationType;
}

export default function NewReferralCode() {
    const router = useRouter();
    const [code, setCode] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [ownerPhone, setOwnerPhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<NotificationState | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/admin/referral-codes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: code.toUpperCase(), ownerName, ownerPhone }),
            });

            const data = await response.json();

            if (data.success) {
                setNotification({
                    message: 'Referral code created successfully!',
                    type: 'success',
                });
                setTimeout(() => {
                    router.push('/admin/referral-codes');
                }, 1500);
            } else {
                setNotification({
                    message: data.message || 'Failed to create referral code',
                    type: 'error',
                });
            }
        } catch (error) {
            setNotification({
                message: 'An error occurred while creating the referral code',
                type: 'error',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AdminLayout>
            <div className={styles.container}>
                <h1 className={styles.title}>Create New Referral Code</h1>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="code" className={styles.label}>
                            Code *
                        </label>
                        <input
                            type="text"
                            id="code"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            className={styles.input}
                            required
                            placeholder="NGN99"
                            maxLength={5}
                            pattern="[A-Z0-9]{5}"
                            title="Code must be exactly 5 uppercase alphanumeric characters"
                        />
                        <span className={styles.hint}>5 uppercase alphanumeric characters (e.g., NGN99)</span>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="ownerName" className={styles.label}>
                            Owner Name *
                        </label>
                        <input
                            type="text"
                            id="ownerName"
                            value={ownerName}
                            onChange={(e) => setOwnerName(e.target.value)}
                            className={styles.input}
                            required
                            placeholder="John Doe"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="ownerPhone" className={styles.label}>
                            Owner Phone *
                        </label>
                        <input
                            type="tel"
                            id="ownerPhone"
                            value={ownerPhone}
                            onChange={(e) => setOwnerPhone(e.target.value)}
                            className={styles.input}
                            required
                            placeholder="+234 801 234 5678"
                        />
                    </div>

                    <div className={styles.actions}>
                        <button
                            type="button"
                            onClick={() => router.push('/admin/referral-codes')}
                            className={`${styles.button} ${styles.buttonSecondary}`}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`${styles.button} ${styles.buttonPrimary}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creating...' : 'Create Code'}
                        </button>
                    </div>
                </form>
            </div>

            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
        </AdminLayout>
    );
}
