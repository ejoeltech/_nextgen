/**
 * SEO Generator
 * AI-powered SEO content generation
 */

import { generateText, generateJSON } from './gemini';

interface SEOMetaTags {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
}

interface OpenGraphTags {
    title: string;
    description: string;
    type: string;
    image?: string;
}

interface SchemaMarkup {
    '@context': string;
    '@type': string;
    [key: string]: any;
}

/**
 * Generate optimized meta title
 */
export async function generateMetaTitle(
    content: string,
    keywords?: string[]
): Promise<string> {
    const keywordText = keywords && keywords.length > 0
        ? `Primary keywords: ${keywords.join(', ')}`
        : '';

    const prompt = `Generate an SEO-optimized meta title for this content about civic engagement in Nigeria:

Content: ${content.substring(0, 500)}
${keywordText}

Requirements:
- 50-60 characters (strict limit)
- Include primary keyword naturally
- Compelling and click-worthy
- Relevant to Nigerian youth and civic engagement
- Action-oriented when possible

Return ONLY the title, no quotes or explanation.`;

    const title = await generateText(prompt, { temperature: 0.7, cache: true });

    // Ensure it's within character limit
    return title.trim().substring(0, 60);
}

/**
 * Generate optimized meta description
 */
export async function generateMetaDescription(
    content: string,
    keywords?: string[]
): Promise<string> {
    const keywordText = keywords && keywords.length > 0
        ? `Keywords to include: ${keywords.join(', ')}`
        : '';

    const prompt = `Generate an SEO-optimized meta description for this content:

Content: ${content.substring(0, 500)}
${keywordText}

Requirements:
- 150-160 characters (strict limit)
- Include a call-to-action
- Keyword-rich but natural
- Compelling and informative
- Relevant to Nigerian civic engagement

Return ONLY the description, no quotes or explanation.`;

    const description = await generateText(prompt, { temperature: 0.7, cache: true });

    // Ensure it's within character limit
    return description.trim().substring(0, 160);
}

/**
 * Generate complete SEO meta tags
 */
export async function generateSEOTags(
    content: string,
    type: 'conference' | 'page',
    keywords?: string[]
): Promise<SEOMetaTags> {
    const schema = `{
  "metaTitle": "string (50-60 chars)",
  "metaDescription": "string (150-160 chars)",
  "keywords": ["array", "of", "keywords"]
}`;

    const keywordText = keywords && keywords.length > 0
        ? `Focus keywords: ${keywords.join(', ')}`
        : '';

    const prompt = `Generate complete SEO meta tags for this ${type}:

Content: ${content.substring(0, 800)}
${keywordText}

Context: This is for a Nigerian civic engagement platform focused on youth participation.

Requirements:
- Meta title: 50-60 characters, compelling, keyword-rich
- Meta description: 150-160 characters, includes CTA, informative
- Keywords: 5-10 relevant keywords for Nigerian civic engagement

Generate tags that will rank well for searches related to civic engagement, youth participation, and community organizing in Nigeria.`;

    return await generateJSON<SEOMetaTags>(prompt, schema, { cache: true });
}

/**
 * Generate Open Graph tags for social sharing
 */
export async function generateOpenGraphTags(
    content: string,
    imageUrl?: string
): Promise<OpenGraphTags> {
    const schema = `{
  "title": "string (compelling social media title)",
  "description": "string (engaging description)",
  "type": "string (website or article)",
  "image": "string (image URL)"
}`;

    const imageText = imageUrl ? `Image URL: ${imageUrl}` : '';

    const prompt = `Generate Open Graph tags for social media sharing:

Content: ${content.substring(0, 500)}
${imageText}

Requirements:
- Title: Compelling for social media (different from meta title)
- Description: Engaging and shareable
- Type: "website" for pages, "article" for content
- Optimized for Facebook, Twitter, LinkedIn sharing

Make it attention-grabbing and shareable!`;

    return await generateJSON<OpenGraphTags>(prompt, schema, { cache: true });
}

/**
 * Generate Schema.org markup
 */
export async function generateSchemaMarkup(
    data: any,
    type: 'Event' | 'Article' | 'Organization'
): Promise<SchemaMarkup> {
    if (type === 'Event') {
        return {
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: data.title,
            description: data.description,
            startDate: data.date,
            location: {
                '@type': 'Place',
                name: data.venue,
                address: data.location || 'Nigeria',
            },
            organizer: {
                '@type': 'Organization',
                name: 'NextGen',
                url: 'https://nextgen.ng',
            },
        };
    }

    if (type === 'Article') {
        return {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: data.title,
            description: data.description,
            author: {
                '@type': 'Organization',
                name: 'NextGen',
            },
            publisher: {
                '@type': 'Organization',
                name: 'NextGen',
            },
        };
    }

    // Organization schema
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'NextGen',
        description: 'Youth Civic Engagement Platform in Nigeria',
        url: 'https://nextgen.ng',
    };
}

/**
 * Generate alt text for images
 */
export async function generateAltText(
    imageUrl: string,
    context: string
): Promise<string> {
    const prompt = `Generate descriptive alt text for an image in this context:

Context: ${context}
Image URL: ${imageUrl}

Requirements:
- Descriptive and specific
- Include relevant keywords naturally
- Accessible for screen readers
- 125 characters or less
- No "image of" or "picture of" prefix

Return ONLY the alt text.`;

    const altText = await generateText(prompt, { temperature: 0.5, cache: true });
    return altText.trim().substring(0, 125);
}

/**
 * Generate complete SEO package
 */
export async function generateCompleteSEO(
    content: string,
    type: 'conference' | 'page',
    data: any,
    keywords?: string[]
): Promise<{
    metaTags: SEOMetaTags;
    openGraph: OpenGraphTags;
    schema: SchemaMarkup;
}> {
    const [metaTags, openGraph] = await Promise.all([
        generateSEOTags(content, type, keywords),
        generateOpenGraphTags(content, data.imageUrl),
    ]);

    const schemaType = type === 'conference' ? 'Event' : 'Article';
    const schema = await generateSchemaMarkup(data, schemaType);

    return {
        metaTags,
        openGraph,
        schema,
    };
}
