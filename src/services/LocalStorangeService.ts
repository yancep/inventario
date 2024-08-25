import {deleteCookie, getCookie, setCookie} from 'cookies-next';

class CookieService {
  private static instance: CookieService | null = null;

  private constructor() {
    if (CookieService.instance) {
      throw new Error('Use CookieService.getInstance() to get the instance.');
    }

    CookieService.instance = this;
  }

  static getInstance(): CookieService {
    if (!CookieService.instance) {
      CookieService.instance = new CookieService();
    }
    return CookieService.instance;
  }

  setItem<T>(key: string, value: T): void {
    try {
      setCookie(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error while setting item in cookies:', error);
    }
  }

  getItem<T>(key: string): T | null {
    try {
      const cookieValue = getCookie(key);
      return cookieValue ? JSON.parse(cookieValue) : null;
    } catch (error) {
      console.error('Error while getting item from cookies:', error);
      return null;
    }
  }

  deleteAll(): void {
    deleteCookie('token');
    deleteCookie('refreshToken');
  }

  removeItem(item: string) {
      deleteCookie(item);
  }
}

export default CookieService;