import axios from 'axios';
import CookieService from './LocalStorangeService';
import ProductData from '@/definitions/ProductData';
import Product from '@/definitions/Product';
import { OperationValues } from '@/components/modals/AddOperationModal';

export async function generateReport() {
    try {
        const token = getToken();
        if (token) {
            const response = await axios.get('http://127.0.0.1:8000/inventory/generate_report/', {
                headers: {
                    Authorization: `Token ${token}`,
                },
                responseType: 'blob', // Esto es importante para manejar archivos binarios
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'report.pdf');
            document.body.appendChild(link);
            link.click();
        } else {
            console.error('No se encontró el token');
        }
    } catch (error) {
        console.error('Error al generar el reporte:', error);
    }
}


function getToken(){
    const service = CookieService.getInstance();
    return service.getItem('token');
}

export async function addOperation(product_id: number
    ,values: OperationValues): Promise<Product | null> {
    try {
        const token = getToken();
        
        if (token) {
            const response = await axios.post(`http://127.0.0.1:8000/inventory/operations/${product_id}/`, values, {
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

  export async function deleteOperation(operation_id: number): Promise<Product | null> {
    try {
        const token = getToken();
        if (token) {
            const response = await axios.delete(`http://127.0.0.1:8000/inventory/operationsdelete/${operation_id}/`, {
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