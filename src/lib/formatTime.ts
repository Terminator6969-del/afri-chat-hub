export const formatMessageTime = (date: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  // Just now (less than 1 minute)
  if (diffInMinutes < 1) {
    return 'Just now';
  }

  // Minutes ago (less than 1 hour)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  // Hours ago (less than 24 hours)
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  // Days ago (less than 7 days)
  if (diffInDays < 7) {
    return diffInDays === 1 ? 'Yesterday' : `${diffInDays}d ago`;
  }

  // Show date for older messages
  return date.toLocaleDateString('en-ZA', { 
    day: '2-digit', 
    month: 'short' 
  });
};

export const formatChatTime = (date: Date): string => {
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  // Show time if within 24 hours
  if (diffInHours < 24) {
    return date.toLocaleTimeString('en-ZA', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  }
  
  // Show day name if within a week
  if (diffInHours < 168) {
    return date.toLocaleDateString('en-ZA', { weekday: 'short' });
  }
  
  // Show date for older
  return date.toLocaleDateString('en-ZA', { 
    day: '2-digit', 
    month: '2-digit' 
  });
};
