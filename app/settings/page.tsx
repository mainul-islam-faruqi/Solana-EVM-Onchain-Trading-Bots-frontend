"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Settings as SettingsIcon, 
  Network, 
  Bell, 
  Shield, 
  Wallet,
  Key,
  Save,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { NetworkSettings } from './components/network-settings';
import { NotificationSettings } from './components/notification-settings';
import { SecuritySettings } from './components/security-settings';
import { ApiKeySettings } from './components/api-key-settings';

export default function SettingsPage() {
  const { toast } = useToast();
  const [isDirty, setIsDirty] = React.useState(false);

  const handleSave = () => {
    // Save settings logic here
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully.",
      variant: "success",
    });
    setIsDirty(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-darkest to-dark">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
              <SettingsIcon className="h-6 w-6 text-light" />
            </div>
            <h1 className="text-2xl font-bold text-lightest">Settings</h1>
          </div>
          <p className="text-lighter/70 max-w-2xl">
            Configure your bot settings, notifications, and security preferences
          </p>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Network Settings */}
          <Card className="border-accent/20 bg-darker/50 backdrop-blur-sm lg:col-span-2">
            <CardHeader className="border-b border-accent/20">
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5 text-light" />
                <span  className=" text-lightest">Network Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <NetworkSettings onChange={() => setIsDirty(true)} />
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="border-accent/20 bg-darker/50 backdrop-blur-sm">
            <CardHeader className="border-b border-accent/20">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-light" />
                <span className=" text-lightest">Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <NotificationSettings onChange={() => setIsDirty(true)} />
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="border-accent/20 bg-darker/50 backdrop-blur-sm">
            <CardHeader className="border-b border-accent/20">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-light" />
                <span className=" text-lightest">Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <SecuritySettings onChange={() => setIsDirty(true)} />
            </CardContent>
          </Card>

          {/* API Keys */}
          <Card className="border-accent/20 bg-darker/50 backdrop-blur-sm lg:col-span-2">
            <CardHeader className="border-b border-accent/20">
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-light" />
                <span className=" text-lightest">API Keys</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ApiKeySettings onChange={() => setIsDirty(true)} />
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        {isDirty && (
          <div className="fixed bottom-6 right-6">
            <Button
              onClick={handleSave}
              className={cn(
                "flex items-center gap-2 px-6",
                "bg-accent hover:bg-accent/90",
                "text-white",
                "shadow-lg shadow-accent/25",
                "hover:shadow-xl hover:shadow-accent/30",
                "transition-all duration-200"
              )}
            >
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 