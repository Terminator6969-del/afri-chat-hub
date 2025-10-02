import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile, Paperclip, MoreVertical, Phone, Video, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { conversations, currentUser } from '@/data/dummyData';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { MessageSkeleton } from '@/components/LoadingStates';

interface ChatWindowProps {
  conversationId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversationId }) => {
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [swipedMessageId, setSwipedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { triggerHaptic } = useHapticFeedback();
  
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
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Welcome to MzansiChat</h3>
          <p className="text-muted-foreground">Select a conversation to start chatting</p>
        </div>
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
      
      const message = {
        id: `msg-${Date.now()}`,
        text: newMessage,
        senderId: currentUser.id,
        timestamp: new Date(),
        type: 'text' as const
      };
      
      const updatedMessages = [...messages, message];
      setMessages(updatedMessages);
      setNewMessage('');
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    triggerHaptic('impactMedium');
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    setSwipedMessageId(null);
  };

  const handleMarkAsRead = (messageId: string) => {
    triggerHaptic('selection');
    setSwipedMessageId(null);
  };

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString('en-ZA', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-chat-bg">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
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
          <Button variant="ghost" size="icon">
            <Phone className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <MessageSkeleton />
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