import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MessageCircle, Phone } from 'lucide-react';
import { users } from '@/data/dummyData';

interface ContactsListProps {
  onStartChat: (userId: string) => void;
}

const ContactsList: React.FC<ContactsListProps> = ({ onStartChat }) => {
  return (
    <div className="flex-1 bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-semibold">Contacts</h2>
        <p className="text-sm text-muted-foreground">{users.length} contacts</p>
      </div>

      {/* Contacts List */}
      <div className="overflow-y-auto">
        {users.map((user) => (
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
                  onClick={() => onStartChat(user.id)}
                  title="Start chat"
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  title="Call"
                >
                  <Phone className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactsList;