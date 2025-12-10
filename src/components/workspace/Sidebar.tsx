import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  Code2, 
  FolderOpen, 
  Settings, 
  Users, 
  Shield, 
  LogOut,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  badge?: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick, badge }) => (
  <button
    onClick={onClick}
    className={cn(
      "nav-item w-full group",
      active && "active"
    )}
  >
    <span className="flex-shrink-0">{icon}</span>
    <span className="flex-1 text-left text-sm">{label}</span>
    {badge && (
      <span className="px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary">
        {badge}
      </span>
    )}
    <ChevronRight className={cn(
      "w-4 h-4 opacity-0 -translate-x-2 transition-all duration-200",
      "group-hover:opacity-100 group-hover:translate-x-0"
    )} />
  </button>
);

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  const { user, role, signOut, isAdmin, isDeveloper } = useAuth();

  const getRoleBadgeClass = () => {
    switch (role) {
      case 'admin': return 'role-admin';
      case 'developer': return 'role-developer';
      default: return 'role-user';
    }
  };

  return (
    <aside className="workspace-sidebar w-64 flex flex-col h-screen">
      {/* Logo */}
      <div className="p-4 border-b border-workspace-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center glow-effect">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-workspace-text">Lovable</h1>
            <p className="text-xs text-workspace-text-muted">Workspace</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-workspace-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/50 to-purple-600/50 flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {user?.email?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-workspace-text truncate">
              {user?.email?.split('@')[0]}
            </p>
            <span className={cn("role-badge", getRoleBadgeClass())}>
              {role}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-workspace-text-muted">
          Main
        </p>
        
        <NavItem
          icon={<LayoutDashboard className="w-5 h-5" />}
          label="Dashboard"
          active={activeSection === 'dashboard'}
          onClick={() => onSectionChange('dashboard')}
        />
        
        <NavItem
          icon={<FolderOpen className="w-5 h-5" />}
          label="Projects"
          active={activeSection === 'projects'}
          onClick={() => onSectionChange('projects')}
        />
        
        <NavItem
          icon={<Code2 className="w-5 h-5" />}
          label="Editor"
          active={activeSection === 'editor'}
          onClick={() => onSectionChange('editor')}
          badge={!isDeveloper() && !isAdmin() ? 'View Only' : undefined}
        />

        {(isAdmin() || isDeveloper()) && (
          <>
            <div className="py-3">
              <div className="h-px bg-workspace-border" />
            </div>
            
            <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-workspace-text-muted">
              Developer
            </p>
            
            <NavItem
              icon={<Settings className="w-5 h-5" />}
              label="Settings"
              active={activeSection === 'settings'}
              onClick={() => onSectionChange('settings')}
            />
          </>
        )}

        {isAdmin() && (
          <>
            <div className="py-3">
              <div className="h-px bg-workspace-border" />
            </div>
            
            <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-workspace-text-muted">
              Admin
            </p>
            
            <NavItem
              icon={<Users className="w-5 h-5" />}
              label="Users"
              active={activeSection === 'users'}
              onClick={() => onSectionChange('users')}
            />
            
            <NavItem
              icon={<Shield className="w-5 h-5" />}
              label="Permissions"
              active={activeSection === 'permissions'}
              onClick={() => onSectionChange('permissions')}
            />
          </>
        )}
      </nav>

      {/* Sign Out */}
      <div className="p-3 border-t border-workspace-border">
        <button
          onClick={signOut}
          className="nav-item w-full text-role-admin/80 hover:text-role-admin hover:bg-role-admin/10"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
