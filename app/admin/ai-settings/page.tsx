'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import Notification, { NotificationType } from '@/components/admin/Notification';
import styles from './ai-settings.module.css';

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
}

interface NotificationState {
    message: string;
    type: NotificationType;
}

const AI_PROVIDERS = [
    { value: 'gemini', label: 'Google Gemini', cost: 'Paid (~$0.05/1K tokens)', free: false },
    { value: 'openai', label: 'OpenAI GPT', cost: 'Paid (~$0.50/1K tokens)', free: false },
    { value: 'huggingface', label: 'Hugging Face (Mistral)', cost: 'FREE (rate limited)', free: true },
    { value: 'ollama', label: 'Ollama (Local)', cost: 'FREE (runs locally)', free: true },
];

export default function AISettingsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState(false);
    const [notification, setNotification] = useState<NotificationState | null>(null);

    const [provider, setProvider] = useState<'gemini' | 'openai' | 'huggingface' | 'ollama'>('gemini');
    const [apiKeys, setApiKeys] = useState({
        gemini: '',
        openai: '',
        huggingface: '',
    });
    const [models, setModels] = useState({
        gemini: 'gemini-1.5-flash',
        openai: 'gpt-3.5-turbo',
        huggingface: 'mistralai/Mistral-7B-Instruct-v0.2',
        ollama: 'llama2',
    });
    const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434');

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const response = await fetch('/api/admin/ai-settings');
            const data = await response.json();

            if (data.success) {
                const settings = data.settings;
                setProvider(settings.provider);
                setModels(settings.models);
                setOllamaUrl(settings.ollamaUrl);
                // API keys are masked in response
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);

        try {
            const response = await fetch('/api/admin/ai-settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    provider,
                    apiKeys,
                    models,
                    ollamaUrl,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setNotification({
                    message: 'AI settings saved successfully!',
                    type: 'success',
                });
            } else {
                setNotification({
                    message: data.message || 'Failed to save settings',
                    type: 'error',
                });
            }
        } catch (error) {
            setNotification({
                message: 'An error occurred while saving settings',
                type: 'error',
            });
        } finally {
            setSaving(false);
        }
    };

    const handleTest = async () => {
        setTesting(true);

        try {
            const response = await fetch('/api/admin/ai-settings/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    provider,
                    apiKey: apiKeys[provider as keyof typeof apiKeys] || '',
                    model: models[provider],
                    ollamaUrl,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setNotification({
                    message: `✅ ${data.message}`,
                    type: 'success',
                });
            } else {
                setNotification({
                    message: `❌ ${data.message}`,
                    type: 'error',
                });
            }
        } catch (error) {
            setNotification({
                message: 'Failed to test connection',
                type: 'error',
            });
        } finally {
            setTesting(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className={styles.container}>
                    <div className={styles.loading}>Loading AI settings...</div>
                </div>
            </AdminLayout>
        );
    }

    const currentProvider = AI_PROVIDERS.find(p => p.value === provider);
    const requiresApiKey = provider !== 'ollama';

    return (
        <AdminLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>AI Settings</h1>
                    <p className={styles.subtitle}>
                        Configure AI provider for SEO generation and content optimization
                    </p>
                </div>

                <div className={styles.card}>
                    <div className={styles.section}>
                        <label htmlFor="provider" className={styles.label}>
                            AI Provider *
                        </label>
                        <select
                            id="provider"
                            value={provider}
                            onChange={(e) => setProvider(e.target.value as any)}
                            className={styles.select}
                        >
                            {AI_PROVIDERS.map(p => (
                                <option key={p.value} value={p.value}>
                                    {p.label} - {p.cost} {p.free && '🆓'}
                                </option>
                            ))}
                        </select>
                        <div className={styles.hint}>
                            {currentProvider?.free ? '✅ Free and open-source option' : '💰 Paid API service'}
                        </div>
                    </div>

                    {requiresApiKey && (
                        <div className={styles.section}>
                            <label htmlFor="apiKey" className={styles.label}>
                                API Key *
                            </label>
                            <input
                                type="password"
                                id="apiKey"
                                value={apiKeys[provider as keyof typeof apiKeys] || ''}
                                onChange={(e) => setApiKeys({
                                    ...apiKeys,
                                    [provider]: e.target.value,
                                })}
                                className={styles.input}
                                placeholder={`Enter your ${currentProvider?.label} API key`}
                            />
                            <div className={styles.hint}>
                                {provider === 'gemini' && 'Get your key from https://aistudio.google.com/app/apikey'}
                                {provider === 'openai' && 'Get your key from https://platform.openai.com/api-keys'}
                                {provider === 'huggingface' && 'Get your key from https://huggingface.co/settings/tokens'}
                            </div>
                        </div>
                    )}

                    <div className={styles.section}>
                        <label htmlFor="model" className={styles.label}>
                            Model
                        </label>
                        <input
                            type="text"
                            id="model"
                            value={models[provider]}
                            onChange={(e) => setModels({
                                ...models,
                                [provider]: e.target.value,
                            })}
                            className={styles.input}
                            placeholder="Model name"
                        />
                        <div className={styles.hint}>
                            {provider === 'gemini' && 'Recommended: gemini-1.5-flash or gemini-1.5-pro'}
                            {provider === 'openai' && 'Recommended: gpt-3.5-turbo or gpt-4'}
                            {provider === 'huggingface' && 'Recommended: mistralai/Mistral-7B-Instruct-v0.2'}
                            {provider === 'ollama' && 'Available: llama2, mistral, phi, codellama'}
                        </div>
                    </div>

                    {provider === 'ollama' && (
                        <div className={styles.section}>
                            <label htmlFor="ollamaUrl" className={styles.label}>
                                Ollama Server URL
                            </label>
                            <input
                                type="text"
                                id="ollamaUrl"
                                value={ollamaUrl}
                                onChange={(e) => setOllamaUrl(e.target.value)}
                                className={styles.input}
                                placeholder="http://localhost:11434"
                            />
                            <div className={styles.hint}>
                                Make sure Ollama is installed and running locally
                            </div>
                        </div>
                    )}

                    <div className={styles.infoBox}>
                        <h3 className={styles.infoTitle}>ℹ️ About {currentProvider?.label}</h3>
                        <ul className={styles.infoList}>
                            {provider === 'gemini' && (
                                <>
                                    <li>Fast and cost-effective</li>
                                    <li>Excellent quality for SEO generation</li>
                                    <li>~$0.05 per 1,000 tokens</li>
                                </>
                            )}
                            {provider === 'openai' && (
                                <>
                                    <li>Industry-leading quality</li>
                                    <li>Reliable and well-documented</li>
                                    <li>~$0.50 per 1,000 tokens (gpt-3.5-turbo)</li>
                                </>
                            )}
                            {provider === 'huggingface' && (
                                <>
                                    <li>100% FREE with rate limits</li>
                                    <li>Open-source Mistral model</li>
                                    <li>Good quality for SEO tasks</li>
                                </>
                            )}
                            {provider === 'ollama' && (
                                <>
                                    <li>100% FREE - runs on your computer</li>
                                    <li>Complete privacy - no data sent externally</li>
                                    <li>Unlimited usage</li>
                                    <li>Requires local installation</li>
                                </>
                            )}
                        </ul>
                    </div>

                    <div className={styles.actions}>
                        <button
                            type="button"
                            onClick={handleTest}
                            className={`${styles.button} ${styles.buttonSecondary}`}
                            disabled={testing || saving}
                        >
                            {testing ? 'Testing...' : '🔌 Test Connection'}
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            className={`${styles.button} ${styles.buttonPrimary}`}
                            disabled={saving || testing}
                        >
                            {saving ? 'Saving...' : '💾 Save Settings'}
                        </button>
                    </div>
                </div>

                {notification && (
                    <Notification
                        message={notification.message}
                        type={notification.type}
                        onClose={() => setNotification(null)}
                    />
                )}
            </div>
        </AdminLayout>
    );
}
