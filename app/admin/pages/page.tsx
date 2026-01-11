'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';
import styles from './pages.module.css';
import Notification, { NotificationType } from '@/components/admin/Notification';

interface Page {
    id: string;
    title: string;
    slug: string;
    body: string;
    heroImage?: string;
    createdAt: string;
    updatedAt: string;
}

interface NotificationState {
    message: string;
    type: NotificationType;
}

export default function PagesManagement() {
    const [pages, setPages] = useState<Page[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState<NotificationState | null>(null);

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/admin/pages');
            const data = await response.json();
            if (data.success) {
                setPages(data.pages);
            }
        } catch (error) {
            console.error('Error fetching pages:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const deletePage = async (id: string) => {
        if (!confirm('Are you sure you want to delete this page?')) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/pages/${id}`, {
                method: 'DELETE',
            });

            const data = await response.json();
            if (data.success) {
                setNotification({
                    message: 'Page deleted successfully',
                    type: 'success',
                });
                fetchPages();
            } else {
                setNotification({
                    message: 'Failed to delete page',
                    type: 'error',
                });
            }
        } catch (error) {
            setNotification({
                message: 'An error occurred while deleting the page',
                type: 'error',
            });
        }
    };

    return (
        <AdminLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Pages Management</h1>
                    <Link href="/admin/pages/new" className={styles.createButton}>
                        + Create New Page
                    </Link>
                </div>

                {isLoading ? (
                    <div className={styles.loading}>Loading pages...</div>
                ) : pages.length === 0 ? (
                    <div className={styles.empty}>
                        <p>No pages found. Create your first page!</p>
                        <Link href="/admin/pages/new" className={styles.createButton}>
                            + Create New Page
                        </Link>
                    </div>
                ) : (
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Slug</th>
                                    <th>Created</th>
                                    <th>Updated</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pages.map((page) => (
                                    <tr key={page.id}>
                                        <td>{page.title}</td>
                                        <td>/pages/{page.slug}</td>
                                        <td>{new Date(page.createdAt).toLocaleDateString()}</td>
                                        <td>{new Date(page.updatedAt).toLocaleDateString()}</td>
                                        <td>
                                            <div className={styles.actions}>
                                                <Link href={`/admin/pages/${page.id}`} className={styles.editButton}>
                                                    Edit
                                                </Link>
                                                <button onClick={() => deletePage(page.id)} className={styles.deleteButton}>
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
