# Spill - Truth or Dare App

A modern, responsive web application for the Spill Truth or Dare game, built from a Figma design specification with interactive AI-generated prompts.

## Features

- **Dark Theme**: Modern dark interface with a sleek design
- **Truth or Dare Buttons**: Two gradient buttons for selecting game mode
- **AI-Generated Prompts**: Click Truth or Dare to get random prompts
- **Interactive Elements**: Hover effects, smooth transitions, and click animations
- **Responsive Design**: Works on both desktop and mobile devices
- **Modern Typography**: Uses Inter font for clean, readable text

## How to Play

1. **Click "Truth"** - Get a random truth question to answer
2. **Click "Dare"** - Get a random dare challenge to complete
3. **Click "hit me with it."** - Get a random truth or dare prompt
4. **Click "another one."** - Get a new prompt of the same type

## Design Specifications

The app is built according to the provided Figma design with:
- Frame dimensions: 393px × 852px (mobile-first design)
- Dark background: #0f0f10
- Gradient buttons with custom colors and shadows
- Proper spacing and typography hierarchy

## Getting Started

1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start playing Truth or Dare!

## File Structure

```
spill/
├── index.html      # Main HTML structure
├── styles.css      # All styling and responsive design
├── script.js       # Interactive functionality and prompts
└── README.md       # This file
```

## Technologies Used

- HTML5
- CSS3 (with Flexbox and CSS Grid)
- JavaScript (ES6+)
- Google Fonts (Inter)
- Modern CSS features (gradients, shadows, transitions)

## AI Integration

The app currently uses a fallback system with static prompts, but you can easily integrate with real AI services for dynamic prompt generation:

### Option 1: OpenAI API (Recommended)
1. Get an API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Open `config.js` and set `openai.enabled = true`
3. Replace `YOUR_OPENAI_API_KEY_HERE` with your actual API key
4. Uncomment the OpenAI section in `script.js`

### Option 2: Hugging Face API (Free)
1. Get an API key from [Hugging Face](https://huggingface.co/settings/tokens)
2. Open `config.js` and set `huggingface.enabled = true`
3. Replace `YOUR_HUGGING_FACE_API_KEY_HERE` with your actual API key
4. Uncomment the Hugging Face section in `script.js`

### Option 3: Custom AI Service
1. Set up your own AI endpoint
2. Open `config.js` and set `custom.enabled = true`
3. Replace `YOUR_AI_SERVICE_ENDPOINT` with your endpoint URL
4. Uncomment the custom service section in `script.js`

### Current Fallback System
If no AI API is configured, the app uses an enhanced fallback system with 20 truth and 20 dare prompts that rotate randomly.

## Browser Support

This application works on all modern browsers that support:
- CSS Flexbox
- CSS Gradients
- CSS Transitions
- CSS Custom Properties
- ES6 JavaScript

## Future Enhancements

- Add more diverse prompts to the database
- Implement difficulty levels for dares
- Add user authentication and progress tracking
- Include sound effects and animations
- Add multiplayer functionality
- Save favorite prompts
- Add custom prompt creation

## Secure OpenAI API Usage

This project uses a secure Vercel serverless function to call the OpenAI API. **Never commit your API key to GitHub!**

### Local Development
1. Copy `.env.example` to `.env` and add your OpenAI API key:
   ```
   cp .env.example .env
   # Edit .env and add your key
   ```
2. Your key will be used by the serverless function, not exposed to the frontend.

### Vercel Deployment
1. Go to your Vercel project dashboard → Settings → Environment Variables
2. Add:
   - **Name:** `OPENAI_API_KEY`
   - **Value:** your actual OpenAI API key
3. Redeploy your project

### How it works
- The frontend calls `/api/openai` (a Vercel serverless function)
- The function uses your secret key from the environment to call OpenAI
- The result is returned to the frontend 