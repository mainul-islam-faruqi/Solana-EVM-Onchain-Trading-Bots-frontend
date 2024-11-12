"use client";

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Bot, TrendingUp } from 'lucide-react';
import { StrategyTemplate, TemplateFilters } from '@/types/templates';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { TemplateService } from '@/lib/services/template-service';
import { TemplateCard } from './template-card'; // Import the TemplateCard component

interface StrategyTemplatesProps {
  onSelectTemplate: (template: StrategyTemplate) => void;
}

export function StrategyTemplates({ onSelectTemplate }: StrategyTemplatesProps) {
  const [filters, setFilters] = React.useState<TemplateFilters>({});
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [templates, setTemplates] = React.useState<StrategyTemplate[]>([]);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();
  const templateService = React.useMemo(() => new TemplateService(), []);

  // Fetch templates on mount and when filters change
  React.useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const fetchedTemplates = await templateService.getTemplates(filters);
        setTemplates(fetchedTemplates);
      } catch (error) {
        console.error('Failed to fetch templates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [filters, templateService]);

  const categories = [
    { id: 'grid', name: 'Grid Trading', icon: TrendingUp },
    { id: 'dca', name: 'DCA', icon: Bot },
    // Add more categories
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // Update filters based on category
    setFilters(prev => ({
      ...prev,
      category: categoryId === selectedCategory ? undefined : categoryId as any
    }));
  };

  const handleTemplateSelect = async (template: StrategyTemplate) => {
    try {
      // Navigate to bot builder with template
      onSelectTemplate(template);
    } catch (error) {
      console.error('Failed to load template:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 bg-white/5 border-gray-800"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            className={cn(
              "h-auto py-4 flex flex-col items-center gap-2",
              "text-light border-accent/20 transition-all duration-200",
              selectedCategory === category.id
                ? "bg-violet-500 text-white hover:bg-violet-600"
                : "hover:bg-violet-500/10"
            )}
            onClick={() => handleCategorySelect(category.id)}
          >
            <category.icon className="h-6 w-6" />
            <span>{category.name}</span>
          </Button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Add loading skeleton here
          <div>Loading...</div>
        ) : templates.length === 0 ? (
          // Empty state
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No templates found</p>
          </div>
        ) : (
          templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onSelect={() => handleTemplateSelect(template)}
            />
          ))
        )}
      </div>
    </div>
  );
} 