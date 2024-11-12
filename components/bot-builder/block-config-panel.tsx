'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, AlertCircle, Info } from 'lucide-react';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { BlockType } from './types';
import { cn } from '@/lib/utils';

interface BlockConfigPanelProps {
  selectedBlock: BlockType | null;
  onConfigChange: (blockId: string, config: Record<string, any>) => void;
}

interface ConfigError {
  field: string;
  message: string;
}

export function BlockConfigPanel({ selectedBlock, onConfigChange }: BlockConfigPanelProps) {
  const [localConfig, setLocalConfig] = React.useState<Record<string, any>>({});
  const [errors, setErrors] = React.useState<ConfigError[]>([]);
  const [touched, setTouched] = React.useState<Set<string>>(new Set());
  const [isDirty, setIsDirty] = React.useState(false);

  // Update local config when selected block changes
  React.useEffect(() => {
    if (selectedBlock && JSON.stringify(localConfig) !== JSON.stringify(selectedBlock.config)) {
      setLocalConfig(selectedBlock.config);
      setErrors([]);
      setTouched(new Set());
      setIsDirty(false);
    }
  }, [selectedBlock?.id, selectedBlock?.config]);

  const validateConfig = (key: string, value: any): string | null => {
    if (!selectedBlock?.validationRules?.[key]) return null;

    const rules = selectedBlock.validationRules[key];
    
    if (rules.required && (value === null || value === undefined || value === '')) {
      return `${key} is required`;
    }
    if (rules.min !== undefined && value < rules.min) {
      return `${key} must be greater than ${rules.min}`;
    }
    if (rules.max !== undefined && value > rules.max) {
      return `${key} must be less than ${rules.max}`;
    }
    if (rules.pattern && !rules.pattern.test(value?.toString())) {
      return `${key} has invalid format`;
    }
    if (rules.custom && !rules.custom(value)) {
      return `${key} is invalid`;
    }

    return null;
  };

  const handleConfigChange = (key: string, value: any) => {
    if (!selectedBlock) return;

    setIsDirty(true);
    const newConfig = {
      ...localConfig,
      [key]: value
    };
    
    setLocalConfig(newConfig);
    setTouched(prev => new Set(prev).add(key));

    const error = validateConfig(key, value);
    setErrors(prev => {
      const newErrors = prev.filter(e => e.field !== key);
      if (error) {
        newErrors.push({ field: key, message: error });
      }
      return newErrors;
    });

    // If there are no errors, update the config immediately
    if (!error) {
      onConfigChange(selectedBlock.id, newConfig);
    }
  };

  const handleSave = () => {
    if (!selectedBlock) return;
    
    // Validate all fields
    const newErrors: ConfigError[] = [];
    Object.entries(localConfig).forEach(([key, value]) => {
      const error = validateConfig(key, value);
      if (error) {
        newErrors.push({ field: key, message: error });
      }
    });

    setErrors(newErrors);

    if (newErrors.length === 0) {
      onConfigChange(selectedBlock.id, localConfig);
      setIsDirty(false);
    } else {
      // Mark all fields as touched when trying to save with errors
      setTouched(new Set(Object.keys(localConfig)));
    }
  };

  const getFieldError = (field: string): string | undefined => {
    return errors.find(e => e.field === field)?.message;
  };

  const getFieldDescription = (key: string): string => {
    switch (key) {
      case 'price':
        return 'Target price for the trigger';
      case 'amount':
        return 'Amount to trade';
      case 'condition':
        return 'Price condition to trigger the trade';
      default:
        return '';
    }
  };

  if (!selectedBlock) {
    return (
      <Card className="border-accent/20 bg-darker/50 backdrop-blur-sm h-full">
        <CardContent className="flex items-center justify-center min-h-[300px] text-lightest">
          <div className="text-center space-y-2">
            <Settings className="h-8 w-8 mx-auto text-light/50" />
            <p className="text-sm">Select a block to configure</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-accent/20 bg-darker/50 backdrop-blur-sm">
      <CardHeader className="border-b border-accent/20">
        <CardTitle className="flex items-center justify-between text-lightest">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <span>Configure {selectedBlock.label}</span>
          </div>
          {isDirty && (
            <button
              onClick={handleSave}
              className={cn(
                "px-3 py-1 text-sm rounded-full",
                "bg-accent/10 text-light",
                "hover:bg-accent/20",
                "transition-colors duration-200",
                errors.length > 0 && "opacity-50 cursor-not-allowed"
              )}
              disabled={errors.length > 0}
            >
              Save Changes
            </button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {Object.entries(localConfig).map(([key, value]) => (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label 
                htmlFor={key} 
                className="text-sm font-medium flex items-center gap-2 text-lighter"
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
                <InfoTooltip text={getFieldDescription(key)}>
                  <Info className="h-4 w-4 text-light/60" />
                </InfoTooltip>
              </Label>
            </div>
            
            {typeof value === 'number' ? (
              <Input
                id={key}
                type="number"
                value={value}
                onChange={(e) => handleConfigChange(key, parseFloat(e.target.value) || 0)}
                className={cn(
                  "bg-darker border-darker/60 text-lightest",
                  "focus:border-accent/40 focus:ring-2 focus:ring-accent/20",
                  "focus:outline-none",
                  "hover:border-accent/30",
                  "placeholder-light/30",
                  "shadow-sm shadow-black/10",
                  "focus-within:shadow-accent/5",
                  "transition-all duration-200",
                  "focus-visible:ring-offset-1",
                  "focus-visible:ring-accent/30",
                  getFieldError(key) && touched.has(key) ? 'border-error/50 focus:border-error/50 focus:ring-error/30' : ''
                )}
                step="0.000001"
                min={selectedBlock.validationRules?.[key]?.min ?? 0}
                max={selectedBlock.validationRules?.[key]?.max}
                placeholder={`Enter ${key}...`}
              />
            ) : typeof value === 'string' && key === 'condition' ? (
              <Select
                value={value}
                onValueChange={(v) => handleConfigChange(key, v)}
              >
                <SelectTrigger 
                  className={cn(
                    "bg-darker border-darker/60 text-lightest",
                    "focus:border-accent/40 focus:ring-2 focus:ring-accent/20",
                    "focus:outline-none",
                    "hover:border-accent/30",
                    "shadow-sm shadow-black/10",
                    "focus-within:shadow-accent/5",
                    "transition-all duration-200",
                    "focus-visible:ring-offset-1",
                    "focus-visible:ring-accent/30",
                    getFieldError(key) && touched.has(key) ? 'border-error/50' : ''
                  )}
                >
                  <SelectValue placeholder={`Select ${key}`} />
                </SelectTrigger>
                <SelectContent 
                  className={cn(
                    "bg-darker border-darker/60",
                    "focus:outline-none",
                    "focus-visible:ring-2",
                    "focus-visible:ring-accent/30"
                  )}
                >
                  <SelectItem 
                    value="above"
                    className={cn(
                      "text-lightest",
                      "hover:bg-accent/5",
                      "focus:bg-accent/10",
                      "focus:text-light/90",
                      "focus:outline-none",
                      "focus-visible:ring-1",
                      "focus-visible:ring-accent/30"
                    )}
                  >
                    Above
                  </SelectItem>
                  <SelectItem 
                    value="below"
                    className={cn(
                      "text-lightest",
                      "hover:bg-accent/5",
                      "focus:bg-accent/10",
                      "focus:text-light/90",
                      "focus:outline-none",
                      "focus-visible:ring-1",
                      "focus-visible:ring-accent/30"
                    )}
                  >
                    Below
                  </SelectItem>
                  <SelectItem 
                    value="equals"
                    className={cn(
                      "text-lightest",
                      "hover:bg-accent/5",
                      "focus:bg-accent/10",
                      "focus:text-light/90",
                      "focus:outline-none",
                      "focus-visible:ring-1",
                      "focus-visible:ring-accent/30"
                    )}
                  >
                    Equals
                  </SelectItem>
                </SelectContent>
              </Select>
            ) : null}
            
            {getFieldError(key) && touched.has(key) && (
              <div className="flex items-center gap-1 text-xs text-error mt-1">
                <AlertCircle className="h-3 w-3" />
                <span>{getFieldError(key)}</span>
              </div>
            )}
          </div>
        ))}

        {/* Configuration Summary */}
        <div className="mt-6 p-3 bg-darker/80 rounded-lg border border-accent/10">
          <h4 className="text-sm font-medium mb-2 text-lightest">Configuration Summary</h4>
          <div className="space-y-1 text-sm">
            {Object.entries(localConfig).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="capitalize text-lighter">{key}:</span>
                <span className="font-medium text-lightest">
                  {value != null ? value.toString() : '-'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Validation Status */}
        {errors.length > 0 && touched.size > 0 && (
          <div className="p-3 rounded-lg bg-error/10 border border-error/20">
            <div className="flex items-center gap-2 text-error mb-2">
              <AlertCircle className="h-4 w-4" />
              <h4 className="font-medium">Configuration Errors</h4>
            </div>
            <ul className="space-y-1 text-sm text-error/80">
              {errors.map((error, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span>•</span>
                  <span>{error.message}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 