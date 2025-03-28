import AccountLayout from '../../components/user/account-layout';
import PasswordForm from '../../components/user/password-form';

export default function PasswordPage() {
  // In production, this would come from auth context
  const userId = 'test-user-123';

  return (
    <AccountLayout
      title="Change Password"
      description="Update your password to keep your account secure."
    >
      <div className="max-w-md">
        <PasswordForm userId={userId} />
        
        <div className="mt-8 p-4 bg-gray-50 rounded-md border border-gray-200">
          <h3 className="text-sm font-medium text-gray-700">Password Tips</h3>
          <ul className="mt-2 text-xs text-gray-600 space-y-1">
            <li>• Use at least 8 characters</li>
            <li>• Include uppercase and lowercase letters</li>
            <li>• Include numbers and special characters</li>
            <li>• Don't reuse passwords from other sites</li>
          </ul>
        </div>
      </div>
    </AccountLayout>
  );
} 