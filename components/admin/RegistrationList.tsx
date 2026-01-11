'use client';

import { useState, useEffect } from 'react';
import styles from './RegistrationList.module.css';
import Notification, { NotificationType } from './Notification';

interface Registration {
    id: string;
    conference_id: string;
    name: string;
    email: string;
    phone?: string;
    timestamp: string;
    attendedAt: string | null;
}

interface Conference {
    id: string;
    title: string;
}

interface NotificationState {
    message: string;
    type: NotificationType;
}

export default function RegistrationList() {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [conferences, setConferences] = useState<Conference[]>([]);
    const [selectedConference, setSelectedConference] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState<NotificationState | null>(null);

    useEffect(() => {
        fetchConferences();
        fetchRegistrations();
    }, []);

    useEffect(() => {
        fetchRegistrations();
    }, [selectedConference]);

    const fetchConferences = async () => {
        try {
            const response = await fetch('/api/admin/conferences');
            const data = await response.json();
            if (data.success) {
                setConferences(data.conferences);
            }
        } catch (error) {
            console.error('Error fetching conferences:', error);
        }
    };

    const fetchRegistrations = async () => {
        setIsLoading(true);
        try {
            const url = selectedConference
                ? `/api/admin/registrations?conference_id=${selectedConference}`
                : '/api/admin/registrations';
            const response = await fetch(url);
            const data = await response.json();
            if (data.success) {
                setRegistrations(data.registrations);
            }
        } catch (error) {
            console.error('Error fetching registrations:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleAttendance = async (id: string, currentStatus: string | null) => {
        try {
            const response = await fetch('/api/admin/registrations', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    attendedAt: currentStatus ? null : new Date().toISOString(),
                }),
            });

            const data = await response.json();
            if (data.success) {
                setNotification({
                    message: 'Attendance updated successfully',
                    type: 'success',
                });
                fetchRegistrations();
            } else {
                setNotification({
                    message: 'Failed to update attendance',
                    type: 'error',
                });
            }
        } catch (error) {
            setNotification({
                message: 'An error occurred while updating attendance',
                type: 'error',
            });
        }
    };

    const deleteRegistration = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete the registration for ${name}?`)) {
            return;
        }

        try {
            const response = await fetch('/api/admin/registrations', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });

            const data = await response.json();
            if (data.success) {
                setNotification({
                    message: 'Registration deleted successfully',
                    type: 'success',
                });
                fetchRegistrations();
            } else {
                setNotification({
                    message: 'Failed to delete registration',
                    type: 'error',
                });
            }
        } catch (error) {
            setNotification({
                message: 'An error occurred while deleting registration',
                type: 'error',
            });
        }
    };

    const exportToCSV = () => {
        const url = selectedConference
            ? `/api/admin/export-csv?conference_id=${selectedConference}`
            : '/api/admin/export-csv';
        window.open(url, '_blank');
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <>
            <div className={styles.container}>
                <div className={styles.controls}>
                    <div className={styles.filterGroup}>
                        <label htmlFor="conference-filter" className={styles.filterLabel}>
                            Filter by Conference:
                        </label>
                        <select
                            id="conference-filter"
                            value={selectedConference}
                            onChange={(e) => setSelectedConference(e.target.value)}
                            className={styles.select}
                        >
                            <option value="">All Conferences</option>
                            {conferences.map((conf) => (
                                <option key={conf.id} value={conf.id}>
                                    {conf.title}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button onClick={exportToCSV} className={styles.exportButton}>
                        📥 Export to CSV
                    </button>
                </div>

                {isLoading ? (
                    <div className={styles.loading}>Loading registrations...</div>
                ) : registrations.length === 0 ? (
                    <div className={styles.empty}>No registrations found</div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Conference</th>
                                        <th>Registered</th>
                                        <th>Attended</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {registrations.map((reg) => (
                                        <tr key={reg.id}>
                                            <td>{reg.name}</td>
                                            <td>{reg.email}</td>
                                            <td>{reg.phone || '-'}</td>
                                            <td>{reg.conference_id}</td>
                                            <td>{formatDate(reg.timestamp)}</td>
                                            <td>
                                                <span className={reg.attendedAt ? styles.attended : styles.notAttended}>
                                                    {reg.attendedAt ? formatDate(reg.attendedAt) : 'Not attended'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className={styles.actionButtons}>
                                                    <button
                                                        onClick={() => toggleAttendance(reg.id, reg.attendedAt)}
                                                        className={styles.toggleButton}
                                                    >
                                                        {reg.attendedAt ? 'Mark Absent' : 'Mark Present'}
                                                    </button>
                                                    <button
                                                        onClick={() => deleteRegistration(reg.id, reg.name)}
                                                        className={styles.deleteButton}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className={styles.cardGrid}>
                            {registrations.map((reg) => (
                                <div key={reg.id} className={styles.card}>
                                    <div className={styles.cardHeader}>
                                        <h3 className={styles.cardName}>{reg.name}</h3>
                                        <span className={reg.attendedAt ? styles.attended : styles.notAttended}>
                                            {reg.attendedAt ? '✓ Attended' : '✕ Not attended'}
                                        </span>
                                    </div>
                                    <div className={styles.cardBody}>
                                        <p><strong>Email:</strong> {reg.email}</p>
                                        <p><strong>Phone:</strong> {reg.phone || '-'}</p>
                                        <p><strong>Conference:</strong> {reg.conference_id}</p>
                                        <p><strong>Registered:</strong> {formatDate(reg.timestamp)}</p>
                                        {reg.attendedAt && (
                                            <p><strong>Attended:</strong> {formatDate(reg.attendedAt)}</p>
                                        )}
                                    </div>
                                    <div className={styles.cardActions}>
                                        <button
                                            onClick={() => toggleAttendance(reg.id, reg.attendedAt)}
                                            className={styles.toggleButton}
                                        >
                                            {reg.attendedAt ? 'Mark Absent' : 'Mark Present'}
                                        </button>
                                        <button
                                            onClick={() => deleteRegistration(reg.id, reg.name)}
                                            className={styles.deleteButton}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

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
