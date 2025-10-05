import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile, Paperclip, MoreVertical, Phone, Video, Trash2, MessageSquare, ArrowLeft, Info } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { conversations, currentUser } from '@/data/dummyData';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';
import { useSwipeBack } from '@/hooks/useSwipeBack';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { MessageSkeleton } from '@/components/LoadingStates';
import { toast } from '@/hooks/use-toast';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { EmptyState } from '@/components/EmptyState';
import { formatMessageTime } from '@/lib/formatTime';

interface ChatWindowProps {
  conversationId: string;
  onBack?: () => void;
  onShowInfo?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversationId, onBack, onShowInfo }) => {
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [swipedMessageId, setSwipedMessageId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { triggerHaptic } = useHapticFeedback();
  const scrollRef = useScrollPosition(`chat-${conversationId}`);
  
  const { swipeProgress, touchHandlers } = useSwipeBack({
    onSwipeBack: () => onBack?.(),
    threshold: 100,
  });
  
  const conversation = conversations.find(c => c.id === conversationId);
  
  useEffect(() => {
    if (conversation) {
      setIsLoading(true);
      setTimeout(() => {
        setMessages(conversation.messages);
        setIsLoading(false);
      }, 800);
    }
  }, [conversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-chat-bg">
        <EmptyState
          icon={MessageSquare}
          title="Welcome to MzansiChat"
          description="Select a conversation to start chatting with your contacts"
        />
      </div>
    );
  }

  const otherUser = conversation.isGroup 
    ? null 
    : conversation.participants.find(p => p.id !== currentUser.id);
  
  const displayName = conversation.isGroup 
    ? conversation.groupName 
    : otherUser?.name;
  
  const displayAvatar = conversation.isGroup 
    ? conversation.groupAvatar 
    : otherUser?.avatar;

  const handleSendMessage = () => {
    if (newMessage.trim() && conversation) {
      triggerHaptic('impactLight');
      
      // Optimistic UI update - show message immediately
      const message = {
        id: `msg-${Date.now()}`,
        text: newMessage,
        senderId: currentUser.id,
        timestamp: new Date(),
        type: 'text' as const,
        status: 'sending' as const
      };
      
      const updatedMessages = [...messages, message];
      setMessages(updatedMessages);
      setNewMessage('');
      setIsSending(true);
      
      // Simulate network delay, then confirm sent
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === message.id 
              ? { ...msg, status: 'sent' as const }
              : msg
          )
        );
        setIsSending(false);
        
        toast({
          title: 'Message sent',
          description: 'Your message has been delivered',
        });
      }, 500);
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessageToDelete(messageId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteMessage = () => {
    if (messageToDelete) {
      triggerHaptic('impactMedium');
      setMessages(prev => prev.filter(msg => msg.id !== messageToDelete));
      setSwipedMessageId(null);
      setMessageToDelete(null);
      setDeleteDialogOpen(false);
      
      toast({
        title: 'Message deleted',
        description: 'The message has been removed',
        variant: 'destructive',
      });
    }
  };

  const handleMarkAsRead = (messageId: string) => {
    triggerHaptic('selection');
    setSwipedMessageId(null);
  };


  return (
    <div 
      className="flex-1 flex flex-col bg-chat-bg animate-slide-in-right relative"
      {...touchHandlers}
      style={{
        transform: `translateX(${swipeProgress * 100}%)`,
        transition: swipeProgress === 0 ? 'transform 0.3s ease-out' : 'none',
      }}
    >
      {/* Swipe Back Indicator */}
      {swipeProgress > 0 && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-50 opacity-${Math.min(swipeProgress * 2, 1)}">
          <ArrowLeft className="w-8 h-8 text-primary" />
        </div>
      )}
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          {onBack && (
            <button 
              onClick={onBack}
              className="w-9 h-9 hover:bg-muted rounded-full flex items-center justify-center transition-colors md:hidden"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <Avatar className="w-10 h-10">
            <AvatarImage src={displayAvatar} alt={displayName} />
            <AvatarFallback>
              {displayName?.split(' ').map(n => n[0]).join('') || '??'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{displayName}</h3>
            <p className="text-sm text-muted-foreground">
              {conversation.isGroup 
                ? `${conversation.participants.length} members`
                : otherUser?.status === 'online' ? 'Online' : `Last seen ${otherUser?.lastSeen}`
              }
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" title="Voice call">
            <Phone className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Video call">
            <Video className="w-4 h-4" />
          </Button>
          {onShowInfo && (
            <Button variant="ghost" size="icon" onClick={onShowInfo} title="Chat info">
              <Info className="w-4 h-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" title="More options">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <MessageSkeleton />
        ) : messages.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No messages yet"
            description="Start the conversation by sending a message below"
          />
        ) : (
          messages.map((message) => {
            const isCurrentUser = message.senderId === currentUser.id;
            const sender = conversation.participants.find(p => p.id === message.senderId) || currentUser;
            
            const MessageItem = ({ message }: { message: any }) => {
              const { swipeOffset, touchHandlers } = useSwipeGesture({
                onSwipeLeft: () => !isCurrentUser && handleDeleteMessage(message.id),
                onSwipeRight: () => !isCurrentUser && handleMarkAsRead(message.id)
              });

              return (
                <div
                  className={`relative overflow-hidden ${swipedMessageId === message.id ? 'bg-muted/20' : ''}`}
                  style={{ transform: `translateX(${swipeOffset}px)` }}
                  {...touchHandlers}
                >
                  {/* Swipe Action Indicators */}
                  {swipeOffset < -50 && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 text-destructive">
                      <Trash2 className="w-4 h-4" />
                      <span className="text-xs">Delete</span>
                    </div>
                  )}
                  {swipeOffset > 50 && (
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-2 text-primary">
                      <span className="text-xs">Mark Read</span>
                    </div>
                  )}
                  
                  <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-2 max-w-[70%] ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                      {!isCurrentUser && (
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={sender.avatar} alt={sender.name} />
                          <AvatarFallback className="text-xs">
                            {sender.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div
                        className={`rounded-2xl p-3 transition-all ${
                          isCurrentUser
                            ? 'bg-chat-sent text-white rounded-br-md'
                            : 'bg-chat-received text-foreground rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          isCurrentUser ? 'text-green-100' : 'text-muted-foreground'
                        }`}>
                          {formatMessageTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            };
            
            return (
              <MessageItem key={message.id} message={message} />
          );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete message?"
        description="This message will be permanently deleted. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteMessage}
        variant="destructive"
      />

      {/* Message Input */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Paperclip className="w-4 h-4" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="pr-10"
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-1 top-1/2 -translate-y-1/2"
            >
              <Smile className="w-4 h-4" />
            </Button>
          </div>
          
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;