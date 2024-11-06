"use client";

import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface NotificationSettingsProps {
  onChange: () => void;
}

export function NotificationSettings({ onChange }: NotificationSettingsProps) {
  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium text-lightest">Email Notifications</Label>
            <p className="text-xs text-light/60 mt-1">Receive bot updates via email</p>
          </div>
          <Switch onCheckedChange={onChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-light/60">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            className={cn(
              "bg-darker border-darker/60 text-lightest",
              "focus:border-accent/40 focus:ring-2 focus:ring-accent/20"
            )}
            onChange={onChange}
          />
        </div>
      </div>

      {/* Trade Notifications */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-lightest">Trade Notifications</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-light/60">Trade Execution</Label>
            <Switch onCheckedChange={onChange} />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm text-light/60">Price Alerts</Label>
            <Switch onCheckedChange={onChange} />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm text-light/60">Error Alerts</Label>
            <Switch onCheckedChange={onChange} defaultChecked />
          </div>
        </div>
      </div>

      {/* Telegram Integration */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium text-lightest">Telegram Bot</Label>
            <p className="text-xs text-light/60 mt-1">Receive notifications on Telegram</p>
          </div>
          <Switch onCheckedChange={onChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telegram" className="text-light/60">Telegram Chat ID</Label>
          <Input
            id="telegram"
            placeholder="Enter your Telegram chat ID"
            className={cn(
              "bg-darker border-darker/60 text-lightest",
              "focus:border-accent/40 focus:ring-2 focus:ring-accent/20"
            )}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
} 