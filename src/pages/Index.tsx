import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import ConversationsList from '@/components/ConversationsList';
import ChatWindow from '@/components/ChatWindow';
import ContactsList from '@/components/ContactsList';
import UserProfile from '@/components/UserProfile';

const Index = () => {
  const [activeTab, setActiveTab] = useState('chats');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  const handleStartChat = (userId: string) => {
    // In a real app, this would create or find an existing conversation with the user
    console.log('Starting chat with user:', userId);
    setActiveTab('chats');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'chats':
        return (
          <>
            <ConversationsList
              selectedConversation={selectedConversation}
              onSelectConversation={setSelectedConversation}
            />
            {selectedConversation ? (
              <ChatWindow conversationId={selectedConversation} />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-chat-bg">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">Welcome to MzansiChat</h3>
                  <p className="text-muted-foreground">Select a conversation to start chatting</p>
                </div>
              </div>
            )}
          </>
        );
      case 'contacts':
        return <ContactsList onStartChat={handleStartChat} />;
      case 'profile':
        return <UserProfile />;
      default:
        return (
          <div className="flex-1 flex items-center justify-center bg-card">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
              <p className="text-muted-foreground">This feature is under development</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      {renderContent()}
    </div>
  );
};

export default Index;
