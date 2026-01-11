'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';
import Image from 'next/image';
import styles from './conferences.module.css';
import Notification, { NotificationType } from '@/components/admin/Notification';

interface Conference {
    id: string;
    title: string;
    date: string;
    venue: string;
    description: string;
    qrCode: string;
    createdAt: string;
    updatedAt: string;
}

interface NotificationState {
    message: string;
    type: NotificationType;
}

export default function ConferencesManagement() {
    const [conferences, setConferences] = useState<Conference[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState<NotificationState | null>(null);

    useEffect(() => {
        fetchConferences();
    }, []);

    const fetchConferences = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/admin/conferences');
            const data = await response.json();
            if (data.success) {
                setConferences(data.conferences);
            }
        } catch (error) {
            console.error('Error fetching conferences:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteConference = async (id: string) => {
        if (!confirm('Are you sure you want to delete this conference?')) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/conferences/${id}`, {
                method: 'DELETE',
            });

            const data = await response.json();
            if (data.success) {
                setNotification({
                    message: 'Conference deleted successfully',
                    type: 'success',
                });
                fetchConferences();
            } else {
                setNotification({
                    message: 'Failed to delete conference',
                    type: 'error',
                });
            }
        } catch (error) {
            setNotification({
                message: 'An error occurred while deleting the conference',
                type: 'error',
            });
        }
    };

    return (
        <AdminLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Conferences Management</h1>
                    <Link href="/admin/conferences/new" className={styles.createButton}>
                        + Create New Conference
                    </Link>
                </div>

                {isLoading ? (
                    <div className={styles.loading}>Loading conferences...</div>
                ) : conferences.length === 0 ? (
                    <div className={styles.empty}>
                        <p>No conferences found. Create your first conference!</p>
                        <Link href="/admin/conferences/new" className={styles.createButton}>
                            + Create New Conference
                        </Link>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {conferences.map((conference) => (
                            <div key={conference.id} className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <h2 className={styles.cardTitle}>{conference.title}</h2>
                                    {conference.qrCode && (
                                        <div className={styles.qrCode}>
                                            <Image
                                                src={conference.qrCode}
                                                alt={`QR Code for ${conference.title}`}
                                                width={80}
                                                height={80}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className={styles.cardBody}>
                                    <p className={styles.detail}>
                                        <strong>ID:</strong> {conference.id}
                                    </p>
                                    <p className={styles.detail}>
                                        <strong>Date:</strong> {conference.date}
                                    </p>
                                    <p className={styles.detail}>
                                        <strong>Venue:</strong> {conference.venue}
                                    </p>
                                    <p className={styles.description}>{conference.description}</p>
                                </div>
                                <div className={styles.cardActions}>
                                    <Link href={`/admin/conferences/${conference.id}`} className={styles.editButton}>
                                        Edit
                                    </Link>
                                    <button onClick={() => deleteConference(conference.id)} className={styles.deleteButton}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
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
