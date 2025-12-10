import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Plus,
  Paperclip,
  Palette,
  MessageSquare,
  AudioLines,
  Send,
  ArrowRight,
  FolderOpen
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface DashboardProps {
  onSelectProject?: (project: Project) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectProject }) => {
  const { user, canEdit } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [activeTab, setActiveTab] = useState<'recent' | 'my-projects' | 'templates'>('recent');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there';

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('id, name, description, created_at, updated_at')
      .order('updated_at', { ascending: false })
      .limit(6);

    if (!error && data) {
      setProjects(data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !canEdit()) return;

    // Create a new project with the prompt as the name
    const { data, error } = await supabase
      .from('projects')
      .insert({
        name: prompt.slice(0, 50),
        description: prompt,
        owner_id: user?.id
      })
      .select()
      .single();

    if (!error && data && onSelectProject) {
      onSelectProject(data);
    }
    setPrompt('');
    fetchProjects();
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Gradient Background */}
      <div className="flex-1 relative overflow-hidden">
        {/* Gradient overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 80% at 50% 50%, 
                hsl(240 70% 40% / 0.6) 0%,
                hsl(280 80% 40% / 0.5) 25%,
                hsl(320 85% 45% / 0.4) 50%,
                hsl(340 90% 50% / 0.3) 75%,
                transparent 100%
              )
            `
          }}
        />
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 60% 50% at 20% 80%, 
                hsl(340 90% 55% / 0.5) 0%,
                transparent 60%
              ),
              radial-gradient(ellipse 50% 40% at 80% 20%, 
                hsl(260 85% 50% / 0.4) 0%,
                transparent 50%
              )
            `
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] px-4">
          <h1 className="text-4xl md:text-5xl font-semibold text-white mb-8 text-center">
            Let's create, <span className="italic">{userName}</span>
          </h1>

          {/* Prompt Input */}
          <form onSubmit={handleSubmit} className="w-full max-w-2xl">
            <div className="relative bg-[hsl(var(--workspace-panel))] rounded-2xl border border-[hsl(var(--workspace-border))] overflow-hidden">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask Lovable to create a landing page for my..."
                className="w-full px-6 py-4 bg-transparent text-white placeholder:text-[hsl(var(--workspace-text-muted))] focus:outline-none text-base"
                disabled={!canEdit()}
              />
              
              {/* Input Actions */}
              <div className="flex items-center gap-2 px-4 pb-4">
                <button 
                  type="button"
                  className="p-2 rounded-lg text-[hsl(var(--workspace-text-muted))] hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button 
                  type="button"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-[hsl(var(--workspace-text-muted))] hover:text-white hover:bg-white/10 transition-colors border border-[hsl(var(--workspace-border))]"
                >
                  <Paperclip className="w-4 h-4" />
                  Attach
                </button>
                <button 
                  type="button"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-[hsl(var(--workspace-text-muted))] hover:text-white hover:bg-white/10 transition-colors border border-[hsl(var(--workspace-border))]"
                >
                  <Palette className="w-4 h-4" />
                  Theme
                </button>

                <div className="flex-1" />

                <button 
                  type="button"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-[hsl(var(--workspace-text-muted))] hover:text-white hover:bg-white/10 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Chat
                </button>
                <button 
                  type="button"
                  className="p-2 rounded-lg text-[hsl(var(--workspace-text-muted))] hover:text-white hover:bg-white/10 transition-colors"
                >
                  <AudioLines className="w-4 h-4" />
                </button>
                <button 
                  type="submit"
                  disabled={!prompt.trim() || !canEdit()}
                  className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
            {!canEdit() && (
              <p className="text-center text-sm text-[hsl(var(--workspace-text-muted))] mt-2">
                You need developer or admin access to create projects
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Projects Section */}
      <div className="bg-[hsl(var(--workspace-bg))] border-t border-[hsl(var(--workspace-border))]">
        <div className="max-w-6xl mx-auto px-6 py-6">
          {/* Tabs */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-1">
              <button 
                onClick={() => setActiveTab('recent')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'recent' 
                    ? 'bg-white/10 text-white' 
                    : 'text-[hsl(var(--workspace-text-muted))] hover:text-white'
                }`}
              >
                Recently viewed
              </button>
              <button 
                onClick={() => setActiveTab('my-projects')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'my-projects' 
                    ? 'bg-white/10 text-white' 
                    : 'text-[hsl(var(--workspace-text-muted))] hover:text-white'
                }`}
              >
                My projects
              </button>
              <button 
                onClick={() => setActiveTab('templates')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'templates' 
                    ? 'bg-white/10 text-white' 
                    : 'text-[hsl(var(--workspace-text-muted))] hover:text-white'
                }`}
              >
                Templates
              </button>
            </div>
            <button className="flex items-center gap-2 text-sm text-[hsl(var(--workspace-text-muted))] hover:text-white transition-colors">
              Browse all
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              // Skeleton loaders
              Array.from({ length: 3 }).map((_, i) => (
                <div 
                  key={i}
                  className="h-40 rounded-xl bg-[hsl(var(--workspace-panel))] border border-[hsl(var(--workspace-border))] animate-pulse"
                />
              ))
            ) : projects.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <FolderOpen className="w-12 h-12 text-[hsl(var(--workspace-text-muted))] mb-4" />
                <p className="text-[hsl(var(--workspace-text-muted))] mb-2">No projects yet</p>
                <p className="text-sm text-[hsl(var(--workspace-text-muted))]">
                  Create your first project using the prompt above
                </p>
              </div>
            ) : (
              projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => onSelectProject?.(project)}
                  className="group h-40 rounded-xl bg-[hsl(var(--workspace-panel))] border border-[hsl(var(--workspace-border))] p-4 text-left hover:border-primary/50 transition-colors overflow-hidden"
                >
                  <div className="flex flex-col h-full">
                    <h3 className="font-medium text-white group-hover:text-primary transition-colors truncate">
                      {project.name}
                    </h3>
                    <p className="text-sm text-[hsl(var(--workspace-text-muted))] mt-1 line-clamp-2">
                      {project.description || 'No description'}
                    </p>
                    <div className="mt-auto">
                      <p className="text-xs text-[hsl(var(--workspace-text-muted))]">
                        {project.updated_at 
                          ? new Date(project.updated_at).toLocaleDateString()
                          : 'Recently created'}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
