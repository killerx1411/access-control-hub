import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Save, Play, Copy, Lock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  onSave?: () => void;
  fileName?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ 
  code, 
  onChange, 
  onSave,
  fileName = 'index.tsx'
}) => {
  const { canEdit, role } = useAuth();
  const [localCode, setLocalCode] = useState(code);
  const isEditable = canEdit();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isEditable) {
      toast.error('Permission Denied', {
        description: 'You need developer or admin access to edit code.',
      });
      return;
    }
    setLocalCode(e.target.value);
    onChange(e.target.value);
  };

  const handleSave = () => {
    if (!isEditable) {
      toast.error('Permission Denied', {
        description: 'You need developer or admin access to save changes.',
      });
      return;
    }
    onSave?.();
    toast.success('Code saved successfully!');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(localCode);
    toast.success('Code copied to clipboard!');
  };

  const lines = localCode.split('\n');

  return (
    <div className="workspace-panel h-full flex flex-col overflow-hidden">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-workspace-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-role-admin/60" />
            <span className="w-3 h-3 rounded-full bg-role-user/60" />
            <span className="w-3 h-3 rounded-full bg-workspace-success/60" />
          </div>
          <span className="text-sm text-workspace-text-muted font-mono">{fileName}</span>
          {!isEditable && (
            <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-role-admin/10 text-role-admin text-xs">
              <Lock className="w-3 h-3" />
              Read Only
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="btn-workspace-secondary p-2"
            title="Copy code"
          >
            <Copy className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleSave}
            disabled={!isEditable}
            className={cn(
              "btn-workspace p-2",
              !isEditable && "opacity-50 cursor-not-allowed"
            )}
            title={isEditable ? "Save" : "No permission to save"}
          >
            <Save className="w-4 h-4" />
          </button>
          
          <button
            disabled={!isEditable}
            className={cn(
              "btn-workspace px-3 py-2",
              !isEditable && "opacity-50 cursor-not-allowed"
            )}
            title={isEditable ? "Run code" : "No permission to run"}
          >
            <Play className="w-4 h-4" />
            <span className="text-sm">Run</span>
          </button>
        </div>
      </div>

      {/* Read-only Warning */}
      {!isEditable && (
        <div className="px-4 py-2 bg-role-admin/10 border-b border-role-admin/20 flex items-center gap-2 animate-fade-in">
          <AlertTriangle className="w-4 h-4 text-role-admin" />
          <span className="text-sm text-role-admin">
            Viewing as <span className="font-semibold">{role}</span> — editing is disabled. Contact an admin to upgrade your role.
          </span>
        </div>
      )}

      {/* Editor Content */}
      <div className="flex-1 overflow-auto">
        <div className="editor-container min-h-full">
          <div className="flex">
            {/* Line Numbers */}
            <div className="select-none py-4 px-3 text-right text-editor-gutter border-r border-editor-line">
              {lines.map((_, i) => (
                <div key={i} className="leading-6 text-xs">
                  {i + 1}
                </div>
              ))}
            </div>
            
            {/* Code Area */}
            <div className="flex-1 relative">
              <textarea
                value={localCode}
                onChange={handleChange}
                readOnly={!isEditable}
                className={cn(
                  "w-full h-full p-4 bg-transparent resize-none outline-none",
                  "font-mono text-sm leading-6 text-workspace-text",
                  !isEditable && "cursor-not-allowed opacity-75"
                )}
                spellCheck={false}
                style={{ minHeight: `${lines.length * 24 + 32}px` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
