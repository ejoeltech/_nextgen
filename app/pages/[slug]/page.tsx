import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from './page.module.css';
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

interface PageData {
    id: string;
    title: string;
    slug: string;
    body: string;
    heroImage?: string;
    metaDescription?: string;
    createdAt: string;
    updatedAt: string;
}

function getPageData(slug: string): PageData | null {
    try {
        const dataPath = path.join(process.cwd(), 'data', 'pages.json');
        const fileContent = fs.readFileSync(dataPath, 'utf-8');
        const pages: PageData[] = JSON.parse(fileContent);
        return pages.find(p => p.slug === slug) || null;
    } catch (error) {
        console.error('Error reading page data:', error);
        return null;
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const page = getPageData(slug);

    if (!page) {
        return {
            title: 'Page Not Found - NextGen',
            description: 'The page you are looking for does not exist.',
        };
    }

    return {
        title: `${page.title} - NextGen`,
        description: page.metaDescription || page.title,
    };
}

export default async function DynamicPage({ params }: PageProps) {
    const { slug } = await params;
    const page = getPageData(slug);

    if (!page) {
        notFound();
    }

    return (
        <>
            <Header />
            <main className={styles.main}>
                <div
                    className={styles.content}
                    dangerouslySetInnerHTML={{ __html: page.body }}
                />
            </main>
            <Footer />
        </>
    );
}
