
import { type LucideIcon } from 'lucide-react-native';
import {Icon} from "@/components/ui/icon";

export function TabBarIcon({
  icon,
  color,
}: {
  icon: LucideIcon;
  color: string;
}) {
  return <Icon className={'28'} as={icon} color={color} />;
}
