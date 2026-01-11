'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './PageForm.module.css';
import Notification, { NotificationType } from './Notification';

interface PageFormProps {
    pageId?: string;
    initialData?: {
        title: string;
        slug: string;
        body: string;
        heroImage?: string;
        metaDescription?: string;
        metaKeywords?: string;
        status?: 'draft' | 'published';
    };
}

interface NotificationState {
    message: string;
    type: NotificationType;
}

export default function PageForm({ pageId, initialData }: PageFormProps) {
    const router = useRouter();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [title, setTitle] = useState(initialData?.title || '');
    const [slug, setSlug] = useState(initialData?.slug || '');
    const [body, setBody] = useState(initialData?.body || '');
    const [heroImage, setHeroImage] = useState(initialData?.heroImage || '');
    const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || '');
    const [metaKeywords, setMetaKeywords] = useState(initialData?.metaKeywords || '');
    const [status, setStatus] = useState<'draft' | 'published'>(initialData?.status || 'draft');
    const [showPreview, setShowPreview] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<NotificationState | null>(null);

    // Auto-generate slug from title
    useEffect(() => {
        if (!pageId && title) {
            const generatedSlug = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
            setSlug(generatedSlug);
        }
    }, [title, pageId]);

    // Markdown formatting helpers
    const insertMarkdown = (before: string, after: string = '', placeholder: string = 'text') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = body.substring(start, end) || placeholder;
        const newText = body.substring(0, start) + before + selectedText + after + body.substring(end);

        setBody(newText);

        // Set cursor position
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(
                start + before.length,
                start + before.length + selectedText.length
            );
        }, 0);
    };

    const formatBold = () => insertMarkdown('**', '**', 'bold text');
    const formatItalic = () => insertMarkdown('*', '*', 'italic text');
    const formatHeading = (level: number) => insertMarkdown('#'.repeat(level) + ' ', '', 'Heading');
    const formatList = () => insertMarkdown('- ', '', 'List item');
    const formatNumberedList = () => insertMarkdown('1. ', '', 'List item');
    const formatLink = () => insertMarkdown('[', '](url)', 'link text');
    const formatImage = () => insertMarkdown('![', '](image-url)', 'alt text');
    const formatCode = () => insertMarkdown('`', '`', 'code');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const url = pageId ? `/api/admin/pages/${pageId}` : '/api/admin/pages';
            const method = pageId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    slug,
                    body,
                    heroImage,
                    metaDescription,
                    metaKeywords,
                    status
                }),
            });

            const data = await response.json();

            if (data.success) {
                setNotification({
                    message: pageId ? 'Page updated successfully!' : 'Page created successfully!',
                    type: 'success',
                });
                setTimeout(() => {
                    router.push('/admin/pages');
                }, 1500);
            } else {
                setNotification({
                    message: data.message || 'Failed to save page',
                    type: 'error',
                });
            }
        } catch (error) {
            setNotification({
                message: 'An error occurred while saving the page',
                type: 'error',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Simple markdown to HTML converter for preview
    const renderPreview = (markdown: string) => {
        let html = markdown
            // Headings
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            // Bold
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Italic
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Links
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
            // Images
            .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" />')
            // Code
            .replace(/`(.*?)`/g, '<code>$1</code>')
            // Line breaks
            .replace(/\n/g, '<br />');

        return html;
    };

    return (
        <>
            <form onSubmit={handleSubmit} className={styles.form}>
                {/* Title */}
                <div className={styles.formGroup}>
                    <label htmlFor="title" className={styles.label}>
                        Page Title *
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={styles.input}
                        required
                        placeholder="Enter a descriptive title"
                    />
                    <span className={styles.hint}>This will appear as the page heading</span>
                </div>

                {/* Slug */}
                <div className={styles.formGroup}>
                    <label htmlFor="slug" className={styles.label}>
                        URL Slug *
                    </label>
                    <input
                        type="text"
                        id="slug"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className={styles.input}
                        required
                        placeholder="auto-generated-from-title"
                    />
                    <span className={styles.hint}>Page URL: /pages/{slug || 'your-slug'}</span>
                </div>

                {/* Status */}
                <div className={styles.formGroup}>
                    <label htmlFor="status" className={styles.label}>
                        Status *
                    </label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                        className={styles.select}
                    >
                        <option value="draft">Draft (Not visible to public)</option>
                        <option value="published">Published (Visible to public)</option>
                    </select>
                    <span className={styles.hint}>Drafts can be edited without affecting the live site</span>
                </div>

                {/* Hero Image */}
                <div className={styles.formGroup}>
                    <label htmlFor="heroImage" className={styles.label}>
                        Hero Image URL
                    </label>
                    <input
                        type="url"
                        id="heroImage"
                        value={heroImage}
                        onChange={(e) => setHeroImage(e.target.value)}
                        className={styles.input}
                        placeholder="https://example.com/image.jpg"
                    />
                    <span className={styles.hint}>Optional: Large image displayed at the top of the page</span>
                </div>

                {/* Meta Description */}
                <div className={styles.formGroup}>
                    <label htmlFor="metaDescription" className={styles.label}>
                        Meta Description (SEO)
                    </label>
                    <textarea
                        id="metaDescription"
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        className={styles.textarea}
                        rows={3}
                        maxLength={160}
                        placeholder="Brief description for search engines (160 characters max)"
                    />
                    <span className={styles.hint}>
                        {metaDescription.length}/160 characters - Appears in search results
                    </span>
                </div>

                {/* Meta Keywords */}
                <div className={styles.formGroup}>
                    <label htmlFor="metaKeywords" className={styles.label}>
                        Keywords (SEO)
                    </label>
                    <input
                        type="text"
                        id="metaKeywords"
                        value={metaKeywords}
                        onChange={(e) => setMetaKeywords(e.target.value)}
                        className={styles.input}
                        placeholder="keyword1, keyword2, keyword3"
                    />
                    <span className={styles.hint}>Comma-separated keywords for search engines</span>
                </div>

                {/* Body Content with Formatting Toolbar */}
                <div className={styles.formGroup}>
                    <div className={styles.editorHeader}>
                        <label htmlFor="body" className={styles.label}>
                            Page Content *
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowPreview(!showPreview)}
                            className={styles.previewToggle}
                        >
                            {showPreview ? '📝 Edit' : '👁️ Preview'}
                        </button>
                    </div>

                    {!showPreview && (
                        <>
                            <div className={styles.toolbar}>
                                <button type="button" onClick={formatBold} title="Bold" className={styles.toolbarBtn}>
                                    <strong>B</strong>
                                </button>
                                <button type="button" onClick={formatItalic} title="Italic" className={styles.toolbarBtn}>
                                    <em>I</em>
                                </button>
                                <button type="button" onClick={() => formatHeading(1)} title="Heading 1" className={styles.toolbarBtn}>
                                    H1
                                </button>
                                <button type="button" onClick={() => formatHeading(2)} title="Heading 2" className={styles.toolbarBtn}>
                                    H2
                                </button>
                                <button type="button" onClick={() => formatHeading(3)} title="Heading 3" className={styles.toolbarBtn}>
                                    H3
                                </button>
                                <button type="button" onClick={formatList} title="Bullet List" className={styles.toolbarBtn}>
                                    • List
                                </button>
                                <button type="button" onClick={formatNumberedList} title="Numbered List" className={styles.toolbarBtn}>
                                    1. List
                                </button>
                                <button type="button" onClick={formatLink} title="Link" className={styles.toolbarBtn}>
                                    🔗 Link
                                </button>
                                <button type="button" onClick={formatImage} title="Image" className={styles.toolbarBtn}>
                                    🖼️ Image
                                </button>
                                <button type="button" onClick={formatCode} title="Code" className={styles.toolbarBtn}>
                                    {'</>'}
                                </button>
                            </div>
                            <textarea
                                ref={textareaRef}
                                id="body"
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                className={styles.textarea}
                                rows={15}
                                required
                                placeholder="Write your content here... Use the buttons above to format text."
                            />
                            <span className={styles.hint}>
                                {body.split(/\s+/).filter(w => w).length} words, {body.length} characters
                            </span>
                        </>
                    )}

                    {showPreview && (
                        <div className={styles.preview}>
                            <div
                                className={styles.previewContent}
                                dangerouslySetInnerHTML={{ __html: renderPreview(body) }}
                            />
                        </div>
                    )}
                </div>

                {/* Markdown Help */}
                <details className={styles.helpSection}>
                    <summary className={styles.helpSummary}>📖 Formatting Guide</summary>
                    <div className={styles.helpContent}>
                        <p><strong>**bold text**</strong> → <strong>bold text</strong></p>
                        <p><em>*italic text*</em> → <em>italic text</em></p>
                        <p># Heading 1</p>
                        <p>## Heading 2</p>
                        <p>### Heading 3</p>
                        <p>- Bullet point</p>
                        <p>1. Numbered list</p>
                        <p>[link text](url) → <a href="#">link text</a></p>
                        <p>![alt text](image-url) → Image</p>
                        <p>`code` → <code>code</code></p>
                    </div>
                </details>

                {/* Action Buttons */}
                <div className={styles.actions}>
                    <button
                        type="button"
                        onClick={() => router.push('/admin/pages')}
                        className={`${styles.button} ${styles.buttonSecondary}`}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={`${styles.button} ${styles.buttonPrimary}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : pageId ? 'Update Page' : 'Create Page'}
                    </button>
                </div>
            </form>

            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
        </>
    );
}
