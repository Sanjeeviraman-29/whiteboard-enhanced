import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import {
  Download,
  Play,
  Star,
  Zap,
  Palette,
  Video,
  Camera,
  PenTool,
  Layers,
  Brain,
  Users,
  Infinity,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Globe,
  Shield,
  Monitor,
  Smartphone,
  ChevronDown
} from "lucide-react";

const LandingPage: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: Brain,
      title: "AI-Assisted Canvas",
      description: "Infinite whiteboard with intelligent suggestions and real-time improvements",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: Video,
      title: "Video Editing",
      description: "Professional video editing tools with timeline and effects",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Camera,
      title: "Photo Editing",
      description: "Advanced photo manipulation and enhancement capabilities",
      color: "from-pink-500 to-red-600"
    },
    {
      icon: Layers,
      title: "UI/UX Design",
      description: "Complete design system with components and prototyping",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Palette,
      title: "Graphic Design",
      description: "Vector graphics, illustrations, and brand design tools",
      color: "from-green-500 to-blue-600"
    },
    {
      icon: PenTool,
      title: "Storyboarding",
      description: "Visual storytelling with frames, annotations, and flows",
      color: "from-orange-500 to-yellow-600"
    }
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Download & Install",
      description: "Get the app for your platform - no account required"
    },
    {
      step: 2,
      title: "Create Your Canvas",
      description: "Start with an infinite whiteboard and choose your project type"
    },
    {
      step: 3,
      title: "AI-Powered Creation",
      description: "Let AI assist you with suggestions, improvements, and automation"
    },
    {
      step: 4,
      title: "Store Locally",
      description: "Your projects stay on your device - complete privacy and control"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "UI/UX Designer",
      avatar: "🎨",
      content: "This is the future of creative tools. The AI suggestions are incredible and having everything in one place saves me hours every day."
    },
    {
      name: "Marcus Rodriguez",
      role: "Video Creator",
      avatar: "🎬",
      content: "Finally, a tool that understands my workflow. From storyboarding to final edit, everything flows seamlessly."
    },
    {
      name: "Emma Thompson",
      role: "Graphic Designer",
      avatar: "✨",
      content: "The decentralized approach gives me complete control over my work. No more worrying about cloud storage or privacy."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-white/20 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Infinity className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">InfiniteCanvas</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">How It Works</a>
              <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors">Testimonials</a>
              <a href="#download" className="text-gray-600 hover:text-blue-600 transition-colors">Download</a>
              <Link to="/canvas">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  Start Creating
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <Sparkles className="w-4 h-4 mr-2" />
              Powered by AI
            </Badge>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Create Without
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"> Limits</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              The first truly decentralized, AI-powered whiteboard for digital creators. 
              Design, edit, collaborate, and create stunning visuals with infinite possibilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/canvas">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 text-lg">
                  <Download className="w-5 h-5 mr-2" />
                  Start Creating
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-blue-200 text-blue-600 px-8 py-3 text-lg">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
            
            {/* Hero Animation/Preview */}
            <div className="relative max-w-5xl mx-auto">
              <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl p-8 backdrop-blur-sm border border-white/20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {features.slice(0, 4).map((feature, index) => (
                    <div key={index} className="bg-white/60 rounded-lg p-4 text-center hover:scale-105 transition-transform">
                      <feature.icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-700">{feature.title}</p>
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <Badge variant="secondary" className="bg-white/60">
                    <Brain className="w-4 h-4 mr-2" />
                    AI-Powered • Decentralized • Cross-Platform
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Create
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From AI-assisted design to multi-modal creation, experience the future of digital creativity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Features */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
              <CardContent className="p-8">
                <Users className="w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold mb-4">Interactive Learning for Kids</h3>
                <p className="text-blue-100 mb-4">
                  Safe, engaging environment for young creators to learn and explore digital art, 
                  with age-appropriate tools and AI guidance.
                </p>
                <Button variant="secondary" className="bg-white text-blue-600">
                  Learn More <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
              <CardContent className="p-8">
                <Shield className="w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold mb-4">Fully Decentralized</h3>
                <p className="text-purple-100 mb-4">
                  No cloud storage, no data tracking. Your projects stay on your device, 
                  giving you complete control and privacy over your creative work.
                </p>
                <Button variant="secondary" className="bg-white text-purple-600">
                  Privacy First <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in minutes, not hours
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Loved by Creators Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of artists, designers, and creators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xl mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-gray-600 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">"{testimonial.content}"</p>
                  <div className="flex mt-4">
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Creator Showcase */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Creator Showcase</h2>
          <p className="text-xl text-blue-100 mb-8">
            Discover amazing projects made with InfiniteCanvas
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[1,2,3,4].map((item) => (
              <div key={item} className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                <div className="w-16 h-16 bg-white/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Sparkles className="w-8 h-8" />
                </div>
                <p className="text-sm">Featured Project {item}</p>
              </div>
            ))}
          </div>
          <Button variant="secondary" className="bg-white text-blue-600">
            Explore Gallery <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Start Creating?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Download InfiniteCanvas for your platform and begin your creative journey
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <Monitor className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Desktop</h3>
                <p className="text-gray-400 mb-4">Windows, Mac, Linux</p>
                <Link to="/canvas" className="w-full">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                    <Download className="w-4 h-4 mr-2" />
                    Launch App
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <Globe className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Web App</h3>
                <p className="text-gray-400 mb-4">Any browser</p>
                <Link to="/canvas" className="w-full">
                  <Button variant="outline" className="w-full border-purple-600 text-purple-400">
                    Launch Web App
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <Smartphone className="w-12 h-12 text-pink-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Mobile</h3>
                <p className="text-gray-400 mb-4">Coming Soon</p>
                <Button variant="outline" className="w-full border-gray-600 text-gray-400" disabled>
                  Notify Me
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
            <h3 className="text-2xl font-bold mb-4">Coming AI Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                <span>Text-to-Image Generation</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                <span>Hand-drawing Enhancement</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                <span>Smart Auto-completion</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Infinity className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl">InfiniteCanvas</span>
              </div>
              <p className="text-gray-400">
                The future of decentralized creative tools. Create without limits.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Download</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Roadmap</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 InfiniteCanvas. All rights reserved. Built with privacy and creativity in mind.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
