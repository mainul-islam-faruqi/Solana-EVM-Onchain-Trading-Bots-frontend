import { StrategyTemplate, TemplateFilters } from '@/types/templates';
import { gridTradingTemplate } from '../templates/grid-trading';

export class TemplateService {
  private templates: StrategyTemplate[] = [
    gridTradingTemplate,
    // Add more templates here
  ];

  async getTemplates(filters?: TemplateFilters): Promise<StrategyTemplate[]> {
    let filteredTemplates = [...this.templates];

    if (filters) {
      if (filters.category) {
        filteredTemplates = filteredTemplates.filter(t => t.category === filters.category);
      }
      if (filters.difficulty) {
        filteredTemplates = filteredTemplates.filter(t => t.difficulty === filters.difficulty);
      }
      if (filters.chain) {
        filteredTemplates = filteredTemplates.filter(t => t.chainSupport.includes(filters.chain!));
      }
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filteredTemplates = filteredTemplates.filter(t => 
          t.name.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
      if (filters.tags?.length) {
        filteredTemplates = filteredTemplates.filter(t => 
          filters.tags!.some(tag => t.tags.includes(tag))
        );
      }
    }

    return filteredTemplates;
  }

  async saveTemplate(template: StrategyTemplate): Promise<void> {
    // In a real app, this would save to your backend
    this.templates.push(template);
  }

  async getTemplateById(id: string): Promise<StrategyTemplate | null> {
    const template = this.templates.find(t => t.id === id);
    if (!template) {
      throw new Error(`Template with id ${id} not found`);
    }
    return template;
  }
} 