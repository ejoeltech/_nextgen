import AdminLayout from '@/components/admin/AdminLayout';
import ConferenceForm from '@/components/admin/ConferenceForm';
import styles from './edit.module.css';

interface ConferenceEditProps {
    params: Promise<{ id: string }>;
}

async function getConference(id: string) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/admin/conferences/${id}`, {
            cache: 'no-store',
        });
        const data = await response.json();
        return data.success ? data.conference : null;
    } catch (error) {
        return null;
    }
}

export default async function EditConference({ params }: ConferenceEditProps) {
    const { id } = await params;
    const conference = await getConference(id);

    if (!conference) {
        return (
            <AdminLayout>
                <div className={styles.container}>
                    <h1 className={styles.title}>Conference Not Found</h1>
                    <p>The conference you're looking for doesn't exist.</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className={styles.container}>
                <h1 className={styles.title}>Edit Conference</h1>
                <ConferenceForm
                    conferenceId={id}
                    initialData={{
                        id: conference.id,
                        title: conference.title,
                        date: conference.date,
                        venue: conference.venue,
                        description: conference.description,
                    }}
                />
            </div>
        </AdminLayout>
    );
}
