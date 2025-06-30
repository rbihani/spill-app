// Get DOM elements
const truthButton = document.querySelector('.truth-button');
const dareButton = document.querySelector('.dare-button');
const hitMeButton = document.querySelector('.hit-me-button');
const title = document.querySelector('.title');
const subtitle = document.querySelector('.subtitle');

// Track used prompts to avoid repeats
let usedTruthPrompts = new Set();
let usedDarePrompts = new Set();

// Function to get a random prompt that hasn't been used recently
function getUnusedPrompt(prompts, usedSet, mode) {
    // If we've used most prompts, reset the used set
    if (usedSet.size >= prompts.length * 0.8) {
        console.log(`Resetting used ${mode} prompts`);
        usedSet.clear();
    }
    
    // Filter out used prompts
    const availablePrompts = prompts.filter(prompt => !usedSet.has(prompt));
    
    if (availablePrompts.length === 0) {
        console.log(`No unused ${mode} prompts available, resetting`);
        usedSet.clear();
        return prompts[Math.floor(Math.random() * prompts.length)];
    }
    
    const randomPrompt = availablePrompts[Math.floor(Math.random() * availablePrompts.length)];
    usedSet.add(randomPrompt);
    console.log(`Selected unused ${mode} prompt:`, randomPrompt);
    return randomPrompt;
}

// Function to generate AI prompt
async function generateAIPrompt(mode) {
    const prompt = `Generate one original, funny, and creative ${mode.toUpperCase()} question for a Truth or Dare game. Keep it under 25 words and make it engaging for friends. Don't repeat any previous prompts.`;
    
    try {
        // Use the secure serverless function if enabled
        if (AI_CONFIG.openai.enabled) {
            console.log('Calling secure /api/openai endpoint...');
            const response = await fetch(AI_CONFIG.openai.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt,
                    model: AI_CONFIG.openai.model,
                    maxTokens: AI_CONFIG.openai.maxTokens,
                    temperature: AI_CONFIG.openai.temperature
                })
            });
            console.log('API Response status:', response.status);
            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error response:', errorText);
                throw new Error(`API error: ${response.status} - ${errorText}`);
            }
            const data = await response.json();
            let generatedText = data.result.trim();
            console.log('API generated text:', generatedText);
            if (generatedText.length < 5 || generatedText.length > 200) {
                throw new Error('API generated text too short or too long');
            }
            return generatedText;
        }
        
        console.log('OpenAI API not enabled, using fallback');
        
        // Fallback system if AI API is not enabled or fails
        if (AI_CONFIG.fallback.enabled) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const enhancedPrompts = {
                        truth: [
                            "What's the most embarrassing thing you've ever done in public?",
                            "What's your biggest fear and why?",
                            "What's the worst lie you've ever told?",
                            "What's your most embarrassing childhood memory?",
                            "What's your biggest regret?",
                            "What's the most embarrassing thing in your search history?",
                            "What's your biggest insecurity?",
                            "What's your biggest pet peeve?",
                            "What's your biggest guilty pleasure?",
                            "What's the most embarrassing thing you've worn?",
                            "What's the most embarrassing thing you've said to someone?",
                            "What's your biggest fear about the future?",
                            "What's the most embarrassing thing you've done while drunk?",
                            "What's the most embarrassing thing that happened to you in school?",
                            "What's the most embarrassing thing you've done in public?",
                            "What's your biggest secret that no one knows?",
                            "What's the most embarrassing thing you've done to impress someone?",
                            "What's your biggest dating disaster story?",
                            "What's the most embarrassing thing you've done at work?",
                            "What's your biggest fashion faux pas?"
                        ],
                        dare: [
                            "Let the group post something on your social media",
                            "Call your crush and confess your feelings",
                            "Let someone in the group text your mom",
                            "Dance to a song of the group's choice",
                            "Let the group take a photo of you and post it",
                            "Call a random number and sing happy birthday",
                            "Let someone in the group go through your phone for 2 minutes",
                            "Do your best impression of someone in the group",
                            "Let the group choose your profile picture for a week",
                            "Call your ex and apologize for something",
                            "Let someone in the group send a message to your best friend",
                            "Do a handstand or headstand for 30 seconds",
                            "Let the group choose what you eat for the next meal",
                            "Call your boss and tell them you're quitting (then say just kidding)",
                            "Let someone in the group control your phone for 5 minutes",
                            "Let the group choose your outfit for tomorrow",
                            "Call a random restaurant and order food for pickup",
                            "Let the group write your next social media post",
                            "Do your best dance move for 1 minute",
                            "Let the group choose your next haircut style",
                            "Call your mom and tell her you're getting married (then say just kidding)"
                        ]
                    };
                    
                    const prompts = enhancedPrompts[mode];
                    const usedSet = mode === 'truth' ? usedTruthPrompts : usedDarePrompts;
                    const randomPrompt = getUnusedPrompt(prompts, usedSet, mode);
                    console.log('Using fallback prompt:', randomPrompt);
                    resolve(randomPrompt);
                }, AI_CONFIG.fallback.delay);
            });
        }
        
        // Final fallback if everything else fails
        return mode === 'truth' 
            ? "What's the most embarrassing thing that happened to you in school?" 
            : "Let the group post something on your social media";
        
    } catch (error) {
        console.error('Error generating prompt:', error);
        
        // If AI API fails, use fallback
        if (AI_CONFIG.fallback.enabled) {
            console.log('AI API failed, using fallback prompts');
            return new Promise((resolve) => {
                setTimeout(() => {
                    const fallbackPrompts = {
                        truth: [
                            "What's the most embarrassing thing you've ever done in public?",
                            "What's your biggest fear and why?",
                            "What's the worst lie you've ever told?"
                        ],
                        dare: [
                            "Let the group post something on your social media",
                            "Call your crush and confess your feelings",
                            "Let someone in the group text your mom"
                        ]
                    };
                    
                    const prompts = fallbackPrompts[mode];
                    const usedSet = mode === 'truth' ? usedTruthPrompts : usedDarePrompts;
                    const randomPrompt = getUnusedPrompt(prompts, usedSet, mode);
                    console.log('Using emergency fallback prompt:', randomPrompt);
                    resolve(randomPrompt);
                }, AI_CONFIG.fallback.delay);
            });
        }
        
        // Ultimate fallback
        return mode === 'truth' 
            ? "What's the most embarrassing thing that happened to you in school?" 
            : "Let the group post something on your social media";
    }
}

