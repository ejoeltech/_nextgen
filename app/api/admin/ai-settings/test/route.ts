import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

const settingsPath = path.join(process.cwd(), 'data', 'ai-settings.json');

// Test connection to selected AI provider
export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized', success: false },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { provider, apiKey, model, ollamaUrl } = body;

        let testResult = { success: false, message: '' };

        switch (provider) {
            case 'gemini':
                testResult = await testGemini(apiKey, model);
                break;
            case 'openai':
                testResult = await testOpenAI(apiKey, model);
                break;
            case 'huggingface':
                testResult = await testHuggingFace(apiKey, model);
                break;
            case 'ollama':
                testResult = await testOllama(ollamaUrl, model);
                break;
            default:
                return NextResponse.json(
                    { message: 'Invalid provider', success: false },
                    { status: 400 }
                );
        }

        return NextResponse.json(testResult, { status: testResult.success ? 200 : 500 });
    } catch (error) {
        console.error('Error testing AI connection:', error);
        return NextResponse.json(
            { message: 'Failed to test connection', success: false },
            { status: 500 }
        );
    }
}

async function testGemini(apiKey: string, model: string) {
    try {
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(apiKey);
        const aiModel = genAI.getGenerativeModel({ model });

        const result = await aiModel.generateContent({
            contents: [{ role: 'user', parts: [{ text: 'Hello' }] }],
        });

        return {
            success: true,
            message: 'Successfully connected to Google Gemini',
            response: result.response.text().substring(0, 50),
        };
    } catch (error: any) {
        return {
            success: false,
            message: `Gemini connection failed: ${error.message}`,
        };
    }
}

async function testOpenAI(apiKey: string, model: string) {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model,
                messages: [{ role: 'user', content: 'Hello' }],
                max_tokens: 10,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        return {
            success: true,
            message: 'Successfully connected to OpenAI',
        };
    } catch (error: any) {
        return {
            success: false,
            message: `OpenAI connection failed: ${error.message}`,
        };
    }
}

async function testHuggingFace(apiKey: string, model: string) {
    try {
        const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ inputs: 'Hello' }),
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        return {
            success: true,
            message: 'Successfully connected to Hugging Face',
        };
    } catch (error: any) {
        return {
            success: false,
            message: `Hugging Face connection failed: ${error.message}`,
        };
    }
}

async function testOllama(ollamaUrl: string, model: string) {
    try {
        const response = await fetch(`${ollamaUrl}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model,
                prompt: 'Hello',
                stream: false,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        return {
            success: true,
            message: 'Successfully connected to Ollama',
        };
    } catch (error: any) {
        return {
            success: false,
            message: `Ollama connection failed: ${error.message}. Make sure Ollama is running locally.`,
        };
    }
}
