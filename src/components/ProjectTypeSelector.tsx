import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Palette, 
  Video, 
  BookOpen, 
  Smartphone, 
  Image, 
  Wand2,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface ProjectType {
  id: string;
  name: string;
  description: string;
  icon: any;
  gradient: string;
}

const projectTypes: ProjectType[] = [
  {
    id: 'design',
    name: 'Graphic Design',
    description: 'Create stunning visuals, logos, and brand materials',
    icon: Palette,
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    id: 'story',
    name: 'Story Making',
    description: 'Craft compelling narratives and visual stories',
    icon: BookOpen,
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'video',
    name: 'Video Editing',
    description: 'Edit and produce professional video content',
    icon: Video,
    gradient: 'from-green-500 to-teal-500'
  },
  {
    id: 'prototype',
    name: 'UI/UX Prototyping',
    description: 'Design user interfaces and experiences',
    icon: Smartphone,
    gradient: 'from-orange-500 to-red-500'
  },
  {
    id: 'photo',
    name: 'Photo Editing',
    description: 'Enhance and manipulate images with AI',
    icon: Image,
    gradient: 'from-indigo-500 to-purple-500'
  },
  {
    id: 'ai-art',
    name: 'AI Art Generation',
    description: 'Transform ideas into stunning AI-generated artwork',
    icon: Wand2,
    gradient: 'from-pink-500 to-violet-500'
  }
];

interface ProjectTypeSelectorProps {
  onProjectTypeSelect: (projectType: ProjectType) => void;
}

export function ProjectTypeSelector({ onProjectTypeSelect }: ProjectTypeSelectorProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleSelect = (projectType: ProjectType) => {
    setSelectedType(projectType.id);
    setTimeout(() => {
      onProjectTypeSelect(projectType);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-canvas flex items-center justify-center p-6">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-8 h-8 text-ai-primary mr-3" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Infinite Canvas
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose your creative journey. Our AI assistant will guide you through every step.
          </p>
        </div>

        {/* Project Type Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectTypes.map((type, index) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.id;
            
            return (
              <Card
                key={type.id}
                className={`
                  glass glass-hover cursor-pointer group relative overflow-hidden
                  transition-all duration-500 transform
                  ${isSelected ? 'scale-105 shadow-ai' : 'hover:scale-105'}
                  animate-slide-in
                `}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => handleSelect(type)}
              >
                <div className="p-8 relative z-10">
                  {/* Icon with gradient background */}
                  <div className={`
                    w-16 h-16 rounded-2xl bg-gradient-to-br ${type.gradient} 
                    flex items-center justify-center mb-6 group-hover:scale-110 
                    transition-transform duration-300 shadow-lg
                  `}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {type.name}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    {type.description}
                  </p>

                  {/* Action */}
                  <div className="flex items-center text-primary group-hover:text-primary-glow transition-colors">
                    <span className="text-sm font-medium">Get Started</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Animated background gradient */}
                <div className={`
                  absolute inset-0 bg-gradient-to-br ${type.gradient} opacity-0 
                  group-hover:opacity-5 transition-opacity duration-500
                `} />
              </Card>
            );
          })}
        </div>

        {/* AI Assistant Preview */}
        <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: '800ms' }}>
          <div className="glass rounded-2xl p-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <div className="w-3 h-3 bg-ai-primary rounded-full mr-2 animate-pulse" />
              <span className="text-ai-primary font-medium">AI Assistant Ready</span>
            </div>
            <p className="text-muted-foreground">
              Once you select a project type, our AI will provide intelligent suggestions, 
              help with creative decisions, and guide you through your workflow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}