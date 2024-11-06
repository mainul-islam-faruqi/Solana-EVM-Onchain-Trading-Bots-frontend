"use client";

import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Shield, Key, AlertTriangle } from 'lucide-react';

interface SecuritySettingsProps {
  onChange: () => void;
}

export function SecuritySettings({ onChange }: SecuritySettingsProps) {
  return (
    <div className="space-y-6">
      {/* Two-Factor Authentication */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium text-lightest">Two-Factor Authentication</Label>
            <p className="text-xs text-light/60 mt-1">Add an extra layer of security</p>
          </div>
          <Switch onCheckedChange={onChange} />
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={onChange}
        >
          <Shield className="h-4 w-4 mr-2" />
          Setup 2FA
        </Button>
      </div>

      {/* Transaction Signing */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium text-lightest">Hardware Wallet Signing</Label>
            <p className="text-xs text-light/60 mt-1">Require hardware wallet for trades</p>
          </div>
          <Switch onCheckedChange={onChange} defaultChecked />
        </div>
      </div>

      {/* Trade Limits */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-lightest">Trade Limits</h3>
        
        <div className="space-y-2">
          <Label htmlFor="max-trade" className="text-light/60">Maximum Trade Size</Label>
          <Input
            id="max-trade"
            type="number"
            placeholder="Enter maximum trade size"
            className={cn(
              "bg-darker border-darker/60 text-lightest",
              "focus:border-accent/40 focus:ring-2 focus:ring-accent/20"
            )}
            onChange={onChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="daily-limit" className="text-light/60">Daily Trading Limit</Label>
          <Input
            id="daily-limit"
            type="number"
            placeholder="Enter daily limit"
            className={cn(
              "bg-darker border-darker/60 text-lightest",
              "focus:border-accent/40 focus:ring-2 focus:ring-accent/20"
            )}
            onChange={onChange}
          />
        </div>
      </div>

      {/* Emergency Stop */}
      <div className="p-3 rounded-lg border border-error/20 bg-error/5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-error shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-error">Emergency Stop</h4>
            <p className="text-xs text-error/80 mt-1">
              Stop all bot activities immediately in case of emergency
            </p>
            <Button
              variant="destructive"
              size="sm"
              className="mt-3 text-error"
              onClick={onChange}
            >
              Stop All Bots
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 