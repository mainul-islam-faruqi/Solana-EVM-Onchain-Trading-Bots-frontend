"use client";

import { StrategyTemplates } from "@/components/bot-builder/templates/strategy-templates";
import { useRouter } from "next/navigation";
import { StrategyTemplate } from "@/types/templates";
import { BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function StrategiesPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSelectTemplate = (template: StrategyTemplate) => {
    try {
      // Navigate to bot builder with template ID
      router.push(`/bot-builder?template=${template.id}`);
      
      toast({
        title: "Template Selected",
        description: "Loading template in bot builder...",
        variant: "success",
      });
    } catch (error) {
      console.error('Failed to select template:', error);
      toast({
        title: "Error",
        description: "Failed to load template. Please try again.",
        variant: "error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-darkest to-dark">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
              <BookOpen className="h-6 w-6 text-light" />
            </div>
            <h1 className="text-2xl font-bold text-lightest">Strategy Library</h1>
          </div>
          <p className="text-lighter/70 max-w-2xl">
            Browse our collection of pre-built trading strategies or create your own. 
            Each strategy is fully customizable and can be deployed across multiple chains.
          </p>
        </div>

        {/* Strategy Templates Section */}
        <div className="space-y-6 bg-darker/30 border border-accent/10 rounded-xl p-6 backdrop-blur-sm">
          <StrategyTemplates onSelectTemplate={handleSelectTemplate} />
        </div>
      </div>
    </div>
  );
} 