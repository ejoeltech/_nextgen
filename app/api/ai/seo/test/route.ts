import { NextRequest, NextResponse } from 'next/server';
import { generateSEOTags, generateCompleteSEO } from '@/lib/ai/seo-generator';

const testContent = `
Join us for the Youth Civic Engagement Summit 2026 in Lagos, Nigeria. 

This groundbreaking event brings together 500+ young Nigerian leaders, activists, and changemakers for three days of learning, networking, and action planning.

Learn about democratic participation, community organizing, and civic responsibility. Participate in interactive workshops led by experienced civic leaders. Network with fellow young Nigerians passionate about shaping our nation's future.

Topics include:
- Understanding Nigerian democracy and governance
- Effective community organizing strategies
- Youth participation in electoral processes
- Holding leaders accountable
- Building sustainable civic movements

Whether you're a student, young professional, or community organizer, this summit will equip you with the knowledge and connections to make a real impact in your community.

Register now and be part of the movement to build a better Nigeria!
`;

export async function GET() {
    try {
        console.log('🤖 Testing AI SEO Generation...\n');

        // Test basic SEO tags
        console.log('📝 Generating SEO tags...');
        const seoTags = await generateSEOTags(
            testContent,
            'conference',
            ['civic engagement', 'youth', 'Lagos', 'Nigeria']
        );

        console.log('✅ Meta Title:', seoTags.metaTitle);
        console.log('   Length:', seoTags.metaTitle.length, 'characters');
        console.log('✅ Meta Description:', seoTags.metaDescription);
        console.log('   Length:', seoTags.metaDescription.length, 'characters');
        console.log('✅ Keywords:', seoTags.keywords.join(', '));

        // Test complete SEO package
        console.log('\n📦 Generating complete SEO package...');
        const completeSEO = await generateCompleteSEO(
            testContent,
            'conference',
            {
                title: 'Youth Civic Engagement Summit 2026',
                description: testContent,
                date: '2026-03-15',
                venue: 'Lagos Continental Hotel',
                location: 'Lagos, Nigeria',
                imageUrl: '/conference-fliers/youth-summit.jpg'
            },
            ['civic engagement', 'youth', 'Lagos']
        );

        return NextResponse.json({
            success: true,
            message: 'AI SEO test completed successfully!',
            results: {
                metaTags: seoTags,
                openGraph: completeSEO.openGraph,
                schema: completeSEO.schema,
                stats: {
                    titleLength: seoTags.metaTitle.length,
                    descriptionLength: seoTags.metaDescription.length,
                    keywordCount: seoTags.keywords.length,
                }
            }
        }, { status: 200 });

    } catch (error) {
        console.error('❌ SEO Test Error:', error);

        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            troubleshooting: [
                'Check that GEMINI_API_KEY is set in .env.local',
                'Verify the API key is valid',
                'Ensure you have internet connection',
                'Check Gemini API quota/limits'
            ]
        }, { status: 500 });
    }
}
