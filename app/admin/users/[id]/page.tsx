'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import styles from '../users.module.css';
import Notification, { NotificationType } from '@/components/admin/Notification';

interface UserPageProps {
    params: Promise<{
        id: string;
    }>;
}

interface NotificationState {
    message: string;
    type: NotificationType;
}

export default function EditUser({ params }: UserPageProps) {
    const router = useRouter();
    const [userId, setUserId] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('admin');
    const [isActive, setIsActive] = useState(true);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<NotificationState | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { id } = await params;
            setUserId(id);

            try {
                const response = await fetch(`/api/admin/users/${id}`);
                const data = await response.json();

                if (data.success) {
                    setUsername(data.user.username);
                    setEmail(data.user.email);
                    setRole(data.user.role);
                    setIsActive(data.user.isActive);
                } else {
                    setNotification({
                        message: 'Failed to load user',
                        type: 'error',
                    });
                }
            } catch (error) {
                setNotification({
                    message: 'An error occurred while loading the user',
                    type: 'error',
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [params]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setNotification(null);

        // Validate passwords match if changing password
        if (newPassword && newPassword !== confirmPassword) {
            setNotification({
                message: 'Passwords do not match',
                type: 'error',
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const body: any = { email, role, isActive };
            if (newPassword) {
                body.newPassword = newPassword;
            }

            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (data.success) {
                setNotification({
                    message: 'User updated successfully!',
                    type: 'success',
                });
                setTimeout(() => {
                    router.push('/admin/users');
                }, 1500);
            } else {
                setNotification({
                    message: data.message || 'Failed to update user',
                    type: 'error',
                });
            }
        } catch (error) {
            setNotification({
                message: 'An error occurred while updating the user',
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
                <h1 className={styles.title}>Edit User: {username}</h1>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Username</label>
                        <input
                            type="text"
                            value={username}
                            className={styles.input}
                            disabled
                        />
                        <span className={styles.hint}>Username cannot be changed</span>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.label}>
                            Email *
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="role" className={styles.label}>
                            Role *
                        </label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className={styles.select}
                            required
                            disabled={isSubmitting}
                        >
                            <option value="super_admin">Super Admin - Full access</option>
                            <option value="admin">Admin - Manage conferences & registrations</option>
                            <option value="moderator">Moderator - Manage registrations only</option>
                            <option value="viewer">Viewer - Read-only access</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            <div className={styles.checkboxGroup}>
                                <input
                                    type="checkbox"
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                    className={styles.checkbox}
                                    disabled={isSubmitting}
                                />
                                <span>Active</span>
                            </div>
                        </label>
                        <span className={styles.hint}>Inactive users cannot login</span>
                    </div>

                    <hr style={{ margin: 'var(--space-4) 0', border: '1px solid var(--color-soft-gray)' }} />

                    <h3 style={{ marginBottom: 'var(--space-2)', color: 'var(--color-charcoal)' }}>
                        Change Password (Optional)
                    </h3>

                    <div className={styles.formGroup}>
                        <label htmlFor="newPassword" className={styles.label}>
                            New Password
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className={styles.input}
                            minLength={8}
                            disabled={isSubmitting}
                        />
                        <span className={styles.hint}>Leave blank to keep current password</span>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="confirmPassword" className={styles.label}>
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={styles.input}
                            minLength={8}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className={styles.actions}>
                        <button
                            type="button"
                            onClick={() => router.push('/admin/users')}
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
                            {isSubmitting ? 'Updating...' : 'Update User'}
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
