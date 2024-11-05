'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Settings, AlertCircle } from 'lucide-react'
import { InfoTooltip } from '@/components/ui/info-tooltip'
import { BlockType } from './types'
import { cn } from '@/lib/utils'

interface BlockConfigPanelProps {
  selectedBlock: BlockType | null;
  onConfigChange: (blockId: string, config: Record<string, any>) => void;
}

interface ConfigError {
  field: string;
  message: string;
}

export function BlockConfigPanel({ selectedBlock, onConfigChange }: BlockConfigPanelProps) {
  // Use local state to track input values
  const [localConfig, setLocalConfig] = React.useState<Record<string, any>>({})
  const [errors, setErrors] = React.useState<ConfigError[]>([])
  const [touched, setTouched] = React.useState<Set<string>>(new Set())

  // Update local config when selected block changes
  React.useEffect(() => {
    if (selectedBlock) {
      setLocalConfig(selectedBlock.config)
      setErrors([])
      setTouched(new Set())
    }
  }, [selectedBlock?.id, selectedBlock?.config])

  const validateConfig = (key: string, value: any): string | null => {
    if (!selectedBlock?.validationRules?.[key]) return null

    const rules = selectedBlock.validationRules[key]
    
    if (rules.required && (value === null || value === undefined || value === '')) {
      return `${key} is required`
    }
    if (rules.min !== undefined && value < rules.min) {
      return `${key} must be greater than ${rules.min}`
    }
    if (rules.max !== undefined && value > rules.max) {
      return `${key} must be less than ${rules.max}`
    }
    if (rules.pattern && !rules.pattern.test(value?.toString())) {
      return `${key} has invalid format`
    }
    if (rules.custom && !rules.custom(value)) {
      return `${key} is invalid`
    }

    return null
  }

  const handleConfigChange = (key: string, value: any) => {
    // Update local state immediately for responsive UI
    setLocalConfig(prev => ({
      ...prev,
      [key]: value
    }))

    // Mark field as touched
    setTouched(prev => new Set(prev).add(key))

    // Validate the new value
    const error = validateConfig(key, value)
    setErrors(prev => {
      const newErrors = prev.filter(e => e.field !== key)
      if (error) {
        newErrors.push({ field: key, message: error })
      }
      return newErrors
    })

    // Notify parent component of change
    if (selectedBlock) {
      const newConfig = {
        ...selectedBlock.config,
        [key]: value
      }
      onConfigChange(selectedBlock.id, newConfig)
    }
  }

  const handleInputBlur = (key: string) => {
    const value = localConfig[key]
    // Revalidate on blur
    const error = validateConfig(key, value)
    if (error) {
      setErrors(prev => [...prev.filter(e => e.field !== key), { field: key, message: error }])
    } else {
      setErrors(prev => prev.filter(e => e.field !== key))
    }
  }

  const getFieldError = (field: string): string | undefined => {
    return errors.find(e => e.field === field)?.message
  }

  if (!selectedBlock) {
    return (
      <Card className="border border-accent/20 bg-darker/50 backdrop-blur-sm h-full">
        <CardHeader className="border-b border-accent/20">
          <CardTitle className="flex items-center space-x-2 text-lightest">
            <Settings className="h-5 w-5" />
            <span>Block Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 flex items-center justify-center">
          <div className="text-center text-light">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>Select a block to configure</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-accent/20 bg-darker/50 backdrop-blur-sm">
      <CardHeader className="border-b border-accent/20">
        <CardTitle className="flex items-center space-x-2 text-lightest">
          <Settings className="h-5 w-5" />
          <span>Configure {selectedBlock?.label}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {Object.entries(localConfig).map(([key, value]) => (
          <div key={key} className="space-y-2">
            <Label 
              htmlFor={key} 
              className="text-sm font-medium flex items-center justify-between text-light"
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
              <InfoTooltip 
                text={`Configure ${key} for ${selectedBlock?.label}`}
                className="text-light/60 cursor-help"
              />
            </Label>
            {typeof value === 'number' ? (
              <Input
                id={key}
                type="number"
                value={value}
                onChange={(e) => handleConfigChange(key, parseFloat(e.target.value) || 0)}
                onBlur={() => handleInputBlur(key)}
                className={cn(
                  "bg-darker border-accent/20 text-lightest placeholder-light/50",
                  "focus:border-accent focus:ring-1 focus:ring-accent",
                  "hover:border-accent/40",
                  getFieldError(key) && touched.has(key) ? 'border-error' : ''
                )}
                step="0.000001"
                min={selectedBlock?.validationRules?.[key]?.min ?? 0}
                max={selectedBlock?.validationRules?.[key]?.max}
                placeholder={`Enter ${key}...`}
              />
            ) : typeof value === 'string' && key === 'condition' ? (
              <Select
                value={value}
                onValueChange={(v) => handleConfigChange(key, v)}
              >
                <SelectTrigger 
                  className={cn(
                    "bg-darker border-accent/20 text-lightest",
                    "focus:border-accent focus:ring-1 focus:ring-accent",
                    "hover:border-accent/40"
                  )}
                >
                  <SelectValue placeholder={`Select ${key}`} />
                </SelectTrigger>
                <SelectContent className="bg-darker border-accent/20">
                  <SelectItem value="above" className="text-lightest hover:bg-accent/10">Above</SelectItem>
                  <SelectItem value="below" className="text-lightest hover:bg-accent/10">Below</SelectItem>
                  <SelectItem value="equals" className="text-lightest hover:bg-accent/10">Equals</SelectItem>
                </SelectContent>
              </Select>
            ) : typeof value === 'string' ? (
              <Input
                id={key}
                type="text"
                value={value}
                onChange={(e) => handleConfigChange(key, e.target.value)}
                onBlur={() => handleInputBlur(key)}
                className={cn(
                  "bg-darker border-accent/20 text-lightest placeholder-light/50",
                  "focus:border-accent focus:ring-1 focus:ring-accent",
                  "hover:border-accent/40",
                  getFieldError(key) && touched.has(key) ? 'border-error' : ''
                )}
                placeholder={`Enter ${key}...`}
              />
            ) : null}
            {getFieldError(key) && touched.has(key) && (
              <p className="text-xs text-error mt-1">{getFieldError(key)}</p>
            )}
          </div>
        ))}

        {/* Configuration Summary */}
        <div className="mt-6 p-3 bg-darker/80 rounded-lg border border-accent/10">
          <h4 className="text-sm font-medium mb-2 text-lightest">Configuration Summary</h4>
          <div className="space-y-1 text-sm">
            {Object.entries(localConfig).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="capitalize text-light">{key}:</span>
                <span className="font-medium text-lightest">{value.toString()}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 