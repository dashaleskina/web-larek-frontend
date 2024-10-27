import { Model } from '../base/Model';
import { IProduct } from '../../types/index'; 

export class ProductsData extends Model<IProduct[]> {
    productsList: IProduct[] = []; 

    loadProducts(products: IProduct[]) {
        this.productsList = this.productsList.concat(products);
        this.emitChanges('products:update', {productsList: this.productsList})
    }
}