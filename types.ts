export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  iconName: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
}

export interface Course {
  id: string;
  title: string;
  duration: string;
  description: string;
  image: string;
}

export interface NavItem {
  label: string;
  path: string;
}
