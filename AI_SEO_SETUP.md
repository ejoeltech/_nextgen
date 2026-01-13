# AI SEO Optimization - Setup Guide

## Getting Your Gemini API Key

1. **Go to Google AI Studio**
   - Visit: https://makersuite.google.com/app/apikey
   - Sign in with your Google account

2. **Create API Key**
   - Click "Create API Key"
   - Select "Create API key in new project" or choose existing project
   - Copy the generated API key

3. **Add to Environment Variables**
   - Open your `.env.local` file
   - Add: `GEMINI_API_KEY=your_api_key_here`
   - Save the file

4. **Restart Development Server**
   ```bash
   # Stop the current server (Ctrl+C)
   npm run dev
   ```

---

## Testing the AI SEO Features

### 1. Test SEO Generation API

```bash
curl -X POST http://localhost:3000/api/ai/seo/generate \
  -H "Content-Type: application/json" \
  -H "Cookie: session=your_session_token" \
  -d '{
    "content": "Join us for the Youth Civic Engagement Summit in Lagos. Learn about democracy, participate in workshops, and network with fellow young leaders.",
    "type": "conference",
    "keywords": ["civic engagement", "youth", "Lagos"]
  }'
```

### 2. Expected Response

```json
{
  "success": true,
  "message": "SEO content generated successfully",
  "seo": {
    "metaTags": {
      "metaTitle": "Youth Civic Engagement Summit 2026 | Lagos, Nigeria",
      "metaDescription": "Join 500+ young Nigerians at the Youth Civic Engagement Summit in Lagos. Learn, network, and shape Nigeria's future. Register now!",
      "keywords": ["civic engagement", "youth summit", "Lagos", "Nigeria", "democracy"]
    }
  }
}
```

---

## Usage in Your Code

### Generate SEO for Conference

```typescript
import { generateSEOTags } from '@/lib/ai/seo-generator';

const seo = await generateSEOTags(
  conferenceDescription,
  'conference',
  ['civic engagement', 'youth', 'Lagos']
);

console.log(seo.metaTitle);
console.log(seo.metaDescription);
```

### Generate Complete SEO Package

```typescript
import { generateCompleteSEO } from '@/lib/ai/seo-generator';

const completeSEO = await generateCompleteSEO(
  content,
  'conference',
  {
    title: 'Youth Summit',
    description: '...',
    date: '2026-03-15',
    venue: 'Lagos',
    imageUrl: '/conference-image.jpg'
  },
  ['civic engagement', 'youth']
);

// Use the generated SEO
const { metaTags, openGraph, schema } = completeSEO;
```

---

## Features Available

✅ **Meta Title Generation** - SEO-optimized titles (50-60 chars)  
✅ **Meta Description** - Compelling descriptions (150-160 chars)  
✅ **Keywords Extraction** - Relevant keywords for your content  
✅ **Open Graph Tags** - Social media optimization  
✅ **Schema Markup** - Structured data for search engines  
✅ **Alt Text Generation** - Accessible image descriptions

---

## Cost Monitoring

- Each SEO generation uses ~750 tokens
- 100 conferences = ~75,000 tokens
- Cost: ~$0.05 per 1000 tokens
- Monthly estimate: $3-5 for typical usage

---

## Troubleshooting

### "Gemini AI Error"
- Check that `GEMINI_API_KEY` is set in `.env.local`
- Verify API key is valid
- Check rate limits (60 requests/minute)

### "Rate limit exceeded"
- Wait 1 minute and try again
- Responses are cached for 24 hours
- Consider reducing frequency of requests

### "Failed to parse AI response"
- This is rare - the AI sometimes returns invalid JSON
- The system will retry automatically
- Contact support if it persists

---

## Next Steps

1. ✅ Get Gemini API key
2. ✅ Add to `.env.local`
3. ✅ Restart server
4. ⏳ Test API endpoint
5. ⏳ Integrate into admin UI
6. ⏳ Generate SEO for existing content

---

**Need Help?** Check the implementation plan or contact support.
