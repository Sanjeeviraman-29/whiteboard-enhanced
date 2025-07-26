import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Send, Minimize2, Bot, User } from "lucide-react";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI design assistant. I can help you create beautiful designs, suggest color schemes, layout ideas, and much more. What would you like to design today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("color") || lowerMessage.includes("palette")) {
      return "For color schemes, I recommend starting with a primary color and building a palette around it. Popular combinations include:\n\n• **Modern**: Deep blues (#1e40af) with light grays (#f8fafc)\n• **Warm**: Coral (#ff6b6b) with cream (#fef7ed)\n• **Professional**: Navy (#1e293b) with gold accents (#f59e0b)\n\nWould you like me to suggest specific colors for your design?";
    }
    
    if (lowerMessage.includes("layout") || lowerMessage.includes("grid")) {
      return "Great choice! Here are some popular layout patterns:\n\n• **Card Grid**: Perfect for showcasing content or products\n• **Hero + Sections**: Classic landing page structure\n• **Sidebar Layout**: Great for dashboards or admin panels\n• **Masonry Grid**: Dynamic, Pinterest-style layouts\n\nWhat type of content will you be displaying?";
    }
    
    if (lowerMessage.includes("font") || lowerMessage.includes("typography")) {
      return "Typography is crucial for great design! Here are my recommendations:\n\n• **Headers**: Inter, Poppins, or Montserrat for modern look\n• **Body Text**: System fonts or Open Sans for readability\n• **Code/Monospace**: JetBrains Mono or Fira Code\n\nFor hierarchy, use size, weight, and spacing. Want specific font pairings?";
    }
    
    if (lowerMessage.includes("button") || lowerMessage.includes("component")) {
      return "I can help you design beautiful components! For buttons, consider:\n\n• **Primary**: Bold colors with subtle shadows\n• **Secondary**: Outlined or ghost styles\n• **States**: Hover, active, and disabled variations\n\nShall I suggest specific button styles for your design system?";
    }
    
    if (lowerMessage.includes("dashboard") || lowerMessage.includes("admin")) {
      return "Dashboards need clear information hierarchy! Key elements:\n\n• **Navigation**: Fixed sidebar or top bar\n• **Cards**: Group related metrics and data\n• **Charts**: Use consistent colors and clear labels\n• **Actions**: Primary actions should be prominent\n\nWhat data will your dashboard display?";
    }
    
    if (lowerMessage.includes("mobile") || lowerMessage.includes("responsive")) {
      return "Mobile-first design is essential! Key principles:\n\n• **Touch Targets**: Minimum 44px for buttons\n• **Navigation**: Hamburger menu or bottom tabs\n• **Content**: Stack vertically, reduce complexity\n• **Performance**: Optimize images and fonts\n\nNeed help with specific responsive breakpoints?";
    }
    
    if (lowerMessage.includes("animation") || lowerMessage.includes("transition")) {
      return "Smooth animations enhance user experience! Best practices:\n\n• **Duration**: 200-300ms for micro-interactions\n• **Easing**: Use cubic-bezier for natural feel\n• **Purpose**: Guide attention, provide feedback\n• **Performance**: Use transform and opacity\n\nWhat elements would you like to animate?";
    }
    
    if (lowerMessage.includes("thank") || lowerMessage.includes("thanks")) {
      return "You're very welcome! I'm here to help you create amazing designs. Feel free to ask about colors, layouts, components, or any design challenges you're facing. Happy designing! 🎨";
    }
    
    // Default responses for general queries
    const defaultResponses = [
      "That's an interesting design challenge! Could you tell me more about what you're trying to create? I can help with layouts, color schemes, typography, and component design.",
      "I'd love to help you with that! Are you working on a specific type of design - like a website, dashboard, mobile app, or something else?",
      "Great question! To give you the best advice, could you share more details about your project? I can suggest modern design patterns and best practices.",
      "I'm here to help you create stunning designs! Whether you need help with visual hierarchy, user experience, or technical implementation, just let me know what you're working on.",
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(inputText),
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isMinimized) {
    return (
      <div className="w-16 bg-white/90 rounded-l-2xl shadow p-4 flex flex-col items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMinimized(false)}
          className="text-indigo-600 hover:text-indigo-700"
        >
          <Bot className="w-5 h-5" />
        </Button>
      </div>
    );
  }

  return (
    <aside className="w-80 bg-white/90 backdrop-blur-sm rounded-l-2xl shadow-lg border border-white/20 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-indigo-600" />
          <span className="font-semibold text-lg text-indigo-700">AI Assistant</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMinimized(true)}
          className="text-slate-400 hover:text-indigo-500"
        >
          <Minimize2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.isUser ? "justify-end" : "justify-start"}`}
            >
              {!message.isUser && (
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-indigo-600" />
                </div>
              )}
              
              <div
                className={`max-w-[240px] rounded-2xl px-4 py-2 ${
                  message.isUser
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {message.text}
                </p>
                <p className={`text-xs mt-1 ${
                  message.isUser ? "text-indigo-200" : "text-gray-500"
                }`}>
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>

              {message.isUser && (
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="bg-gray-100 text-gray-800 rounded-2xl px-4 py-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200/50">
        <div className="flex gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about colors, layouts, components..."
            className="flex-1 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
            disabled={isTyping}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </aside>
  );
};

export default AIAssistant;
