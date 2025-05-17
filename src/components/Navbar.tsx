import Link from 'next/link';
import { useRouter } from 'next/router';

const Navbar = () => {
  const router = useRouter();

  return (
    <nav className="p-4 bg-gray-800 text-white" aria-label="Navegación principal">
      <ul className="flex gap-4">
        <li>
          <Link href="/dashboard">
            <a
              className={`${
                router.pathname === '/dashboard' ? 'text-blue-500' : 'text-white'
              }`}
              aria-current={router.pathname === '/dashboard' ? 'page' : undefined}
            >
              Dashboard
            </a>
          </Link>
        </li>
        <li>
          <Link href="/analisis">
            <a
              className={`${
                router.pathname === '/analisis' ? 'text-blue-500' : 'text-white'
              }`}
              aria-current={router.pathname === '/analisis' ? 'page' : undefined}
            >
              Análisis
            </a>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

