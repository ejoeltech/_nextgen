import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.column}>
                    <h3 className={styles.heading}>NextGen</h3>
                    <p className={styles.description}>
                        Empowering young Nigerians to participate in civic life and shape the future.
                    </p>
                </div>

                <div className={styles.column}>
                    <h4 className={styles.columnHeading}>Quick Links</h4>
                    <nav className={styles.links}>
                        <Link href="/about" className={styles.link}>About</Link>
                        <Link href="/what-we-do" className={styles.link}>What We Do</Link>
                        <Link href="/get-involved" className={styles.link}>Get Involved</Link>
                        <Link href="/updates" className={styles.link}>Updates</Link>
                    </nav>
                </div>

                <div className={styles.column}>
                    <h4 className={styles.columnHeading}>Connect</h4>
                    <div className={styles.social}>
                        <a href="https://twitter.com/nextgen" target="_blank" rel="noopener noreferrer" className={styles.link}>
                            Twitter
                        </a>
                        <a href="https://instagram.com/nextgen" target="_blank" rel="noopener noreferrer" className={styles.link}>
                            Instagram
                        </a>
                        <a href="https://facebook.com/nextgen" target="_blank" rel="noopener noreferrer" className={styles.link}>
                            Facebook
                        </a>
                    </div>
                </div>
            </div>

            <div className={styles.bottom}>
                <div className={styles.container}>
                    <p className={styles.copyright}>
                        © {new Date().getFullYear()} NextGen. All rights reserved.
                    </p>
                    <p className={styles.privacy}>
                        Your privacy and data are protected.
                    </p>
                </div>
            </div>
        </footer>
    );
}
