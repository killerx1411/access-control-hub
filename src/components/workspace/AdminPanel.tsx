import React, { useEffect, useState } from 'react';
import { useAuth, AppRole } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Users, Shield, RefreshCw, Search, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface UserWithRole {
  id: string;
  email: string;
  role: AppRole;
  created_at: string;
}

export const AdminPanel: React.FC = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    
    // Fetch profiles with roles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, created_at');

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      toast.error('Failed to load users');
      setLoading(false);
      return;
    }

    // Fetch roles
    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id, role');

    if (rolesError) {
      console.error('Error fetching roles:', rolesError);
    }

    const roleMap = new Map(roles?.map(r => [r.user_id, r.role as AppRole]) || []);

    const usersWithRoles: UserWithRole[] = (profiles || []).map(p => ({
      id: p.id,
      email: p.email || 'Unknown',
      role: roleMap.get(p.id) || 'user',
      created_at: p.created_at,
    }));

    setUsers(usersWithRoles);
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin()) {
      fetchUsers();
    }
  }, []);

  const updateUserRole = async (userId: string, newRole: AppRole) => {
    const { error } = await supabase
      .from('user_roles')
      .update({ role: newRole })
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update role');
    } else {
      toast.success(`Role updated to ${newRole}`);
      setEditingUser(null);
      fetchUsers();
    }
  };

  const getRoleBadgeClass = (role: AppRole) => {
    switch (role) {
      case 'admin': return 'role-admin';
      case 'developer': return 'role-developer';
      default: return 'role-user';
    }
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAdmin()) {
    return (
      <div className="p-6 text-center">
        <Shield className="w-12 h-12 text-role-admin mx-auto mb-4" />
        <h2 className="text-xl font-bold text-workspace-text mb-2">Access Denied</h2>
        <p className="text-workspace-text-muted">
          You need admin privileges to access this panel.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-workspace-text flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            User Management
          </h1>
          <p className="text-workspace-text-muted">
            Manage user roles and permissions
          </p>
        </div>
        
        <button onClick={fetchUsers} className="btn-workspace-secondary">
          <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-workspace-text-muted" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users by email..."
          className="input-workspace pl-10"
        />
      </div>

      {/* Users Table */}
      <div className="card-workspace overflow-hidden p-0">
        <table className="w-full">
          <thead>
            <tr className="border-b border-workspace-border bg-workspace-border/30">
              <th className="text-left px-4 py-3 text-sm font-semibold text-workspace-text">Email</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-workspace-text">Role</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-workspace-text">Joined</th>
              <th className="text-right px-4 py-3 text-sm font-semibold text-workspace-text">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-workspace-border/50 hover:bg-workspace-border/20">
                <td className="px-4 py-3">
                  <span className="text-sm text-workspace-text">{user.email}</span>
                </td>
                <td className="px-4 py-3">
                  {editingUser === user.id ? (
                    <div className="relative">
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value as AppRole)}
                        onBlur={() => setEditingUser(null)}
                        className="input-workspace py-1 pr-8 text-sm"
                        autoFocus
                      >
                        <option value="user">User</option>
                        <option value="developer">Developer</option>
                        <option value="admin">Admin</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-workspace-text-muted pointer-events-none" />
                    </div>
                  ) : (
                    <span className={cn("role-badge", getRoleBadgeClass(user.role))}>
                      {user.role}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-workspace-text-muted">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => setEditingUser(user.id)}
                    className="text-sm text-primary hover:underline"
                  >
                    Change Role
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-workspace-text-muted">
            No users found
          </div>
        )}
      </div>

      {/* Role Legend */}
      <div className="card-workspace">
        <h3 className="font-semibold text-workspace-text mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Role Permissions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-role-admin/10 border border-role-admin/20">
            <h4 className="font-medium text-role-admin mb-2">Admin</h4>
            <ul className="text-sm text-workspace-text-muted space-y-1">
              <li>• Full system access</li>
              <li>• Manage all users</li>
              <li>• Delete projects</li>
              <li>• View all data</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-role-developer/10 border border-role-developer/20">
            <h4 className="font-medium text-role-developer mb-2">Developer</h4>
            <ul className="text-sm text-workspace-text-muted space-y-1">
              <li>• Create/edit projects</li>
              <li>• Full code access</li>
              <li>• Deploy changes</li>
              <li>• Cannot manage users</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-role-user/10 border border-role-user/20">
            <h4 className="font-medium text-role-user mb-2">User</h4>
            <ul className="text-sm text-workspace-text-muted space-y-1">
              <li>• View-only access</li>
              <li>• Cannot edit code</li>
              <li>• Cannot create projects</li>
              <li>• Read documentation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
