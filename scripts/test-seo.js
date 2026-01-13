/**
 * Test script for AI SEO generation
 * Run with: node scripts/test-seo.js
 */

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

async function testSEO() {
    console.log('🤖 Testing AI SEO Generation...\n');

    try {
        // You'll need to get a session token first by logging in
        // For now, we'll test the AI functions directly

        const { generateSEOTags, generateCompleteSEO } = require('../lib/ai/seo-generator.ts');

        console.log('📝 Generating SEO tags...\n');

        const seoTags = await generateSEOTags(
            testContent,
            'conference',
            ['civic engagement', 'youth', 'Lagos', 'Nigeria']
        );

        console.log('✅ Meta Title:');
        console.log(`   "${seoTags.metaTitle}"`);
        console.log(`   Length: ${seoTags.metaTitle.length} characters\n`);

        console.log('✅ Meta Description:');
        console.log(`   "${seoTags.metaDescription}"`);
        console.log(`   Length: ${seoTags.metaDescription.length} characters\n`);

        console.log('✅ Keywords:');
        console.log(`   ${seoTags.keywords.join(', ')}\n`);

        console.log('🎉 SEO generation successful!\n');

        // Test complete SEO package
        console.log('📦 Generating complete SEO package...\n');

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

        console.log('✅ Open Graph Tags:');
        console.log(JSON.stringify(completeSEO.openGraph, null, 2));
        console.log('\n✅ Schema Markup:');
        console.log(JSON.stringify(completeSEO.schema, null, 2));

        console.log('\n🎉 Complete SEO package generated successfully!');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('\nMake sure:');
        console.error('1. GEMINI_API_KEY is set in .env.local');
        console.error('2. The API key is valid');
        console.error('3. You have internet connection');
    }
}

testSEO();
