// Sample config file for local development
const AI_CONFIG = {
    openai: {
        enabled: true,
        endpoint: '/api/openai',
        model: 'gpt-3.5-turbo',
        maxTokens: 50,
        temperature: 0.8
    },
    fallback: {
        enabled: true,
        delay: 800
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AI_CONFIG;
}
  