import { useColorScheme as useNativeColorScheme } from 'react-native';

type ColorScheme = 'light' | 'dark';

/**
 * Hook to get the current color scheme (light or dark)
 * @returns The current color scheme
 */
export function useColorScheme(): ColorScheme {
  const colorScheme = useNativeColorScheme();
  return colorScheme === 'dark' ? 'dark' : 'light';
}
