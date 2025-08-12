export interface Component {
  id: string;
  type: ComponentType;
  props: Record<string, any>;
  children?: Component[];
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  components: Component[];
  seoData: {
    title: string;
    description: string;
    keywords: string[];
  };
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

export type ComponentType = 
  | 'hero'
  | 'text'
  | 'image'
  | 'button'
  | 'gallery'
  | 'form'
  | 'spacer'
  | 'columns';

export interface ComponentDefinition {
  type: ComponentType;
  name: string;
  icon: string;
  defaultProps: Record<string, any>;
  editableProps: Array<{
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'number' | 'color' | 'select' | 'boolean';
    options?: string[];
  }>;
}