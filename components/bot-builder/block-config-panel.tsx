'use client'

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Info } from 'lucide-react';
import { BlockType } from './types';
import { TOKEN_PAIRS } from './block-registry';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface TokenPair {
  id: string;
  name: string;
  inputToken: { symbol: string };
  outputToken: { symbol: string };
}

interface BlockConfigPanelProps {
  selectedBlock: BlockType;
  onConfigChange: (blockId: string, config: Record<string, unknown>) => void;
}

interface InfoTooltipProps {
  text: string;
  children: React.ReactNode;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ text, children }) => (
  <span className="relative inline-flex items-center">
    <span className="cursor-help group">
      {children}
      <span className="invisible group-hover:visible absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-xs bg-darker rounded-lg shadow-lg text-lighter whitespace-nowrap z-50">
        {text}
      </span>
    </span>
  </span>
);

const getFieldDescription = (key: string): string => {
  const descriptions: Record<string, string> = {
    price: 'Target price for the trigger',
    condition: 'Condition to check against the target price',
    pair: 'Trading pair to monitor',
    volume: 'Target trading volume',
    timeframe: 'Time period for volume calculation',
    amount: 'Amount to trade',
    slippage: 'Maximum allowed slippage percentage',
    limitPrice: 'Target price for limit order',
    expiry: 'Time until order expires',
    stopPrice: 'Price at which to trigger stop loss',
    targetPrice: 'Target price for take profit',
    trailingPercent: 'Percentage to trail the market price',
    delay: 'Time to wait before executing next action',
    cancelOnNewTrigger: 'Whether to reset delay on new trigger',
    interval: 'Time between triggers',
    startTime: 'When to start triggering',
    endTime: 'When to stop triggering',
    daysOfWeek: 'Days on which to trigger',
    tradingPair: 'Pair to trade in DCA strategy',
    inputAmount: 'Amount to invest in each cycle',
    cycleFrequency: 'Time between DCA purchases',
    minOutAmount: 'Minimum output amount',
    maxOutAmount: 'Maximum output amount',
    startAt: 'When to start the DCA strategy',
  };
  return descriptions[key] || 'No description available';
};

