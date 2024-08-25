"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthService from '../services/AuthService';
import CookieService from '@/services/LocalStorangeService';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { ScrollShadow } from '@nextui-org/react';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const cookieService = CookieService.getInstance();
      const token: string | null = cookieService.getItem('token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      const authService = AuthService.getInstance();
      const isValid = await authService.isTokenValid(token);

      if (isValid) {
        router.push('/productos');
      } 
    };

    checkAuth().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <ScrollShadow
        offset={100}
        className={'p-4'}
        style={{
          height: '100vh',
          width: '100vw',
        }}
      >
      </ScrollShadow>
    </>
  );
}
