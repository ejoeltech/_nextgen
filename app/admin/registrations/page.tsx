import AdminLayout from '@/components/admin/AdminLayout';
import RegistrationList from '@/components/admin/RegistrationList';
import styles from './registrations.module.css';

export default function RegistrationsManagement() {
    return (
        <AdminLayout>
            <div className={styles.container}>
                <h1 className={styles.title}>Registrations Management</h1>
                <p className={styles.subtitle}>View and manage all conference registrations</p>
                <RegistrationList />
            </div>
        </AdminLayout>
    );
}
