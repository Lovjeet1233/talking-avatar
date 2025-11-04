'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { href: '/dashboard', label: 'New Session' },
    { href: '/dashboard/chats', label: 'My Sessions' },
    { href: '/dashboard/knowledge-bases', label: 'Knowledge Base' },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col shadow-2xl">
      {/* Logo */}
      <div className="p-8 flex items-center justify-center">
        <img 
          src="/image.png" 
          alt="AI Avatar Studio" 
          className="h-24 w-auto object-contain"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block px-6 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
                      : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                  }`}
                >
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full px-6 py-3 text-gray-300 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all font-medium"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

