import React, { useState } from 'react';
import { ArrowLeft, Settings, UserPlus, UserMinus, Crown, Shield, Mic, MicOff, Volume2, VolumeX, MoreHorizontal, Edit3, Camera, Bell, BellOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';

interface GroupManagementProps {
  group: {
    id: string;
    name: string;
    avatar: string;
    members: Array<{
      id: string;
      name: string;
      avatar: string;
      role: 'admin' | 'member';
      status: 'online' | 'offline';
    }>;
  };
  onBack: () => void;
}

const GroupManagement: React.FC<GroupManagementProps> = ({ group, onBack }) => {
  const [activeTab, setActiveTab] = useState<'members' | 'settings'>('members');
  const [showAddMember, setShowAddMember] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);
  const [groupSettings, setGroupSettings] = useState({
    notifications: true,
    onlyAdminsCanSend: false,
    joinApproval: true
  });
  const { triggerHaptic } = useHapticFeedback();

  const availableContacts = [
    { id: '5', name: 'Sipho Dlamini', avatar: '👨🏽' },
    { id: '6', name: 'Zanele Khumalo', avatar: '👩🏽' },
    { id: '7', name: 'Mandla Ngcobo', avatar: '👨🏿' },
    { id: '8', name: 'Thandi Molefe', avatar: '👩🏾' }
  ];

  const [members, setMembers] = useState(group.members);

  const promoteMember = (memberId: string) => {
    triggerHaptic('selection');
    const member = members.find(m => m.id === memberId);
    setMembers(prev => prev.map(member => 
      member.id === memberId 
        ? { ...member, role: member.role === 'admin' ? 'member' : 'admin' }
        : member
    ));
    
    toast({
      title: member?.role === 'admin' ? 'Member demoted' : 'Member promoted',
      description: member?.role === 'admin' 
        ? `${member.name} is now a member` 
        : `${member?.name} is now an admin`,
    });
  };

  const removeMember = (memberId: string) => {
    setMemberToRemove(memberId);
    setDeleteDialogOpen(true);
  };

  const confirmRemoveMember = () => {
    if (memberToRemove) {
      triggerHaptic('impactMedium');
      const member = members.find(m => m.id === memberToRemove);
      setMembers(prev => prev.filter(member => member.id !== memberToRemove));
      setMemberToRemove(null);
      setDeleteDialogOpen(false);
      
      toast({
        title: 'Member removed',
        description: `${member?.name} has been removed from the group`,
        variant: 'destructive',
      });
    }
  };

  const addMember = (contactId: string) => {
    triggerHaptic('notificationSuccess');
    const contact = availableContacts.find(c => c.id === contactId);
    if (contact) {
      const newMember = {
        ...contact,
        role: 'member' as const,
        status: 'offline' as const
      };
      setMembers(prev => [...prev, newMember]);
      setShowAddMember(false);
      
      toast({
        title: 'Member added',
        description: `${contact.name} has been added to the group`,
      });
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <div className="bg-background/80 backdrop-blur-xl border-b border-border/50 p-4">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="w-9 h-9 hover:bg-muted rounded-full flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold">Group Info</h1>
        </div>

        {/* Group Header */}
        <div className="text-center mb-4">
          <div className="relative inline-block">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center text-2xl mb-3 shadow-lg">
              {group.avatar}
            </div>
            <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <h2 className="text-lg font-semibold">{group.name}</h2>
            <button className="p-1 hover:bg-muted rounded">
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground">{members.length} members</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-muted rounded-lg p-1">
          <button
            onClick={() => setActiveTab('members')}
            className={cn(
              "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all",
              activeTab === 'members' 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Members
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={cn(
              "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all",
              activeTab === 'settings'
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Settings
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'members' ? (
          <div className="p-4">
            {/* Add Member Button */}
            <button
              onClick={() => setShowAddMember(true)}
              className="w-full flex items-center gap-3 p-3 bg-muted/50 hover:bg-muted rounded-xl mb-4 transition-colors"
            >
              <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                <UserPlus className="w-5 h-5" />
              </div>
              <span className="font-medium">Add member</span>
            </button>

            {/* Members List */}
            <div className="space-y-2">
              {members.map((member, index) => (
                <div 
                  key={member.id}
                  className="flex items-center gap-3 p-3 bg-background rounded-xl shadow-sm animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-muted to-muted/70 rounded-xl flex items-center justify-center text-lg">
                      {member.avatar}
                    </div>
                    {member.status === 'online' && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{member.name}</h3>
                      {member.role === 'admin' && (
                        <Crown className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground capitalize">{member.role}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => promoteMember(member.id)}
                      className="w-8 h-8 hover:bg-muted rounded-full flex items-center justify-center transition-colors"
                    >
                      {member.role === 'admin' ? (
                        <Shield className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Crown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                    <button
                      onClick={() => removeMember(member.id)}
                      className="w-8 h-8 hover:bg-destructive/10 rounded-full flex items-center justify-center transition-colors"
                    >
                      <UserMinus className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {/* Notification Settings */}
            <div className="bg-background rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold mb-3">Notifications</h3>
              <label className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  <span>Group notifications</span>
                </div>
                <input
                  type="checkbox"
                  checked={groupSettings.notifications}
                  onChange={(e) => setGroupSettings(prev => ({ ...prev, notifications: e.target.checked }))}
                  className="w-5 h-5 text-primary rounded"
                />
              </label>
            </div>

            {/* Privacy Settings */}
            <div className="bg-background rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold mb-3">Privacy & Security</h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mic className="w-5 h-5 text-muted-foreground" />
                    <span>Only admins can send messages</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={groupSettings.onlyAdminsCanSend}
                    onChange={(e) => setGroupSettings(prev => ({ ...prev, onlyAdminsCanSend: e.target.checked }))}
                    className="w-5 h-5 text-primary rounded"
                  />
                </label>
                
                <label className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-muted-foreground" />
                    <span>Approve new members</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={groupSettings.joinApproval}
                    onChange={(e) => setGroupSettings(prev => ({ ...prev, joinApproval: e.target.checked }))}
                    className="w-5 h-5 text-primary rounded"
                  />
                </label>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4">
              <h3 className="font-semibold text-destructive mb-3">Danger Zone</h3>
              <div className="space-y-2">
                <button className="w-full text-left p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                  Leave Group
                </button>
                <button className="w-full text-left p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                  Delete Group
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Remove Member Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Remove member?"
        description="This member will be removed from the group. They can be added back later."
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={confirmRemoveMember}
        variant="destructive"
      />

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-end z-50">
          <div className="w-full bg-background rounded-t-3xl p-6 animate-slide-in-right">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add Members</h3>
              <button
                onClick={() => setShowAddMember(false)}
                className="w-8 h-8 hover:bg-muted rounded-full flex items-center justify-center"
              >
                ×
              </button>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {availableContacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => addMember(contact.id)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-xl transition-colors"
                >
                  <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
                    {contact.avatar}
                  </div>
                  <span className="font-medium">{contact.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupManagement;