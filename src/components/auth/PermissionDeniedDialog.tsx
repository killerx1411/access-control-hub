import React from 'react';
import { ShieldX, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface PermissionDeniedDialogProps {
  isOpen: boolean;
  onClose: () => void;
  requiredRole?: string;
  action?: string;
}

export const PermissionDeniedDialog: React.FC<PermissionDeniedDialogProps> = ({
  isOpen,
  onClose,
  requiredRole = 'developer or admin',
  action = 'perform this action',
}) => {
  const { role } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in">
      <div className="card-workspace w-full max-w-md mx-4 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-role-admin/20">
              <ShieldX className="w-6 h-6 text-role-admin" />
            </div>
            <h2 className="text-xl font-bold text-workspace-text">Permission Denied</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-workspace-border transition-colors"
          >
            <X className="w-5 h-5 text-workspace-text-muted" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-workspace-text">
            You don't have permission to <span className="font-medium">{action}</span>.
          </p>
          
          <div className="p-4 rounded-lg bg-workspace-border/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-workspace-text-muted">Your current role:</span>
              <span className={`role-badge role-${role || 'user'}`}>
                {role || 'user'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-workspace-text-muted">Required role:</span>
              <span className="text-sm font-medium text-primary">{requiredRole}</span>
            </div>
          </div>

          <p className="text-sm text-workspace-text-muted">
            Contact your workspace administrator to request elevated permissions.
          </p>
        </div>

        <div className="flex justify-end mt-6">
          <button onClick={onClose} className="btn-workspace">
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
