import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { generateCompleteSEO, generateSEOTags } from '@/lib/ai/seo-generator';

export async function POST(request: NextRequest) {
    try {
        // Verify authentication
        const session = await getSession();
        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized', success: false },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { content, type, data, keywords } = body;

        // Validate required fields
        if (!content || !type) {
            return NextResponse.json(
                { message: 'Missing required fields: content and type', success: false },
                { status: 400 }
            );
        }

        // Validate type
        if (type !== 'conference' && type !== 'page') {
            return NextResponse.json(
                { message: 'Invalid type. Must be "conference" or "page"', success: false },
                { status: 400 }
            );
        }

        // Generate SEO content
        let seoData;

        if (data) {
            // Generate complete SEO package
            seoData = await generateCompleteSEO(content, type, data, keywords);
        } else {
            // Generate just meta tags
            const metaTags = await generateSEOTags(content, type, keywords);
            seoData = { metaTags };
        }

        return NextResponse.json(
            {
                message: 'SEO content generated successfully',
                success: true,
                seo: seoData,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('SEO Generation Error:', error);

        const errorMessage = error instanceof Error ? error.message : 'Failed to generate SEO content';

        return NextResponse.json(
            { message: errorMessage, success: false },
            { status: 500 }
        );
    }
}
