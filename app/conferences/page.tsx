import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Button from '@/components/Button';
import Card from '@/components/Card';
import styles from './page.module.css';
import fs from 'fs';
import path from 'path';

export const metadata: Metadata = {
    title: 'Conferences - NextGen',
    description: 'View all past, current, and upcoming NextGen conferences and summits.',
};

interface Conference {
    id: string;
    title: string;
    date: string;
    venue: string;
    description: string;
    qrCode: string;
    createdAt: string;
    updatedAt: string;
    flierUrl?: string;
}

function getConferences(): Conference[] {
    try {
        const dataPath = path.join(process.cwd(), 'data', 'conferences.json');
        const fileContent = fs.readFileSync(dataPath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error('Error reading conference data:', error);
        return [];
    }
}

function categorizeConferences(conferences: Conference[]) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const past: Conference[] = [];
    const current: Conference[] = [];
    const upcoming: Conference[] = [];

    conferences.forEach((conference) => {
        const conferenceDate = new Date(conference.date);
        const conferenceDateOnly = new Date(
            conferenceDate.getFullYear(),
            conferenceDate.getMonth(),
            conferenceDate.getDate()
        );

        if (conferenceDateOnly < today) {
            past.push(conference);
        } else if (conferenceDateOnly.getTime() === today.getTime()) {
            current.push(conference);
        } else {
            upcoming.push(conference);
        }
    });

    // Sort: past (newest first), current, upcoming (soonest first)
    past.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return { past, current, upcoming };
}

export default function ConferencesPage() {
    const conferences = getConferences();
    const { past, current, upcoming } = categorizeConferences(conferences);

    return (
        <>
            <Header />
            <main className={styles.main}>
                {/* Hero Section */}
                <section className={styles.hero}>
                    <div className="container">
                        <h1 className="color-green">Conferences & Summits</h1>
                        <p className={styles.heroDescription}>
                            Join us at our conferences and summits to connect with fellow young leaders,
                            participate in workshops, and shape the future of civic participation in Nigeria.
                        </p>
                    </div>
                </section>

                {/* Current Conferences */}
                {current.length > 0 && (
                    <section className={`${styles.section} ${styles.currentSection}`}>
                        <div className="container">
                            <h2 className={`${styles.sectionHeading} color-green`}>
                                🔴 Happening Today
                            </h2>
                            <div className={styles.grid}>
                                {current.map((conference) => (
                                    <Card key={conference.id}>
                                        <div className={styles.badge}>Today</div>
                                        {conference.flierUrl && (
                                            <div className={styles.flierThumbnail}>
                                                <img
                                                    src={conference.flierUrl}
                                                    alt={`${conference.title} flier`}
                                                    className={styles.flierImage}
                                                />
                                            </div>
                                        )}
                                        <h3 className="color-green">{conference.title}</h3>
                                        <div className={styles.details}>
                                            <div className={styles.detailItem}>
                                                <span className={styles.icon}>📅</span>
                                                <span>{conference.date}</span>
                                            </div>
                                            <div className={styles.detailItem}>
                                                <span className={styles.icon}>📍</span>
                                                <span>{conference.venue}</span>
                                            </div>
                                        </div>
                                        <p className={styles.description}>{conference.description}</p>
                                        <Button href={`/conference/${conference.id}`} variant="primary">
                                            View Details
                                        </Button>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Upcoming Conferences */}
                {upcoming.length > 0 && (
                    <section className={styles.section}>
                        <div className="container">
                            <h2 className={`${styles.sectionHeading} color-green`}>
                                📅 Upcoming Conferences
                            </h2>
                            <div className={styles.grid}>
                                {upcoming.map((conference) => (
                                    <Card key={conference.id}>
                                        <div className={`${styles.badge} ${styles.badgeUpcoming}`}>
                                            Upcoming
                                        </div>
                                        {conference.flierUrl && (
                                            <div className={styles.flierThumbnail}>
                                                <img
                                                    src={conference.flierUrl}
                                                    alt={`${conference.title} flier`}
                                                    className={styles.flierImage}
                                                />
                                            </div>
                                        )}
                                        <h3 className="color-green">{conference.title}</h3>
                                        <div className={styles.details}>
                                            <div className={styles.detailItem}>
                                                <span className={styles.icon}>📅</span>
                                                <span>{conference.date}</span>
                                            </div>
                                            <div className={styles.detailItem}>
                                                <span className={styles.icon}>📍</span>
                                                <span>{conference.venue}</span>
                                            </div>
                                        </div>
                                        <p className={styles.description}>{conference.description}</p>
                                        <Button href={`/conference/${conference.id}`} variant="primary">
                                            Register Now
                                        </Button>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Past Conferences */}
                {past.length > 0 && (
                    <section className={`${styles.section} ${styles.pastSection}`}>
                        <div className="container">
                            <h2 className={`${styles.sectionHeading} color-green`}>
                                📚 Past Conferences
                            </h2>
                            <div className={styles.grid}>
                                {past.map((conference) => (
                                    <Card key={conference.id}>
                                        <div className={`${styles.badge} ${styles.badgePast}`}>
                                            Past Event
                                        </div>
                                        {conference.flierUrl && (
                                            <div className={styles.flierThumbnail}>
                                                <img
                                                    src={conference.flierUrl}
                                                    alt={`${conference.title} flier`}
                                                    className={styles.flierImage}
                                                />
                                            </div>
                                        )}
                                        <h3 className="color-green">{conference.title}</h3>
                                        <div className={styles.details}>
                                            <div className={styles.detailItem}>
                                                <span className={styles.icon}>📅</span>
                                                <span>{conference.date}</span>
                                            </div>
                                            <div className={styles.detailItem}>
                                                <span className={styles.icon}>📍</span>
                                                <span>{conference.venue}</span>
                                            </div>
                                        </div>
                                        <p className={styles.description}>{conference.description}</p>
                                        <Button href={`/conference/${conference.id}`} variant="secondary">
                                            View Details
                                        </Button>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Empty State */}
                {conferences.length === 0 && (
                    <section className={styles.section}>
                        <div className="container">
                            <div className={styles.emptyState}>
                                <h2 className="color-green">No Conferences Yet</h2>
                                <p>Check back soon for upcoming conferences and summits!</p>
                            </div>
                        </div>
                    </section>
                )}
            </main>
            <Footer />
        </>
    );
}
