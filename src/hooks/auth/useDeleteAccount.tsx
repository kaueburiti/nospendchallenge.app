import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useSimpleToast } from '../useSimpleToast';
import { useSignOut } from "@/hooks/auth/useSignOut";
import { type FunctionsError } from '@supabase/supabase-js';

type DeleteAccountParams = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

type DeleteAccountResponse = {
  message: string;
};

const deleteAccount = async (): Promise<DeleteAccountResponse> => {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    console.error('Session Error:', sessionError);
    throw new Error('Failed to get session');
  }

  if (!session?.access_token) {
    console.error('No access token in session');
    throw new Error('No active session or missing access token');
  }

  const response =
      await supabase.functions.invoke<DeleteAccountResponse>('delete-account', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

  if (response.error) {
    console.error('Error invoking function:', response.error);
    throw response.error;
  }

  const { data } = response;

  if (!data) {
    throw new Error('No data returned from delete-account function');
  }

  return data;
};

export const useDeleteAccount = () => {
  const { showToast } = useSimpleToast();
  const { signOut } = useSignOut();

  const mutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: async () => {
      showToast('success', 'Account deleted successfully');
      await signOut({});
    },
    onError: (error: FunctionsError | Error) => {
      console.error('Delete account error:', error.message);
      showToast('error', 'Failed to delete account');
    },
  });

  const handleDeleteAccount = async ({ onSuccess, onError }: DeleteAccountParams) => {
    try {
      await mutation.mutateAsync();
      onSuccess?.();
    } catch (error) {
      onError?.(error as FunctionsError | Error);
    }
  };

  return {
    isLoading: mutation.isPending,
    deleteAccount: handleDeleteAccount,
  };
};