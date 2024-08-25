export default interface Operation {
    id: number;
    values_array: string;
    is_sale: boolean;
    value: number;
    quantity: number;
    quantity_array: string;
    date: string;
    user: number;
    product_id: number;
}