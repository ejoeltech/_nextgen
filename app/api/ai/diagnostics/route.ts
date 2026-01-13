import { NextResponse } from 'next/server';

export async function GET() {
    const diagnostics = {
        apiKeySet: !!process.env.GEMINI_API_KEY,
        apiKeyLength: process.env.GEMINI_API_KEY?.length || 0,
        apiKeyPrefix: process.env.GEMINI_API_KEY?.substring(0, 10) + '...',
        nodeEnv: process.env.NODE_ENV,
    };

    return NextResponse.json({
        message: 'Gemini API Configuration Check',
        diagnostics,
        troubleshooting: {
            apiKeySet: diagnostics.apiKeySet
                ? '✅ API key is set'
                : '❌ API key is NOT set in .env.local',
            nextSteps: diagnostics.apiKeySet
                ? [
                    'API key appears to be set',
                    'Try getting a new API key from https://makersuite.google.com/app/apikey',
                    'Make sure the key has no extra spaces',
                    'Restart the dev server after updating .env.local'
                ]
                : [
                    'Add GEMINI_API_KEY=your_key_here to .env.local',
                    'Get your key from https://makersuite.google.com/app/apikey',
                    'Restart the dev server'
                ]
        }
    });
}
