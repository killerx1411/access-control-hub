import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Dashboard } from './Dashboard';
import { ProjectsPanel } from './ProjectsPanel';
import { CodeEditor } from './CodeEditor';
import { AdminPanel } from './AdminPanel';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft, Settings, Shield } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string | null;
  code?: string;
}

export const WorkspaceLayout: React.FC = () => {
  const { canEdit, isAdmin } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectCode, setProjectCode] = useState('');

  const handleSelectProject = async (project: Project) => {
    // Fetch full project with code
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', project.id)
      .single();

    if (error) {
      toast.error('Failed to load project');
      return;
    }

    setSelectedProject(data);
    setProjectCode(data.code || '');
    setActiveSection('editor');
  };

  const handleSaveCode = async () => {
    if (!selectedProject || !canEdit()) return;

    const { error } = await supabase
      .from('projects')
      .update({ code: projectCode })
      .eq('id', selectedProject.id);

    if (error) {
      toast.error('Failed to save code');
    }
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
    setActiveSection('projects');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      
      case 'projects':
        return <ProjectsPanel onSelectProject={handleSelectProject} />;
      
      case 'editor':
        if (selectedProject) {
          return (
            <div className="h-full flex flex-col">
              {/* Editor Header */}
              <div className="flex items-center gap-4 p-4 border-b border-workspace-border bg-workspace-sidebar">
                <button
                  onClick={handleBackToProjects}
                  className="btn-workspace-secondary p-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h2 className="font-semibold text-workspace-text">{selectedProject.name}</h2>
                  <p className="text-xs text-workspace-text-muted">
                    {selectedProject.description || 'No description'}
                  </p>
                </div>
              </div>
              
              {/* Editor */}
              <div className="flex-1 p-4">
                <CodeEditor
                  code={projectCode}
                  onChange={setProjectCode}
                  onSave={handleSaveCode}
                  fileName={`${selectedProject.name.toLowerCase().replace(/\s+/g, '-')}.tsx`}
                />
              </div>
            </div>
          );
        }
        return (
          <div className="p-6">
            <p className="text-workspace-text-muted">Select a project to edit</p>
            <button
              onClick={() => setActiveSection('projects')}
              className="btn-workspace mt-4"
            >
              Browse Projects
            </button>
          </div>
        );
      
      case 'settings':
        if (!canEdit()) {
          return (
            <div className="p-6 text-center">
              <Settings className="w-12 h-12 text-workspace-text-muted mx-auto mb-4" />
              <h2 className="text-xl font-bold text-workspace-text mb-2">Access Restricted</h2>
              <p className="text-workspace-text-muted">
                Developer or admin access required.
              </p>
            </div>
          );
        }
        return (
          <div className="p-6 animate-fade-in">
            <h1 className="text-2xl font-bold text-workspace-text mb-6 flex items-center gap-2">
              <Settings className="w-6 h-6 text-primary" />
              Settings
            </h1>
            <div className="card-workspace max-w-2xl">
              <h3 className="font-semibold text-workspace-text mb-4">Workspace Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-workspace-text mb-2">
                    Workspace Name
                  </label>
                  <input type="text" defaultValue="My Workspace" className="input-workspace" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-workspace-text mb-2">
                    Default Branch
                  </label>
                  <input type="text" defaultValue="main" className="input-workspace" />
                </div>
                <button className="btn-workspace">Save Changes</button>
              </div>
            </div>
          </div>
        );
      
      case 'users':
      case 'permissions':
        return <AdminPanel />;
      
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="workspace-layout flex">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
};
