'use client';
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Select, SelectItem } from '@nextui-org/react';
import { showToast } from '@/components/Toast';
import { addOperation } from '@/services/OperationService';
import CustomTextInput from '../inputs/CustomTextInput';
import ProductData from '@/definitions/ProductData';
import Operation from '@/definitions/Operation';
import Product from '@/definitions/Product';

const validationSchema = Yup.object({
  is_sale: Yup.boolean().required('El tipo de operación es requerido'),
  
  quantity: Yup.number().required('La cantidad es requerida').positive('La cantidad debe ser positiva'),
  new_lote: Yup.boolean().required('Indique si es un nuevo lote'),

});

interface OperationModalProps {
  productId: Product;
  isOpenModal: boolean;
  onClose: () => void;
  products: ProductData[] | null;
  onCreateOrUpdate: () => void;
}

export interface OperationValues {
  is_sale: boolean;
  value?: number | null;
  quantity: number;
  new_lote?: boolean;
  select_lote?: number | null;
}

export default function OperationModal({ productId, isOpenModal, onClose, products, onCreateOrUpdate }: OperationModalProps) {
  const [initialValues, setInitialValues] = useState<OperationValues>({
    is_sale: false,
    value: null,
    quantity: 0,
    new_lote: false,
    select_lote: null,
  });

  useEffect(() => {
    if (products) {
      const productData = products.find(product => product.product.id === productId.id);
      if (productData && productData.operations && productData.operations.length > 0) {
        const lastOperation = productData.operations[productData.operations.length - 1];
        setInitialValues({
          is_sale: true,
          value: lastOperation.value,
          quantity: JSON.parse(lastOperation.quantity_array).slice(-1)[0],
          new_lote: false,
          select_lote: JSON.parse(lastOperation.values_array)[0],
        });
      }
    }
  }, [products]);

  const formik = useFormik<OperationValues>({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (productId.id) {

          let data : OperationValues = {
            is_sale: values.is_sale,
            quantity: Number(values.quantity),
            value: Number(values.value),
          }

          if(values.new_lote)
            data.new_lote = values.new_lote
          else
            data.select_lote = Number(values.select_lote)
          
          const response = await addOperation(productId.id, data);
          if (response) {
            showToast('Operación agregada con éxito', 'success');
            onCreateOrUpdate();
            onClose();
          }
        }
      } catch (error) {
        showToast('Se produjo un error al agregar la operación', 'error');
        console.error(error);
      }
    },
  });

  const productData = products?.find(product => product.product.id === productId.id);
  const valuesArray = (productData?.operations  && productData.operations[productData.operations.length - 1]?.values_array)? 
                        JSON.parse(productData.operations[productData.operations.length - 1]?.values_array) : [];

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
            <span className="text-lg font-bold">Agregar Operación</span>
          </ModalHeader>
          <form onSubmit={formik.handleSubmit}>
            <ModalBody className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <label className="font-semibold">Tipo de Operación:</label>
                <select
                  name="is_sale"
                  value={formik.values.is_sale ? "true" : "false"}
                  onChange={(e) => {formik.setFieldValue('is_sale', e.target.value === "true");
                    formik.setFieldValue('new_lote', false)
                  }}
                  onBlur={formik.handleBlur}
                  className="border rounded px-2 py-1"
                >
                  <option value="true">Venta</option>
                  <option value="false" >Compra</option>
                </select>
              </div>
              {!formik.values.is_sale && formik.values.new_lote && (
                <CustomTextInput
                  form={formik}
                  fieldKey="value"
                  label="Precio"
                  placeholder="Precio"
                  isRequired={true}
                  type="number"
                />
              )}
              <CustomTextInput
                form={formik}
                fieldKey="quantity"
                label="Cantidad"
                placeholder="Cantidad"
                isRequired={true}
                type="number"
              />
              {!formik.values.new_lote && (
                <div className="flex flex-col gap-2">
                  <label className="font-semibold">Seleccionar precio:</label>
                  <select
                    name="select_lote"
                    value={formik.values.select_lote?.toString() || ''}
                    onChange={(e) => formik.setFieldValue('select_lote', e.target.value)}
                    onBlur={formik.handleBlur}
                    className="border rounded px-2 py-1"
                  >
                    {valuesArray.map((value: number, index: number) => (
                      <option key={index} value={value.toString()}>{value}</option>
                    ))}
                  </select>
                </div>
              )}
              {!formik.values.is_sale && (
                <div className="flex items-center gap-2">
                  <label className="font-semibold">Nuevo Lote:</label>
                  <input
                    type="checkbox"
                    name="new_lote"
                    checked={formik.values.new_lote}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="border rounded px-2 py-1"
                  />
                </div>
              )}
            </ModalBody>
            <ModalFooter className="flex justify-end gap-2 bg-gray-100">
              <Button
                size="sm"
                color="primary"
                type="submit"
                disabled={!formik.isValid || !formik.touched}
              >
                Agregar
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}







 