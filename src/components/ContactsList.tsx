import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MessageCircle, Phone, Users } from 'lucide-react';
import { users } from '@/data/dummyData';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { ContactSkeleton, PullRefreshIndicator } from '@/components/LoadingStates';
import { toast } from '@/hooks/use-toast';
import { EmptyState } from '@/components/EmptyState';

interface ContactsListProps {
  onStartChat: (userId: string) => void;
}

const ContactsList: React.FC<ContactsListProps> = ({ onStartChat }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState(users);
  const { triggerHaptic } = useHapticFeedback();

  const handleRefresh = async () => {
    triggerHaptic('medium');
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    setFilteredUsers([...users]);
    setIsLoading(false);
    triggerHaptic('notificationSuccess');
    
    toast({
      title: 'Contacts refreshed',
      description: 'Your contact list is up to date',
    });
  };

  const { containerRef, isRefreshing, pullDistance } = usePullToRefresh(handleRefresh);

  const handleStartChat = (userId: string) => {
    triggerHaptic('selection');
    onStartChat(userId);
    
    toast({
      title: 'Chat started',
      description: 'Opening conversation...',
    });
  };

  const handleCallUser = () => {
    triggerHaptic('impactMedium');
    
    toast({
      title: 'Calling...',
      description: 'Call feature coming soon',
    });
  };

  return (
    <div className="flex-1 bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-semibold">Contacts</h2>
        <p className="text-sm text-muted-foreground">{users.length} contacts</p>
      </div>

      {/* Contacts List */}
      <div 
        ref={containerRef}
        className="overflow-y-auto relative"
        style={{ transform: `translateY(${pullDistance > 0 ? pullDistance * 0.5 : 0}px)` }}
      >
        <PullRefreshIndicator pullDistance={pullDistance} />
        
        {isLoading || isRefreshing ? (
          <ContactSkeleton />
        ) : filteredUsers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No contacts"
            description="Add contacts to start chatting with them"
          />
        ) : (
          filteredUsers.map((user) => (
          <div
            key={user.id}
            className="p-4 border-b border-border hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {user.status === 'online' && (
                  <div className="w-3 h-3 bg-status-online rounded-full border-2 border-card absolute -bottom-1 -right-1"></div>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium">{user.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {user.status === 'online' ? 'Online' : `Last seen ${user.lastSeen}`}
                </p>
                {user.phone && (
                  <p className="text-xs text-muted-foreground">{user.phone}</p>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleStartChat(user.id)}
                  title="Start chat"
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleCallUser}
                  title="Call"
                >
                  <Phone className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))
        )}
      </div>
    </div>
  );
};

export default ContactsList;