# AI Features Setup Guide

## 🚀 Enable Full AI Features

To unlock the complete AI-powered capabilities of your digital creator whiteboard, you'll need to integrate with OpenAI's APIs.

### 🔑 Getting Your OpenAI API Key

1. **Visit OpenAI Platform**: Go to [platform.openai.com](https://platform.openai.com/api-keys)
2. **Sign Up/Login**: Create an account or sign in if you already have one
3. **Create API Key**: 
   - Click "Create new secret key"
   - Give it a descriptive name like "Whiteboard App"
   - Copy the key immediately (you won't see it again!)

### ⚙️ Environment Setup

1. **Create Environment File**: In your project root, create a `.env` file:
   ```bash
   touch .env
   ```

2. **Add Your API Key**: Add this line to your `.env` file:
   ```
   VITE_OPENAI_API_KEY=your_api_key_here
   ```

3. **Secure Your Key**: Make sure `.env` is in your `.gitignore` file to keep your key private:
   ```
   # .gitignore
   .env
   .env.local
   .env.production
   ```

4. **Restart Development Server**: 
   ```bash
   npm run dev
   # or
   yarn dev
   ```

### 🌟 What You Get With Full AI Integration

#### 🎨 AI Image Generator
- **DALL-E 3 Integration**: Generate high-quality images from text descriptions
- **Real-time Generation**: Create unique visuals instantly
- **Canvas Integration**: Generated images automatically added to your workspace

#### 🧠 Smart Assistant
- **GPT-4 Powered**: Professional design advice and suggestions
- **Context Aware**: AI understands your current canvas elements
- **Actionable Insights**: Get specific recommendations for:
  - Color improvements
  - Layout optimization
  - Typography enhancements
  - Creative inspiration

### 💰 Pricing Information

- **OpenAI DALL-E 3**: ~$0.040 per image (1024×1024)
- **OpenAI GPT-4**: ~$0.03 per 1K tokens
- **Typical Usage**: $1-5 per month for regular use

### 🔧 Troubleshooting

#### API Key Not Working?
- Ensure the key starts with `sk-`
- Check you have sufficient credits in your OpenAI account
- Verify the `.env` file is in the project root
- Restart your development server after adding the key

#### Still Seeing Demo Mode?
- Check browser console for any error messages
- Ensure environment variable name is exactly: `VITE_OPENAI_API_KEY`
- Try clearing browser cache and refreshing

### 🏢 Production Deployment

For production environments:

1. **Vercel**: Add environment variables in your Vercel dashboard
2. **Netlify**: Add in Site settings > Environment variables
3. **Custom Server**: Use your hosting provider's environment variable system

### 🔒 Security Best Practices

- Never commit API keys to version control
- Use environment variables for all sensitive data
- Consider using a backend proxy for additional security
- Monitor your API usage regularly

### 📱 Desktop App Integration

For Tauri or Electron apps:
- Store API keys in secure system keychain
- Use native HTTP clients for better security
- Consider local AI models for offline functionality

---

**Ready to Create?** Once your API key is configured, you'll see the 🌐 Online Mode indicator in the AI panels, and you can start generating amazing content with real AI power!
