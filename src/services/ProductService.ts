import axios from 'axios';
import CookieService from './LocalStorangeService';
import ProductData from '@/definitions/ProductData';
import Product from '@/definitions/Product';

class ProductService {
  private static instance: ProductService | null = null;
 
  private constructor() {
    if (ProductService.instance) {
      throw new Error('Use AuthService.getInstance() to get the instance.');
    }

    ProductService.instance = this;
  }

  static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }
    
}

function getToken(){
  const service = CookieService.getInstance();
  return service.getItem('token');
}

export async function deleteProduct(product_id: number): Promise<Product | null> {
    try {
        const token = getToken();
        if (token) {
            const response = await axios.delete(`http://127.0.0.1:8000/inventory/productdelete/${product_id}/`, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            return response.data;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error durante la petición:', error);
        return null;
    }
  }
  


export async function editProduct(product_id: number, values: any): Promise<Product | null> {
  try {
      const token = getToken()
      if (token) {
        const response = await axios.post(`http://127.0.0.1:8000/inventory/updateproduct`, {
            name: values,
            id: product_id
        }, {
            headers: {
                Authorization: `Token ${token}`,
            }
        });
        return response.data;
    } else {
        return null;
    }
  } catch (error) {
      console.error('Error durante la petición:', error);
      return null;
  }
}

export async function createProduct(values: string): Promise<Product | null> {
    try {
        const token = getToken();
        if (token) {
            const response = await axios.post('http://127.0.0.1:8000/inventory/products', {
                name: values,
            }, {
                headers: {
                    Authorization: `Token ${token}`,
                }
            });
            return response.data;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error durante la petición:', error);
        return null;
    }
  }
  

export async function getProductById(product_id: number): Promise<Product | null> {
  try {
      const service = CookieService.getInstance();
      const token = service.getItem('token');
      if (token) {
          const response = await axios.post(`http://127.0.0.1:8000/inventory/updateproduct/${product_id}/`, {
                headers: {
                    Authorization: `Token ${token}`,
                }
            });
            return response.data;
        } else {
            return null;
        }
  } catch (error) {
      console.error('Error durante la petición:', error);
      return null;
  }
}

export async function getAllInfo(): Promise<ProductData[] | null> {
  try {
      const service = CookieService.getInstance();
      const token = service.getItem('token');
      if (token) {
          const response = await axios.get('http://127.0.0.1:8000/inventory/getallinfo', {
              headers: {
                  Authorization: `Token ${token}`,
              },
          });
          return response.data;
      } else {
          return null;
      }
  } catch (error) {
      console.error('Error durante la petición:', error);
      return null;
  }
}

export default ProductService;

