import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BarChart3, 
  Users, 
  FolderOpen, 
  Activity,
  TrendingUp,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, trend, trendUp }) => (
  <div className="card-workspace animate-slide-up">
    <div className="flex items-start justify-between">
      <div className="p-2 rounded-lg bg-primary/10">
        {icon}
      </div>
      {trend && (
        <span className={cn(
          "flex items-center gap-1 text-xs font-medium",
          trendUp ? "text-workspace-success" : "text-role-admin"
        )}>
          <TrendingUp className={cn("w-3 h-3", !trendUp && "rotate-180")} />
          {trend}
        </span>
      )}
    </div>
    <div className="mt-4">
      <p className="text-2xl font-bold text-workspace-text">{value}</p>
      <p className="text-sm text-workspace-text-muted">{label}</p>
    </div>
  </div>
);

interface ActivityItemProps {
  action: string;
  user: string;
  time: string;
  type: 'create' | 'update' | 'delete';
}

const ActivityItem: React.FC<ActivityItemProps> = ({ action, user, time, type }) => {
  const colors = {
    create: 'bg-workspace-success',
    update: 'bg-primary',
    delete: 'bg-role-admin',
  };

  return (
    <div className="flex items-start gap-3 py-3 border-b border-workspace-border last:border-0">
      <div className={cn("w-2 h-2 rounded-full mt-2", colors[type])} />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-workspace-text">{action}</p>
        <p className="text-xs text-workspace-text-muted">by {user}</p>
      </div>
      <span className="text-xs text-workspace-text-muted flex items-center gap-1">
        <Clock className="w-3 h-3" />
        {time}
      </span>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const { role, isAdmin } = useAuth();

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-workspace-text">Dashboard</h1>
        <p className="text-workspace-text-muted">
          Welcome back! Here's an overview of your workspace.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<FolderOpen className="w-5 h-5 text-primary" />}
          label="Total Projects"
          value="12"
          trend="+2 this week"
          trendUp
        />
        <StatCard
          icon={<Activity className="w-5 h-5 text-primary" />}
          label="Active Sessions"
          value="3"
        />
        {(role === 'admin' || role === 'developer') && (
          <StatCard
            icon={<BarChart3 className="w-5 h-5 text-primary" />}
            label="Deployments"
            value="28"
            trend="+5 this month"
            trendUp
          />
        )}
        {isAdmin() && (
          <StatCard
            icon={<Users className="w-5 h-5 text-primary" />}
            label="Team Members"
            value="8"
            trend="+1 new"
            trendUp
          />
        )}
      </div>

      {/* Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="card-workspace">
          <h2 className="text-lg font-semibold text-workspace-text mb-4">Recent Activity</h2>
          <div className="space-y-1">
            <ActivityItem
              action="Created new project 'Landing Page'"
              user="john@example.com"
              time="2h ago"
              type="create"
            />
            <ActivityItem
              action="Updated 'Dashboard' component"
              user="sarah@example.com"
              time="5h ago"
              type="update"
            />
            <ActivityItem
              action="Deployed to production"
              user="admin@example.com"
              time="1d ago"
              type="create"
            />
            {isAdmin() && (
              <ActivityItem
                action="Removed deprecated API endpoint"
                user="admin@example.com"
                time="2d ago"
                type="delete"
              />
            )}
          </div>
        </div>

        {/* Role Permissions */}
        <div className="card-workspace">
          <h2 className="text-lg font-semibold text-workspace-text mb-4">Your Permissions</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-workspace-border/30">
              <span className="text-sm text-workspace-text">View Projects</span>
              <span className="text-xs text-workspace-success">✓ Allowed</span>
            </div>
            <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-workspace-border/30">
              <span className="text-sm text-workspace-text">Edit Code</span>
              <span className={cn(
                "text-xs",
                role === 'user' ? "text-role-admin" : "text-workspace-success"
              )}>
                {role === 'user' ? '✗ Restricted' : '✓ Allowed'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-workspace-border/30">
              <span className="text-sm text-workspace-text">Deploy to Production</span>
              <span className={cn(
                "text-xs",
                role === 'user' ? "text-role-admin" : "text-workspace-success"
              )}>
                {role === 'user' ? '✗ Restricted' : '✓ Allowed'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-workspace-border/30">
              <span className="text-sm text-workspace-text">Manage Users</span>
              <span className={cn(
                "text-xs",
                role === 'admin' ? "text-workspace-success" : "text-role-admin"
              )}>
                {role === 'admin' ? '✓ Allowed' : '✗ Admin Only'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
