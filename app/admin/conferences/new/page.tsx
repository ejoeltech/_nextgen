import AdminLayout from '@/components/admin/AdminLayout';
import ConferenceForm from '@/components/admin/ConferenceForm';
import styles from './new.module.css';

export default function NewConference() {
    return (
        <AdminLayout>
            <div className={styles.container}>
                <h1 className={styles.title}>Create New Conference</h1>
                <ConferenceForm />
            </div>
        </AdminLayout>
    );
}
