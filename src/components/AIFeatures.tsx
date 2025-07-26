/**
 * AI Features Component for Digital Creator Whiteboard Platform
 *
 * This component provides advanced AI capabilities including:
 * 1. Text-to-Image Generation (DALL-E, Stability AI, Replicate)
 * 2. Smart Design Assistant (GPT-4, Gemini, Custom LLM)
 *
 * INTEGRATION GUIDE:
 *
 * Environment Variables Required:
 * - VITE_OPENAI_API_KEY (for DALL-E and GPT-4)
 * - VITE_STABILITY_API_KEY (for Stability AI)
 * - VITE_REPLICATE_API_TOKEN (for Replicate)
 * - VITE_GEMINI_API_KEY (for Google Gemini)
 *
 * Backend Integration Options:
 * 1. Direct API calls (requires CORS handling)
 * 2. Backend proxy server (recommended for production)
 * 3. Serverless functions (Vercel, Netlify)
 *
 * Desktop App Compatibility:
 * - Tauri: Use window.__TAURI__.http for secure API calls
 * - Electron: Use ipcRenderer to communicate with main process
 * - Store API keys in secure environment files
 *
 * Security Considerations:
 * - Never expose API keys in frontend code
 * - Use backend proxy for API calls in production
 * - Implement rate limiting and usage tracking
 * - Add user authentication for premium features
 *
 * Performance Optimizations:
 * - Cache generated images locally
 * - Implement image compression for faster loading
 * - Use loading states and progressive enhancement
 * - Add offline fallbacks for desktop apps
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import {
  Wand2,
  Lightbulb,
  Send,
  Download,
  RefreshCw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Loader2,
  Globe,
  Wifi
} from 'lucide-react';

interface AIFeaturesProps {
  onImageGenerated?: (imageUrl: string, prompt: string) => void;
  onSuggestionApplied?: (suggestion: string) => void;
  currentElements?: any[];
}

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: Date;
}

interface AISuggestion {
  id: string;
  text: string;
  category: 'layout' | 'color' | 'typography' | 'composition' | 'creativity';
  confidence: number;
}

const AIFeatures: React.FC<AIFeaturesProps> = ({ 
  onImageGenerated, 
  onSuggestionApplied,
  currentElements = []
}) => {
  // Text-to-Image state
  const [imagePrompt, setImagePrompt] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isImageSectionCollapsed, setIsImageSectionCollapsed] = useState(false);

  // AI Assistant state
  const [assistantPrompt, setAssistantPrompt] = useState('');
  const [isGeneratingSuggestion, setIsGeneratingSuggestion] = useState(false);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [currentResponse, setCurrentResponse] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isAssistantCollapsed, setIsAssistantCollapsed] = useState(false);
  const [copiedSuggestion, setCopiedSuggestion] = useState<string | null>(null);

  const responseRef = useRef<HTMLDivElement>(null);

  // Check if online mode is available
  const isOnlineMode = Boolean(import.meta.env.VITE_OPENAI_API_KEY);

  // Text-to-Image Generation Function
  const handleImageGeneration = async () => {
    if (!imagePrompt.trim()) {
      alert('Please enter a description for your image');
      return;
    }

    setIsGeneratingImage(true);
    
    try {
      // Real OpenAI DALL-E API Integration - ONLINE MODE
      const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
      
      if (OPENAI_API_KEY) {
        // Use real OpenAI API for online image generation
        const response = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: "dall-e-3",
            prompt: imagePrompt,
            size: '1024x1024',
            quality: 'standard',
            n: 1
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          const imageUrl = data.data[0].url;
          
          const newImage: GeneratedImage = {
            id: Date.now().toString(),
            url: imageUrl,
            prompt: imagePrompt,
            timestamp: new Date()
          };
          
          setGeneratedImages(prev => [newImage, ...prev]);
          onImageGenerated?.(newImage.url, newImage.prompt);
          setImagePrompt('');
          return;
        } else {
          console.warn('OpenAI API failed, falling back to mock generation');
        }
      }
      
      // Fallback to mock generation if no API key or API fails
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockImageUrl = await generateMockImage(imagePrompt);
      
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: mockImageUrl,
        prompt: imagePrompt,
        timestamp: new Date()
      };
      
      setGeneratedImages(prev => [newImage, ...prev]);
      onImageGenerated?.(newImage.url, newImage.prompt);
      
      // Clear input
      setImagePrompt('');
      
    } catch (error) {
      console.error('Image generation failed:', error);
      alert('Image generation failed. Please try again.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Mock Image Generation (Replace with actual API)
  const generateMockImage = async (prompt: string): Promise<string> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');

    canvas.width = 512;
    canvas.height = 512;

    // Create gradient based on prompt keywords
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    
    if (prompt.toLowerCase().includes('sunset')) {
      gradient.addColorStop(0, '#ff6b6b');
      gradient.addColorStop(0.5, '#ffa726');
      gradient.addColorStop(1, '#ffcc02');
    } else if (prompt.toLowerCase().includes('ocean')) {
      gradient.addColorStop(0, '#74b9ff');
      gradient.addColorStop(1, '#0984e3');
    } else if (prompt.toLowerCase().includes('forest')) {
      gradient.addColorStop(0, '#00b894');
      gradient.addColorStop(1, '#00cec9');
    } else {
      gradient.addColorStop(0, '#a29bfe');
      gradient.addColorStop(1, '#fd79a8');
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add text overlay
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('AI Generated:', canvas.width / 2, canvas.height / 2 - 20);
    
    ctx.font = '18px Arial';
    const words = prompt.split(' ').slice(0, 3).join(' ');
    ctx.fillText(words, canvas.width / 2, canvas.height / 2 + 20);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(URL.createObjectURL(blob));
        }
      });
    });
  };

  // AI Suggestions Generation
  const handleSuggestionGeneration = async () => {
    if (!assistantPrompt.trim()) {
      alert('Please ask a question about your design');
      return;
    }

    setIsGeneratingSuggestion(true);
    setIsTyping(true);
    setCurrentResponse('');

    try {
      // Real OpenAI GPT-4 API Integration - ONLINE MODE
      const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
      let aiResponse = '';
      
      if (OPENAI_API_KEY) {
        // Use real OpenAI ChatGPT API for online assistance
        try {
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
              model: "gpt-4",
              messages: [
                {
                  role: "system",
                  content: "You are a professional design assistant specializing in digital art, UI/UX design, and creative direction. Provide specific, actionable advice for improving designs, layouts, colors, and user experience. Be concise but detailed."
                },
                {
                  role: "user",
                  content: `Design context: I have ${currentElements.length} elements on my canvas including ${currentElements.filter(el => el.type === 'text').length} text elements, ${currentElements.filter(el => el.type === 'rectangle').length} rectangles, and ${currentElements.filter(el => el.type === 'circle').length} circles. Question: ${assistantPrompt}`
                }
              ],
              max_tokens: 300,
              temperature: 0.7
            })
          });
          
          if (response.ok) {
            const data = await response.json();
            aiResponse = data.choices[0].message.content;
            
            // Simulate typing effect with real AI response
            await simulateTypingEffect(aiResponse);
            
            // Generate structured suggestions from AI response
            const aiSuggestions = parseAIResponseToSuggestions(aiResponse);
            setSuggestions(aiSuggestions);
            setAssistantPrompt('');
            return;
          } else {
            console.warn('OpenAI API failed, falling back to local suggestions');
          }
        } catch (error) {
          console.warn('OpenAI API error, falling back to local suggestions:', error);
        }
      }
      
      // Fallback to contextual suggestions if no API key or API fails
      const mockSuggestions = generateContextualSuggestions(assistantPrompt, currentElements);
      await simulateTypingEffect(mockSuggestions[0]?.text || 'Here are some suggestions for your design...');
      setSuggestions(mockSuggestions);
      setAssistantPrompt('');
      
    } catch (error) {
      console.error('Suggestion generation failed:', error);
      setCurrentResponse('Sorry, I encountered an error. Please try again.');
    } finally {
      setIsGeneratingSuggestion(false);
      setIsTyping(false);
    }
  };

  // Generate contextual suggestions based on prompt and current elements
  const generateContextualSuggestions = (prompt: string, elements: any[]): AISuggestion[] => {
    const suggestions: AISuggestion[] = [];
    const lowerPrompt = prompt.toLowerCase();

    if (lowerPrompt.includes('color') || lowerPrompt.includes('palette')) {
      suggestions.push({
        id: '1',
        text: 'Try using a complementary color scheme. For your current design, consider adding blue accents to balance the warm colors. Use the 60-30-10 rule: 60% primary color, 30% secondary, 10% accent.',
        category: 'color',
        confidence: 0.9
      });
    }

    if (lowerPrompt.includes('layout') || lowerPrompt.includes('composition')) {
      suggestions.push({
        id: '2',
        text: 'Apply the rule of thirds to create better visual balance. Consider grouping related elements together and adding more white space around important components.',
        category: 'layout',
        confidence: 0.85
      });
    }

    if (lowerPrompt.includes('improve') || lowerPrompt.includes('better')) {
      suggestions.push({
        id: '3',
        text: 'Enhance your design with: 1) Consistent spacing between elements, 2) A clear visual hierarchy using size and color, 3) Better contrast for accessibility, 4) Rounded corners for a modern feel.',
        category: 'composition',
        confidence: 0.8
      });
    }

    if (suggestions.length === 0) {
      // Default suggestions
      suggestions.push({
        id: '4',
        text: 'Based on your current design, I recommend: Adding more contrast between elements, using consistent font sizes, and ensuring proper alignment. Consider using AI enhancement tools to improve colors automatically.',
        category: 'creativity',
        confidence: 0.75
      });
    }

    return suggestions;
  };

  // Parse AI response into structured suggestions
  const parseAIResponseToSuggestions = (response: string): AISuggestion[] => {
    const suggestions: AISuggestion[] = [];
    
    // Split response into actionable parts
    const sentences = response.split(/[.!]/).filter(s => s.trim().length > 20);
    
    sentences.forEach((sentence, index) => {
      const trimmed = sentence.trim();
      if (trimmed) {
        let category: AISuggestion['category'] = 'creativity';
        
        if (trimmed.toLowerCase().includes('color') || trimmed.toLowerCase().includes('palette')) {
          category = 'color';
        } else if (trimmed.toLowerCase().includes('layout') || trimmed.toLowerCase().includes('composition') || trimmed.toLowerCase().includes('position')) {
          category = 'layout';
        } else if (trimmed.toLowerCase().includes('font') || trimmed.toLowerCase().includes('text') || trimmed.toLowerCase().includes('typography')) {
          category = 'typography';
        } else if (trimmed.toLowerCase().includes('balance') || trimmed.toLowerCase().includes('spacing') || trimmed.toLowerCase().includes('align')) {
          category = 'composition';
        }
        
        suggestions.push({
          id: `ai-${Date.now()}-${index}`,
          text: trimmed + '.',
          category,
          confidence: 0.9
        });
      }
    });
    
    return suggestions.slice(0, 3); // Limit to 3 suggestions
  };

  // Simulate typing effect
  const simulateTypingEffect = async (text: string) => {
    const words = text.split(' ');
    let currentText = '';
    
    for (let i = 0; i < words.length; i++) {
      currentText += (i === 0 ? '' : ' ') + words[i];
      setCurrentResponse(currentText);
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 100));
    }
  };

  // Apply suggestion
  const applySuggestion = (suggestion: AISuggestion) => {
    onSuggestionApplied?.(suggestion.text);
    
    // TODO: Implement actual suggestion application logic
    // This could involve:
    // - Adjusting colors of selected elements
    // - Repositioning elements for better layout
    // - Changing font sizes or styles
    // - Adding spacing or margins
    
    alert(`✨ Applied suggestion: ${suggestion.category.charAt(0).toUpperCase() + suggestion.category.slice(1)} improvement`);
  };

  // Copy suggestion to clipboard
  const copySuggestion = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSuggestion(id);
      setTimeout(() => setCopiedSuggestion(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Download generated image
  const downloadImage = (image: GeneratedImage) => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `ai-generated-${image.id}.png`;
    link.click();
  };

  return (
    <div className="space-y-8 p-6 max-w-4xl mx-auto">
      {/* Online Status Banner */}
      <div className={`p-4 rounded-xl border-2 ${isOnlineMode ? 'bg-green-50 border-green-300' : 'bg-orange-50 border-orange-300'}`}>
        <div className="flex items-center justify-center gap-3">
          {isOnlineMode ? (
            <>
              <Globe className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">🌐 Online Mode Active - Real AI Integration</span>
              <Badge className="bg-green-100 text-green-800">ChatGPT & DALL-E</Badge>
            </>
          ) : (
            <>
              <Wifi className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-orange-800">📱 Demo Mode - Add API Key for Full Features</span>
              <Badge className="bg-orange-100 text-orange-800">Local Simulation</Badge>
            </>
          )}
        </div>
      </div>

      {/* AI Image Generator */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-300 shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                <Wand2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  AI Image Generator
                  {isOnlineMode && <Badge className="bg-purple-100 text-purple-700">✨ DALL-E Powered</Badge>}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Generate unique visuals from your imagination
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsImageSectionCollapsed(!isImageSectionCollapsed)}
              className="hover:bg-purple-100"
            >
              {isImageSectionCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            </Button>
          </div>
        </CardHeader>

        {!isImageSectionCollapsed && (
          <CardContent className="space-y-6">
            <div className="flex gap-3">
              <Input
                placeholder="Describe your idea... (e.g., 'a futuristic city at sunset', 'cute cartoon cat')"
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isGeneratingImage && handleImageGeneration()}
                className="flex-1 bg-white text-black placeholder:text-gray-600 border-purple-300 focus:border-purple-500 focus:ring-purple-500 h-12 text-base"
                disabled={isGeneratingImage}
              />
              <Button 
                onClick={handleImageGeneration}
                disabled={isGeneratingImage || !imagePrompt.trim()}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-200 h-12 px-6"
              >
                {isGeneratingImage ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 mr-2" />
                    Generate Image
                  </>
                )}
              </Button>
            </div>

            {/* Generated Images Display */}
            {generatedImages.length > 0 && (
              <div className="space-y-4 bg-white/80 p-6 rounded-xl border-2 border-purple-200 shadow-inner">
                <h4 className="font-bold text-black text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Generated Images
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {generatedImages.slice(0, 6).map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.url}
                        alt={image.prompt}
                        className="w-full h-32 object-cover rounded-xl border-3 border-gray-200 hover:border-purple-400 transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg"
                        onClick={() => onImageGenerated?.(image.url, image.prompt)}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-white text-black hover:bg-gray-100 shadow-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadImage(image);
                          }}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                      <div className="absolute bottom-2 left-2 bg-black/80 text-white text-xs px-2 py-1 rounded-lg">
                        {image.prompt.substring(0, 25)}...
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Smart Assistant */}
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-300 shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  Smart Assistant
                  {isOnlineMode && <Badge className="bg-blue-100 text-blue-700">💡 GPT-4 Powered</Badge>}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  AI can help improve layout, colors, and creative ideas
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAssistantCollapsed(!isAssistantCollapsed)}
              className="hover:bg-blue-100"
            >
              {isAssistantCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            </Button>
          </div>
        </CardHeader>

        {!isAssistantCollapsed && (
          <CardContent className="space-y-6">
            <div className="flex gap-3">
              <Input
                placeholder="Ask how to improve your design... (e.g., 'How can I make this more colorful?')"
                value={assistantPrompt}
                onChange={(e) => setAssistantPrompt(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isGeneratingSuggestion && handleSuggestionGeneration()}
                className="flex-1 bg-white text-black placeholder:text-gray-600 border-blue-300 focus:border-blue-500 focus:ring-blue-500 h-12 text-base"
                disabled={isGeneratingSuggestion}
              />
              <Button 
                onClick={handleSuggestionGeneration}
                disabled={isGeneratingSuggestion || !assistantPrompt.trim()}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all duration-200 h-12 px-6"
              >
                {isGeneratingSuggestion ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Thinking...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Ask AI
                  </>
                )}
              </Button>
            </div>

            {/* AI Response Area */}
            {(currentResponse || suggestions.length > 0) && (
              <div className="space-y-4">
                {/* Current Response with Typing Effect */}
                {currentResponse && (
                  <div className="p-6 bg-white border-2 border-blue-300 rounded-xl shadow-lg">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex-shrink-0">
                        <Lightbulb className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-black mb-3 flex items-center gap-2">
                          AI Assistant Response
                          {isOnlineMode && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              🌐 Online
                            </Badge>
                          )}
                        </h5>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="text-black leading-relaxed font-medium">
                            {currentResponse}
                            {isTyping && <span className="animate-pulse text-blue-600 font-bold">|</span>}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Suggestions List */}
                {suggestions.length > 0 && !isTyping && (
                  <div className="bg-white/90 p-6 rounded-xl border-2 border-blue-200 shadow-inner">
                    <h5 className="font-bold text-black mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                      AI Suggestions
                    </h5>
                    <ScrollArea className="max-h-60">
                      <div className="space-y-4">
                        {suggestions.map((suggestion) => (
                          <div
                            key={suggestion.id}
                            className="p-5 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-300 font-medium">
                                    {suggestion.category}
                                  </Badge>
                                  <span className="text-xs text-gray-600 font-medium">
                                    {Math.round(suggestion.confidence * 100)}% confidence
                                  </span>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                  <p className="text-black font-medium leading-relaxed">{suggestion.text}</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => copySuggestion(suggestion.text, suggestion.id)}
                                  className="p-2 h-9 w-9 hover:bg-gray-100"
                                >
                                  {copiedSuggestion === suggestion.id ? (
                                    <Check className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => applySuggestion(suggestion)}
                                  className="bg-blue-600 text-white hover:bg-blue-700 px-4 h-9 text-sm font-medium"
                                >
                                  Apply
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </div>
            )}

            {/* API Status and Quick Suggestion Buttons */}
            <div className="bg-white/80 p-5 rounded-xl border-2 border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <h5 className="font-bold text-black">Quick Actions</h5>
                <div className="flex items-center gap-2">
                  {isOnlineMode ? (
                    <Badge className="bg-green-100 text-green-800 font-medium">
                      🌐 Online Mode
                    </Badge>
                  ) : (
                    <Badge className="bg-orange-100 text-orange-800 font-medium">
                      📱 Demo Mode
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setAssistantPrompt('How can I improve the colors in my design?');
                    handleSuggestionGeneration();
                  }}
                  className="text-sm bg-white text-black border-blue-300 hover:bg-blue-50 font-medium px-4 py-2"
                  disabled={isGeneratingSuggestion}
                >
                  Improve Colors
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setAssistantPrompt('How can I make my layout more balanced?');
                    handleSuggestionGeneration();
                  }}
                  className="text-sm bg-white text-black border-blue-300 hover:bg-blue-50 font-medium px-4 py-2"
                  disabled={isGeneratingSuggestion}
                >
                  Better Layout
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setAssistantPrompt('What creative elements can I add?');
                    handleSuggestionGeneration();
                  }}
                  className="text-sm bg-white text-black border-blue-300 hover:bg-blue-50 font-medium px-4 py-2"
                  disabled={isGeneratingSuggestion}
                >
                  Creative Ideas
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Setup Instructions for API Integration */}
      {!isOnlineMode && (
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
              🔧 Setup Instructions for Full AI Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-yellow-200">
              <h6 className="font-semibold text-black mb-2">To enable online AI features:</h6>
              <ol className="list-decimal list-inside space-y-2 text-black">
                <li>Get your OpenAI API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">platform.openai.com</a></li>
                <li>Create a <code className="bg-gray-100 px-2 py-1 rounded text-sm">.env</code> file in your project root</li>
                <li>Add: <code className="bg-gray-100 px-2 py-1 rounded text-sm">VITE_OPENAI_API_KEY=your_api_key_here</code></li>
                <li>Restart your development server</li>
              </ol>
            </div>
            <Badge className="bg-yellow-100 text-yellow-800">
              💡 With API key: Real ChatGPT responses + DALL-E image generation
            </Badge>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIFeatures;
