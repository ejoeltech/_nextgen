'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';
import styles from './users.module.css';
import Notification, { NotificationType } from '@/components/admin/Notification';

interface User {
    id: string;
    username: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
}

interface NotificationState {
    message: string;
    type: NotificationType;
}

const roleLabels: Record<string, string> = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    moderator: 'Moderator',
    viewer: 'Viewer'
};

export default function UsersManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState<NotificationState | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/admin/users');
            const data = await response.json();
            if (data.success) {
                setUsers(data.users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteUser = async (id: string, username: string) => {
        if (!confirm(`Are you sure you want to delete user "${username}"?`)) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/users/${id}`, {
                method: 'DELETE',
            });

            const data = await response.json();
            if (data.success) {
                setNotification({
                    message: 'User deleted successfully',
                    type: 'success',
                });
                fetchUsers();
            } else {
                setNotification({
                    message: 'Failed to delete user',
                    type: 'error',
                });
            }
        } catch (error) {
            setNotification({
                message: 'An error occurred while deleting the user',
                type: 'error',
            });
        }
    };

    return (
        <AdminLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>User Management</h1>
                    <Link href="/admin/users/new" className={styles.createButton}>
                        + Create New User
                    </Link>
                </div>

                {isLoading ? (
                    <div className={styles.loading}>Loading users...</div>
                ) : users.length === 0 ? (
                    <div className={styles.empty}>
                        <p>No users found.</p>
                        <Link href="/admin/users/new" className={styles.createButton}>
                            + Create New User
                        </Link>
                    </div>
                ) : (
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td className={styles.username}>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={`${styles.roleBadge} ${styles[`role${user.role}`]}`}>
                                                {roleLabels[user.role] || user.role}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={user.isActive ? styles.statusActive : styles.statusInactive}>
                                                {user.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td className={styles.actions}>
                                            <Link
                                                href={`/admin/users/${user.id}`}
                                                className={styles.editButton}
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => deleteUser(user.id, user.username)}
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