export function BlockConfigPanel({ selectedBlock, onConfigChange }: BlockConfigPanelProps) {
  const [localConfig, setLocalConfig] = React.useState<Record<string, unknown>>(selectedBlock.config);
  const [inputValues, setInputValues] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    setLocalConfig(selectedBlock.config);
    const initialInputs: Record<string, string> = {};
    Object.entries(selectedBlock.config).forEach(([key, value]) => {
      if (typeof value === 'number') {
        initialInputs[key] = value.toString();
      }
    });
    setInputValues(initialInputs);
  }, [selectedBlock.id]);

  const handleConfigChange = (key: string, value: unknown) => {
    const newConfig = {
      ...localConfig,
      [key]: value
    };
    setLocalConfig(newConfig);
    onConfigChange(selectedBlock.id, newConfig);
  };

  const handleNumberInput = (key: string, value: string) => {
    setInputValues(prev => ({
      ...prev,
      [key]: value
    }));

    if (value === '') {
      handleConfigChange(key, 0);
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        handleConfigChange(key, numValue);
      }
    }
  };

  const renderPairSelector = () => {
    if (!selectedBlock.config.availablePairs) return null;

    const selectedPair = selectedBlock.config.pair as TokenPair;
    
    return (
      <div className="space-y-2">
        <Label htmlFor="pair" className="flex items-center gap-1 text-sm font-medium text-lightest">
          Trading Pair
          <InfoTooltip text={getFieldDescription('pair')}>
            <Info className="h-3 w-3 text-lighter/50" />
          </InfoTooltip>
        </Label>
        <Select
          value={selectedPair?.id || ''}
          onValueChange={(value) => {
            const pair = TOKEN_PAIRS.find(p => p.id === value);
            handleConfigChange('pair', pair);
          }}
        >
          <SelectTrigger className="w-full bg-darker border-accent/20 text-lightest">
            <SelectValue>
              {selectedPair ? (
                <div className="flex items-center gap-2">
                  <span>{selectedPair.name}</span>
                  <span className="text-xs text-lighter/70">
                    ({selectedPair.inputToken?.symbol} → {selectedPair.outputToken?.symbol})
                  </span>
                </div>
              ) : (
                'Select pair'
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {TOKEN_PAIRS.map((pair) => (
              <SelectItem 
                key={pair.id} 
                value={pair.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span>{pair.name}</span>
                  <span className="text-xs text-lighter/70">
                    ({pair.inputToken.symbol} → {pair.outputToken.symbol})
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };

  const renderField = (key: string, value: unknown) => {
    if (key === 'availablePairs') return null;

    if (key === 'pair' || key === 'tradingPair') {
      return renderPairSelector();
    }

    if (typeof value === 'number' && key !== 'startAt') {
      return (
        <div key={key} className="space-y-2">
          <Label 
            htmlFor={key}
            className="flex items-center gap-1 text-sm font-medium text-lightest"
          >
            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
            <InfoTooltip text={getFieldDescription(key)}>
              <Info className="h-3 w-3 text-lighter/50" />
            </InfoTooltip>
          </Label>
          <Input
            id={key}
            type="number"
            value={inputValues[key] ?? value.toString()}
            onChange={(e) => handleNumberInput(key, e.target.value)}
            onBlur={() => {
              if (inputValues[key] === '') {
                handleNumberInput(key, '0');
              }
            }}
            className="bg-darker border-accent/20 text-lightest placeholder:text-lighter/50"
            step={key.includes('Amount') ? '0.000001' : '1'}
            onClick={(e) => {
              e.stopPropagation();
              (e.target as HTMLInputElement).focus();
            }}
          />
        </div>
      );
    }

    if (typeof value === 'string') {
      if (key === 'condition') {
        return (
          <div key={key} className="space-y-2">
            <Label 
              htmlFor={key}
              className="flex items-center gap-1 text-sm font-medium text-lightest"
            >
              Condition
              <InfoTooltip text={getFieldDescription(key)}>
                <Info className="h-3 w-3 text-lighter/50" />
              </InfoTooltip>
            </Label>
            <Select
              value={value}
              onValueChange={(value) => handleConfigChange(key, value)}
            >
              <SelectTrigger className="w-full bg-darker border-accent/20 text-lightest">
                <SelectValue>{value}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="above">Above</SelectItem>
                <SelectItem value="below">Below</SelectItem>
                <SelectItem value="equals">Equals</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      }

      if (key === 'timeframe') {
        return (
          <div key={key} className="space-y-2">
            <Label 
              htmlFor={key}
              className="flex items-center gap-1 text-sm font-medium text-lightest"
            >
              Timeframe
              <InfoTooltip text={getFieldDescription(key)}>
                <Info className="h-3 w-3 text-lighter/50" />
              </InfoTooltip>
            </Label>
            <Select
              value={value}
              onValueChange={(value) => handleConfigChange(key, value)}
            >
              <SelectTrigger className="w-full bg-darker border-accent/20 text-lightest">
                <SelectValue>{value}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">1 minute</SelectItem>
                <SelectItem value="5m">5 minutes</SelectItem>
                <SelectItem value="15m">15 minutes</SelectItem>
                <SelectItem value="1h">1 hour</SelectItem>
                <SelectItem value="4h">4 hours</SelectItem>
                <SelectItem value="1d">1 day</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      }

      if (key === 'startAt') {
        const timestamp = typeof value === 'string' ? parseInt(value) : Date.now();
        const date = new Date(timestamp);
        console.log('value', value, timestamp)
        const handleDateChange = (newDate: Date | null) => {
          if (newDate) {
            console.log('newDate',  newDate ,  newDate.getTime().toString() )
            handleConfigChange(key, newDate.getTime().toString());
          } else {
            handleConfigChange(key, Date.now().toString());
          }
        };

        return (
          <div key={key} className="space-y-2">
            <Label 
              htmlFor={key}
              className="flex items-center gap-1 text-sm font-medium text-lightest"
            >
              Start Time
              <InfoTooltip text={getFieldDescription(key)}>
                <Info className="h-3 w-3 text-lighter/50" />
              </InfoTooltip>
            </Label>
            <div className="relative">
              <DatePicker
                selected={date}
                onChange={handleDateChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy 'at' h:mm aa"
                timeCaption="Time"
                showPopperArrow={false}
                placeholderText="Select date and time"
                isClearable
                monthsShown={1}
                minDate={new Date()}
                calendarStartDay={1}
                formatWeekDay={day => day.substring(0, 3)}
                fixedHeight
                className="w-full bg-darker border border-accent/20 rounded-md px-3 py-2 text-lightest placeholder:text-lighter/50"
                wrapperClassName="w-full"
              />
            </div>
          </div>
        );
      }

      return (
        <div key={key} className="space-y-2">
          <Label 
            htmlFor={key}
            className="flex items-center gap-1 text-sm font-medium text-lightest"
          >
            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
            <InfoTooltip text={getFieldDescription(key)}>
              <Info className="h-3 w-3 text-lighter/50" />
            </InfoTooltip>
          </Label>
          <Input
            id={key}
            type="text"
            value={value}
            onChange={(e) => handleConfigChange(key, e.target.value)}
            className="bg-darker border-accent/20 text-lightest placeholder:text-lighter/50"
          />
        </div>
      );
    }

    if (typeof value === 'boolean') {
      return (
        <div key={key} className="flex items-center space-x-2">
          <input
            type="checkbox"
            id={key}
            checked={value}
            onChange={(e) => handleConfigChange(key, e.target.checked)}
            className="form-checkbox bg-darker border-accent/20"
          />
          <Label 
            htmlFor={key}
            className="flex items-center gap-1 text-sm font-medium text-lightest"
          >
            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
            <InfoTooltip text={getFieldDescription(key)}>
              <Info className="h-3 w-3 text-lighter/50" />
            </InfoTooltip>
          </Label>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-4">
      {Object.entries(localConfig).map(([key, value]) => renderField(key, value))}
    </div>
  );
}