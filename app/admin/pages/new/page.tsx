import AdminLayout from '@/components/admin/AdminLayout';
import PageForm from '@/components/admin/PageForm';
import styles from './new.module.css';

export default function NewPage() {
    return (
        <AdminLayout>
            <div className={styles.container}>
                <h1 className={styles.title}>Create New Page</h1>
                <PageForm />
            </div>
        </AdminLayout>
    );
}
