import { useState, useEffect } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setNav(false);
  }, [location]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle mobile menu
  const toggleNav = () => setNav(!nav);

  // Navigation items
  const navItems = [
    { id: 1, text: 'Welcome', link: '/' },
    { id: 2, text: 'Blog', link: '/blog' },
    { id: 3, text: 'Services', link: '/services' },
    { id: 4, text: 'About', link: '/about' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-blue-900 shadow-xl' : 'bg-blue-900/75 backdrop-blur-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold text-[#00df9a]">WPMS.</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.link}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.link
                      ? 'bg-[#00df9a] text-black'
                      : 'text-white hover:bg-[#00df9a]/80 hover:text-black'
                  }`}
                >
                  {item.text}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleNav}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-[#00df9a] focus:outline-none"
              aria-expanded={nav}
            >
              <span className="sr-only">Open main menu</span>
              {nav ? (
                <AiOutlineClose className="block h-6 w-6" />
              ) : (
                <AiOutlineMenu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden fixed inset-y-0 left-0 w-64 bg-blue-900 shadow-lg transform ${
          nav ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="px-4 pt-5 pb-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-[#00df9a]">
              WPMS.
            </Link>
            <button
              onClick={toggleNav}
              className="rounded-md text-white hover:text-[#00df9a] focus:outline-none"
            >
              <AiOutlineClose className="h-6 w-6" />
            </button>
          </div>
        </div>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-black/75 min-h-screen">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === item.link
                  ? 'bg-[#00df9a] text-black'
                  : 'text-white hover:bg-[#00df9a]/80 hover:text-black'
              }`}
              onClick={toggleNav}
            >
              {item.text}
            </Link>
          ))}
        </div>
      </div>

      {/* Overlay */}
      {nav && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleNav}
        />
      )}
    </nav>
  );
};

export default Navbar;