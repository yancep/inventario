'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MdMenu, MdClose, MdLogout } from 'react-icons/md';
import { FaUserCircle, FaBox, FaCog, FaPrint } from 'react-icons/fa';
import CookieService from '../services/LocalStorangeService';
import { generateReport } from '../services/OperationService'; 

const links = [
  { name: 'Productos', href: '/productos', icon: <FaBox className="text-white text-xl" /> },
  { name: 'Operaciones', href: '/operations', icon: <FaCog className="text-white text-xl" /> },
];

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = () => {
    const cookieService = CookieService.getInstance();
    cookieService.deleteAll();
    window.location.href = '/login';
  };

  const handlePrint = async () => {
    try {
      await generateReport();
    } catch (error) {
      console.error('Error al imprimir el reporte:', error);
    }
  };

  return (
    <div className="relative flex h-screen overflow-hidden">
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-gray-700 via-gray-900 to-black">
        <div className="absolute inset-0 bg-cover bg-center filter blur-lg opacity-50 animate-pulse"></div>
      </div>
      <button
        className={`fixed top-3 left-3 z-50 text-3xl bg-gray-800 text-white p-2 rounded-md cursor-pointer transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <MdClose /> : <MdMenu />}
      </button>

      <div className={`fixed top-0 left-0 w-64 h-full bg-gray-900 shadow-lg transform transition-transform duration-300 z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <nav className="p-4 mt-12">
          <ul className="list-none">
            {links.map((link) => (
              <li key={link.href} className="my-4 flex items-center">
                {link.icon}
                <Link href={link.href} className="ml-3 text-lg font-semibold text-gray-300 hover:text-white hover:bg-gray-700 p-2 rounded-md transition-colors duration-300 w-full">
                  {link.name}
                </Link>
              </li>
            ))}
            <li className="my-4 flex items-center">
              <FaUserCircle className="text-white text-xl" />
              <Link href="/login" className="ml-3 text-lg font-semibold text-gray-300 hover:text-white hover:bg-gray-700 p-2 rounded-md transition-colors duration-300 w-full">
                Login
              </Link>
            </li>
            <li className="my-4 flex items-center cursor-pointer" onClick={handlePrint}>
              <FaPrint className="text-white text-xl" />
              <span className="ml-3 text-lg font-semibold text-gray-300 hover:text-white hover:bg-gray-700 p-2 rounded-md transition-colors duration-300 w-full">
                Imprimir Reporte
              </span>
            </li>
          </ul>
        </nav>
        <button
          className="absolute bottom-4 left-4 text-2xl bg-red-700 text-white hover:bg-red-600 rounded-full p-2 transition-colors duration-300"
          onClick={handleLogout}
        >
          <MdLogout />
        </button>
      </div>
      <div className={`flex-1 transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-0'} p-4 relative z-10`}>
        {children}
      </div>
    </div>
  );
};

export default Sidebar;



