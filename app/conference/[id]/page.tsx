import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ConferenceForm from '@/components/ConferenceForm';
import styles from './page.module.css';
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';

interface ConferencePageProps {
    params: Promise<{
        id: string;
    }>;
}

interface Conference {
    id: string;
    title: string;
    date: string;
    venue: string;
    description: string;
    qrCode: string;
    flierUrl?: string;
}

function getConferenceData(id: string): Conference | null {
    try {
        const dataPath = path.join(process.cwd(), 'data', 'conferences.json');
        const fileContent = fs.readFileSync(dataPath, 'utf-8');
        const conferences: Conference[] = JSON.parse(fileContent);
        return conferences.find(c => c.id === id) || null;
    } catch (error) {
        console.error('Error reading conference data:', error);
        return null;
    }
}

export async function generateMetadata({ params }: ConferencePageProps): Promise<Metadata> {
    const { id } = await params;
    const conference = getConferenceData(id);

    if (!conference) {
        return {
            title: 'Conference Not Found - NextGen',
            description: 'The conference you are looking for does not exist.',
        };
    }

    return {
        title: `${conference.title} - NextGen`,
        description: conference.description,
    };
}

export default async function ConferencePage({ params }: ConferencePageProps) {
    const { id } = await params;
    const conference = getConferenceData(id);

    if (!conference) {
        notFound();
    }

    return (
        <>
            <Header />
            <main className={styles.main}>
                {/* Registration Form */}
                <section className={styles.section}>
                    <div className="container">
                        <ConferenceForm conferenceId={id} />
                    </div>
                </section>

                {/* Conference Details */}
                <section className={`${styles.section} ${styles.hero}`}>
                    <div className="container">
                        <div className={styles.conferenceContent}>
                            <div className={styles.conferenceInfo}>
                                <h1 className="color-green">{conference.title}</h1>
                                <div className={styles.details}>
                                    <div className={styles.detailItem}>
                                        <span className={styles.icon}>📅</span>
                                        <span className={styles.detailText}>{conference.date}</span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <span className={styles.icon}>📍</span>
                                        <span className={styles.detailText}>{conference.venue}</span>
                                    </div>
                                </div>
                                <p className={styles.description}>{conference.description}</p>
                            </div>
                            {conference.flierUrl && (
                                <div className={styles.flierContainer}>
                                    <img
                                        src={conference.flierUrl}
                                        alt={`${conference.title} flier`}
                                        className={styles.flierImage}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
