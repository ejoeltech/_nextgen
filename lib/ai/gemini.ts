/**
 * Gemini AI Service
 * Core service for interacting with Google's Gemini AI
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Cache for AI responses (24 hours)
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Rate limiting
let requestCount = 0;
let resetTime = Date.now() + 60000; // Reset every minute
const MAX_REQUESTS_PER_MINUTE = 60;

/**
 * Get cached response if available
 */
function getCached(key: string): any | null {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }
    cache.delete(key);
    return null;
}

/**
 * Set cache
 */
function setCache(key: string, data: any): void {
    cache.set(key, { data, timestamp: Date.now() });
}

/**
 * Check rate limit
 */
function checkRateLimit(): boolean {
    const now = Date.now();
    if (now > resetTime) {
        requestCount = 0;
        resetTime = now + 60000;
    }

    if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
        return false;
    }

    requestCount++;
    return true;
}

/**
 * Generate text using Gemini AI
 */
export async function generateText(
    prompt: string,
    options: {
        temperature?: number;
        maxTokens?: number;
        cache?: boolean;
    } = {}
): Promise<string> {
    const { temperature = 0.7, maxTokens = 1000, cache: useCache = true } = options;

    // Check cache
    if (useCache) {
        const cacheKey = `${prompt}-${temperature}`;
        const cached = getCached(cacheKey);
        if (cached) {
            return cached;
        }
    }

    // Check rate limit
    if (!checkRateLimit()) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
                temperature,
                maxOutputTokens: maxTokens,
            },
        });

        const response = result.response;
        const text = response.text();

        // Cache the response
        if (useCache) {
            const cacheKey = `${prompt}-${temperature}`;
            setCache(cacheKey, text);
        }

        return text;
    } catch (error: any) {
        // Log detailed error information
        console.error('=== Gemini AI Error Details ===');
        console.error('Message:', error.message);
        console.error('Name:', error.name);
        console.error('Stack:', error.stack);

        if (error.response) {
            console.error('Response:', JSON.stringify(error.response, null, 2));
        }

        // Provide helpful error messages based on error type
        if (error.message?.toLowerCase().includes('api key') || error.message?.toLowerCase().includes('invalid')) {
            throw new Error('Invalid API key. Get a new one from https://makersuite.google.com/app/apikey');
        }

        if (error.message?.toLowerCase().includes('quota')) {
            throw new Error('API quota exceeded. Check your usage at https://makersuite.google.com');
        }

        if (error.message?.toLowerCase().includes('permission') || error.message?.toLowerCase().includes('403')) {
            throw new Error('API permission denied. Enable Gemini API in your Google Cloud project.');
        }

        throw new Error(`Gemini API Error: ${error.message || 'Unknown error. Check console for details.'}`);
    }
}

/**
 * Generate structured JSON response
 */
export async function generateJSON<T>(
    prompt: string,
    schema: string,
    options: {
        temperature?: number;
        cache?: boolean;
    } = {}
): Promise<T> {
    const fullPrompt = `${prompt}\n\nRespond with valid JSON matching this schema:\n${schema}\n\nReturn ONLY the JSON, no explanation.`;

    const text = await generateText(fullPrompt, {
        ...options,
        temperature: options.temperature || 0.5, // Lower temperature for structured output
    });

    try {
        // Extract JSON from response (in case AI adds explanation)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No JSON found in response');
        }

        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error('JSON Parse Error:', error);
        console.error('Response:', text);
        throw new Error('Failed to parse AI response as JSON');
    }
}

/**
 * Analyze content and return insights
 */
export async function analyzeContent(
    content: string,
    analysisType: 'seo' | 'readability' | 'keywords' | 'structure'
): Promise<any> {
    const prompts = {
        seo: `Analyze this content for SEO effectiveness:\n\n${content}\n\nProvide: keyword density, meta tag suggestions, improvement areas.`,
        readability: `Analyze the readability of this content:\n\n${content}\n\nProvide: reading level, sentence complexity, suggestions.`,
        keywords: `Extract and analyze keywords from this content:\n\n${content}\n\nProvide: main keywords, keyword frequency, LSI keywords.`,
        structure: `Analyze the structure of this content:\n\n${content}\n\nProvide: heading hierarchy, paragraph length, list usage.`,
    };

    return await generateText(prompts[analysisType], { temperature: 0.3 });
}

/**
 * Clear cache (for testing or manual refresh)
 */
export function clearCache(): void {
    cache.clear();
}

/**
 * Get cache stats
 */
export function getCacheStats(): { size: number; oldestEntry: number | null } {
    let oldestTimestamp: number | null = null;

    for (const entry of cache.values()) {
        if (oldestTimestamp === null || entry.timestamp < oldestTimestamp) {
            oldestTimestamp = entry.timestamp;
        }
    }

    return {
        size: cache.size,
        oldestEntry: oldestTimestamp,
    };
}
