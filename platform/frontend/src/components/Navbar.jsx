import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Button } from 'antd';
import { LogoutOutlined, MenuOutlined, CloseOutlined } from '@ant-design/icons';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav
      className="bg-gradient-to-l from-indigo-500 via-purple-500 to-pink-500 text-white px-4 py-3 shadow-lg sticky top-0 z-50"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Right: AIED logo */}
        

        {/* Center: Navigation Links (Desktop) */}
        <div className="hidden sm:flex gap-8 font-medium text-white text-base">
          <Link className="hover:underline" to="/videos">
            🎬 ویدیوها
          </Link>
          <Link className="hover:underline" to="/chat">
            🤖 چت با LLM
          </Link>
          <Link className="hover:underline" to="/PracticeList">
            🧠 تمرین‌ها
          </Link>
          <Link className="hover:underline" to="/quizzes">
            📝 آزمون‌ها
          </Link>
          <Link className="hover:underline" to="/about-us">
            🧭 درباره ما
          </Link>
        </div>

        {/* Left: User Info + Logout */}
        <div className="flex items-center gap-4">
          <span className="text-white font-semibold text-sm hidden sm:inline">
            👤 {`${user?.first_name ?? ''} ${user?.last_name ?? ''}`.trim()}
          </span>
          <Button
            onClick={handleLogout}
            size="middle"
            className="bg-red-500 text-white hover:bg-red-600 border-none font-bold px-4 py-1.5 rounded-md shadow-sm transition-all duration-200 hidden sm:inline-flex items-center gap-2"
          >
            <LogoutOutlined />
            <span>خروج</span>
          </Button>

          {/* Mobile menu toggle */}
          <div className="sm:hidden">
            <Button
              onClick={toggleMenu}
              icon={menuOpen ? <CloseOutlined /> : <MenuOutlined />}
              type="text"
              className="text-white text-xl"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden mt-4 rounded-lg p-5 backdrop-blur-md bg-white/20 text-white space-y-3 animate-fade-down shadow-lg">
          <div className="flex justify-between items-center border-b border-white/30 pb-2 mb-2">
            <span className="font-medium text-sm">👤 {`${user?.first_name ?? ''} ${user?.last_name ?? ''}`.trim()}</span>
            <Button
              onClick={handleLogout}
              size="small"
              className="bg-red-500 text-white hover:bg-red-600 border-none font-bold px-4 py-1.5 rounded-md shadow-sm transition-all duration-200 inline-flex items-center gap-2"
            >
              <LogoutOutlined />
              <span>خروج</span>
            </Button>
          </div>
          <Link className="block hover:text-yellow-200 transition" to="/videos">
            🎬 ویدیوها
          </Link>
          <Link className="block hover:text-yellow-200 transition" to="/chat">
            🤖 چت با LLM
          </Link>
          <Link className="block hover:text-yellow-200 transition" to="/PracticeList">
            🧠 تمرین‌ها
          </Link>
          <Link className="block hover:text-yellow-200 transition" to="/quizzes">
            📝 آزمون‌ها
          </Link>
	  <Link className="block hover:text-yellow-200 transition" to="/about-us">
            🧭 درباره ما
          </Link>
        </div>
      )}
    </nav>
  );
}
