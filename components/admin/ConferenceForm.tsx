'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './ConferenceForm.module.css';
import Notification, { NotificationType } from './Notification';

interface ConferenceFormProps {
    conferenceId?: string;
    initialData?: {
        id: string;
        title: string;
        date: string;
        venue: string;
        description: string;
        flierUrl?: string;
        advertiseOnHomepage?: boolean;
    };
}

interface NotificationState {
    message: string;
    type: NotificationType;
}

export default function ConferenceForm({ conferenceId, initialData }: ConferenceFormProps) {
    const router = useRouter();
    const [id, setId] = useState(initialData?.id || '');
    const [title, setTitle] = useState(initialData?.title || '');
    const [date, setDate] = useState(initialData?.date || '');
    const [venue, setVenue] = useState(initialData?.venue || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [flierFile, setFlierFile] = useState<File | null>(null);
    const [flierPreview, setFlierPreview] = useState<string>(initialData?.flierUrl || '');
    const [advertiseOnHomepage, setAdvertiseOnHomepage] = useState(initialData?.advertiseOnHomepage || false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<NotificationState | null>(null);

    const handleFlierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFlierFile(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setFlierPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const url = conferenceId ? `/api/admin/conferences/${conferenceId}` : '/api/admin/conferences';
            const method = conferenceId ? 'PUT' : 'POST';

            // Prepare request body with flier data
            const requestBody: any = { id, title, date, venue, description, advertiseOnHomepage };

            // If a new flier was uploaded, include it as base64
            if (flierFile) {
                requestBody.flierData = flierPreview;
                requestBody.flierName = flierFile.name;
            }

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();

            if (data.success) {
                setNotification({
                    message: conferenceId ? 'Conference updated successfully!' : 'Conference created successfully!',
                    type: 'success',
                });
                setTimeout(() => {
                    router.push('/admin/conferences');
                }, 1500);
            } else {
                setNotification({
                    message: data.message || 'Failed to save conference',
                    type: 'error',
                });
            }
        } catch (error) {
            setNotification({
                message: 'An error occurred while saving the conference',
                type: 'error',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="id" className={styles.label}>
                        Conference ID (slug) *
                    </label>
                    <input
                        type="text"
                        id="id"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        className={styles.input}
                        required
                        placeholder="nextgen-summit-2026"
                        pattern="[a-z0-9-]+"
                        title="Only lowercase letters, numbers, and hyphens allowed"
                    />
                    <span className={styles.hint}>URL: /conference/{id || 'your-id'}</span>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="title" className={styles.label}>
                        Title *
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={styles.input}
                        required
                        placeholder="NextGen Civic Summit 2026"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="date" className={styles.label}>
                        Date *
                    </label>
                    <input
                        type="text"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className={styles.input}
                        required
                        placeholder="March 15, 2026"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="venue" className={styles.label}>
                        Venue *
                    </label>
                    <input
                        type="text"
                        id="venue"
                        value={venue}
                        onChange={(e) => setVenue(e.target.value)}
                        className={styles.input}
                        required
                        placeholder="Lagos Continental Hotel, Victoria Island"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="description" className={styles.label}>
                        Description *
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={styles.textarea}
                        rows={6}
                        required
                        placeholder="Enter conference description..."
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="flier" className={styles.label}>
                        Conference Flier (Optional)
                    </label>
                    <input
                        type="file"
                        id="flier"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleFlierChange}
                        className={styles.fileInput}
                        disabled={isSubmitting}
                    />
                    {flierPreview && (
                        <div className={styles.flierPreview}>
                            <img src={flierPreview} alt="Flier preview" className={styles.previewImage} />
                        </div>
                    )}
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={advertiseOnHomepage}
                            onChange={(e) => setAdvertiseOnHomepage(e.target.checked)}
                            className={styles.checkbox}
                            disabled={isSubmitting}
                        />
                        <span>Advertise on Homepage</span>
                    </label>
                    <span className={styles.hint}>
                        When enabled, this conference will be featured in the homepage hero section
                    </span>
                </div>

                <div className={styles.infoBox}>
                    <p className={styles.infoText}>
                        ℹ️ A QR code will be automatically generated for this conference when you save.
                    </p>
                </div>

                <div className={styles.actions}>
                    <button
                        type="button"
                        onClick={() => router.push('/admin/conferences')}
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
                        {isSubmitting ? 'Saving...' : conferenceId ? 'Update Conference' : 'Create Conference'}
                    </button>
                </div>
            </form>

            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
        </>
    );
}
