export interface Product {
  id: string;
  name: string;
  price: string; // Formatted string
  category: string;
  image: string;
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