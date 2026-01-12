import { NavItem, Product, Service, TeamMember, Course } from './types';

export const CONTACT_INFO = {
  name: 'Cristian Marzetti',
  phone: '+5492612692207',
  address: 'Santiago Araujo 637, Mendoza, Argentina',
  hours: 'Lun-Vie 9-20hs, Sáb 9-18hs',
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3348.978864708708!2d-68.8358!3d-32.9256!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzLCsDU1JzMyLjIiUyA2OMKwNTAnMDguOSJX!5e0!3m2!1ses!2sar!4v1620000000000!5m2!1ses!2sar",
};

export const NAV_ITEMS: NavItem[] = [
  { label: 'Inicio', path: '/' },
  { label: 'Nosotros', path: '/nosotros' },
  { label: 'Productos', path: '/productos' },
  { label: 'Academia', path: '/academia' },
  { label: 'Turnos', path: '/turnos' },
  { label: 'Contacto', path: '/contacto' },
];

export const SERVICES: Service[] = [
  { id: '1', name: 'Corte y Styling', description: 'Diseño de imagen personalizado', iconName: 'Scissors' },
  { id: '2', name: 'Coloración', description: 'Balayage, Babylights y Correcciones', iconName: 'Palette' },
  { id: '3', name: 'Tratamientos', description: 'Hidratación, Nutrición y Keratina', iconName: 'Sparkles' },
  { id: '4', name: 'Novias y Eventos', description: 'Peinados y preparación para bodas', iconName: 'Heart' }, // Changed icon concept locally, will use Heart or similar in render
  { id: '5', name: 'Servicio a Domicilio', description: 'La experiencia Marzetti en tu hogar', iconName: 'Home' },
];

export const PRODUCTS: Product[] = [
  { id: '1', name: 'Shampoo Profesional', price: '$8.500', category: 'Cuidado', image: 'https://picsum.photos/400/400?random=10' },
  { id: '2', name: 'Sérum Reparador', price: '$12.000', category: 'Nutrición', image: 'https://picsum.photos/400/400?random=11' },
  { id: '3', name: 'Aceite de Argan', price: '$12.000', category: 'Nutrición', image: 'https://picsum.photos/400/400?random=12' },
  { id: '4', name: 'Máscara Capilar', price: '$9.800', category: 'Hidratación', image: 'https://picsum.photos/400/400?random=13' },
  { id: '5', name: 'Spray Fijador', price: '$6.500', category: 'Styling', image: 'https://picsum.photos/400/400?random=14' },
];

export const TEAM: TeamMember[] = [
  { id: '1', name: 'Cristian Marzetti', role: 'Fundador & Master Stylist', image: 'https://picsum.photos/400/600?random=20' },
  { id: '2', name: 'Laura Gómez', role: 'Colorista Senior', image: 'https://picsum.photos/400/600?random=21' },
  { id: '3', name: 'Pablo Ruiz', role: 'Estilista Senior', image: 'https://picsum.photos/400/600?random=22' },
];

export const COURSES: Course[] = [
  { id: '1', title: 'Peinados y Recogidos', duration: '3 Meses', description: 'Técnicas avanzadas para novias, 15 años y eventos sociales.', image: 'https://picsum.photos/600/400?random=30' },
  { id: '2', title: 'Colorimetría Avanzada', duration: '4 Meses', description: 'Domina las técnicas de color, decoloración y correcciones.', image: 'https://picsum.photos/600/400?random=31' },
  { id: '3', title: 'Corte Femenino', duration: '5 Meses', description: 'Técnicas de texturizado, capas y cortes de tendencia.', image: 'https://picsum.photos/600/400?random=32' },
];