import axios from 'axios';
import CookieService from './LocalStorangeService';
import { useRouter } from 'next/navigation';

class AuthService {
  private static instance: AuthService | null = null;
 
  private constructor() {
    if (AuthService.instance) {
      throw new Error('Use AuthService.getInstance() to get the instance.');
    }

    AuthService.instance = this;
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(username: string, password: string): Promise<boolean> {
    try {
      const response = await axios.post('http://127.0.0.1:8000/inventory/login', {
        username,
        password,
      });
      
      if(response.data["token"]){
        const { token } = response.data;
        const cookieService = CookieService.getInstance();
        cookieService.setItem('token', token);
        console.log('Login successful and tokens saved.');
        return true;
      }     
    } catch (error) {
      console.error('Error during login:', error);
    }
    return false;
  }

  async register(username: string, password: string): Promise<void> {
    try {
      const response = await axios.post('http://127.0.0.1:8000/inventory/register', {
        username,
        password,
      });

      const { token } = response.data;

      const cookieService = CookieService.getInstance();
      cookieService.setItem('token', token);

      console.log('Login successful and tokens saved.');
    } catch (error) {
      console.error('Error during login:', error);
    }
  }

  async isTokenValid(token: string): Promise<boolean> {
    try {
      const response = await axios.post('http://127.0.0.1:8000/inventory/verifytoken', { "token": token });
      return response.data.valid;
    } catch (error) {
      console.error('Error verifying token:', error);
      return false;
    }
  }
}

export default AuthService;

