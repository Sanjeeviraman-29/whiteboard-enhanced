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
  Loader2
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

  // Text-to-Image Generation Function
  const handleImageGeneration = async () => {
    if (!imagePrompt.trim()) {
      alert('Please enter a description for your image');
      return;
    }

    setIsGeneratingImage(true);
    
    try {
      // TODO: Connect to AI Image Generation API
      //
      // Option 1: OpenAI DALL-E API
      // const response = await fetch('https://api.openai.com/v1/images/generations', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
      //   },
      //   body: JSON.stringify({
      //     model: "dall-e-3",
      //     prompt: imagePrompt,
      //     size: '1024x1024',
      //     quality: 'standard',
      //     n: 1
      //   })
      // });
      //
      // Option 2: Stability AI API
      // const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${process.env.REACT_APP_STABILITY_API_KEY}`
      //   },
      //   body: JSON.stringify({
      //     text_prompts: [{ text: imagePrompt }],
      //     cfg_scale: 7,
      //     height: 1024,
      //     width: 1024,
      //     steps: 20,
      //     samples: 1
      //   })
      // });
      //
      // Option 3: Replicate API
      // const response = await fetch('https://api.replicate.com/v1/predictions', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Token ${process.env.REACT_APP_REPLICATE_API_TOKEN}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     version: "ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
      //     input: { prompt: imagePrompt }
      //   })
      // });
      //
      // For Tauri/Electron Desktop Apps:
      // Use the built-in HTTP client or invoke backend commands
      // Tauri: window.__TAURI__.http.fetch()
      // Electron: Use ipcRenderer to communicate with main process
      
      // Simulate API call for demo
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // TODO: Replace with actual generated image URL from API
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
      // TODO: Connect to AI Chat/Suggestions API
      //
      // Option 1: OpenAI GPT-4 API
      // const response = await fetch('https://api.openai.com/v1/chat/completions', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
      //   },
      //   body: JSON.stringify({
      //     model: "gpt-4",
      //     messages: [
      //       {
      //         role: "system",
      //         content: "You are a professional design assistant. Provide specific, actionable advice for improving digital designs, layouts, colors, and user experience."
      //       },
      //       {
      //         role: "user",
      //         content: `Design context: ${JSON.stringify(currentElements.slice(0, 5))}. Question: ${assistantPrompt}`
      //       }
      //     ],
      //     max_tokens: 500,
      //     temperature: 0.7
      //   })
      // });
      //
      // Option 2: Custom Backend API
      // const response = await fetch('/api/design-suggestions', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     prompt: assistantPrompt,
      //     elements: currentElements,
      //     canvas_size: { width: 800, height: 600 },
      //     design_mode: 'creative'
      //   })
      // });
      //
      // Option 3: Google Gemini API
      // const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     contents: [{
      //       parts: [{ text: `As a design expert, help improve this design: ${assistantPrompt}. Context: ${JSON.stringify(currentElements)}` }]
      //     }]
      //   })
      // });
      //
      // For Desktop Apps (Tauri/Electron):
      // - Store API keys securely in environment files
      // - Use native HTTP clients for better security
      // - Consider local AI models for offline functionality

      // Generate contextual suggestions
      const mockSuggestions = generateContextualSuggestions(assistantPrompt, currentElements);
      
      // Simulate typing effect
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
    <div className="space-y-4">
      {/* AI Image Generator */}
      <Card className="bg-white/95 backdrop-blur-sm border-purple-200 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Wand2 className="w-4 h-4 text-white" />
              </div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                AI Image Generator
              </CardTitle>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                ✨ Powered by AI
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsImageSectionCollapsed(!isImageSectionCollapsed)}
            >
              {isImageSectionCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-sm text-gray-600">
            Generate unique visuals from your imagination
          </p>
        </CardHeader>

        {!isImageSectionCollapsed && (
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Describe your idea... (e.g., 'a futuristic city at sunset')"
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isGeneratingImage && handleImageGeneration()}
                className="flex-1"
                disabled={isGeneratingImage}
              />
              <Button 
                onClick={handleImageGeneration}
                disabled={isGeneratingImage || !imagePrompt.trim()}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
              >
                {isGeneratingImage ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate Image
                  </>
                )}
              </Button>
            </div>

            {/* Generated Images Display */}
            {generatedImages.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Generated Images</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {generatedImages.slice(0, 6).map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.url}
                        alt={image.prompt}
                        className="w-full h-24 object-cover rounded-lg border-2 border-gray-200 hover:border-purple-400 transition-colors cursor-pointer"
                        onClick={() => onImageGenerated?.(image.url, image.prompt)}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-white text-black hover:bg-gray-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadImage(image);
                          }}
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1 rounded">
                        {image.prompt.substring(0, 20)}...
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
      <Card className="bg-white/95 backdrop-blur-sm border-blue-200 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Smart Assistant
              </CardTitle>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                💡 AI Powered
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAssistantCollapsed(!isAssistantCollapsed)}
            >
              {isAssistantCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-sm text-gray-600">
            AI can help improve layout, colors, and creative ideas
          </p>
        </CardHeader>

        {!isAssistantCollapsed && (
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Ask how to improve your design... (e.g., 'How can I make this more colorful?')"
                value={assistantPrompt}
                onChange={(e) => setAssistantPrompt(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isGeneratingSuggestion && handleSuggestionGeneration()}
                className="flex-1"
                disabled={isGeneratingSuggestion}
              />
              <Button 
                onClick={handleSuggestionGeneration}
                disabled={isGeneratingSuggestion || !assistantPrompt.trim()}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
              >
                {isGeneratingSuggestion ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Thinking...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Ask AI
                  </>
                )}
              </Button>
            </div>

            {/* AI Response Area */}
            {(currentResponse || suggestions.length > 0) && (
              <div className="space-y-3">
                {/* Current Response with Typing Effect */}
                {currentResponse && (
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-gray-800 leading-relaxed">
                          {currentResponse}
                          {isTyping && <span className="animate-pulse">|</span>}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Suggestions List */}
                {suggestions.length > 0 && !isTyping && (
                  <ScrollArea className="max-h-40">
                    <div className="space-y-2">
                      {suggestions.map((suggestion) => (
                        <div
                          key={suggestion.id}
                          className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="text-xs">
                                  {suggestion.category}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {Math.round(suggestion.confidence * 100)}% confidence
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">{suggestion.text}</p>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copySuggestion(suggestion.text, suggestion.id)}
                                className="p-1 h-7 w-7"
                              >
                                {copiedSuggestion === suggestion.id ? (
                                  <Check className="w-3 h-3 text-green-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => applySuggestion(suggestion)}
                                className="bg-blue-600 text-white hover:bg-blue-700 px-3 h-7 text-xs"
                              >
                                Apply
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>
            )}

            {/* Quick Suggestion Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setAssistantPrompt('How can I improve the colors in my design?');
                  handleSuggestionGeneration();
                }}
                className="text-xs"
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
                className="text-xs"
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
                className="text-xs"
                disabled={isGeneratingSuggestion}
              >
                Creative Ideas
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default AIFeatures;
