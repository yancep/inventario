'use client'
import { FaEdit, FaTrashAlt, FaEye, FaPlus } from 'react-icons/fa';
import Operation from "@/definitions/Operation";
import ProductData from "@/definitions/ProductData";
import { getAllInfo, deleteProduct } from "@/services/ProductService";
import ProductModal from "@/components/modals/AddProductModal";
import Product from "@/definitions/Product";
import { useState, useEffect, useCallback } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import Button from "@mui/material/Button";

export default function ProductView() {
    const [data, setData] = useState<ProductData[] | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [idPro, setIdPro] = useState<number | undefined>();

    const fetchData = async () => {
        const result = await getAllInfo();
        setData(result);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleView = async (id: number | undefined) => {
        console.log("result");
    };

    const handleDelete = async (id: number | undefined) => {
        if (id) {
            const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este producto?");
            if (confirmDelete) {
                try {
                    const result = await deleteProduct(id);
                    await fetchData();
                } catch (error) {
                    console.error("Error al eliminar el producto:", error);
                }
            }
        }
    };

    const handleCreateOrUpdate = async (value: Product | null) => {
        setIsOpen(false);
        setIdPro(undefined); 
        if (value) {
            await fetchData();
        }
    };

    const handleEdit = (id: number | undefined) => {
        setIdPro(id);
        setIsOpen(true);
    };

    const calculateQuantity = (operations: Operation[] = []) => {
        if (operations.length === 0) return 0;
        const lastOperation = operations[operations.length - 1];
        const quantityArray: number[] = JSON.parse(lastOperation.quantity_array);
        return quantityArray.reduce((acc: number, val: number) => acc + val, 0);
    };

    const renderCell = useCallback((item: ProductData, columnKey: React.Key) => {
        if (columnKey === "product") {
            return (
                <div className="flex flex-col">
                    <p className="font-bold text-lg capitalize text-center">{item.product?.name}</p>
                </div>
            );
        } else if (columnKey === "quantity") {
            return (
                <p className="text-center text-lg">{calculateQuantity(item.operations)}</p>
            );
        } else if (columnKey === "actions") {
            return (
                <div className="flex justify-center items-center gap-2">
                    {/*
                    <span className="text-lg text-gray-400 cursor-pointer hover:text-blue-500" onClick={() => handleView(item.product?.id)}>
                        <FaEye /> 
                    </span>*/}
                    <span className="text-lg text-gray-400 cursor-pointer hover:text-yellow-500" onClick={() => handleEdit(item.product?.id)}>
                        <FaEdit />
                    </span>
                    <span className="text-lg text-gray-400 cursor-pointer hover:text-red-500" onClick={() => handleDelete(item.product?.id)}>
                        <FaTrashAlt />
                    </span>
                </div>
            );
        } else {
            return null;
        }
    }, [handleView, handleDelete, handleEdit]);

    return (
        <div className="relative flex flex-col justify-center items-center h-screen overflow-hidden">
            <div className="w-full rounded-lg shadow-lg p-8 bg-opacity-75 h-full overflow-auto">
                <Table aria-label="Product Table" className="text-lg p-2 rounded-lg bg-gray-800 text-white">
                    <TableHeader>
                        <TableColumn key="product" align="start">Nombre</TableColumn>
                        <TableColumn key="quantity" align="start">Cantidad</TableColumn>
                        <TableColumn key="actions" align="center">Acción</TableColumn>
                    </TableHeader>
                    <TableBody items={data ?? []}>
                        {(item) => (
                            <TableRow key={item.product?.id} className="bg-gray-700 rounded-lg">
                                {(columnKey) => <TableCell className="p-2">{renderCell(item, columnKey)}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <ProductModal 
                isOpenModal={isOpen} 
                productId={idPro} 
                key={"modal"} 
                onCreateOrUpdate={handleCreateOrUpdate}
                onClose= {() => setIsOpen(false)}
            />
            <Button 
                color="primary" 
                onClick={() => {setIdPro(undefined); 
                                setIsOpen(true);}} 
                className="absolute top-0 right-0 m-4 p-2 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600"
            >
                <FaPlus />
            </Button>
        </div>
    );
}


