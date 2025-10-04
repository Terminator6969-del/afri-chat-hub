import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, MapPin, Calendar, Phone, Mail, ArrowLeft, Settings } from 'lucide-react';
import { currentUser } from '@/data/dummyData';

interface UserProfileProps {
  onBack?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onBack }) => {
  return (
    <div className="flex-1 bg-card overflow-y-auto">
      {/* Header */}
      {onBack && (
        <div className="sticky top-0 z-10 bg-card/80 backdrop-blur-xl border-b border-border/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={onBack}
                className="w-9 h-9 hover:bg-muted rounded-full flex items-center justify-center transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold">Profile</h1>
            </div>
            <button className="w-9 h-9 hover:bg-muted rounded-full flex items-center justify-center transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
      
      <div className="max-w-2xl mx-auto space-y-6 p-6">
        {/* Profile Header */}
        <Card>
          <CardHeader className="text-center">
            <div className="relative mx-auto w-24 h-24">
              <Avatar className="w-24 h-24">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback className="text-2xl">
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="w-6 h-6 bg-status-online rounded-full border-2 border-card absolute -bottom-1 -right-1"></div>
            </div>
            <h1 className="text-2xl font-bold mt-4">{currentUser.name}</h1>
            <Badge variant="secondary" className="w-fit mx-auto">
              {currentUser.status}
            </Badge>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Contact Information</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span>{currentUser.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span>themba.nkosi@email.com</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>Cape Town, South Africa</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>Joined January 2024</span>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">About</h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Software developer from Cape Town. Love rugby, coding, and exploring the beautiful Western Cape. 
              Always up for a braai with friends! 🇿🇦
            </p>
          </CardContent>
        </Card>

        {/* Quick Settings */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Quick Settings</h2>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Show online status</span>
              <Badge variant="outline" className="text-status-online">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Read receipts</span>
              <Badge variant="outline" className="text-status-online">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Last seen</span>
              <Badge variant="outline" className="text-status-online">Enabled</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;