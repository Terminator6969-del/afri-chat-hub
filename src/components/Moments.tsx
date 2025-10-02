import React, { useState } from 'react';
import { ArrowLeft, Heart, MessageCircle, Send, Camera, Image as ImageIcon, X, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';

interface MomentsProps {
  onBack: () => void;
}

interface Moment {
  id: string;
  user: string;
  avatar: string;
  content: string;
  image?: string;
  time: string;
  likes: number;
  comments: Comment[];
  liked: boolean;
}

interface Comment {
  id: string;
  user: string;
  text: string;
  time: string;
}

const Moments: React.FC<MomentsProps> = ({ onBack }) => {
  const { triggerHaptic } = useHapticFeedback();
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedMoment, setSelectedMoment] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const [moments, setMoments] = useState<Moment[]>([
    {
      id: '1',
      user: 'Sophia Norman',
      avatar: '🇿🇦',
      content: 'Beautiful sunset at Camps Bay today! 🌅',
      image: '🏖️',
      time: '2 hours ago',
      likes: 12,
      comments: [
        { id: 'c1', user: 'Thabo', text: 'Stunning view!', time: '1h ago' },
        { id: 'c2', user: 'Nomsa', text: 'Love it! 😍', time: '30m ago' }
      ],
      liked: false
    },
    {
      id: '2',
      user: 'Thabo Mthembu',
      avatar: '👨🏽‍💻',
      content: 'Just finished an amazing braai with friends! Nothing beats South African hospitality 🔥🥩',
      time: '4 hours ago',
      likes: 8,
      comments: [],
      liked: true
    },
    {
      id: '3',
      user: 'Nomsa Khumalo',
      avatar: '👩🏽',
      content: 'Coffee and coding on a Sunday morning ☕💻',
      time: '6 hours ago',
      likes: 15,
      comments: [
        { id: 'c3', user: 'Sipho', text: 'That\'s the spirit!', time: '5h ago' }
      ],
      liked: false
    }
  ]);

  const handleLike = (momentId: string) => {
    triggerHaptic('impactLight');
    setMoments(prev => prev.map(moment => {
      if (moment.id === momentId) {
        return {
          ...moment,
          liked: !moment.liked,
          likes: moment.liked ? moment.likes - 1 : moment.likes + 1
        };
      }
      return moment;
    }));
  };

  const handlePostMoment = () => {
    if (!newPostContent.trim()) return;

    triggerHaptic('notificationSuccess');
    const newMoment: Moment = {
      id: `moment-${Date.now()}`,
      user: 'You',
      avatar: '👤',
      content: newPostContent,
      time: 'Just now',
      likes: 0,
      comments: [],
      liked: false
    };

    setMoments(prev => [newMoment, ...prev]);
    setNewPostContent('');
    setShowNewPost(false);
  };

  const handleAddComment = (momentId: string) => {
    if (!commentText.trim()) return;

    triggerHaptic('selection');
    setMoments(prev => prev.map(moment => {
      if (moment.id === momentId) {
        const newComment: Comment = {
          id: `comment-${Date.now()}`,
          user: 'You',
          text: commentText,
          time: 'Just now'
        };
        return {
          ...moment,
          comments: [...moment.comments, newComment]
        };
      }
      return moment;
    }));
    setCommentText('');
  };

  if (showNewPost) {
    return (
      <div className="h-full flex flex-col bg-gradient-to-br from-background to-muted/20">
        <div className="bg-background/80 backdrop-blur-xl border-b border-border/50 p-4">
          <div className="flex items-center justify-between">
            <button onClick={() => setShowNewPost(false)} className="w-9 h-9 hover:bg-muted rounded-full flex items-center justify-center">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold">New Moment</h1>
            <button
              onClick={handlePostMoment}
              disabled={!newPostContent.trim()}
              className={cn(
                "px-4 py-2 rounded-lg font-medium transition-all",
                newPostContent.trim()
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              Post
            </button>
          </div>
        </div>

        <div className="flex-1 p-4">
          <div className="bg-background rounded-2xl p-4 shadow-lg">
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Share your moment..."
              className="w-full bg-transparent resize-none focus:outline-none text-lg min-h-[200px]"
              maxLength={500}
              autoFocus
            />
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <div className="flex gap-2">
                <button className="w-10 h-10 hover:bg-muted rounded-full flex items-center justify-center">
                  <Camera className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 hover:bg-muted rounded-full flex items-center justify-center">
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 hover:bg-muted rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </button>
              </div>
              <span className="text-xs text-muted-foreground">
                {newPostContent.length}/500
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-background to-muted/20">
      <div className="bg-background/80 backdrop-blur-xl border-b border-border/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="w-9 h-9 hover:bg-muted rounded-full flex items-center justify-center">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold">Moments</h1>
          </div>
          <button
            onClick={() => {
              triggerHaptic('selection');
              setShowNewPost(true);
            }}
            className="w-9 h-9 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full flex items-center justify-center"
          >
            <Camera className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {moments.map((moment, index) => (
          <div
            key={moment.id}
            className="bg-background rounded-2xl p-4 shadow-lg animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                <span className="text-sm">{moment.avatar}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{moment.user}</h3>
                <p className="text-xs text-muted-foreground">{moment.time}</p>
              </div>
            </div>

            <p className="mb-3">{moment.content}</p>

            {moment.image && (
              <div className="w-full h-48 bg-gradient-to-br from-muted to-muted/70 rounded-xl flex items-center justify-center text-6xl mb-3">
                {moment.image}
              </div>
            )}

            <div className="flex items-center gap-4 pt-3 border-t border-border">
              <button
                onClick={() => handleLike(moment.id)}
                className="flex items-center gap-2 hover:text-red-500 transition-colors"
              >
                <Heart className={cn("w-5 h-5", moment.liked && "fill-red-500 text-red-500")} />
                <span className="text-sm font-medium">{moment.likes}</span>
              </button>
              <button
                onClick={() => {
                  triggerHaptic('selection');
                  setSelectedMoment(selectedMoment === moment.id ? null : moment.id);
                }}
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{moment.comments.length}</span>
              </button>
            </div>

            {selectedMoment === moment.id && (
              <div className="mt-4 pt-4 border-t border-border space-y-3">
                {moment.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-2">
                    <div className="flex-1 bg-muted rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{comment.user}</span>
                        <span className="text-xs text-muted-foreground">{comment.time}</span>
                      </div>
                      <p className="text-sm">{comment.text}</p>
                    </div>
                  </div>
                ))}

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 bg-muted rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment(moment.id)}
                  />
                  <button
                    onClick={() => handleAddComment(moment.id)}
                    disabled={!commentText.trim()}
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                      commentText.trim()
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    )}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Moments;
