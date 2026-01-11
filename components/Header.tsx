'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import styles from './Header.module.css';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/pages/about', label: 'About' },
        { href: '/pages/what-we-do', label: 'What We Do' },
        { href: '/pages/get-involved', label: 'Get Involved' },
        { href: '/pages/updates', label: 'Updates' },
        { href: '/conferences', label: 'Conferences' },
    ];

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <Image
                        src="/nextgen-logo.png"
                        alt="NextGen Logo"
                        width={180}
                        height={50}
                        priority
                    />
                </Link>

                {/* Desktop Navigation */}
                <nav className={styles.desktopNav}>
                    {navLinks.map((link) => (
                        <Link key={link.href} href={link.href} className={styles.navLink}>
                            {link.label}
                        </Link>
                    ))}
                    <Link href="/join" className={styles.ctaButton}>
                        Join NextGen
                    </Link>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className={styles.mobileMenuButton}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span className={mobileMenuOpen ? styles.iconClose : styles.iconMenu}></span>
                </button>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <nav className={styles.mobileNav}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={styles.mobileNavLink}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        href="/join"
                        className={styles.mobileCtaButton}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Join NextGen
                    </Link>
                </nav>
            )}
        </header>
    );
}
