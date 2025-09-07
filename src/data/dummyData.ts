export interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
  phone?: string;
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  imageUrl?: string;
  fileName?: string;
}

export interface Conversation {
  id: string;
  participants: User[];
  messages: Message[];
  lastMessage: Message;
  unreadCount: number;
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
}

export const currentUser: User = {
  id: '1',
  name: 'Themba Nkosi',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  status: 'online',
  phone: '+27 82 123 4567'
};

export const users: User[] = [
  {
    id: '2',
    name: 'Nomsa Mthembu',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b66c1e5f?w=100&h=100&fit=crop&crop=face',
    status: 'online',
    lastSeen: '2 min ago',
    phone: '+27 83 234 5678'
  },
  {
    id: '3',
    name: 'Sipho Dlamini',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    status: 'offline',
    lastSeen: '1 hour ago',
    phone: '+27 84 345 6789'
  },
  {
    id: '4',
    name: 'Zanele Khumalo',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    status: 'away',
    lastSeen: '30 min ago',
    phone: '+27 85 456 7890'
  },
  {
    id: '5',
    name: 'Mandla Ngcobo',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    status: 'online',
    lastSeen: 'now',
    phone: '+27 86 567 8901'
  },
  {
    id: '6',
    name: 'Thandi Molefe',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    status: 'offline',
    lastSeen: '2 hours ago',
    phone: '+27 87 678 9012'
  }
];

export const conversations: Conversation[] = [
  {
    id: 'conv1',
    participants: [users[0]],
    isGroup: false,
    unreadCount: 2,
    messages: [
      {
        id: 'msg1',
        text: 'Hey Themba! How are you doing?',
        senderId: '2',
        timestamp: new Date(Date.now() - 30 * 60000),
        type: 'text'
      },
      {
        id: 'msg2',
        text: 'I\'m doing great! Just finished work. How about you?',
        senderId: '1',
        timestamp: new Date(Date.now() - 25 * 60000),
        type: 'text'
      },
      {
        id: 'msg3',
        text: 'Same here! Want to grab some coffee later?',
        senderId: '2',
        timestamp: new Date(Date.now() - 5 * 60000),
        type: 'text'
      }
    ],
    lastMessage: {
      id: 'msg3',
      text: 'Same here! Want to grab some coffee later?',
      senderId: '2',
      timestamp: new Date(Date.now() - 5 * 60000),
      type: 'text'
    }
  },
  {
    id: 'conv2',
    participants: [users[1]],
    isGroup: false,
    unreadCount: 0,
    messages: [
      {
        id: 'msg4',
        text: 'Sawubona! How was your weekend?',
        senderId: '3',
        timestamp: new Date(Date.now() - 2 * 60 * 60000),
        type: 'text'
      },
      {
        id: 'msg5',
        text: 'It was fantastic! Went to the Drakensberg mountains 🏔️',
        senderId: '1',
        timestamp: new Date(Date.now() - 1.5 * 60 * 60000),
        type: 'text'
      }
    ],
    lastMessage: {
      id: 'msg5',
      text: 'It was fantastic! Went to the Drakensberg mountains 🏔️',
      senderId: '1',
      timestamp: new Date(Date.now() - 1.5 * 60 * 60000),
      type: 'text'
    }
  },
  {
    id: 'conv3',
    participants: [users[2], users[3], users[4]],
    isGroup: true,
    groupName: 'SA Rugby Fans 🏉',
    groupAvatar: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100&h=100&fit=crop',
    unreadCount: 5,
    messages: [
      {
        id: 'msg6',
        text: 'What a game last night! Springboks were amazing! 🇿🇦',
        senderId: '4',
        timestamp: new Date(Date.now() - 3 * 60 * 60000),
        type: 'text'
      },
      {
        id: 'msg7',
        text: 'Absolutely! That last try was incredible!',
        senderId: '5',
        timestamp: new Date(Date.now() - 2.5 * 60 * 60000),
        type: 'text'
      },
      {
        id: 'msg8',
        text: 'Can\'t wait for the next match! 🔥',
        senderId: '6',
        timestamp: new Date(Date.now() - 10 * 60000),
        type: 'text'
      }
    ],
    lastMessage: {
      id: 'msg8',
      text: 'Can\'t wait for the next match! 🔥',
      senderId: '6',
      timestamp: new Date(Date.now() - 10 * 60000),
      type: 'text'
    }
  }
];