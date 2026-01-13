import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

        // Try to list available models
        const models = await genAI.listModels();

        return NextResponse.json({
            success: true,
            message: 'Available Gemini models',
            models: models.map(m => ({
                name: m.name,
                displayName: m.displayName,
                description: m.description,
                supportedMethods: m.supportedGenerationMethods,
            })),
        });
    } catch (error: any) {
        console.error('List Models Error:', error);

        return NextResponse.json({
            success: false,
            error: error.message,
            suggestion: 'Your API key might be for an older Gemini API version. Try getting a new key from https://aistudio.google.com/app/apikey',
        }, { status: 500 });
    }
}
