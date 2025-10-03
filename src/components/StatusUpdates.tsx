import React, { useState } from 'react';
import { ArrowLeft, Plus, Edit3, Camera, Smile, Clock, Eye, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';

interface StatusUpdatesProps {
  onBack: () => void;
}

const StatusUpdates: React.FC<StatusUpdatesProps> = ({ onBack }) => {
  const [showCreateStatus, setShowCreateStatus] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [selectedBg, setSelectedBg] = useState(0);
  const { triggerHaptic } = useHapticFeedback();

  const myStatus = {
    id: '1',
    text: 'Busy with work 💼',
    bgColor: 'from-blue-500 to-blue-600',
    timestamp: '2 hours ago',
    views: 12,
    expires: '22h'
  };

  const friendsStatus = [
    {
      id: '2',
      name: 'Sophia Norman',
      avatar: '🇿🇦',
      text: 'Beautiful day at Table Mountain! 🏔️',
      bgColor: 'from-green-500 to-green-600',
      timestamp: '1 hour ago',
      views: 8,
      hasViewed: false
    },
    {
      id: '3',
      name: 'Thabo Mthembu',
      avatar: '👨🏽‍💻',
      text: 'Code, coffee, repeat ☕',
      bgColor: 'from-purple-500 to-purple-600',
      timestamp: '3 hours ago',
      views: 15,
      hasViewed: true
    },
    {
      id: '4',
      name: 'Nomsa Khumalo',
      avatar: '👩🏽',
      text: 'Weekend vibes! 🌅',
      bgColor: 'from-orange-500 to-orange-600',
      timestamp: '5 hours ago',
      views: 22,
      hasViewed: false
    }
  ];

  const backgroundOptions = [
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600',
    'from-green-500 to-green-600',
    'from-red-500 to-red-600',
    'from-orange-500 to-orange-600',
    'from-pink-500 to-pink-600'
  ];

  const createStatus = () => {
    if (!statusText.trim()) return;
    
    triggerHaptic('notificationSuccess');
    setShowCreateStatus(false);
    setStatusText('');
    setSelectedBg(0);
    
    toast({
      title: 'Status updated',
      description: 'Your status has been shared and is visible for 24 hours',
    });
  };

  if (showCreateStatus) {
    return (
      <div className="h-full flex flex-col bg-gradient-to-br from-background to-muted/20">
        {/* Header */}
        <div className="bg-background/80 backdrop-blur-xl border-b border-border/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setShowCreateStatus(false)} className="w-9 h-9 hover:bg-muted rounded-full flex items-center justify-center">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-semibold">New Status</h1>
            </div>
            <button 
              onClick={createStatus}
              disabled={!statusText.trim()}
              className={cn(
                "px-4 py-2 rounded-lg font-medium transition-all",
                statusText.trim()
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              Share
            </button>
          </div>
        </div>

        <div className="flex-1 p-4">
          {/* Status Preview */}
          <div className={cn(
            "bg-gradient-to-br rounded-3xl p-8 mb-6 text-white shadow-xl relative overflow-hidden",
            backgroundOptions[selectedBg]
          )}>
            <div className="relative z-10 text-center">
              <div className="text-2xl font-bold mb-4">
                {statusText || 'Type your status...'}
              </div>
              <div className="text-white/80 text-sm">
                Visible for 24 hours
              </div>
            </div>
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          {/* Text Input */}
          <div className="bg-background rounded-2xl p-4 mb-4 shadow-lg">
            <textarea
              value={statusText}
              onChange={(e) => setStatusText(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full bg-transparent resize-none focus:outline-none text-lg"
              rows={3}
              maxLength={150}
            />
            <div className="flex items-center justify-between mt-2">
              <div className="flex gap-2">
                <button className="w-8 h-8 hover:bg-muted rounded-full flex items-center justify-center">
                  <Smile className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 hover:bg-muted rounded-full flex items-center justify-center">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-muted-foreground">
                {statusText.length}/150
              </span>
            </div>
          </div>

          {/* Background Options */}
          <div className="bg-background rounded-2xl p-4 shadow-lg">
            <h3 className="font-medium mb-3">Background</h3>
            <div className="grid grid-cols-6 gap-3">
              {backgroundOptions.map((bg, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedBg(index)}
                  className={cn(
                    "aspect-square rounded-xl bg-gradient-to-br transition-all",
                    bg,
                    selectedBg === index ? "ring-2 ring-primary ring-offset-2" : ""
                  )}
                />
              ))}
            </div>
          </div>
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
            <h1 className="text-xl font-semibold">Status</h1>
          </div>
          <button 
            onClick={() => setShowCreateStatus(true)}
            className="w-9 h-9 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full flex items-center justify-center transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* My Status */}
        <div className="p-4 border-b border-border/30">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">My Status</h2>
          {myStatus ? (
            <div className="flex items-center gap-3 p-3 bg-background rounded-xl shadow-sm">
              <div className="relative">
                <div className={cn(
                  "w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold shadow-lg",
                  myStatus.bgColor
                )}>
                  You
                </div>
                <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors">
                  <Edit3 className="w-3 h-3" />
                </button>
              </div>
              <div className="flex-1">
                <p className="font-medium mb-1">{myStatus.text}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{myStatus.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{myStatus.views} views</span>
                  </div>
                  <span>expires in {myStatus.expires}</span>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowCreateStatus(true)}
              className="w-full flex items-center gap-3 p-3 border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 rounded-xl transition-all"
            >
              <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center">
                <Plus className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="text-left">
                <p className="font-medium">Add status</p>
                <p className="text-sm text-muted-foreground">Share what's on your mind</p>
              </div>
            </button>
          )}
        </div>

        {/* Friends Status */}
        <div className="p-4">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Recent Updates</h2>
          <div className="space-y-3">
            {friendsStatus.map((status, index) => (
              <div 
                key={status.id}
                className="flex items-center gap-3 p-3 bg-background rounded-xl shadow-sm cursor-pointer hover:bg-muted/20 transition-all animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white text-lg shadow-lg",
                    status.bgColor,
                    status.hasViewed ? "opacity-60" : ""
                  )}>
                    {status.avatar}
                  </div>
                  {!status.hasViewed && (
                    <div className="absolute inset-0 rounded-2xl ring-2 ring-primary ring-offset-2"></div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium mb-1">{status.name}</h3>
                  <p className="text-sm text-muted-foreground mb-1">{status.text}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{status.timestamp}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{status.views}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusUpdates;