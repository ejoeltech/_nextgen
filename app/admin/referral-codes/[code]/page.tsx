'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import styles from '../referral-codes.module.css';
import Notification, { NotificationType } from '@/components/admin/Notification';

interface ReferralCodePageProps {
    params: Promise<{
        code: string;
    }>;
}

interface NotificationState {
    message: string;
    type: NotificationType;
}

export default function EditReferralCode({ params }: ReferralCodePageProps) {
    const router = useRouter();
    const [code, setCode] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [ownerPhone, setOwnerPhone] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<NotificationState | null>(null);

    useEffect(() => {
        const fetchCode = async () => {
            const { code: codeParam } = await params;
            setCode(codeParam);

            try {
                const response = await fetch(`/api/admin/referral-codes/${codeParam}`);
                const data = await response.json();

                if (data.success) {
                    setOwnerName(data.code.ownerName);
                    setOwnerPhone(data.code.ownerPhone);
                } else {
                    setNotification({
                        message: 'Failed to load referral code',
                        type: 'error',
                    });
                }
            } catch (error) {
                setNotification({
                    message: 'An error occurred while loading the referral code',
                    type: 'error',
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchCode();
    }, [params]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/admin/referral-codes/${code}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ownerName, ownerPhone }),
            });

            const data = await response.json();

            if (data.success) {
                setNotification({
                    message: 'Referral code updated successfully!',
                    type: 'success',
                });
                setTimeout(() => {
                    router.push('/admin/referral-codes');
                }, 1500);
            } else {
                setNotification({
                    message: data.message || 'Failed to update referral code',
                    type: 'error',
                });
            }
        } catch (error) {
            setNotification({
                message: 'An error occurred while updating the referral code',
                type: 'error',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className={styles.container}>
                    <div className={styles.loading}>Loading...</div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className={styles.container}>
                <h1 className={styles.title}>Edit Referral Code: {code}</h1>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Code</label>
                        <input
                            type="text"
                            value={code}
                            className={styles.input}
                            disabled
                        />
                        <span className={styles.hint}>Code cannot be changed</span>
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
                            {isSubmitting ? 'Updating...' : 'Update Code'}
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
