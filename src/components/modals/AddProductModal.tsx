'use client';
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@nextui-org/react';
import { showToast } from '@/components/Toast';
import Product from '@/definitions/Product';
import { editProduct, createProduct, getProductById , deleteProduct} from '@/services/ProductService';
import CustomTextInput from '../inputs/CustomTextInput';


const validationSchema = Yup.object({
  name: Yup.string().required('El nombre es requerido'),
});

interface ProductModalProps {
    productId?: number;
    onCreateOrUpdate: (value: Product) => void;
    isOpenModal: boolean;
    onClose: () => void; 
  }

export default function ProductModal({ productId, onCreateOrUpdate, isOpenModal, onClose }: ProductModalProps) {
  const [initialValues, setInitialValues] = useState<Product>({
    name: ''
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        let response = null;
        if (productId) {
          response = await editProduct(productId, values.name);
        } else {
          response = await createProduct(values.name);
        }
    
        if (response) {
        showToast(`Producto ${(productId!= undefined) ? 'actualizado' : 'creado'} con éxito`, 'success');
        onCreateOrUpdate(response);
        onClose();
        }
      } catch (error) {
        showToast('Se produjo un error en el registro', 'error');
        console.error(error);
      }
    }
  });

  return (
    <> 
      <Modal
        isOpen={isOpenModal}
        placement="center"
        className="flex"
        onClose={onClose}
      >
        <ModalContent className="bg-gray-100 py-4 px-6 rounded-lg w-auto max-w-md shadow-lg">
          <ModalHeader className="flex flex-col gap-2">
            <span className="text-lg font-bold">{productId ? 'Editar Producto' : 'Crear Producto'}</span>
          </ModalHeader>
          <form onSubmit={formik.handleSubmit}>
            <ModalBody className="flex flex-col gap-4">
              <CustomTextInput
                    form={formik}
                    fieldKey={'name'}
                    label={'Nombre del producto'}
                    placeholder={'Nombre'}
                    isRequired={true}
                />
            </ModalBody>
            <ModalFooter className="flex justify-end gap-2 bg-gray-100">		
              <Button
                size="sm"
                color="primary"
                type="submit"
                disabled={!formik.isValid || !formik.touched}
                isDisabled={!formik.isValid || !formik.touched}
              >
                {(productId!= undefined) ? 'Actualizar' : 'Registrar'}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
