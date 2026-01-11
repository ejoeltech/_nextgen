'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import styles from '../users.module.css';
import Notification, { NotificationType } from '@/components/admin/Notification';

interface NotificationState {
    message: string;
    type: NotificationType;
}

export default function NewUser() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('admin');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<NotificationState | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setNotification(null);

        // Validate passwords match
        if (password !== confirmPassword) {
            setNotification({
                message: 'Passwords do not match',
                type: 'error',
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password, role }),
            });

            const data = await response.json();

            if (data.success) {
                setNotification({
                    message: 'User created successfully!',
                    type: 'success',
                });
                setTimeout(() => {
                    router.push('/admin/users');
                }, 1500);
            } else {
                setNotification({
                    message: data.message || 'Failed to create user',
                    type: 'error',
                });
            }
        } catch (error) {
            setNotification({
                message: 'An error occurred while creating the user',
                type: 'error',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AdminLayout>
            <div className={styles.container}>
                <h1 className={styles.title}>Create New User</h1>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="username" className={styles.label}>
                            Username *
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={styles.input}
                            required
                            disabled={isSubmitting}
                        />
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
                        <label htmlFor="password" className={styles.label}>
                            Password *
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                            required
                            minLength={8}
                            disabled={isSubmitting}
                        />
                        <span className={styles.hint}>Minimum 8 characters</span>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="confirmPassword" className={styles.label}>
                            Confirm Password *
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={styles.input}
                            required
                            minLength={8}
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
                            {isSubmitting ? 'Creating...' : 'Create User'}
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
