'use client';

import { useEffect, useState } from 'react';
import styles from './Notification.module.css';

export type NotificationType = 'success' | 'error' | 'info';

interface NotificationProps {
    message: string;
    type: NotificationType;
    onClose: () => void;
    duration?: number;
}

export default function Notification({ message, type, onClose, duration = 5000 }: NotificationProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for fade out animation
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className={`${styles.notification} ${styles[type]} ${!isVisible ? styles.fadeOut : ''}`}>
            <div className={styles.content}>
                <span className={styles.icon}>
                    {type === 'success' && '✓'}
                    {type === 'error' && '✕'}
                    {type === 'info' && 'ℹ'}
                </span>
                <span className={styles.message}>{message}</span>
            </div>
            <button className={styles.closeButton} onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
            }}>
                ✕
            </button>
        </div>
    );
}
