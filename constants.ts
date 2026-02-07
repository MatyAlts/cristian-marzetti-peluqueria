import { NavItem, Service, TeamMember, Course } from './types';

export const CONTACT_INFO = {
  name: 'Cristian Marzetti',
  phone: '+5492612692207',
  address: 'Santiago Araujo 637, Mendoza, Argentina',
  hours: 'Lun-Vie 9-20hs, Sáb 9-18hs',
  mapUrl: 'https://maps.app.goo.gl/PbmJfDhcqRcasP95A',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3348.4!2d-68.8436!3d-32.8886!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x967e0914497da78b%3A0x7e4c0c1e0c1e0c1e!2sSantiago%20Araujo%20637%2C%20Mendoza!5e0!3m2!1ses-419!2sar!4v1620000000000!5m2!1ses-419!2sar',
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

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const TEAM: TeamMember[] = [
  { id: '1', name: 'Cristian Marzetti', role: 'Fundador & Master Stylist', image: '/images/equipo/cristian.jpg' },
];

export const COURSES: Course[] = [
  { id: '1', title: 'Peinados y Recogidos', duration: '3 Meses', description: 'Técnicas avanzadas para novias, 15 años y eventos sociales.', image: 'https://picsum.photos/600/400?random=30' },
  { id: '2', title: 'Colorimetría Avanzada', duration: '4 Meses', description: 'Domina las técnicas de color, decoloración y correcciones.', image: 'https://picsum.photos/600/400?random=31' },
  { id: '3', title: 'Corte Femenino', duration: '5 Meses', description: 'Técnicas de texturizado, capas y cortes de tendencia.', image: 'https://picsum.photos/600/400?random=32' },
];