import Product from "./Product";
import Operation from "./Operation";

export default interface ProductData {
    product: Product;
    operations: Operation[];
}