import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Folder, Trash2, Edit2, Eye, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Project {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

interface ProjectsPanelProps {
  onSelectProject?: (project: Project) => void;
}

export const ProjectsPanel: React.FC<ProjectsPanelProps> = ({ onSelectProject }) => {
  const { canEdit, canDelete, user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async () => {
    if (!canEdit()) {
      toast.error('Permission Denied', {
        description: 'You need developer or admin access to create projects.',
      });
      return;
    }

    if (!newProjectName.trim()) {
      toast.error('Please enter a project name');
      return;
    }

    const { error } = await supabase.from('projects').insert({
      name: newProjectName.trim(),
      description: newProjectDesc.trim() || null,
      owner_id: user?.id,
      code: `// Welcome to ${newProjectName}\n\nconst App = () => {\n  return (\n    <div>\n      <h1>Hello, World!</h1>\n    </div>\n  );\n};\n\nexport default App;`,
    });

    if (error) {
      toast.error('Failed to create project');
      console.error(error);
    } else {
      toast.success('Project created!');
      setNewProjectName('');
      setNewProjectDesc('');
      setShowCreateModal(false);
      fetchProjects();
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!canDelete()) {
      toast.error('Permission Denied', {
        description: 'Only admins can delete projects.',
      });
      return;
    }

    const { error } = await supabase.from('projects').delete().eq('id', id);

    if (error) {
      toast.error('Failed to delete project');
    } else {
      toast.success('Project deleted');
      fetchProjects();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="p-6 animate-pulse">
        <div className="h-8 w-32 bg-workspace-border rounded mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-workspace-border rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-workspace-text">Projects</h1>
          <p className="text-workspace-text-muted">
            {projects.length} project{projects.length !== 1 ? 's' : ''} in your workspace
          </p>
        </div>
        
        {canEdit() && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-workspace"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        )}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="card-workspace group hover:border-primary/50 transition-all duration-200 cursor-pointer"
            onClick={() => onSelectProject?.(project)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Folder className="w-5 h-5 text-primary" />
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectProject?.(project);
                  }}
                  className="p-1.5 rounded hover:bg-workspace-border"
                  title="View"
                >
                  <Eye className="w-4 h-4 text-workspace-text-muted" />
                </button>
                {canEdit() && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProject?.(project);
                    }}
                    className="p-1.5 rounded hover:bg-workspace-border"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4 text-workspace-text-muted" />
                  </button>
                )}
                {canDelete() && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project.id);
                    }}
                    className="p-1.5 rounded hover:bg-role-admin/20"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-role-admin" />
                  </button>
                )}
              </div>
            </div>
            
            <h3 className="font-semibold text-workspace-text mb-1">{project.name}</h3>
            <p className="text-sm text-workspace-text-muted line-clamp-2 mb-4">
              {project.description || 'No description'}
            </p>
            
            <div className="flex items-center gap-1 text-xs text-workspace-text-muted">
              <Clock className="w-3 h-3" />
              Updated {formatDate(project.updated_at)}
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <Folder className="w-12 h-12 text-workspace-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-medium text-workspace-text mb-2">No projects yet</h3>
          <p className="text-workspace-text-muted mb-4">
            {canEdit() ? 'Create your first project to get started.' : 'No projects available in this workspace.'}
          </p>
          {canEdit() && (
            <button onClick={() => setShowCreateModal(true)} className="btn-workspace">
              <Plus className="w-4 h-4" />
              Create Project
            </button>
          )}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in">
          <div className="card-workspace w-full max-w-md mx-4 animate-slide-up">
            <h2 className="text-xl font-bold text-workspace-text mb-4">Create New Project</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-workspace-text mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="My Awesome Project"
                  className="input-workspace"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-workspace-text mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  placeholder="A brief description of your project..."
                  className="input-workspace resize-none h-24"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="btn-workspace-secondary"
              >
                Cancel
              </button>
              <button onClick={handleCreateProject} className="btn-workspace">
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
