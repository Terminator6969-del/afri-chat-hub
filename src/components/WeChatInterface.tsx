import React, { useState, useRef, useEffect, startTransition } from 'react';
import { Send, Plus, Search, ArrowLeft, MoreHorizontal, Camera, Users, Compass, User, MapPin, ChevronRight, CreditCard, Zap, Smile, Paperclip, Video, Phone, QrCode, Settings, Heart, Image, Gift, Wallet, Mic, FileText, UserPlus, ScanLine, X, CircleDot, Gamepad2, MessageSquare, Edit3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { MomentsSkeleton, PullRefreshIndicator } from '@/components/LoadingStates';
import MiniPrograms from '@/components/MiniPrograms';
import RedPackets from '@/components/RedPackets';
import GroupManagement from '@/components/GroupManagement';
import StatusUpdates from '@/components/StatusUpdates';
import Moments from '@/components/Moments';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from '@/hooks/use-toast';

const WeChatInterface = () => {
  const [currentView, setCurrentView] = useState('chats');
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showGroupManagement, setShowGroupManagement] = useState(false);
  const [userStatus, setUserStatus] = useLocalStorage('userStatus', 'Available');
  const messagesEndRef = useRef(null);
  const { triggerHaptic } = useHapticFeedback();

  const contacts = [
    {
      id: 1,
      name: 'Sophia Norman',
      avatar: '🇿🇦',
      lastMessage: 'Hi dear! How are you? Long time no see, do you have ti...',
      time: '4:15pm',
      unread: 0,
      isOnline: true,
      isOfficial: false,
      messages: [
        { id: 1, sender: 'them', text: 'Hi dear! How are you? Long time no see, do you have time for coffee?', time: '16:15' },
        { id: 2, sender: 'me', text: 'Hey Sophia! Yes, would love to catch up', time: '16:20' },
        { id: 3, sender: 'them', text: 'Perfect! How about tomorrow at 2pm?', time: '16:22' },
        { id: 4, sender: 'me', text: 'Sounds great! See you at our usual spot? ☕', time: '16:25' }
      ]
    },
    {
      id: 2,
      name: 'Lunch gang',
      avatar: '🍽️',
      lastMessage: 'Alice Kim: Wait for you guys! 😊',
      time: '3:47pm',
      unread: 2,
      isGroup: true,
      messages: [
        { id: 1, sender: 'Alice Kim', text: 'What time are we meeting?', time: '15:30' },
        { id: 2, sender: 'Mike', text: 'How about 1pm at Sandton City?', time: '15:40' },
        { id: 3, sender: 'Alice Kim', text: 'Wait for you guys! 😊', time: '15:47' },
        { id: 4, sender: 'Sarah', text: 'On my way! Traffic is crazy today 🚗', time: '15:50' }
      ]
    },
    {
      id: 3,
      name: 'Roxie Crawford',
      avatar: '👩🏽',
      lastMessage: 'Please call Jim tomorrow',
      time: 'Sun',
      unread: 0,
      isOnline: false,
      messages: [
        { id: 1, sender: 'them', text: 'Please call Jim tomorrow', time: 'Sunday' },
        { id: 2, sender: 'them', text: 'It\'s quite important', time: 'Sunday' }
      ]
    },
    {
      id: 4,
      name: 'Lloyd Berry',
      avatar: '👨🏿',
      lastMessage: '📄 new_doc',
      time: 'Sat',
      unread: 0,
      isOnline: false,
      messages: [
        { id: 1, sender: 'them', text: 'Check out this document I shared', time: 'Saturday' },
        { id: 2, sender: 'them', text: '📄 Financial_Report_Q3.pdf', time: 'Saturday' }
      ]
    },
    {
      id: 5,
      name: 'Braai Squad',
      avatar: '🔥',
      lastMessage: 'Who\'s bringing the boerewors?',
      time: 'Sat',
      unread: 1,
      isGroup: true,
      messages: [
        { id: 1, sender: 'Thabo', text: 'Who\'s bringing the boerewors?', time: 'Saturday' },
        { id: 2, sender: 'Nomsa', text: 'I can get some from the butcher', time: 'Saturday' }
      ]
    }
  ];

  const officialAccounts = [
    {
      id: 1,
      name: 'Woolworths',
      subtitle: 'Fresh food, fashion & home • South Africa',
      avatar: '🛒',
      time: '2:29pm',
      isOnline: true
    },
    {
      id: 2,
      name: 'Nando\'s',
      subtitle: 'PERi-PERi chicken • Order online for delivery',
      avatar: '🐔',
      time: '1:22pm',
      isOnline: true
    },
    {
      id: 3,
      name: 'Pick n Pay',
      subtitle: 'Smart shopping • Online groceries',
      avatar: '🛍️',
      time: '5:57pm',
      isOnline: false
    },
    {
      id: 4,
      name: 'Mugg & Bean',
      subtitle: 'Coffee culture • Premium coffee experience',
      avatar: '☕',
      time: '8hr',
      isOnline: false
    },
    {
      id: 5,
      name: 'Uber Eats SA',
      subtitle: 'Food delivery • Order from your favourite restaurants',
      avatar: '🍔',
      time: '5hr',
      isOnline: false
    },
    {
      id: 6,
      name: 'Checkers',
      subtitle: 'Lower prices you can trust • Online shopping',
      avatar: '🏪',
      time: 'Sat',
      isOnline: false
    },
    {
      id: 7,
      name: 'Kauai',
      subtitle: 'Fresh smoothies, wraps & healthy food',
      avatar: '🥗',
      time: '3hr',
      isOnline: false
    }
  ];

  const [chats, setChats] = useLocalStorage('chats', contacts);
  const [filteredChats, setFilteredChats] = useState(contacts);

  // Sync filtered chats when chats change
  useEffect(() => {
    setFilteredChats(chats);
  }, [chats]);

  const emojis = ['😊', '😂', '❤️', '👍', '🙏', '😍', '🤔', '😎', '🎉', '🔥', '💯', '✨', '🌟', '💪', '👌', '🤝'];


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat?.messages]);

  const sendMessage = () => {
    if (!message.trim() || !selectedChat) return;

    const newMessage = {
      id: Date.now(),
      sender: 'me',
      text: message,
      time: new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedChats = chats.map(chat =>
      chat.id === selectedChat.id
        ? {
            ...chat,
            messages: [...chat.messages, newMessage],
            lastMessage: message,
            time: newMessage.time
          }
        : chat
    );

    setChats(updatedChats);
    setSelectedChat({
      ...selectedChat,
      messages: [...selectedChat.messages, newMessage]
    });
    setMessage('');
    
    toast({
      title: 'Message sent',
      description: 'Your message has been delivered',
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const addEmoji = (emoji) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Start recording
      setTimeout(() => {
        setIsRecording(false);
        // Simulate voice message
        sendVoiceMessage();
      }, 2000);
    }
  };

  const sendVoiceMessage = () => {
    if (!selectedChat) return;

    const newMessage = {
      id: Date.now(),
      sender: 'me',
      text: '🎤 Voice message (2s)',
      time: new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' }),
      type: 'voice'
    };

    const updatedChats = chats.map(chat =>
      chat.id === selectedChat.id
        ? {
            ...chat,
            messages: [...chat.messages, newMessage],
            lastMessage: '🎤 Voice message',
            time: newMessage.time
          }
        : chat
    );

    setChats(updatedChats);
    setSelectedChat({
      ...selectedChat,
      messages: [...selectedChat.messages, newMessage]
    });
    
    toast({
      title: 'Voice message sent',
      description: 'Your voice message has been delivered',
    });
  };

  const handleImageShare = () => {
    if (!selectedChat) return;

    const newMessage = {
      id: Date.now(),
      sender: 'me',
      text: '📷 Photo',
      time: new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' }),
      type: 'image'
    };

    const updatedChats = chats.map(chat =>
      chat.id === selectedChat.id
        ? {
            ...chat,
            messages: [...chat.messages, newMessage],
            lastMessage: '📷 Photo',
            time: newMessage.time
          }
        : chat
    );

    setChats(updatedChats);
    setSelectedChat({
      ...selectedChat,
      messages: [...selectedChat.messages, newMessage]
    });
    
    toast({
      title: 'Photo shared',
      description: 'Your photo has been sent',
    });
  };


  const ChatsList = () => (
    <div className="h-full flex flex-col bg-gradient-to-br from-background to-muted/20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-primary/20 to-primary/10 opacity-60 animate-pulse"></div>
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-transparent via-muted/10 to-muted/20 opacity-40"></div>
      
      {/* Header with Glass Effect */}
      <div className="relative z-10 bg-background/80 backdrop-blur-xl border-b border-border/50 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-foreground animate-fade-in">MzansiChat</h1>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 bg-muted/50 hover:bg-muted transition-all duration-200 rounded-full flex items-center justify-center hover:scale-110 active:scale-95">
              <Users className="w-4 h-4 text-muted-foreground" />
            </button>
            <div className="relative">
              <button 
                onClick={() => setShowPlusMenu(!showPlusMenu)}
                className="w-9 h-9 bg-muted/50 hover:bg-muted transition-all duration-200 rounded-full flex items-center justify-center hover:scale-110 active:scale-95"
              >
                <Plus className="w-4 h-4 text-muted-foreground" />
              </button>
              
              {showPlusMenu && (
                <div className="absolute top-12 right-0 bg-background/90 backdrop-blur-xl border border-border/50 rounded-xl shadow-lg p-2 z-50 min-w-[160px] animate-scale-in">
                  <button 
                    onClick={() => {
                      setShowPlusMenu(false);
                      // Handle new chat
                    }}
                    className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg transition-all"
                  >
                    <UserPlus className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">New Chat</span>
                  </button>
                  <button 
                    onClick={() => {
                      setShowPlusMenu(false);
                      // Handle add contacts
                    }}
                    className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg transition-all"
                  >
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">Add Contacts</span>
                  </button>
                  <button 
                    onClick={() => {
                      setShowPlusMenu(false);
                      setShowQRScanner(true);
                    }}
                    className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg transition-all"
                  >
                    <ScanLine className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">Scan</span>
                  </button>
                  <button 
                    onClick={() => {
                      triggerHaptic();
                      setShowPlusMenu(false);
                      startTransition(() => setCurrentView('red-packets'));
                    }}
                    className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg transition-all"
                  >
                    <Gift className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">Red Packet</span>
                  </button>
                  <button 
                    onClick={() => {
                      triggerHaptic();
                      setShowPlusMenu(false);
                      startTransition(() => setCurrentView('mini-programs'));
                    }}
                    className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg transition-all"
                  >
                    <Gamepad2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">Mini Programs</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              const filtered = chats.filter(chat => 
                chat.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                (chat.lastMessage && chat.lastMessage.toLowerCase().includes(e.target.value.toLowerCase())) ||
                chat.messages?.some(msg => msg.text.toLowerCase().includes(e.target.value.toLowerCase()))
              );
              setFilteredChats(filtered);
            }}
            className="w-full bg-muted/30 backdrop-blur-sm border-0 rounded-xl py-2.5 pl-10 pr-4 text-foreground placeholder-muted-foreground focus:outline-none focus:bg-background focus:shadow-md focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          />
        </div>
      </div>

      {/* Official Accounts Section */}
      <div className="relative z-10 bg-background/40 backdrop-blur-sm p-4 border-b border-border/30">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-muted-foreground">Official Accounts</h2>
          <span className="text-xs text-muted-foreground/70">{officialAccounts.length}</span>
        </div>
        <button 
          onClick={() => {
            triggerHaptic();
            startTransition(() => setCurrentView('official'));
          }}
          className="w-full flex items-center justify-between group hover:bg-muted/20 rounded-lg p-2 transition-all duration-200"
        >
          <div className="flex items-center gap-2">
            {officialAccounts.slice(0, 3).map((account, idx) => (
              <div key={account.id} className={cn(
                "w-8 h-8 bg-gradient-to-br rounded-lg flex items-center justify-center transform transition-all duration-200",
                idx === 0 && "from-primary to-primary/80 hover:scale-110",
                idx === 1 && "from-accent to-accent/80 hover:scale-110",
                idx === 2 && "from-destructive to-destructive/80 hover:scale-110"
              )}>
                <span className="text-white text-xs">{account.avatar}</span>
              </div>
            ))}
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all duration-200" />
        </button>
      </div>

      {/* Chat List */}
      <div className="relative z-10 flex-1 overflow-y-auto">
        {filteredChats.map((chat, index) => (
          <div
            key={chat.id}
            onClick={() => {
              triggerHaptic('selection');
              setSelectedChat(chat);
            }}
            className={cn(
              "flex items-center gap-3 p-4 hover:bg-background/60 cursor-pointer border-b border-border/30 backdrop-blur-sm transition-all duration-200 hover:shadow-sm",
              "animate-fade-in",
              selectedChat?.id === chat.id && "bg-primary/5 border-primary/20"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-muted to-muted/70 rounded-2xl flex items-center justify-center text-lg overflow-hidden transform transition-all duration-200 hover:scale-105">
                {chat.avatar === '🇿🇦' ? (
                  <div className="w-full h-full bg-gradient-to-br from-green-400 via-yellow-400 to-blue-500 rounded-2xl flex items-center justify-center">
                    <span className="text-white font-bold text-xs">SA</span>
                  </div>
                ) : (
                  <span>{chat.avatar}</span>
                )}
              </div>
              {chat.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full animate-pulse"></div>
              )}
              {chat.unread > 0 && (
                <div className="absolute -top-2 -right-2 min-w-[20px] h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center px-1.5 shadow-lg animate-bounce">
                  {chat.unread}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-foreground text-sm truncate">
                  {chat.name}
                </h3>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{chat.time}</span>
              </div>
              <p className="text-xs text-muted-foreground truncate leading-relaxed">{chat.lastMessage}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );

  const OfficialAccountsView = () => (
    <div className="h-full flex flex-col bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <div className="bg-background/80 backdrop-blur-xl border-b border-border/50 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              triggerHaptic();
              startTransition(() => setCurrentView('chats'));
            }}
            className="w-8 h-8 hover:bg-muted rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
            <h1 className="text-xl font-semibold text-foreground">Official Accounts</h1>
          </div>
          <button className="w-8 h-8 bg-muted/50 hover:bg-muted transition-all duration-200 rounded-full flex items-center justify-center hover:scale-110 active:scale-95">
            <Plus className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search official accounts..."
            className="w-full bg-muted/30 backdrop-blur-sm border-0 rounded-xl py-2.5 pl-10 pr-4 text-foreground placeholder-muted-foreground focus:outline-none focus:bg-background focus:shadow-md focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          />
        </div>
      </div>

      {/* Located near you */}
      <div className="bg-background/40 backdrop-blur-sm p-4 border-b border-border/30">
        <button className="w-full flex items-center justify-between group hover:bg-muted/20 rounded-lg p-2 transition-all duration-200">
          <h2 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Located near you
          </h2>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all duration-200" />
        </button>
      </div>

      {/* Official Accounts List */}
      <div className="flex-1 overflow-y-auto">
        {officialAccounts.map((account, index) => (
          <div
            key={account.id}
            className={cn(
              "flex items-center gap-3 p-4 hover:bg-background/60 cursor-pointer border-b border-border/30 backdrop-blur-sm transition-all duration-200 hover:shadow-sm animate-fade-in"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center text-lg overflow-hidden transform transition-all duration-200 hover:scale-105">
                <span className="text-white">{account.avatar}</span>
              </div>
              {account.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full animate-pulse"></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-foreground text-sm">
                  {account.name}
                </h3>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{account.time}</span>
              </div>
              <p className="text-xs text-muted-foreground truncate leading-relaxed">{account.subtitle}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/50 flex-shrink-0 group-hover:text-muted-foreground transition-colors" />
          </div>
        ))}
      </div>
    </div>
  );

  const ChatView = () => (
    <div className="h-full flex flex-col bg-gradient-to-br from-background to-muted/20">
      {/* Enhanced Chat Header */}
      <div className="bg-background/80 backdrop-blur-xl border-b border-border/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSelectedChat(null)}
              className="w-8 h-8 hover:bg-muted rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-muted to-muted/70 rounded-2xl flex items-center justify-center text-lg transform transition-all duration-200 hover:scale-105">
              {selectedChat.avatar}
            </div>
            <div>
              <h2 className="text-sm font-medium text-foreground">{selectedChat.name}</h2>
              <p className="text-xs text-muted-foreground">
                {selectedChat.isOnline ? (
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Online
                  </span>
                ) : 'Last seen recently'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 hover:bg-muted rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95">
              <Phone className="w-4 h-4 text-muted-foreground" />
            </button>
            <button className="w-8 h-8 hover:bg-muted rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95">
              <Video className="w-4 h-4 text-muted-foreground" />
            </button>
            <button className="w-8 h-8 hover:bg-muted rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95">
              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {selectedChat.messages.map((msg, index) => (
          <div
            key={msg.id}
            className={cn(
              "flex mb-4 animate-fade-in",
              msg.sender === 'me' ? 'justify-end' : 'justify-start'
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={cn(
              "max-w-[70%] px-4 py-3 rounded-2xl text-sm shadow-sm transition-all duration-200 hover:shadow-md",
              msg.sender === 'me'
                ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-br-md hover:from-primary/90 hover:to-primary'
                : 'bg-background text-foreground border border-border rounded-bl-md hover:bg-muted/30'
            )}>
              {msg.sender !== 'me' && selectedChat.isGroup && (
                <p className="text-xs font-medium text-accent mb-1">{msg.sender}</p>
              )}
              <p className="break-words leading-relaxed">{msg.text}</p>
              <p className={cn(
                "text-xs mt-2",
                msg.sender === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'
              )}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Message Input */}
      <div className="p-4 bg-background/80 backdrop-blur-xl border-t border-border/50">
        {showEmojiPicker && (
          <div className="mb-3 p-3 bg-background/80 backdrop-blur-sm border border-border rounded-xl shadow-lg animate-scale-in">
            <div className="grid grid-cols-8 gap-2">
              {emojis.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => addEmoji(emoji)}
                  className="w-8 h-8 text-lg hover:bg-muted rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <button 
              onClick={handleImageShare}
              className="w-8 h-8 bg-muted/50 hover:bg-muted rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <Camera className="w-4 h-4 text-muted-foreground" />
            </button>
            <button className="w-8 h-8 bg-muted/50 hover:bg-muted rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95">
              <Paperclip className="w-4 h-4 text-muted-foreground" />
            </button>
            <button 
              onClick={handleVoiceRecord}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95",
                isRecording ? "bg-red-500 animate-pulse" : "bg-muted/50 hover:bg-muted"
              )}
            >
              <Mic className={cn("w-4 h-4", isRecording ? "text-white" : "text-muted-foreground")} />
            </button>
          </div>
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full bg-muted/30 border-0 rounded-2xl py-3 px-4 pr-12 text-foreground placeholder-muted-foreground focus:outline-none focus:bg-background focus:shadow-md focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            />
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 hover:bg-muted rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <Smile className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <button
            onClick={sendMessage}
            disabled={!message.trim()}
            className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground px-6 py-3 rounded-2xl hover:from-primary/90 hover:to-primary transition-all duration-200 shadow-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 hover:shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );


  const DiscoverView = () => (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Discover</h1>
          <div className="flex items-center gap-3">
            <Search className="w-6 h-6 text-gray-600" />
            <Plus className="w-6 h-6 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 bg-gray-50">
        {/* Moments */}
        <div className="bg-white border-b border-gray-100">
          <button 
            onClick={() => {
              triggerHaptic();
              startTransition(() => setCurrentView('moments'));
            }}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 flex items-center justify-center relative">
                <div className="w-4 h-4 rounded-full border-2 border-white"></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
              <span className="text-gray-900 font-medium">Moments</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-blue-400 border-2 border-white"></div>
                <div className="w-6 h-6 rounded-full bg-green-400 border-2 border-white"></div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </button>
        </div>

        {/* Channels */}
        <div className="bg-white border-b border-gray-100">
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-yellow-500 flex items-center justify-center relative">
                <div className="text-white text-xs">🦋</div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
              <span className="text-gray-900 font-medium">Channels</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">South African Stories</span>
              <div className="w-6 h-6 rounded-full bg-gray-300"></div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Live Stream */}
        <div className="bg-white border-b border-gray-200 mb-2">
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full border-2 border-white"></div>
              </div>
              <span className="text-gray-900 font-medium">Live Stream</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Scan */}
        <div className="bg-white border-b border-gray-100">
          <button 
            onClick={() => setShowQRScanner(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                <ScanLine className="w-4 h-4 text-white" />
              </div>
              <span className="text-gray-900 font-medium">Scan</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Listen */}
        <div className="bg-white border-b border-gray-200 mb-2">
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                <span className="text-white text-sm">♪</span>
              </div>
              <span className="text-gray-900 font-medium">Listen</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Top Stories */}
        <div className="bg-white border-b border-gray-100">
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-yellow-500 flex items-center justify-center">
                <span className="text-white text-sm">✦</span>
              </div>
              <span className="text-gray-900 font-medium">Top Stories</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Search */}
        <div className="bg-white border-b border-gray-200 mb-2">
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-red-400 flex items-center justify-center">
                <span className="text-white text-sm">✨</span>
              </div>
              <span className="text-gray-900 font-medium">Search</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Nearby */}
        <div className="bg-white border-b border-gray-100">
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <span className="text-gray-900 font-medium">Nearby</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Games */}
        <div className="bg-white border-b border-gray-100">
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-400 to-blue-500 flex items-center justify-center transform rotate-45">
                <div className="w-3 h-3 bg-white rounded-sm transform -rotate-45"></div>
              </div>
              <span className="text-gray-900 font-medium">Games</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Mini Programs */}
        <div className="bg-white">
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                <span className="text-white text-xs">⚬</span>
              </div>
              <span className="text-gray-900 font-medium">Mini Programs</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );





  // Bottom Navigation Component (used across all views)
  const BottomNavigation = () => (
    <div className="sticky bottom-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border/50 shadow-lg">
      <div className="flex px-2">
        {[
          { id: 'chats', icon: 'chats', label: 'Chats', hasNotification: true },
          { id: 'contacts', icon: Users, label: 'Contacts' },
          { id: 'discover', icon: Compass, label: 'Discover', hasGlow: true },
          { id: 'me', icon: User, label: 'Me' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              triggerHaptic();
              startTransition(() => {
                setCurrentView(tab.id);
                setSelectedChat(null);
              });
            }}
            className={cn(
              "flex-1 py-3 flex flex-col items-center gap-1.5 transition-all duration-200",
              currentView === tab.id ? 'text-primary scale-105' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <div className="relative">
              {tab.id === 'chats' ? (
                <div className={cn(
                  "w-6 h-6 rounded-lg bg-current opacity-20 relative",
                  currentView === 'chats' && 'animate-pulse'
                )}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-current rounded"></div>
                  </div>
                  {tab.hasNotification && currentView === 'chats' && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
                  )}
                </div>
              ) : (
                <div className="relative">
                  <tab.icon className={cn(
                    "w-6 h-6 transition-transform duration-200",
                    currentView === tab.id && 'scale-110'
                  )} />
                  {tab.hasGlow && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center animate-pulse">
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-sm mx-auto h-screen bg-card shadow-2xl overflow-hidden flex flex-col">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {selectedChat ? (
          <ChatView />
        ) : currentView === 'chats' ? (
          <ChatsList />
        ) : currentView === 'contacts' ? (
          <div className="h-full flex flex-col bg-gradient-to-br from-background to-muted/20 p-4">
            <h1 className="text-xl font-semibold mb-4">Contacts</h1>
            <p className="text-muted-foreground">Contacts view coming soon...</p>
          </div>
        ) : currentView === 'discover' ? (
          <DiscoverView />
        ) : currentView === 'mini-programs' ? (
          <MiniPrograms onBack={() => setCurrentView('chats')} />
        ) : currentView === 'red-packets' ? (
          <RedPackets onBack={() => setCurrentView('chats')} />
        ) : currentView === 'moments' ? (
          <Moments onBack={() => setCurrentView('discover')} />
        ) : currentView === 'status' ? (
          <StatusUpdates onBack={() => setCurrentView('me')} />
        ) : currentView === 'me' ? (
          <div className="h-full flex flex-col bg-gradient-to-br from-background to-muted/20">
            {/* Profile Header */}
            <div className="bg-background/80 backdrop-blur-xl border-b border-border/50 p-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center text-white text-2xl">
                  👤
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-foreground">John Doe</h1>
                  <p className="text-sm text-muted-foreground">WeChat ID: johndoe123</p>
                </div>
              </div>
            </div>
            
            {/* Profile Content */}
            <div className="flex-1 p-4">
              <div className="space-y-2">
                <button 
                  onClick={() => {
                    triggerHaptic();
                    startTransition(() => setCurrentView('status'));
                  }}
                  className="flex items-center justify-between p-3 bg-background/50 hover:bg-background rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Edit3 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">Status</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{userStatus}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </button>
                <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <span className="text-foreground">Pay</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <span className="text-foreground">Favorites</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <span className="text-foreground">Settings</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
        ) : currentView === 'official' ? (
          <OfficialAccountsView />
        ) : null}
      </div>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
          <div className="bg-background/90 backdrop-blur-xl border border-border/50 rounded-2xl p-6 m-4 max-w-sm w-full animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">QR Code Scanner</h2>
              <button 
                onClick={() => setShowQRScanner(false)}
                className="w-8 h-8 hover:bg-muted rounded-full flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            
            <div className="relative mb-6">
              <div className="w-full h-48 bg-gradient-to-br from-muted to-muted/70 rounded-xl flex items-center justify-center relative overflow-hidden">
                {/* Simulated camera view */}
                <div className="absolute inset-4 border-2 border-primary rounded-xl"></div>
                <div className="absolute inset-8 border border-primary/50 rounded-lg"></div>
                <ScanLine className="w-12 h-12 text-primary animate-pulse" />
                
                {/* Scanning animation */}
                <div className="absolute top-8 left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse"></div>
              </div>
              
              <div className="absolute top-2 left-2 right-2 flex justify-between">
                <button className="w-8 h-8 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <CircleDot className="w-4 h-4 text-white" />
                </button>
                <button className="w-8 h-8 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
            
            <p className="text-center text-muted-foreground text-sm mb-4">
              Position the QR code within the frame to scan
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowQRScanner(false)}
                className="flex-1 bg-muted/50 hover:bg-muted text-foreground py-3 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button className="flex-1 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground py-3 rounded-xl hover:from-primary/90 hover:to-primary transition-all">
                Gallery
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Group Management Modal */}
      {showGroupManagement && selectedChat?.isGroup && (
        <div className="fixed inset-0 z-50 bg-background">
          <GroupManagement 
            group={{
              id: selectedChat.id.toString(),
              name: selectedChat.name,
              avatar: selectedChat.avatar,
              members: [
                { id: '1', name: 'Alice Kim', avatar: '👩🏻', role: 'admin', status: 'online' },
                { id: '2', name: 'Mike Johnson', avatar: '👨🏻', role: 'member', status: 'offline' },
                { id: '3', name: 'Sarah Connor', avatar: '👩🏽', role: 'member', status: 'online' },
                { id: '4', name: 'David Lee', avatar: '👨🏻‍💻', role: 'member', status: 'offline' }
              ]
            }}
            onBack={() => setShowGroupManagement(false)}
          />
        </div>
      )}

      {/* Bottom Navigation - Hide when in chat view or special views */}
      {!selectedChat && !['mini-programs', 'red-packets', 'status', 'moments', 'official'].includes(currentView) && <BottomNavigation />}
    </div>
  );
};

export default WeChatInterface;