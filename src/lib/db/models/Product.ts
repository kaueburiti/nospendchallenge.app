import { type BaseEntity } from './BaseEntity';

export enum Category {
  Development = 'Development',
  Productivity = 'Productivity',
  ArtificialIntelligence = 'Artificial Intelligence',
  SEO = 'SEO',
  Design = 'Design',
  Communication = 'Communication',
  Others = 'Others',
}

export interface Product extends BaseEntity {
  name: string;
  src: string;
  description: string;
  href: string;
  featured: boolean;
  categories: Category[];
}
