import { TOrderList } from '../../types/index';
import { IEvents } from '../base/events';
import { createElement } from '../../utils/utils';
import { View } from '../base/View';

export class BasketView extends View<TOrderList> {
	protected list: HTMLElement;
	protected price: HTMLElement;
	protected button: HTMLButtonElement;

	constructor(
		container: HTMLElement,
		protected element: string,
		protected events: IEvents
	) {
		super(container);

		this.button = container.querySelector(`.${element}__button`);
		this.price = container.querySelector(`.${element}__price`);
		this.list = container.querySelector(`.${element}__list`);

		if (this.button) {
			this.button.addEventListener('click', () => events.emit('basket:order'));
		}
	}

	set basketSum(price: number) {
		this.setText(this.price, price + ' синапсов');
	}

	set products(products: HTMLElement[]) {
		const isEmpty = products.length === 0;

		if (isEmpty) {
			this.list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		} else {
			this.list.replaceChildren(...products);
		}

		this.button.disabled = isEmpty;
	}
}
