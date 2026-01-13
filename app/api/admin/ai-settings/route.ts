import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

interface AISettings {
    provider: 'gemini' | 'openai' | 'huggingface' | 'ollama';
    apiKeys: {
        gemini: string;
        openai: string;
        huggingface: string;
    };
    models: {
        gemini: string;
        openai: string;
        huggingface: string;
        ollama: string;
    };
    ollamaUrl: string;
    updatedAt: string;
}

const settingsPath = path.join(process.cwd(), 'data', 'ai-settings.json');

function readSettings(): AISettings {
    try {
        const fileContent = fs.readFileSync(settingsPath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        // Return default settings if file doesn't exist
        return {
            provider: 'gemini',
            apiKeys: {
                gemini: process.env.GEMINI_API_KEY || '',
                openai: process.env.OPENAI_API_KEY || '',
                huggingface: process.env.HUGGINGFACE_API_KEY || '',
            },
            models: {
                gemini: 'gemini-1.5-flash',
                openai: 'gpt-3.5-turbo',
                huggingface: 'mistralai/Mistral-7B-Instruct-v0.2',
                ollama: 'llama2',
            },
            ollamaUrl: process.env.OLLAMA_URL || 'http://localhost:11434',
            updatedAt: new Date().toISOString(),
        };
    }
}

function writeSettings(settings: AISettings): void {
    settings.updatedAt = new Date().toISOString();
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), 'utf-8');
}

// GET - Get current AI settings
export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized', success: false },
                { status: 401 }
            );
        }

        const settings = readSettings();

        // Don't expose full API keys in response
        const safeSettings = {
            ...settings,
            apiKeys: {
                gemini: settings.apiKeys.gemini ? '••••••••' + settings.apiKeys.gemini.slice(-4) : '',
                openai: settings.apiKeys.openai ? '••••••••' + settings.apiKeys.openai.slice(-4) : '',
                huggingface: settings.apiKeys.huggingface ? '••••••••' + settings.apiKeys.huggingface.slice(-4) : '',
            },
        };

        return NextResponse.json(
            { settings: safeSettings, success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error reading AI settings:', error);
        return NextResponse.json(
            { message: 'Failed to read AI settings', success: false },
            { status: 500 }
        );
    }
}

// POST - Save AI settings
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
        const { provider, apiKeys, models, ollamaUrl } = body;

        // Validate provider
        if (!['gemini', 'openai', 'huggingface', 'ollama'].includes(provider)) {
            return NextResponse.json(
                { message: 'Invalid AI provider', success: false },
                { status: 400 }
            );
        }

        const currentSettings = readSettings();

        // Update settings
        const newSettings: AISettings = {
            provider,
            apiKeys: {
                gemini: apiKeys?.gemini || currentSettings.apiKeys.gemini,
                openai: apiKeys?.openai || currentSettings.apiKeys.openai,
                huggingface: apiKeys?.huggingface || currentSettings.apiKeys.huggingface,
            },
            models: {
                gemini: models?.gemini || currentSettings.models.gemini,
                openai: models?.openai || currentSettings.models.openai,
                huggingface: models?.huggingface || currentSettings.models.huggingface,
                ollama: models?.ollama || currentSettings.models.ollama,
            },
            ollamaUrl: ollamaUrl || currentSettings.ollamaUrl,
            updatedAt: new Date().toISOString(),
        };

        writeSettings(newSettings);

        return NextResponse.json(
            { message: 'AI settings saved successfully', success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error saving AI settings:', error);
        return NextResponse.json(
            { message: 'Failed to save AI settings', success: false },
            { status: 500 }
        );
    }
}
