// AI API Configuration
// Now using a secure serverless function for OpenAI API calls
const AI_CONFIG = {
    openai: {
        enabled: true,
        endpoint: '/api/openai', // Use the Vercel serverless function
        model: 'gpt-3.5-turbo',
        maxTokens: 50,
        temperature: 0.8
    },
    
    // Fallback settings (used when no AI API is configured)
    fallback: {
        enabled: true,
        delay: 800
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AI_CONFIG;
} 