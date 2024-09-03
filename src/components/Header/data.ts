import { HOME } from '../../routes';

interface NavItem {
  title: string;
  route: string;
}

export const navItems: NavItem[] = [
  {
    title: 'Home',
    route: HOME,
  },
];
