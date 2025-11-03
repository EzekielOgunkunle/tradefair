import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

export async function generateSearchSuggestions(query, availableProducts = []) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const productContext = availableProducts.length > 0
      ? `Available product categories and titles: ${availableProducts.slice(0, 50).map(p => `${p.title} (${p.categories.join(', ')})`).join(', ')}`
      : '';

    const prompt = `You are a helpful e-commerce search assistant for an African marketplace called TradeFair.
    
User search query: "${query}"

${productContext}

Generate 5 relevant search suggestions that would help the user find what they're looking for. Consider:
- Similar products or alternative terms
- Common misspellings or variations
- Related categories
- Popular product types in African markets

Return ONLY a JSON array of strings, no other text or formatting. Example format:
["suggestion 1", "suggestion 2", "suggestion 3", "suggestion 4", "suggestion 5"]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\[.*\]/s);
    if (jsonMatch) {
      const suggestions = JSON.parse(jsonMatch[0]);
      return suggestions.slice(0, 5); // Ensure max 5 suggestions
    }
    
    return [];
  } catch (error) {
    console.error('Error generating search suggestions:', error);
    return [];
  }
}

export async function enhanceSearchQuery(query) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are helping to enhance a product search query for an e-commerce platform.

Original query: "${query}"

Extract and return a JSON object with:
- "keywords": array of main search keywords (remove filler words)
- "category": most likely product category (or null if unclear)
- "priceIntent": "budget", "mid-range", "premium", or null
- "attributes": array of product attributes mentioned (color, size, brand, etc.)

Example:
Input: "cheap red nike shoes"
Output: {"keywords": ["red", "nike", "shoes"], "category": "Footwear", "priceIntent": "budget", "attributes": ["red", "nike"]}

Return ONLY valid JSON, no other text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{.*\}/s);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return { keywords: [query], category: null, priceIntent: null, attributes: [] };
  } catch (error) {
    console.error('Error enhancing search query:', error);
    return { keywords: [query], category: null, priceIntent: null, attributes: [] };
  }
}

export async function generateProductRecommendations(userContext, products) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const productList = products.slice(0, 20).map(p => 
      `ID: ${p.id}, Title: ${p.title}, Price: ₦${p.priceCents / 100}, Categories: ${p.categories.join(', ')}, Rating: ${p.averageRating || 0}`
    ).join('\n');

    const prompt = `You are a product recommendation engine for TradeFair, an African e-commerce marketplace.

User context:
- Recent searches: ${userContext.recentSearches?.join(', ') || 'None'}
- Viewed categories: ${userContext.viewedCategories?.join(', ') || 'None'}
- Purchase history: ${userContext.purchaseCategories?.join(', ') || 'None'}

Available products:
${productList}

Based on the user's context, recommend up to 5 product IDs from the list that would be most relevant and interesting to them.
Consider their browsing patterns, preferences, and complementary products.

Return ONLY a JSON array of product IDs (strings), no other text. Example: ["id1", "id2", "id3", "id4", "id5"]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\[.*\]/s);
    if (jsonMatch) {
      const recommendedIds = JSON.parse(jsonMatch[0]);
      return products.filter(p => recommendedIds.includes(p.id));
    }
    
    return products.slice(0, 5); // Fallback to first 5
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return products.slice(0, 5); // Fallback to first 5
  }
}
