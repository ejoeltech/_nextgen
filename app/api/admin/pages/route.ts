import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface Page {
    id: string;
    title: string;
    slug: string;
    body: string;
    heroImage?: string;
    metaDescription?: string;
    metaKeywords?: string;
    status?: 'draft' | 'published';
    createdAt: string;
    updatedAt: string;
}

const dataPath = path.join(process.cwd(), 'data', 'pages.json');

function readPages(): Page[] {
    try {
        const fileContent = fs.readFileSync(dataPath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        return [];
    }
}

function writePages(pages: Page[]): void {
    fs.writeFileSync(dataPath, JSON.stringify(pages, null, 2), 'utf-8');
}

// GET - List all pages
export async function GET() {
    try {
        const pages = readPages();
        return NextResponse.json({ pages, success: true }, { status: 200 });
    } catch (error) {
        console.error('Error reading pages:', error);
        return NextResponse.json(
            { message: 'Failed to read pages', success: false },
            { status: 500 }
        );
    }
}

// POST - Create new page
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, slug, body: pageBody, heroImage, metaDescription, metaKeywords, status } = body;

        // Validate required fields
        if (!title || !slug || !pageBody) {
            return NextResponse.json(
                { message: 'Missing required fields: title, slug, and body are required', success: false },
                { status: 400 }
            );
        }

        const pages = readPages();

        // Check if slug already exists
        if (pages.some(p => p.slug === slug)) {
            return NextResponse.json(
                { message: 'A page with this slug already exists', success: false },
                { status: 400 }
            );
        }

        // Create new page
        const newPage: Page = {
            id: Date.now().toString(),
            title,
            slug,
            body: pageBody,
            heroImage: heroImage || undefined,
            metaDescription: metaDescription || undefined,
            metaKeywords: metaKeywords || undefined,
            status: status || 'draft',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        pages.push(newPage);
        writePages(pages);

        return NextResponse.json(
            { message: 'Page created successfully', page: newPage, success: true },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating page:', error);
        return NextResponse.json(
            { message: 'Failed to create page', success: false },
            { status: 500 }
        );
    }
}
