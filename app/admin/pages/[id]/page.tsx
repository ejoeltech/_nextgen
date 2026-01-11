import AdminLayout from '@/components/admin/AdminLayout';
import PageForm from '@/components/admin/PageForm';
import styles from './edit.module.css';

interface PageEditProps {
    params: Promise<{ id: string }>;
}

async function getPage(id: string) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/admin/pages/${id}`, {
            cache: 'no-store',
        });
        const data = await response.json();
        return data.success ? data.page : null;
    } catch (error) {
        return null;
    }
}

export default async function EditPage({ params }: PageEditProps) {
    const { id } = await params;
    const page = await getPage(id);

    if (!page) {
        return (
            <AdminLayout>
                <div className={styles.container}>
                    <h1 className={styles.title}>Page Not Found</h1>
                    <p>The page you're looking for doesn't exist.</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className={styles.container}>
                <h1 className={styles.title}>Edit Page</h1>
                <PageForm
                    pageId={id}
                    initialData={{
                        title: page.title,
                        slug: page.slug,
                        body: page.body,
                        heroImage: page.heroImage,
                    }}
                />
            </div>
        </AdminLayout>
    );
}
