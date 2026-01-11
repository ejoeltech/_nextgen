import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';
import styles from './page.module.css';
import fs from 'fs';
import path from 'path';

async function getStats() {
    const dataDir = path.join(process.cwd(), 'data');

    // Read pages
    let pagesCount = 0;
    try {
        const pagesData = fs.readFileSync(path.join(dataDir, 'pages.json'), 'utf-8');
        pagesCount = JSON.parse(pagesData).length;
    } catch (error) {
        pagesCount = 0;
    }

    // Read conferences
    let conferencesCount = 0;
    try {
        const conferencesData = fs.readFileSync(path.join(dataDir, 'conferences.json'), 'utf-8');
        conferencesCount = JSON.parse(conferencesData).length;
    } catch (error) {
        conferencesCount = 0;
    }

    // Read registrations
    let registrationsCount = 0;
    try {
        const attendanceData = fs.readFileSync(path.join(dataDir, 'attendance.json'), 'utf-8');
        registrationsCount = JSON.parse(attendanceData).length;
    } catch (error) {
        registrationsCount = 0;
    }

    return { pagesCount, conferencesCount, registrationsCount };
}

export default async function AdminDashboard() {
    const stats = await getStats();

    return (
        <AdminLayout>
            <div className={styles.dashboard}>
                <h1 className={styles.title}>Admin Dashboard</h1>
                <p className={styles.subtitle}>Manage your NextGen website content and conferences</p>

                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>📄</div>
                        <div className={styles.statContent}>
                            <h2 className={styles.statNumber}>{stats.pagesCount}</h2>
                            <p className={styles.statLabel}>Pages</p>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>🎤</div>
                        <div className={styles.statContent}>
                            <h2 className={styles.statNumber}>{stats.conferencesCount}</h2>
                            <p className={styles.statLabel}>Conferences</p>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>📋</div>
                        <div className={styles.statContent}>
                            <h2 className={styles.statNumber}>{stats.registrationsCount}</h2>
                            <p className={styles.statLabel}>Registrations</p>
                        </div>
                    </div>
                </div>

                <div className={styles.quickLinks}>
                    <h2 className={styles.sectionTitle}>Quick Actions</h2>
                    <div className={styles.linksGrid}>
                        <Link href="/admin/pages" className={styles.linkCard}>
                            <span className={styles.linkIcon}>📄</span>
                            <span className={styles.linkText}>Manage Pages</span>
                        </Link>
                        <Link href="/admin/conferences" className={styles.linkCard}>
                            <span className={styles.linkIcon}>🎤</span>
                            <span className={styles.linkText}>Manage Conferences</span>
                        </Link>
                        <Link href="/admin/registrations" className={styles.linkCard}>
                            <span className={styles.linkIcon}>📋</span>
                            <span className={styles.linkText}>View Registrations</span>
                        </Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
