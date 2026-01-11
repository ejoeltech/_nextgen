'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';
import styles from './referral-codes.module.css';
import Notification, { NotificationType } from '@/components/admin/Notification';

interface ReferralCode {
    code: string;
    ownerName: string;
    ownerPhone: string;
    createdAt: string;
}

interface NotificationState {
    message: string;
    type: NotificationType;
}

export default function ReferralCodesManagement() {
    const [codes, setCodes] = useState<ReferralCode[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState<NotificationState | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCodes();
    }, []);

    const fetchCodes = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/admin/referral-codes');
            const data = await response.json();
            if (data.success) {
                setCodes(data.codes);
            }
        } catch (error) {
            console.error('Error fetching referral codes:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteCode = async (code: string) => {
        if (!confirm(`Are you sure you want to delete referral code ${code}?`)) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/referral-codes/${code}`, {
                method: 'DELETE',
            });

            const data = await response.json();
            if (data.success) {
                setNotification({
                    message: 'Referral code deleted successfully',
                    type: 'success',
                });
                fetchCodes();
            } else {
                setNotification({
                    message: 'Failed to delete referral code',
                    type: 'error',
                });
            }
        } catch (error) {
            setNotification({
                message: 'An error occurred while deleting the referral code',
                type: 'error',
            });
        }
    };

    const filteredCodes = codes.filter(code =>
        code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        code.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        code.ownerPhone.includes(searchTerm)
    );

    return (
        <AdminLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Referral Codes Management</h1>
                    <Link href="/admin/referral-codes/new" className={styles.createButton}>
                        + Create New Code
                    </Link>
                </div>

                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Search by code, name, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>

                {isLoading ? (
                    <div className={styles.loading}>Loading referral codes...</div>
                ) : filteredCodes.length === 0 ? (
                    <div className={styles.empty}>
                        <p>No referral codes found.</p>
                        <Link href="/admin/referral-codes/new" className={styles.createButton}>
                            + Create New Code
                        </Link>
                    </div>
                ) : (
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Code</th>
                                    <th>Owner Name</th>
                                    <th>Owner Phone</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCodes.map((code) => (
                                    <tr key={code.code}>
                                        <td className={styles.codeCell}>{code.code}</td>
                                        <td>{code.ownerName}</td>
                                        <td>{code.ownerPhone}</td>
                                        <td>{new Date(code.createdAt).toLocaleDateString()}</td>
                                        <td className={styles.actions}>
                                            <Link
                                                href={`/admin/referral-codes/${code.code}`}
                                                className={styles.editButton}
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => deleteCode(code.code)}
                                                className={styles.deleteButton}
                                            >
                                                Delete
                                            </button>
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
