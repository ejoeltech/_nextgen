'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './AdminLayout.module.css';

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const navItems = [
        { href: '/admin', label: 'Dashboard', icon: '📊' },
        { href: '/admin/pages', label: 'Pages', icon: '📄' },
        { href: '/admin/conferences', label: 'Conferences', icon: '🎤' },
        { href: '/admin/registrations', label: 'Registrations', icon: '📋' },
        { href: '/admin/referral-codes', label: 'Referral Codes', icon: '🎫' },
        { href: '/admin/users', label: 'Users', icon: '👥' },
        { href: '/admin/ai-settings', label: 'AI Settings', icon: '🤖' },
        { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
    ];

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await fetch('/api/admin/auth/logout', { method: 'POST' });
            router.push('/admin/login');
            router.refresh();
        } catch (error) {
            console.error('Logout error:', error);
            setIsLoggingOut(false);
        }
    };

    return (
        <div className={styles.adminContainer}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h2 className={styles.sidebarTitle}>NextGen Admin</h2>
                    <p className={styles.userInfo}>👤 admin</p>
                </div>
                <nav className={styles.nav}>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navLink} ${pathname === item.href ? styles.navLinkActive : ''}`}
                        >
                            <span className={styles.navIcon}>{item.icon}</span>
                            <span className={styles.navLabel}>{item.label}</span>
                        </Link>
                    ))}
                </nav>
                <div className={styles.sidebarFooter}>
                    <button
                        onClick={handleLogout}
                        className={styles.logoutButton}
                        disabled={isLoggingOut}
                    >
                        {isLoggingOut ? '🔄 Logging out...' : '🚪 Logout'}
                    </button>
                    <Link href="/" className={styles.backLink}>
                        ← Back to Website
                    </Link>
                </div>
            </aside>
            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
}
