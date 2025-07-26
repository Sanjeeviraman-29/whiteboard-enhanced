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

    // Color and palette suggestions
    if (lowerMessage.includes("color") || lowerMessage.includes("palette")) {
      return "For color schemes, I recommend starting with a primary color and building a palette around it. Popular combinations include:\n\n• **Modern**: Deep blues (#1e40af) with light grays (#f8fafc)\n• **Warm**: Coral (#ff6b6b) with cream (#fef7ed)\n• **Professional**: Navy (#1e293b) with gold accents (#f59e0b)\n• **Nature**: Forest green (#059669) with warm beige (#fef3c7)\n• **Vibrant**: Purple (#8b5cf6) with cyan (#06b6d4)\n\nWould you like me to suggest specific colors for your design?";
    }

    // Layout and grid systems
    if (lowerMessage.includes("layout") || lowerMessage.includes("grid")) {
      return "Great choice! Here are some popular layout patterns:\n\n• **Card Grid**: Perfect for showcasing content or products\n• **Hero + Sections**: Classic landing page structure\n• **Sidebar Layout**: Great for dashboards or admin panels\n• **Masonry Grid**: Dynamic, Pinterest-style layouts\n• **Flexbox Layout**: Flexible and responsive arrangements\n• **CSS Grid**: Complex, two-dimensional layouts\n\nWhat type of content will you be displaying?";
    }

    // Typography and fonts
    if (lowerMessage.includes("font") || lowerMessage.includes("typography")) {
      return "Typography is crucial for great design! Here are my recommendations:\n\n• **Headers**: Inter, Poppins, or Montserrat for modern look\n• **Body Text**: System fonts or Open Sans for readability\n• **Code/Monospace**: JetBrains Mono or Fira Code\n• **Serif**: Playfair Display or Merriweather for elegance\n• **Script**: Dancing Script for decorative elements\n\nFor hierarchy, use size, weight, and spacing. Want specific font pairings?";
    }

    // UI Components
    if (lowerMessage.includes("button") || lowerMessage.includes("component")) {
      return "I can help you design beautiful components! For buttons, consider:\n\n• **Primary**: Bold colors with subtle shadows\n• **Secondary**: Outlined or ghost styles\n• **States**: Hover, active, and disabled variations\n• **Sizes**: Small, medium, large variants\n• **Icons**: Add visual clarity and context\n\nShall I suggest specific button styles for your design system?";
    }

    // Dashboard design
    if (lowerMessage.includes("dashboard") || lowerMessage.includes("admin")) {
      return "Dashboards need clear information hierarchy! Key elements:\n\n• **Navigation**: Fixed sidebar or top bar\n• **Cards**: Group related metrics and data\n• **Charts**: Use consistent colors and clear labels\n• **Actions**: Primary actions should be prominent\n• **Filters**: Easy data manipulation tools\n• **Status**: Clear indicators for system health\n\nWhat data will your dashboard display?";
    }

    // Mobile and responsive design
    if (lowerMessage.includes("mobile") || lowerMessage.includes("responsive")) {
      return "Mobile-first design is essential! Key principles:\n\n• **Touch Targets**: Minimum 44px for buttons\n• **Navigation**: Hamburger menu or bottom tabs\n• **Content**: Stack vertically, reduce complexity\n• **Performance**: Optimize images and fonts\n• **Gestures**: Swipe, pinch, and tap interactions\n• **Safe Areas**: Account for notches and home indicators\n\nNeed help with specific responsive breakpoints?";
    }

    // Animation and transitions
    if (lowerMessage.includes("animation") || lowerMessage.includes("transition")) {
      return "Smooth animations enhance user experience! Best practices:\n\n• **Duration**: 200-300ms for micro-interactions\n• **Easing**: Use cubic-bezier for natural feel\n• **Purpose**: Guide attention, provide feedback\n• **Performance**: Use transform and opacity\n• **Loading**: Skeleton screens and progressive loading\n• **Accessibility**: Respect reduced motion preferences\n\nWhat elements would you like to animate?";
    }

    // Logo and branding
    if (lowerMessage.includes("logo") || lowerMessage.includes("brand")) {
      return "Logo design is all about memorable simplicity! Consider:\n\n• **Simplicity**: Clean, recognizable at any size\n• **Relevance**: Reflects your brand personality\n• **Versatility**: Works in color and black/white\n• **Timelessness**: Avoid trendy elements\n• **Scalability**: Readable from business card to billboard\n\nWhat industry or style are you targeting?";
    }

    // Website design
    if (lowerMessage.includes("website") || lowerMessage.includes("web")) {
      return "Website design involves many considerations:\n\n• **User Journey**: Map out user goals and paths\n• **Content Strategy**: Organize information logically\n• **Visual Hierarchy**: Guide users through your content\n• **Performance**: Fast loading and smooth interactions\n• **SEO**: Structure for search engine visibility\n• **Accessibility**: Design for all users\n\nWhat's the main purpose of your website?";
    }

    // App design
    if (lowerMessage.includes("app") || lowerMessage.includes("mobile app")) {
      return "App design focuses on user experience:\n\n• **Onboarding**: Smooth introduction to your app\n• **Navigation**: Intuitive and consistent patterns\n• **Gestures**: Natural touch interactions\n• **Feedback**: Visual and haptic responses\n• **Offline**: Graceful handling of no connection\n• **Platform**: Follow iOS/Android guidelines\n\nWhat type of app are you building?";
    }

    // UX/UI principles
    if (lowerMessage.includes("ux") || lowerMessage.includes("ui") || lowerMessage.includes("user experience")) {
      return "UX/UI design principles for great experiences:\n\n• **Clarity**: Make functions obvious\n• **Consistency**: Use familiar patterns\n• **Feedback**: Show system status clearly\n• **Efficiency**: Minimize user effort\n• **Forgiveness**: Easy error recovery\n• **Accessibility**: Inclusive design for all\n\nWhat specific UX challenge are you facing?";
    }

    // Video editing ideas
    if (lowerMessage.includes("video") || lowerMessage.includes("editing")) {
      return "Video editing tips for engaging content:\n\n• **Pacing**: Vary cuts to match content mood\n• **Transitions**: Use purposefully, not excessively\n• **Color Grading**: Maintain consistent mood\n• **Audio**: Balance music, effects, and dialogue\n• **Text Overlays**: Keep readable and brief\n• **Thumbnails**: Design eye-catching previews\n\nWhat type of video are you creating?";
    }

    // Photo editing ideas
    if (lowerMessage.includes("photo") || lowerMessage.includes("photography")) {
      return "Photo editing for stunning visuals:\n\n• **Exposure**: Balance highlights and shadows\n• **Contrast**: Add depth and dimension\n• **Saturation**: Enhance without oversaturation\n• **Composition**: Rule of thirds, leading lines\n• **Filters**: Apply subtly for mood\n• **Sharpening**: Enhance key details\n\nWhat style are you going for?";
    }

    // Creative ideas and inspiration
    if (lowerMessage.includes("idea") || lowerMessage.includes("inspiration") || lowerMessage.includes("creative")) {
      return "Here are some creative ideas to spark inspiration:\n\n• **Mood Boards**: Collect visual references\n• **Color Stories**: Build palettes from nature\n• **Typography Mixing**: Combine serif and sans-serif\n• **Asymmetric Layouts**: Break traditional grids\n• **Micro-Interactions**: Delight in small details\n• **Bold Gradients**: Create dynamic backgrounds\n• **Text-to-Image**: Use our AI to generate images from descriptions\n\nWhat project are you working on?";
    }

    // Text to image suggestions
    if (lowerMessage.includes("text to image") || lowerMessage.includes("generate image") || lowerMessage.includes("ai image")) {
      return "Great! Our Text-to-Image feature can help you create visuals. Here are some effective prompt tips:\n\n• **Be Specific**: 'A red cartoon cat with a blue hat' vs 'cat'\n• **Style Keywords**: Add 'cartoon', 'realistic', 'sketch', 'watercolor'\n• **Composition**: Mention 'centered', 'close-up', 'wide view'\n• **Colors**: Specify color schemes like 'pastel colors' or 'bright neon'\n• **For Kids**: Try 'simple', 'cute', 'friendly', 'colorful'\n\nExample prompts:\n• 'Simple cartoon house with a red roof'\n• 'Friendly smiling sun with sunglasses'\n• 'Geometric pattern in blue and green'\n\nUse the Text→Image tool in the canvas to try it!";
    }

    // Auto-complete and AI assistance
    if (lowerMessage.includes("auto complete") || lowerMessage.includes("ai complete") || lowerMessage.includes("finish drawing")) {
      return "The AI Auto-Complete feature is perfect for learning! Here's how it helps:\n\n• **Shape Completion**: Start drawing a circle, AI adds facial features\n• **Pattern Recognition**: Draw some shapes, AI suggests connections\n• **Educational Aid**: Great for kids learning to draw\n• **Flow Diagrams**: AI can connect boxes with arrows\n• **Label Suggestions**: AI adds text labels to shapes\n\nJust draw something and click the 'AI Complete' tool. The AI will analyze your drawing and add helpful elements!";
    }

    // Storyboarding help
    if (lowerMessage.includes("storyboard") || lowerMessage.includes("story") || lowerMessage.includes("frames")) {
      return "Visual storytelling with storyboards is powerful! Here's how to use our storyboard features:\n\n• **Create Frames**: Each frame represents a scene or moment\n• **Add Annotations**: Use notes to describe actions or dialogue\n• **Flow Connections**: Connect frames to show sequence\n• **Scene Planning**: Plan your video or presentation flow\n• **Educational Stories**: Great for teaching narratives to kids\n\nTips for good storyboards:\n• Keep it simple and clear\n• Focus on key moments\n• Use arrows to show movement\n• Add brief descriptions\n\nTry creating your first frame with the 'New Frame' button!";
    }

    // Landing page design
    if (lowerMessage.includes("landing") || lowerMessage.includes("homepage")) {
      return "Landing pages need immediate impact:\n\n• **Hero Section**: Clear value proposition\n• **Benefits**: Focus on user outcomes\n• **Social Proof**: Testimonials and reviews\n• **Call-to-Action**: Prominent and specific\n• **Loading Speed**: Optimize for fast delivery\n• **Mobile-First**: Most traffic is mobile\n\nWhat's your main conversion goal?";
    }

    // E-commerce design
    if (lowerMessage.includes("ecommerce") || lowerMessage.includes("shop") || lowerMessage.includes("store")) {
      return "E-commerce design for better conversions:\n\n• **Product Images**: High-quality, multiple angles\n• **Search & Filters**: Easy product discovery\n• **Trust Signals**: Security badges, reviews\n• **Checkout**: Minimal steps, guest options\n• **Cart**: Clear pricing, easy modification\n• **Returns**: Clear, confident policies\n\nWhat products will you be selling?";
    }

    // Thank you responses
    if (lowerMessage.includes("thank") || lowerMessage.includes("thanks")) {
      return "You're very welcome! I'm here to help you create amazing designs. Feel free to ask about colors, layouts, components, or any design challenges you're facing. Happy designing! 🎨";
    }

    // Greeting responses
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
      return "Hello! I'm excited to help you with your design project. I can assist with:\n\n• Color schemes and palettes\n• Layout and composition ideas\n• Typography recommendations\n• UI/UX best practices\n• Photo and video editing tips\n• Creative inspiration\n\nWhat would you like to work on today?";
    }

    // Help responses
    if (lowerMessage.includes("help") || lowerMessage.includes("what can you do")) {
      return "I can help you with many aspects of design:\n\n• **Visual Design**: Colors, typography, layouts\n• **User Experience**: Navigation, interactions, workflows\n• **Branding**: Logos, identity, consistency\n• **Web Design**: Responsive layouts, performance\n• **App Design**: Mobile patterns, gestures\n• **Content**: Photo/video editing, optimization\n\nJust describe what you're working on and I'll provide specific guidance!";
    }

    // Default responses for general queries
    const defaultResponses = [
      "That's an interesting design challenge! Could you tell me more about what you're trying to create? I can help with layouts, color schemes, typography, and component design.",
      "I'd love to help you with that! Are you working on a specific type of design - like a website, dashboard, mobile app, or something else?",
      "Great question! To give you the best advice, could you share more details about your project? I can suggest modern design patterns and best practices.",
      "I'm here to help you create stunning designs! Whether you need help with visual hierarchy, user experience, or technical implementation, just let me know what you're working on.",
      "Interesting! I can provide guidance on many design topics. Try asking me about colors, layouts, typography, user experience, or specific design challenges you're facing.",
      "I'm ready to help! I can assist with creative ideas, design principles, color theory, layout composition, and much more. What's your current project about?"
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
