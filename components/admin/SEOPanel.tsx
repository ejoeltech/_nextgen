'use client';

import { useState } from 'react';
import styles from './SEOPanel.module.css';

interface SEOPanelProps {
    content: string;
    type: 'conference' | 'page';
    initialValues?: {
        metaTitle?: string;
        metaDescription?: string;
        keywords?: string[];
    };
    onChange: (seoData: {
        metaTitle: string;
        metaDescription: string;
        keywords: string[];
    }) => void;
}

export default function SEOPanel({ content, type, initialValues, onChange }: SEOPanelProps) {
    const [metaTitle, setMetaTitle] = useState(initialValues?.metaTitle || '');
    const [metaDescription, setMetaDescription] = useState(initialValues?.metaDescription || '');
    const [keywords, setKeywords] = useState(initialValues?.keywords?.join(', ') || '');
    const [isGenerating, setIsGenerating] = useState(false);
    const [score, setScore] = useState<number | null>(null);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Calculate SEO score
    const calculateScore = () => {
        let points = 0;

        // Title (20 points)
        if (metaTitle.length >= 50 && metaTitle.length <= 60) points += 20;
        else if (metaTitle.length >= 40 && metaTitle.length <= 70) points += 15;
        else if (metaTitle.length > 0) points += 10;

        // Description (20 points)
        if (metaDescription.length >= 150 && metaDescription.length <= 160) points += 20;
        else if (metaDescription.length >= 120 && metaDescription.length <= 170) points += 15;
        else if (metaDescription.length > 0) points += 10;

        // Keywords (10 points)
        const keywordArray = keywords.split(',').map(k => k.trim()).filter(k => k);
        if (keywordArray.length >= 5 && keywordArray.length <= 10) points += 10;
        else if (keywordArray.length > 0) points += 5;

        // Content relevance (20 points) - simplified check
        if (content.length > 200) points += 20;
        else if (content.length > 100) points += 10;

        // Basic completeness (30 points)
        if (metaTitle && metaDescription && keywords) points += 30;

        return points;
    };

    // Generate suggestions
    const generateSuggestions = () => {
        const newSuggestions: string[] = [];

        if (metaTitle.length < 50) {
            newSuggestions.push('Meta title is too short. Aim for 50-60 characters.');
        } else if (metaTitle.length > 60) {
            newSuggestions.push('Meta title is too long. Keep it under 60 characters.');
        }

        if (metaDescription.length < 150) {
            newSuggestions.push('Meta description is too short. Aim for 150-160 characters.');
        } else if (metaDescription.length > 160) {
            newSuggestions.push('Meta description is too long. Keep it under 160 characters.');
        }

        const keywordArray = keywords.split(',').map(k => k.trim()).filter(k => k);
        if (keywordArray.length < 5) {
            newSuggestions.push('Add more keywords. Aim for 5-10 relevant keywords.');
        }

        if (!metaDescription.includes('Nigeria') && !metaDescription.includes('civic')) {
            newSuggestions.push('Consider including location or topic keywords in description.');
        }

        return newSuggestions;
    };

    // Auto-generate SEO
    const handleAutoGenerate = async () => {
        if (!content) {
            setError('Please add content before generating SEO');
            return;
        }

        setIsGenerating(true);
        setError(null);

        try {
            const response = await fetch('/api/ai/seo/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content,
                    type,
                    keywords: keywords.split(',').map(k => k.trim()).filter(k => k),
                }),
            });

            const data = await response.json();

            if (data.success && data.seo?.metaTags) {
                setMetaTitle(data.seo.metaTags.metaTitle);
                setMetaDescription(data.seo.metaTags.metaDescription);
                setKeywords(data.seo.metaTags.keywords.join(', '));

                // Notify parent
                onChange({
                    metaTitle: data.seo.metaTags.metaTitle,
                    metaDescription: data.seo.metaTags.metaDescription,
                    keywords: data.seo.metaTags.keywords,
                });
            } else {
                setError(data.message || 'Failed to generate SEO. Please enter manually.');
            }
        } catch (err) {
            setError('AI SEO generation unavailable. Please enter SEO details manually.');
        } finally {
            setIsGenerating(false);
        }
    };

    // Update score when values change
    const handleTitleChange = (value: string) => {
        setMetaTitle(value);
        onChange({ metaTitle: value, metaDescription, keywords: keywords.split(',').map(k => k.trim()).filter(k => k) });
    };

    const handleDescriptionChange = (value: string) => {
        setMetaDescription(value);
        onChange({ metaTitle, metaDescription: value, keywords: keywords.split(',').map(k => k.trim()).filter(k => k) });
    };

    const handleKeywordsChange = (value: string) => {
        setKeywords(value);
        onChange({ metaTitle, metaDescription, keywords: value.split(',').map(k => k.trim()).filter(k => k) });
    };

    // Calculate score on mount and when values change
    useState(() => {
        const newScore = calculateScore();
        setScore(newScore);
        setSuggestions(generateSuggestions());
    });

    const currentScore = calculateScore();
    const scoreColor = currentScore >= 80 ? '#0F5C4A' : currentScore >= 60 ? '#F59E0B' : '#C01F28';

    return (
        <div className={styles.seoPanel}>
            <div className={styles.header}>
                <h3 className={styles.title}>SEO Optimization</h3>
                <div className={styles.scoreContainer}>
                    <span className={styles.scoreLabel}>SEO Score:</span>
                    <span className={styles.score} style={{ color: scoreColor }}>
                        {currentScore}/100
                    </span>
                </div>
            </div>

            <button
                type="button"
                onClick={handleAutoGenerate}
                className={styles.generateButton}
                disabled={isGenerating || !content}
            >
                {isGenerating ? '🤖 Generating...' : '🤖 Auto-Generate SEO'}
            </button>

            {error && (
                <div className={styles.error}>
                    ⚠️ {error}
                </div>
            )}

            <div className={styles.formGroup}>
                <label htmlFor="metaTitle" className={styles.label}>
                    Meta Title *
                </label>
                <input
                    type="text"
                    id="metaTitle"
                    value={metaTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className={styles.input}
                    placeholder="Compelling title for search results (50-60 chars)"
                    maxLength={70}
                />
                <div className={styles.charCount}>
                    {metaTitle.length}/60 characters
                    {metaTitle.length >= 50 && metaTitle.length <= 60 && ' ✓'}
                </div>
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="metaDescription" className={styles.label}>
                    Meta Description *
                </label>
                <textarea
                    id="metaDescription"
                    value={metaDescription}
                    onChange={(e) => handleDescriptionChange(e.target.value)}
                    className={styles.textarea}
                    placeholder="Engaging description for search results (150-160 chars)"
                    rows={3}
                    maxLength={170}
                />
                <div className={styles.charCount}>
                    {metaDescription.length}/160 characters
                    {metaDescription.length >= 150 && metaDescription.length <= 160 && ' ✓'}
                </div>
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="keywords" className={styles.label}>
                    Keywords
                </label>
                <input
                    type="text"
                    id="keywords"
                    value={keywords}
                    onChange={(e) => handleKeywordsChange(e.target.value)}
                    className={styles.input}
                    placeholder="civic engagement, youth, Nigeria, democracy (comma-separated)"
                />
                <div className={styles.hint}>
                    {keywords.split(',').filter(k => k.trim()).length} keywords
                    {keywords.split(',').filter(k => k.trim()).length >= 5 && keywords.split(',').filter(k => k.trim()).length <= 10 && ' ✓'}
                </div>
            </div>

            {generateSuggestions().length > 0 && (
                <div className={styles.suggestions}>
                    <h4 className={styles.suggestionsTitle}>💡 Suggestions:</h4>
                    <ul className={styles.suggestionsList}>
                        {generateSuggestions().map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className={styles.preview}>
                <h4 className={styles.previewTitle}>Search Preview:</h4>
                <div className={styles.searchPreview}>
                    <div className={styles.previewTitle}>{metaTitle || 'Your title will appear here'}</div>
                    <div className={styles.previewUrl}>nextgen.ng › {type}</div>
                    <div className={styles.previewDescription}>
                        {metaDescription || 'Your description will appear here'}
                    </div>
                </div>
            </div>
        </div>
    );
}
