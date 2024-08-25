'use client';
import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip, Button } from "@nextui-org/react";
import { FaEdit, FaTrashAlt, FaEye, FaPlus, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Operation from "@/definitions/Operation";
import ProductData from "@/definitions/ProductData";
import { getAllInfo } from "@/services/ProductService";
import OperationModal from "@/components/modals/AddOperationModal";
import Product from "@/definitions/Product";
import { deleteOperation } from "@/services/OperationService";

export default function OperationsView() {
    const [data, setData] = useState<ProductData[] | null>(null);
    const [currentProductIndex, setCurrentProductIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [idPro, setIdPro] = useState<number| undefined>(0);

    const fetchData = async () => {
        const result = await getAllInfo();
        setData(result);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateOrUpdate = async () => {
        setIsOpen(false);
        await fetchData()
    };

    const handleDelete = async (id: number | undefined) => {
        if (id) {
            const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta operación?");
            if (confirmDelete) {
                try {
                    const result = await deleteOperation(id);
                    await fetchData();
                } catch (error) {
                    console.error("Error al eliminar el producto:", error);
                }
            }
        }
    };


    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const formatValuesArray = (valuesArray: string): string => {
        const values = JSON.parse(valuesArray);
        return values.join(', ');
    };

    const calculateTotalCost = (quantityArray: number[], valuesArray: number[]): number => {
        return quantityArray.reduce((acc, quantity, index) => acc + quantity * valuesArray[index], 0);
    };

    const renderCell = React.useCallback((item: Operation, columnKey: React.Key) => {
        if (columnKey === "date") {
            return (
                <p className="text-center text-lg">{formatDate(item.date)}</p>
            );
        } else if (columnKey === "values") {
            return (
                <p className="text-center text-lg">{formatValuesArray(item.values_array)}</p>
            );
        } else if (columnKey === "is_sale") {
            return (
                <p className="text-center text-lg">{item.is_sale ? 'Venta' : 'Compra'}</p>
            );
        } else if (columnKey === "quantity") {
            return (
                <p className="text-center text-lg">{item.quantity}</p>
            );
        } else if (columnKey === "coste") {
            return (
                <p className="text-center text-lg">{item.quantity * item.value}</p>
            );
        } else if (columnKey === "inventario") {
            return (
                <p className="text-center text-lg">{formatValuesArray(item.quantity_array)}</p>
            );
        } else if (columnKey === "total_cost") {
            const quantityArray: number[] = JSON.parse(item.quantity_array);
            const valuesArray: number[] = JSON.parse(item.values_array);
            return (
                <p className="text-center text-lg">{calculateTotalCost(quantityArray, valuesArray)}</p>
            );
        } else if (columnKey === "actions") {
            return (
                <div className="flex justify-center items-center gap-2">
                    <span className="text-lg text-gray-400 cursor-pointer hover:text-red-500" onClick={() => handleDelete(item?.id)}>
                        <FaTrashAlt />
                    </span>
                </div>
            );
        } else {
            return null;
        }
    }, []);

    const handleNextProduct = () => {
        setCurrentProductIndex((prevIndex) => (data && prevIndex < data.length - 1 ? prevIndex + 1 : 0));
    };

    const handlePreviousProduct = () => {
        setCurrentProductIndex((prevIndex) => (data && prevIndex > 0 ? prevIndex - 1 : (data ? data.length - 1 : 0)));
    };

    const currentProduct = data ? data[currentProductIndex] : null;

    return (
        <div className="relative flex flex-col justify-center items-center h-screen overflow-hidden">  
            <div className="w-full rounded-lg shadow-lg p-8 bg-opacity-75 h-full overflow-auto">
                {currentProduct && (
                    <>
                        <h2 className="text-2xl font-bold text-center mb-4 text-white">{currentProduct.product?.name}</h2>
                        <Table aria-label="Operations Table" className="text-lg p-2 rounded-lg bg-gray-800 text-white">
                            <TableHeader>
                                <TableColumn key="date" align="start">Fecha</TableColumn>
                                <TableColumn key="values" align="start">Costes por unidad</TableColumn>
                                <TableColumn key="is_sale" align="start">Tipo</TableColumn>
                                <TableColumn key="quantity" align="start">Cantidad</TableColumn>
                                <TableColumn key="coste" align="start">Coste</TableColumn>
                                <TableColumn key="inventario" align="start">Saldo</TableColumn>
                                <TableColumn key="total_cost" align="start">Coste Total</TableColumn>
                                <TableColumn key="actions" align="center">Acción</TableColumn>
                            </TableHeader>
                            <TableBody items={currentProduct.operations ?? []}>
                                {(item) => (
                                    <TableRow key={item.id} className="bg-gray-700 rounded-lg">
                                        {(columnKey) => <TableCell className="p-2">{renderCell(item, columnKey)}</TableCell>}
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        <div className="flex justify-between mt-4">
                            <Button className="text-white" onPress={handlePreviousProduct}>
                                <FaArrowLeft />
                            </Button>
                            <Button className="text-white" onPress={handleNextProduct}>
                                <FaArrowRight />
                            </Button>
                        </div>
                    </>      
                )}
                <Button 
                    color="primary" 
                    onClick={() => {setIdPro(43); 
                        setIsOpen(true);}} 
                    className="absolute top-4 right-4 p-2 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600"
                >
                    <FaPlus size={16} />
                </Button>
            </div> 
            { (data && isOpen && data[currentProductIndex].product) ?
            <OperationModal
                isOpenModal={isOpen} 
                productId={data[currentProductIndex].product}
                onCreateOrUpdate={handleCreateOrUpdate}
                products= {data}
                onClose= {() => setIsOpen(false)}
            ></OperationModal>: <></>}
        </div>
    );
}

