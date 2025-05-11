import { Redirect } from 'expo-router';
import { useSession } from '@/provider/SessionProvider';

function Index() {
  const { session } = useSession();

  if (session) {
    return <Redirect href="/(protected)/onboard" />;
  }

  return <Redirect href="/(public)/welcome" />;
}

export default Index;
