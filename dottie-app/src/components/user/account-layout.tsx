import { ReactNode } from 'react';
import AccountSidebar from './account-sidebar';

interface AccountLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export default function AccountLayout({
  children,
  title,
  description,
}: AccountLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        {description && (
          <p className="mt-2 text-sm text-gray-600">{description}</p>
        )}
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        <AccountSidebar />
        
        <main className="flex-1 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
} 