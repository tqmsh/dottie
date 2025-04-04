import { Link, useLocation } from "react-router-dom"; // Vite not nextjs
import { Wrench } from "lucide-react"; // Or use emoji directly

export default function UITestPageSwitch() {
  const location = useLocation();
  const isTestPage = location.pathname === '/test-page';

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Link
        to={isTestPage ? "/" : "/test-page"}
        className="flex items-center gap-2 bg-gray-800/90 hover:bg-gray-900 text-white px-4 py-2 rounded-full shadow-lg transition-all"
      >
        {isTestPage ? (
          <>
            <span>🎨</span>
            <span className="hidden sm:inline font-bold">Back to UI</span>
          </>
        ) : (
          <>
            <Wrench className="h-4 w-4" />
            <span className="hidden sm:inline font-bold">Developer Mode</span>
          </>
        )}
      </Link>
    </div>
  );
}