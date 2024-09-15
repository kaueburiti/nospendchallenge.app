import { Icon } from '../ui';
import { type LucideIcon } from 'lucide-react-native';

export function TabBarIcon({
  icon,
  color,
}: {
  icon: LucideIcon;
  color: string;
}) {
  return <Icon className={'28'} as={icon} color={color} />;
}
