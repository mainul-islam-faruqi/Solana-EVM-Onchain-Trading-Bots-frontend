import React from 'react';
import { DeployedBot } from '../../models/deployed-bot';
import { ExecutionState } from '../../models/execution-state';

export function BotMonitor({ deployedBots }: { deployedBots: DeployedBot[] }) {
  const [botStates, setBotStates] = React.useState<Map<string, ExecutionState>>(new Map());
  
  // Update metrics periodically
  React.useEffect(() => {
    const interval = setInterval(() => {
      deployedBots.forEach(bot => {
        const metrics = bot.engine.getMetrics();
        // Update UI with latest metrics
        updateBotMetrics(bot.id, metrics);
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, [deployedBots]);

  // ... rest of the component
} 