import { useState, useEffect } from 'react';
import axios from 'axios';
import AccountLayout from '../../components/user/account-layout';
import AccountForm from '../../components/user/account-form';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // For testing, we'll use a mock user ID
      // In production, this would come from auth context
      const userId = 'test-user-123';
      
      const response = await axios.get(`/api/user/${userId}`);
      setUser(response.data);
    } catch (err) {
      console.error('Error fetching user:', err);
      setError('Failed to load user profile');
      
      // For demo/development, create a mock user
      setUser({
        id: 'test-user-123',
        username: 'testuser',
        email: 'test@example.com',
        name: 'Test User'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (isLoading && !user) {
    return (
      <AccountLayout title="Account">
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </AccountLayout>
    );
  }

  if (error && !user) {
    return (
      <AccountLayout title="Account">
        <div className="p-4 border border-red-200 bg-red-50 rounded-md">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchUser}
            className="mt-2 text-sm text-red-600 underline"
          >
            Try again
          </button>
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout
      title="Profile Settings"
      description="Manage your account details and preferences."
    >
      {user && <AccountForm user={user} onUpdate={fetchUser} />}
    </AccountLayout>
  );
} 