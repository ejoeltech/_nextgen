'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import styles from './settings.module.css';
import Notification, { NotificationType } from '@/components/admin/Notification';

interface NotificationState {
    message: string;
    type: NotificationType;
}

export default function AdminSettings() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<NotificationState | null>(null);
    const [newHash, setNewHash] = useState<string | null>(null);

    // Logo upload states
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string>('/nextgen-logo.png');
    const [isUploadingLogo, setIsUploadingLogo] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setNotification(null);
        setNewHash(null);

        // Validate passwords match
        if (newPassword !== confirmPassword) {
            setNotification({
                message: 'New passwords do not match',
                type: 'error',
            });
            return;
        }

        // Validate password strength
        if (newPassword.length < 8) {
            setNotification({
                message: 'Password must be at least 8 characters long',
                type: 'error',
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/admin/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await response.json();

            if (data.success) {
                setNewHash(data.newPasswordHash);
                setNotification({
                    message: 'Password hash generated! Follow the instructions below.',
                    type: 'success',
                });
                // Clear form
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setNotification({
                    message: data.message || 'Failed to change password',
                    type: 'error',
                });
            }
        } catch (error) {
            setNotification({
                message: 'An error occurred while changing password',
                type: 'error',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const copyToClipboard = () => {
        if (newHash) {
            navigator.clipboard.writeText(newHash);
            setNotification({
                message: 'Hash copied to clipboard!',
                type: 'success',
            });
        }
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
            if (!allowedTypes.includes(file.type)) {
                setNotification({
                    message: 'Invalid file type. Only PNG, JPG, and SVG are allowed',
                    type: 'error',
                });
                return;
            }

            // Validate file size (2MB)
            if (file.size > 2 * 1024 * 1024) {
                setNotification({
                    message: 'File too large. Maximum size is 2MB',
                    type: 'error',
                });
                return;
            }

            setLogoFile(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLogoUpload = async () => {
        if (!logoFile) {
            setNotification({
                message: 'Please select a logo file first',
                type: 'error',
            });
            return;
        }

        setIsUploadingLogo(true);

        try {
            const formData = new FormData();
            formData.append('logo', logoFile);

            const response = await fetch('/api/admin/settings/logo', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                setNotification({
                    message: 'Logo uploaded successfully!',
                    type: 'success',
                });
                setLogoFile(null);
                // Force reload logo with timestamp to bypass cache
                setLogoPreview(`/nextgen-logo.png?t=${Date.now()}`);
            } else {
                setNotification({
                    message: data.message || 'Failed to upload logo',
                    type: 'error',
                });
            }
        } catch (error) {
            setNotification({
                message: 'An error occurred while uploading logo',
                type: 'error',
            });
        } finally {
            setIsUploadingLogo(false);
        }
    };

    const handleLogoReset = async () => {
        if (!confirm('Are you sure you want to reset the logo to default?')) {
            return;
        }

        setIsUploadingLogo(true);

        try {
            const response = await fetch('/api/admin/settings/logo', {
                method: 'DELETE',
            });

            const data = await response.json();

            if (data.success) {
                setNotification({
                    message: 'Logo reset to default successfully!',
                    type: 'success',
                });
                setLogoFile(null);
                // Force reload logo with timestamp
                setLogoPreview(`/nextgen-logo.png?t=${Date.now()}`);
            } else {
                setNotification({
                    message: data.message || 'Failed to reset logo',
                    type: 'error',
                });
            }
        } catch (error) {
            setNotification({
                message: 'An error occurred while resetting logo',
                type: 'error',
            });
        } finally {
            setIsUploadingLogo(false);
        }
    };

    return (
        <AdminLayout>
            <div className={styles.container}>
                <h1 className={styles.title}>Admin Settings</h1>

                {/* Logo Management Section */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Site Logo</h2>

                    <div className={styles.logoSection}>
                        <div className={styles.logoPreview}>
                            <img
                                src={logoPreview}
                                alt="Site Logo"
                                className={styles.logoImage}
                            />
                        </div>

                        <div className={styles.logoControls}>
                            <div className={styles.formGroup}>
                                <label htmlFor="logoUpload" className={styles.label}>
                                    Upload New Logo
                                </label>
                                <input
                                    type="file"
                                    id="logoUpload"
                                    accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                                    onChange={handleLogoChange}
                                    className={styles.fileInput}
                                    disabled={isUploadingLogo}
                                />
                                <span className={styles.hint}>
                                    PNG, JPG, or SVG (max 2MB)
                                </span>
                            </div>

                            <div className={styles.logoButtons}>
                                <button
                                    onClick={handleLogoUpload}
                                    className={styles.uploadButton}
                                    disabled={!logoFile || isUploadingLogo}
                                >
                                    {isUploadingLogo ? 'Uploading...' : '📤 Upload Logo'}
                                </button>
                                <button
                                    onClick={handleLogoReset}
                                    className={styles.resetButton}
                                    disabled={isUploadingLogo}
                                >
                                    🔄 Reset to Default
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Password Change Section */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Change Password</h2>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="currentPassword" className={styles.label}>
                                Current Password *
                            </label>
                            <input
                                type="password"
                                id="currentPassword"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className={styles.input}
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="newPassword" className={styles.label}>
                                New Password *
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className={styles.input}
                                required
                                minLength={8}
                                disabled={isSubmitting}
                            />
                            <span className={styles.hint}>Minimum 8 characters</span>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="confirmPassword" className={styles.label}>
                                Confirm New Password *
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

                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Generating...' : 'Change Password'}
                        </button>
                    </form>

                    {newHash && (
                        <div className={styles.hashResult}>
                            <h3 className={styles.hashTitle}>📋 New Password Hash</h3>
                            <p className={styles.hashInstructions}>
                                Follow these steps to complete the password change:
                            </p>
                            <ol className={styles.instructionsList}>
                                <li>Copy the hash below</li>
                                <li>Open your <code>.env.local</code> file</li>
                                <li>Update <code>ADMIN_PASSWORD_HASH</code> with the new hash</li>
                                <li>Restart your development server</li>
                                <li>Login with your new password</li>
                            </ol>
                            <div className={styles.hashBox}>
                                <code className={styles.hashCode}>{newHash}</code>
                                <button
                                    onClick={copyToClipboard}
                                    className={styles.copyButton}
                                >
                                    📋 Copy
                                </button>
                            </div>
                        </div>
                    )}
                </div>
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