// Function to show prompt with animation
function showPrompt(prompt, type) {
    // Keep the original header and subtitle unchanged
    title.textContent = 'Out of questions?';
    subtitle.textContent = 'Spill makes sure the game never dies.';
    
    // Create or update the prompt display
    let promptContainer = document.querySelector('.prompt-container');
    if (!promptContainer) {
        promptContainer = document.createElement('div');
        promptContainer.className = 'prompt-container';
        document.querySelector('.frame-12').appendChild(promptContainer);
    }
    
    // Update prompt container content
    promptContainer.innerHTML = `
        <div class="prompt-title">${type === 'truth' ? 'Truth' : 'Dare'}</div>
        <div class="prompt-text">${prompt}</div>
        <button class="another-button">
            <span class="button-text">another one.</span>
        </button>
    `;
    
    // Add animation
    promptContainer.style.opacity = '0';
    setTimeout(() => {
        promptContainer.style.transition = 'opacity 0.3s ease';
        promptContainer.style.opacity = '1';
    }, 100);
    
    // Add event listener to the new "another one" button
    const anotherButton = promptContainer.querySelector('.another-button');
    anotherButton.addEventListener('click', async () => {
        // Show loading state
        const promptText = promptContainer.querySelector('.prompt-text');
        promptText.textContent = `Generating new ${type}...`;
        promptText.style.opacity = '0.7';
        
        const newPrompt = await generateAIPrompt(type);
        promptText.textContent = newPrompt;
        promptText.style.opacity = '1';
        
        // Add click effect
        addClickEffect(anotherButton);
    });
    
    // Hide the original hit me button
    const hitMeButton = document.querySelector('.hit-me-button');
    hitMeButton.style.display = 'none';
}

// Function to reset to original state
function resetToOriginal() {
    title.textContent = 'Out of questions?';
    subtitle.textContent = 'Spill makes sure the game never dies.';
    
    // Remove prompt container if it exists
    const promptContainer = document.querySelector('.prompt-container');
    if (promptContainer) {
        promptContainer.remove();
    }
    
    // Show the original hit me button
    const hitMeButton = document.querySelector('.hit-me-button');
    hitMeButton.style.display = 'flex';
    hitMeButton.querySelector('.button-text').textContent = 'hit me with it.';
    
    // Add animation
    title.style.opacity = '0';
    subtitle.style.opacity = '0';
    
    setTimeout(() => {
        title.style.transition = 'opacity 0.3s ease';
        subtitle.style.transition = 'opacity 0.3s ease';
        title.style.opacity = '1';
        subtitle.style.opacity = '1';
    }, 100);
}

// Event listeners
truthButton.addEventListener('click', async () => {
    const truthPrompt = await generateAIPrompt('truth');
    showPrompt(truthPrompt, 'truth');
});

dareButton.addEventListener('click', async () => {
    const darePrompt = await generateAIPrompt('dare');
    showPrompt(darePrompt, 'dare');
});

hitMeButton.addEventListener('click', async () => {
    // If we're showing a prompt, generate a new one
    if (document.querySelector('.prompt-container')) {
        const promptContainer = document.querySelector('.prompt-container');
        const promptText = promptContainer.querySelector('.prompt-text');
        const promptTitle = promptContainer.querySelector('.prompt-title');
        const currentType = promptTitle.textContent.toLowerCase();
        
        // Show loading state
        promptText.textContent = `Generating new ${currentType}...`;
        promptText.style.opacity = '0.7';
        
        const newPrompt = await generateAIPrompt(currentType);
        promptText.textContent = newPrompt;
        promptText.style.opacity = '1';
    } else {
        // If we're in original state, generate a random truth or dare
        const randomType = Math.random() < 0.5 ? 'truth' : 'dare';
        const prompt = await generateAIPrompt(randomType);
        showPrompt(prompt, randomType);
    }
});

// Add some visual feedback for button clicks
function addClickEffect(button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 150);
}

truthButton.addEventListener('click', () => addClickEffect(truthButton));
dareButton.addEventListener('click', () => addClickEffect(dareButton));
hitMeButton.addEventListener('click', () => addClickEffect(hitMeButton)); 