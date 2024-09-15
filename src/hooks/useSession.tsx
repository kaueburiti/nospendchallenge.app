import { useContext } from 'react';
import { SessionContext } from '@/provider/SessionProvider';

/**
 * Hook to get the current session
 * @returns {SessionContext}
 */
export const useSession = () => useContext(SessionContext);
