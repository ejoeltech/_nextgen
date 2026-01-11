'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import styles from './QRCodeDisplay.module.css';

interface QRCodeDisplayProps {
    conferenceId: string;
}

export default function QRCodeDisplay({ conferenceId }: QRCodeDisplayProps) {
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const generateQRCode = async () => {
            try {
                // Generate the full URL for the conference page
                const conferenceUrl = `${window.location.origin}/conference/${conferenceId}`;

                // Generate QR code as data URL
                const qrDataUrl = await QRCode.toDataURL(conferenceUrl, {
                    width: 300,
                    margin: 2,
                    color: {
                        dark: '#0F5C4A', // Deep Green
                        light: '#FFFFFF', // White
                    },
                });

                setQrCodeUrl(qrDataUrl);
            } catch (error) {
                console.error('Error generating QR code:', error);
            }
        };

        generateQRCode();
    }, [conferenceId, mounted]);

    if (!mounted || !qrCodeUrl) {
        return <div className={styles.loading}>Generating QR code...</div>;
    }

    return (
        <div className={styles.qrContainer}>
            <h3 className="color-green">Scan to Register</h3>
            <p className={styles.instruction}>
                Scan this QR code with your phone camera to register for the conference
            </p>
            <div className={styles.qrCodeWrapper}>
                <img src={qrCodeUrl} alt="Conference QR Code" className={styles.qrCode} />
            </div>
            <p className={styles.url}>
                Or visit: <span className={styles.urlText}>/conference/{conferenceId}</span>
            </p>
        </div>
    );
}
