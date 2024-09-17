import React, { createContext, useState } from 'react';
import { GluestackUIProvider } from '@/components/ui';

const defaultTheme: 'dark' | 'light' = 'light';

type ThemeContextType = {
    colorMode: 'dark' | 'light';
    isDark: boolean;
    toggleColorMode: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
    colorMode: defaultTheme,
    isDark: false,
    toggleColorMode: () => undefined,
});


export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [colorMode, setColorMode] = useState<'dark' | 'light'>(defaultTheme);

    const toggleColorMode = () => {
        setColorMode(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    const isDark = colorMode === 'dark';

    return (
        <ThemeContext.Provider value={{ colorMode, toggleColorMode, isDark }}>
            <GluestackUIProvider mode={colorMode}>
                {children}
            </GluestackUIProvider>
        </ThemeContext.Provider>
    );
};