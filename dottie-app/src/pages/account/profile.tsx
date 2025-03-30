import { useAuth } from '@/context/AuthContext';
import AccountLayout from '../../pages/user/account-layout';
import AccountForm from '../../pages/user/account-form';

export default function ProfilePage() {
  const { user, isLoading, error } = useAuth();

  if (isLoading) {
    return (
      <AccountLayout title="Account">
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </AccountLayout>
    );
  }

  if (error) {
    return (
      <AccountLayout title="Account">
        <div className="p-4 border border-red-200 bg-red-50 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout
      title="Profile Settings"
      description="Manage your account details and preferences."
    >
      {user && <AccountForm user={user} />}
    </AccountLayout>
  );
}
