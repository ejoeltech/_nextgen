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

// GET - Get single page by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const pages = readPages();
        const page = pages.find(p => p.id === id);

        if (!page) {
            return NextResponse.json(
                { message: 'Page not found', success: false },
                { status: 404 }
            );
        }

        return NextResponse.json({ page, success: true }, { status: 200 });
    } catch (error) {
        console.error('Error reading page:', error);
        return NextResponse.json(
            { message: 'Failed to read page', success: false },
            { status: 500 }
        );
    }
}

// PUT - Update page
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
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
        const pageIndex = pages.findIndex(p => p.id === id);

        if (pageIndex === -1) {
            return NextResponse.json(
                { message: 'Page not found', success: false },
                { status: 404 }
            );
        }

        // Check if slug already exists (excluding current page)
        if (pages.some((p, idx) => p.slug === slug && idx !== pageIndex)) {
            return NextResponse.json(
                { message: 'A page with this slug already exists', success: false },
                { status: 400 }
            );
        }

        // Update page
        pages[pageIndex] = {
            ...pages[pageIndex],
            title,
            slug,
            body: pageBody,
            heroImage: heroImage || undefined,
            metaDescription: metaDescription || undefined,
            metaKeywords: metaKeywords || undefined,
            status: status || pages[pageIndex].status || 'draft',
            updatedAt: new Date().toISOString(),
        };

        writePages(pages);

        return NextResponse.json(
            { message: 'Page updated successfully', page: pages[pageIndex], success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating page:', error);
        return NextResponse.json(
            { message: 'Failed to update page', success: false },
            { status: 500 }
        );
    }
}

// DELETE - Delete page
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const pages = readPages();
        const pageIndex = pages.findIndex(p => p.id === id);

        if (pageIndex === -1) {
            return NextResponse.json(
                { message: 'Page not found', success: false },
                { status: 404 }
            );
        }

        pages.splice(pageIndex, 1);
        writePages(pages);

        return NextResponse.json(
            { message: 'Page deleted successfully', success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting page:', error);
        return NextResponse.json(
            { message: 'Failed to delete page', success: false },
            { status: 500 }
        );
    }
}
