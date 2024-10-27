import { Model } from '../base/Model';
import { IProduct } from '../../types/index';

export class BasketData extends Model<IProduct> {
	productsList: IProduct[] = [];
	total: number | null;

	addProduct(product: IProduct) {
		this.productsList = [...this.productsList, product];
		this.updateTotalBasketSum();
		product.basketStatus = true;
	}

	deleteProduct(product: IProduct) {
		this.productsList = this.productsList.filter(
			(item) => item.id !== product.id
		);
		this.updateTotalBasketSum();
		product.basketStatus = false;
	}

	clearBasket() {
		this.productsList = [];
		this.updateTotalBasketSum();
	}

	private finalPrice() {
		let total = 0;
		this.productsList.forEach((product) => {
			total += product.price;
		});
		return total;
	}

	private updateTotalBasketSum() {
		this.total = this.finalPrice();
	}
}
