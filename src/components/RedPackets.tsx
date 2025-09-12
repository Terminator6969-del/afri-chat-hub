import React, { useState } from 'react';
import { ArrowLeft, Gift, Plus, Clock, CheckCircle, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RedPacketsProps {
  onBack: () => void;
}

const RedPackets: React.FC<RedPacketsProps> = ({ onBack }) => {
  const [showSendPacket, setShowSendPacket] = useState(false);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [recipients, setRecipients] = useState<string[]>([]);

  const redPackets = [
    {
      id: 1,
      sender: 'Nomsa Mthembu',
      amount: 50,
      message: 'Happy Birthday! 🎉',
      timestamp: '2 hours ago',
      status: 'received',
      avatar: '👩🏽'
    },
    {
      id: 2,
      sender: 'You',
      amount: 100,
      message: 'Good luck with your exams!',
      timestamp: '1 day ago',
      status: 'sent',
      recipients: 3,
      avatar: '👨🏽‍💻'
    },
    {
      id: 3,
      sender: 'Braai Squad',
      amount: 25,
      message: 'Thanks for organizing! 🔥',
      timestamp: '3 days ago',
      status: 'received',
      avatar: '🔥'
    }
  ];

  const contacts = [
    { id: '1', name: 'Sophia Norman', avatar: '🇿🇦' },
    { id: '2', name: 'Lunch gang', avatar: '🍽️' },
    { id: '3', name: 'Roxie Crawford', avatar: '👩🏽' },
    { id: '4', name: 'Lloyd Berry', avatar: '👨🏿' }
  ];

  const sendRedPacket = () => {
    if (!amount || !message || recipients.length === 0) return;
    
    // Add logic to send red packet
    setShowSendPacket(false);
    setAmount('');
    setMessage('');
    setRecipients([]);
  };

  if (showSendPacket) {
    return (
      <div className="h-full flex flex-col bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
        {/* Header */}
        <div className="bg-background/80 backdrop-blur-xl border-b border-border/50 p-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setShowSendPacket(false)} className="w-9 h-9 hover:bg-muted rounded-full flex items-center justify-center">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold">Send Red Packet</h1>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          {/* Red Packet Preview */}
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-3xl p-6 mb-6 text-white shadow-xl">
            <div className="text-center">
              <Gift className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Red Packet</h2>
              <div className="text-3xl font-bold mb-2">R{amount || '0'}</div>
              <p className="text-red-100">{message || 'Add your message...'}</p>
            </div>
          </div>

          {/* Amount Input */}
          <div className="bg-background rounded-2xl p-4 mb-4 shadow-lg">
            <label className="block text-sm font-medium mb-2">Amount (ZAR)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full bg-muted rounded-xl px-4 py-3 text-lg font-semibold text-center focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Message Input */}
          <div className="bg-background rounded-2xl p-4 mb-4 shadow-lg">
            <label className="block text-sm font-medium mb-2">Message</label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a message..."
              className="w-full bg-muted rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Recipients */}
          <div className="bg-background rounded-2xl p-4 mb-6 shadow-lg">
            <label className="block text-sm font-medium mb-3">Send to</label>
            <div className="space-y-2">
              {contacts.map((contact) => (
                <label key={contact.id} className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={recipients.includes(contact.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setRecipients([...recipients, contact.id]);
                      } else {
                        setRecipients(recipients.filter(id => id !== contact.id));
                      }
                    }}
                    className="w-4 h-4 text-red-600 rounded"
                  />
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-sm">{contact.avatar}</span>
                  </div>
                  <span className="font-medium">{contact.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Send Button */}
          <button
            onClick={sendRedPacket}
            disabled={!amount || !message || recipients.length === 0}
            className={cn(
              "w-full py-4 rounded-xl font-semibold text-lg transition-all",
              amount && message && recipients.length > 0
                ? "bg-red-500 text-white hover:bg-red-600 shadow-lg"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            Send Red Packet (R{amount || '0'})
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <div className="bg-background/80 backdrop-blur-xl border-b border-border/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="w-9 h-9 hover:bg-muted rounded-full flex items-center justify-center">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold">Red Packets</h1>
          </div>
          <button 
            onClick={() => setShowSendPacket(true)}
            className="w-9 h-9 bg-red-500 text-white hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Balance Card */}
      <div className="p-4">
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 mb-1">Wallet Balance</p>
              <p className="text-3xl font-bold">R 1,247.50</p>
            </div>
            <Gift className="w-12 h-12 text-red-200" />
          </div>
        </div>
      </div>

      {/* Red Packets History */}
      <div className="flex-1 p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {redPackets.map((packet, index) => (
            <div 
              key={packet.id}
              className="bg-background rounded-xl p-4 shadow-lg border border-border/50 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">{packet.avatar}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold">{packet.sender}</h3>
                    <div className="flex items-center gap-2">
                      {packet.status === 'received' ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Users className="w-4 h-4 text-blue-500" />
                      )}
                      <span className={cn(
                        "font-bold",
                        packet.status === 'received' ? "text-green-600" : "text-blue-600"
                      )}>
                        {packet.status === 'received' ? '+' : '-'}R{packet.amount}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{packet.message}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{packet.timestamp}</span>
                    {packet.recipients && (
                      <span className="text-xs text-muted-foreground">{packet.recipients} recipients</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RedPackets;