import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bot, 
  X, 
  Send, 
  Lightbulb, 
  Wand2, 
  Eye, 
  Sparkles,
  ChevronRight,
  MessageCircle,
  Zap
} from 'lucide-react';

interface AIAssistantProps {
  isVisible: boolean;
  projectType: any;
  currentTool: string;
  onClose: () => void;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface Suggestion {
  id: string;
  title: string;
  description: string;
  action: string;
  icon: any;
}

export function AIAssistant({ isVisible, projectType, currentTool, onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: `Welcome to your ${projectType.name} project! I'm here to help you create something amazing. What would you like to work on first?`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const suggestions: Suggestion[] = [
    {
      id: '1',
      title: 'Smart Layout',
      description: 'Let me suggest an optimal layout for your design',
      action: 'Generate Layout',
      icon: Lightbulb
    },
    {
      id: '2',
      title: 'Color Palette',
      description: 'Get AI-generated color schemes that work perfectly',
      action: 'Generate Colors',
      icon: Wand2
    },
    {
      id: '3',
      title: 'Content Ideas',
      description: 'Need inspiration? I can suggest content ideas',
      action: 'Get Ideas',
      icon: Sparkles
    },
    {
      id: '4',
      title: 'Review & Improve',
      description: 'Let me analyze your work and suggest improvements',
      action: 'Analyze',
      icon: Eye
    }
  ];

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "That's a great question! I can help you with that. Let me analyze your current work and provide some suggestions.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  if (!isVisible) return null;

  return (
    <div className="w-80 glass border-l border-glass-border flex flex-col h-full animate-slide-in">
      {/* Header */}
      <div className="p-4 border-b border-glass-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-ai rounded-lg flex items-center justify-center ai-pulse">
              <Bot className="w-4 h-4 text-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">AI Assistant</h3>
              <p className="text-xs text-ai-primary">Ready to help</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Current Tool Context */}
      <div className="p-4 border-b border-glass-border">
        <div className="glass rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-ai-primary" />
            <span className="text-sm font-medium">Tool Context</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Currently using: <span className="text-foreground font-medium capitalize">{currentTool}</span> tool
          </p>
        </div>
      </div>

      {/* Quick Suggestions */}
      <div className="p-4 border-b border-glass-border">
        <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-ai-primary" />
          Smart Suggestions
        </h4>
        <div className="space-y-2">
          {suggestions.map((suggestion) => {
            const Icon = suggestion.icon;
            return (
              <Card key={suggestion.id} className="glass-hover cursor-pointer p-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-ai rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-medium text-foreground mb-1">
                      {suggestion.title}
                    </h5>
                    <p className="text-xs text-muted-foreground mb-2">
                      {suggestion.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Button variant="outline" size="sm" className="text-xs">
                        {suggestion.action}
                      </Button>
                      <ChevronRight className="w-3 h-3 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 pb-2">
          <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-ai-primary" />
            Chat with AI
          </h4>
        </div>
        
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`
                    max-w-[80%] rounded-2xl px-4 py-3 text-sm
                    ${message.type === 'user' 
                      ? 'bg-gradient-primary text-primary-foreground' 
                      : 'glass text-foreground'
                    }
                  `}
                >
                  <p>{message.content}</p>
                  <p className={`text-xs mt-1 opacity-70`}>
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-glass-border">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 glass border-glass-border"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button 
              variant="ai" 
              size="icon" 
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}