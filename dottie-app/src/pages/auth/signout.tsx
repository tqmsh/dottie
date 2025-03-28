import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

export default function SignOut() {
  const navigate = useNavigate();

  useEffect(() => {
    const performSignOut = async () => {
      try {
        // Call the sign-out endpoint
        await axios.post('/api/auth/signout');
        toast.success('You have been signed out successfully');
      } catch (error) {
        console.error('Error signing out:', error);
        toast.error('There was a problem signing you out');
      } finally {
        // Redirect to the sign-in page regardless of outcome
        navigate('/auth/signin', { replace: true });
      }
    };

    performSignOut();
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Signing out...</h1>
        <p className="text-gray-600">Please wait while we sign you out.</p>
      </div>
    </div>
  );
} 