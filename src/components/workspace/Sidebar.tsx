import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home,
  Search,
  Grid3X3,
  Star,
  Users,
  Compass,
  LayoutTemplate,
  BookOpen,
  Share2,
  Zap,
  LogOut,
  ChevronDown,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-all duration-200",
      active 
        ? "text-white bg-white/10" 
        : "text-[hsl(var(--workspace-text-muted))] hover:text-white hover:bg-white/5"
    )}
  >
    <span className="flex-shrink-0">{icon}</span>
    <span>{label}</span>
  </button>
);

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  const { user, role, signOut, isAdmin, isDeveloper } = useAuth();

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <aside className="w-56 flex flex-col h-screen bg-[hsl(var(--workspace-sidebar))] border-r border-[hsl(var(--workspace-border))]">
      {/* Logo */}
      <div className="p-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">L</span>
          </div>
        </div>
      </div>

      {/* Workspace Dropdown */}
      <div className="px-3 mb-2">
        <button className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-xs font-medium">
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="flex-1 text-left text-sm text-white truncate">{userName}'s Workspace</span>
          <ChevronDown className="w-4 h-4 text-[hsl(var(--workspace-text-muted))]" />
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <NavItem
          icon={<Home className="w-4 h-4" />}
          label="Home"
          active={activeSection === 'dashboard'}
          onClick={() => onSectionChange('dashboard')}
        />
        <NavItem
          icon={<Search className="w-4 h-4" />}
          label="Search"
          active={activeSection === 'search'}
          onClick={() => onSectionChange('search')}
        />

        {/* Projects Section */}
        <div className="pt-4">
          <p className="px-3 py-2 text-xs font-medium text-[hsl(var(--workspace-text-muted))]">
            Projects
          </p>
          <NavItem
            icon={<Grid3X3 className="w-4 h-4" />}
            label="All projects"
            active={activeSection === 'projects'}
            onClick={() => onSectionChange('projects')}
          />
          <NavItem
            icon={<Star className="w-4 h-4" />}
            label="Starred"
            active={activeSection === 'starred'}
            onClick={() => onSectionChange('starred')}
          />
          <NavItem
            icon={<Users className="w-4 h-4" />}
            label="Shared with me"
            active={activeSection === 'shared'}
            onClick={() => onSectionChange('shared')}
          />
        </div>

        {/* Resources Section */}
        <div className="pt-4">
          <p className="px-3 py-2 text-xs font-medium text-[hsl(var(--workspace-text-muted))]">
            Resources
          </p>
          <NavItem
            icon={<Compass className="w-4 h-4" />}
            label="Discover"
            active={activeSection === 'discover'}
            onClick={() => onSectionChange('discover')}
          />
          <NavItem
            icon={<LayoutTemplate className="w-4 h-4" />}
            label="Templates"
            active={activeSection === 'templates'}
            onClick={() => onSectionChange('templates')}
          />
          <NavItem
            icon={<BookOpen className="w-4 h-4" />}
            label="Learn"
            active={activeSection === 'learn'}
            onClick={() => onSectionChange('learn')}
          />
        </div>

        {/* Admin Section */}
        {isAdmin() && (
          <div className="pt-4">
            <p className="px-3 py-2 text-xs font-medium text-[hsl(var(--workspace-text-muted))]">
              Admin
            </p>
            <NavItem
              icon={<Users className="w-4 h-4" />}
              label="Users"
              active={activeSection === 'users'}
              onClick={() => onSectionChange('users')}
            />
            <NavItem
              icon={<Settings className="w-4 h-4" />}
              label="Settings"
              active={activeSection === 'settings'}
              onClick={() => onSectionChange('settings')}
            />
          </div>
        )}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 space-y-1 border-t border-[hsl(var(--workspace-border))]">
        <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-[hsl(var(--workspace-text-muted))] hover:text-white hover:bg-white/5 transition-colors">
          <Share2 className="w-4 h-4" />
          <div className="flex-1 text-left">
            <p className="text-sm">Share Lovable</p>
            <p className="text-xs text-[hsl(var(--workspace-text-muted))]">Get 10 credits each</p>
          </div>
          <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center">
            <Grid3X3 className="w-3 h-3" />
          </div>
        </button>

        <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-[hsl(var(--workspace-text-muted))] hover:text-white hover:bg-white/5 transition-colors">
          <Zap className="w-4 h-4" />
          <div className="flex-1 text-left">
            <p className="text-sm">Upgrade to Pro</p>
            <p className="text-xs text-[hsl(var(--workspace-text-muted))]">Unlock more benefits</p>
          </div>
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
            <Zap className="w-3 h-3 text-white" />
          </div>
        </button>

        {/* User Avatar & Sign Out */}
        <div className="flex items-center gap-2 pt-2">
          <button className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 text-white text-sm font-medium">
            {userName.charAt(0).toUpperCase()}
          </button>
          <button 
            onClick={signOut}
            className="p-2 rounded-lg text-[hsl(var(--workspace-text-muted))] hover:text-white hover:bg-white/5 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
