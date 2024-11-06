"use client";

import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, Copy, Key, Plus } from 'lucide-react';

interface ApiKeySettingsProps {
  onChange: () => void;
}

export function ApiKeySettings({ onChange }: ApiKeySettingsProps) {
  const [showKey, setShowKey] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("your-api-key-here");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Current API Key */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-lightest">Current API Key</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowKey(!showKey)}
            className="text-light/60 hover:text-light"
          >
            {showKey ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="relative">
          <Input
            type={showKey ? "text" : "password"}
            value="your-api-key-here"
            readOnly
            className={cn(
              "bg-darker border-darker/60 text-lightest pr-24",
              "focus:border-accent/40 focus:ring-2 focus:ring-accent/20"
            )}
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-lightest"
            onClick={handleCopy}
          >
            <Copy className="h-4 w-4 mr-2" />
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
      </div>

      {/* Generate New Key */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-lightest">Generate New API Key</h3>
        
        <div className="space-y-2">
          <Label htmlFor="key-name" className="text-light/60">Key Name</Label>
          <Input
            id="key-name"
            placeholder="Enter a name for this API key"
            className={cn(
              "bg-darker border-darker/60 text-lightest",
              "focus:border-accent/40 focus:ring-2 focus:ring-accent/20"
            )}
            onChange={onChange}
          />
        </div>

        <Button
          className="w-full flex items-center justify-center gap-2 text-lightest"
          onClick={onChange}
        >
          <Key className="h-4 w-4" />
          Generate New Key
        </Button>
      </div>

      {/* API Key List */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-lightest">Active API Keys</h3>
        
        <div className="space-y-3">
          {['Trading Bot Key', 'Analytics Key', 'Development Key'].map((key) => (
            <div
              key={key}
              className={cn(
                "p-3 rounded-lg",
                "border border-accent/10",
                "bg-darker/30"
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-lightest">{key}</h4>
                  <p className="text-xs text-light/60 mt-1">Created on Apr 1, 2024</p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={onChange}
                  className="bg-error/70 hover:bg-error/80"
                >
                  Revoke
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 