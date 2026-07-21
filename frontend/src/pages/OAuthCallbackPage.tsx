// frontend/src/pages/OAuthCallbackPage.tsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store';
import { toast } from 'react-hot-toast';

const OAuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setToken, fetchUser } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get('token');
    
    const handleAuth = async () => {
      if (token) {
        setToken(token);
        try {
          await fetchUser();
          toast.success('Successfully logged in!');
          navigate('/');
        } catch (error) {
          toast.error('Failed to complete login');
          navigate('/login');
        }
      } else {
        toast.error('Authentication failed');
        navigate('/login');
      }
    };

    handleAuth();
  }, [searchParams, navigate, setToken, fetchUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        <p className="text-text-secondary">Completing sign in...</p>
      </div>
    </div>
  );
};

export default OAuthCallbackPage;
