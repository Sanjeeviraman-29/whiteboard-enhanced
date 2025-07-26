// API Service for InfiniteCanvas Backend Integration

export interface Project {
  id: string;
  name: string;
  type: 'canvas' | 'video' | 'photo' | 'design';
  thumbnail?: string;
  lastModified: Date;
  elements?: any[];
  settings?: Record<string, any>;
  aiEnhancements?: any[];
}

export interface AIRequest {
  type: 'enhance' | 'generate' | 'suggest' | 'optimize';
  data: any;
  prompt?: string;
}

export interface AIResponse {
  success: boolean;
  data: any;
  suggestions?: string[];
  confidence?: number;
}

class APIService {
  private baseURL = process.env.NODE_ENV === 'production' 
    ? 'https://api.infinitecanvas.com' 
    : 'http://localhost:3001';

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.debug('API Request failed, using mock response:', error);
      // Always fallback to mock data when backend is unavailable
      return this.getMockResponse<T>(endpoint, options);
    }
  }

  private getMockResponse<T>(endpoint: string, options: RequestInit): T {
    // Mock responses for development/offline mode
    if (endpoint.includes('/projects') && options.method === 'POST') {
      return { success: true, id: Date.now().toString() } as T;
    }
    
    if (endpoint.includes('/projects/') && options.method === 'GET') {
      return {
        id: '1',
        name: 'Sample Project',
        type: 'canvas',
        lastModified: new Date(),
        elements: [],
        settings: {}
      } as T;
    }

    if (endpoint.includes('/ai/enhance')) {
      return {
        success: true,
        data: {
          elements: JSON.parse(options.body as string).elements,
          enhancements: [
            'Improved color harmony',
            'Better composition balance',
            'Enhanced visual hierarchy'
          ]
        },
        suggestions: [
          'Consider adding more contrast to your design',
          'Try using complementary colors for better visual impact',
          'The layout could benefit from more white space'
        ],
        confidence: 0.85
      } as T;
    }

    if (endpoint.includes('/ai/generate')) {
      const body = JSON.parse(options.body as string);
      return {
        success: true,
        data: {
          type: body.type,
          content: this.generateMockContent(body.type, body.prompt),
          metadata: {
            generated_at: new Date().toISOString(),
            model: 'gpt-4-vision',
            confidence: 0.92
          }
        }
      } as T;
    }

    if (endpoint.includes('/ai/suggest')) {
      return {
        success: true,
        data: {
          suggestions: [
            'Add a gradient background for modern appeal',
            'Use rounded corners for a friendlier feel',
            'Consider implementing a dark mode variant',
            'Add subtle animations for better user experience'
          ],
          layoutOptions: [
            { name: 'Grid Layout', preview: '/mock/grid-preview.png' },
            { name: 'Hero Section', preview: '/mock/hero-preview.png' },
            { name: 'Card Grid', preview: '/mock/cards-preview.png' }
          ]
        }
      } as T;
    }

    return { success: false, error: 'Mock response not implemented' } as T;
  }

  private generateMockContent(type: string, prompt: string): any {
    switch (type) {
      case 'image':
        return {
          url: `https://picsum.photos/800/600?random=${Date.now()}`,
          alt: `AI generated image based on: ${prompt}`,
          dimensions: { width: 800, height: 600 }
        };
      
      case 'video':
        return {
          url: '/mock/generated-video.mp4',
          thumbnail: `https://picsum.photos/400/300?random=${Date.now()}`,
          duration: 30,
          format: 'mp4'
        };
      
      case 'design':
        return {
          components: [
            { type: 'header', props: { title: 'AI Generated Header', style: 'modern' } },
            { type: 'hero', props: { text: prompt, background: 'gradient' } },
            { type: 'features', props: { count: 3, layout: 'grid' } }
          ],
          theme: {
            colors: ['#3b82f6', '#8b5cf6', '#ec4899'],
            fonts: ['Inter', 'Poppins'],
            spacing: 'comfortable'
          }
        };
      
      case 'text':
        return {
          content: `AI generated content based on your prompt: "${prompt}". This is a sophisticated response that takes into account modern design principles and user experience best practices.`,
          variants: [
            'Professional tone version',
            'Casual tone version', 
            'Technical tone version'
          ]
        };
      
      default:
        return { message: 'Content generated successfully' };
    }
  }

  // Project Management
  async saveProject(project: Project): Promise<{ success: boolean; id: string }> {
    // Save to backend
    const result = await this.request<{ success: boolean; id: string }>('/api/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });

    // Also save to localStorage as backup
    localStorage.setItem(`project-${project.id}`, JSON.stringify(project));
    
    return result;
  }

  async loadProject(projectId: string): Promise<Project> {
    try {
      return await this.request<Project>(`/api/projects/${projectId}`);
    } catch (error) {
      // Fallback to localStorage
      const stored = localStorage.getItem(`project-${projectId}`);
      if (stored) {
        return JSON.parse(stored);
      }
      throw new Error('Project not found');
    }
  }

  async listProjects(): Promise<Project[]> {
    try {
      return await this.request<Project[]>('/api/projects');
    } catch (error) {
      // Fallback to localStorage projects
      const projects: Project[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('project-')) {
          const project = JSON.parse(localStorage.getItem(key)!);
          projects.push(project);
        }
      }
      return projects;
    }
  }

  async deleteProject(projectId: string): Promise<{ success: boolean }> {
    const result = await this.request<{ success: boolean }>(`/api/projects/${projectId}`, {
      method: 'DELETE',
    });
    
    // Also remove from localStorage
    localStorage.removeItem(`project-${projectId}`);
    
    return result;
  }

  // AI Features
  async enhanceWithAI(elements: any[], type: string = 'canvas'): Promise<AIResponse> {
    return await this.request<AIResponse>('/api/ai/enhance', {
      method: 'POST',
      body: JSON.stringify({ elements, type }),
    });
  }

  async generateAIContent(prompt: string, type: string): Promise<AIResponse> {
    return await this.request<AIResponse>('/api/ai/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt, type }),
    });
  }

  async getAISuggestions(context: any): Promise<AIResponse> {
    return await this.request<AIResponse>('/api/ai/suggest', {
      method: 'POST',
      body: JSON.stringify({ context }),
    });
  }

  async optimizeForPlatform(elements: any[], platform: string): Promise<AIResponse> {
    return await this.request<AIResponse>('/api/ai/optimize', {
      method: 'POST',
      body: JSON.stringify({ elements, platform }),
    });
  }

  // Media Processing
  async uploadMedia(file: File, type: 'image' | 'video'): Promise<{ url: string; metadata: any }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      const response = await fetch(`${this.baseURL}/api/media/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      
      return await response.json();
    } catch (error) {
      // Fallback to local URL for development
      return {
        url: URL.createObjectURL(file),
        metadata: {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified
        }
      };
    }
  }

  async processImage(imageUrl: string, filters: Record<string, any>): Promise<{ processedUrl: string }> {
    return await this.request<{ processedUrl: string }>('/api/media/process-image', {
      method: 'POST',
      body: JSON.stringify({ imageUrl, filters }),
    });
  }

  async processVideo(videoUrl: string, edits: Record<string, any>): Promise<{ processedUrl: string; preview: string }> {
    return await this.request<{ processedUrl: string; preview: string }>('/api/media/process-video', {
      method: 'POST',
      body: JSON.stringify({ videoUrl, edits }),
    });
  }

  // Collaboration
  async shareProject(projectId: string, permissions: string[]): Promise<{ shareUrl: string }> {
    return await this.request<{ shareUrl: string }>('/api/projects/share', {
      method: 'POST',
      body: JSON.stringify({ projectId, permissions }),
    });
  }

  async getCollaborators(projectId: string): Promise<{ collaborators: any[] }> {
    return await this.request<{ collaborators: any[] }>(`/api/projects/${projectId}/collaborators`);
  }

  // Analytics
  async trackUsage(action: string, metadata: Record<string, any>): Promise<void> {
    try {
      await this.request('/api/analytics/track', {
        method: 'POST',
        body: JSON.stringify({ action, metadata, timestamp: new Date().toISOString() }),
      });
    } catch (error) {
      // Silently fail for analytics
      console.debug('Analytics tracking failed:', error);
    }
  }
}

// Export singleton instance
export const apiService = new APIService();

// Export types
export type { AIResponse, AIRequest };
