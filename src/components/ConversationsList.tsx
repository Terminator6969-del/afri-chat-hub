import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { conversations, currentUser } from '@/data/dummyData';
import { formatDistanceToNow } from 'date-fns';

interface ConversationsListProps {
  selectedConversation: string | null;
  onSelectConversation: (conversationId: string) => void;
}

const ConversationsList: React.FC<ConversationsListProps> = ({
  selectedConversation,
  onSelectConversation
}) => {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-ZA', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    } else {
      return date.toLocaleDateString('en-ZA', { 
        day: '2-digit', 
        month: '2-digit' 
      });
    }
  };

  return (
    <div className="w-80 bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-semibold">Chats</h2>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => {
          const otherUser = conversation.isGroup 
            ? null 
            : conversation.participants.find(p => p.id !== currentUser.id);
          
          const displayName = conversation.isGroup 
            ? conversation.groupName 
            : otherUser?.name;
          
          const displayAvatar = conversation.isGroup 
            ? conversation.groupAvatar 
            : otherUser?.avatar;

          const isCurrentUserSender = conversation.lastMessage.senderId === currentUser.id;
          const messagePreview = conversation.lastMessage.text.length > 40 
            ? conversation.lastMessage.text.substring(0, 40) + '...' 
            : conversation.lastMessage.text;

          return (
            <div
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className={`p-4 border-b border-border cursor-pointer transition-colors hover:bg-muted/50 ${
                selectedConversation === conversation.id ? 'bg-muted' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={displayAvatar} alt={displayName} />
                    <AvatarFallback>
                      {displayName?.split(' ').map(n => n[0]).join('') || '??'}
                    </AvatarFallback>
                  </Avatar>
                  {!conversation.isGroup && otherUser?.status === 'online' && (
                    <div className="w-3 h-3 bg-status-online rounded-full border-2 border-card absolute -bottom-1 -right-1"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium truncate">{displayName}</h3>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(conversation.lastMessage.timestamp)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-muted-foreground truncate">
                      {isCurrentUserSender && 'You: '}{messagePreview}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <Badge variant="default" className="ml-2 bg-primary text-primary-foreground">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConversationsList;