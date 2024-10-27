import { View } from '../base/View';
import { IProduct, IMouseEvent, ICardDetails, CategoryList } from '../../types';
import { CDN_URL } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

const categoryElements: Record<CategoryList, string> = {
	[CategoryList.SOFT]: 'card__category_soft',
	[CategoryList.OTHER]: 'card__category_other',
	[CategoryList.EXTRA]: 'card__category_additional',
	[CategoryList.BUTTON]: 'card__category_button',
	[CategoryList.HARD]: 'card__category_hard',
};

export class CardView extends View<IProduct> {
	protected cardElements: ICardDetails;

	constructor(
		container: HTMLElement,
		protected element: string,
		actions?: IMouseEvent
	) {
		super(container);

		this.cardElements = {
			category: container.querySelector(`.${element}__category`) as HTMLElement,
			title: ensureElement<HTMLElement>(`.${element}__title`, container),
			image: container.querySelector(`.${element}__image`) as HTMLImageElement,
			price: container.querySelector(`.${element}__price`) as HTMLElement,
			description: container.querySelector(
				`.${this.element}__text`
			) as HTMLElement,
			button: container.querySelector(
				`.${element}__button`
			) as HTMLButtonElement,
			removeButton: container.querySelector(
				`.basket__item-delete`
			) as HTMLButtonElement,
			index: container.querySelector(`.basket__item-index`) as HTMLElement,
		};

		if (actions?.onClick) {
			if (this.cardElements.button) {
				this.cardElements.button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}

		if (this.cardElements.removeButton) {
			this.cardElements.removeButton.addEventListener('click', (evt) => {
				this.container.remove();
			});
		}
	}
	set price(value: number | null) {
		if (value === null) {
			this.setText(this.cardElements.price, 'Бесценно');
			if (this.cardElements.button) {
				this.cardElements.button.disabled = true;
			}
		} else {
			this.setText(this.cardElements.price, value.toString() + ' синапсов');
			if (this.cardElements.button) {
				this.cardElements.button.disabled = false;
			}
		}
	}

	set index(ind: number) {
		if (this.cardElements.index) {
			this.setText(this.cardElements.index, ind.toString());
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set category(value: CategoryList) {
		if (this.cardElements.category) {
			this.setText(this.cardElements.category, value);
			this.cardElements.category.classList.add(categoryElements[value]);
		}
	}

	set title(value: string) {
		this.setText(this.cardElements.title, value);
	}

	get title(): string {
		return this.cardElements.title.textContent || '';
	}

	set image(value: string) {
		if (this.cardElements.image) {
			this.setImage(this.cardElements.image, CDN_URL + value);
		}
	}

	set description(value: string) {
		if (this.cardElements.description) {
			this.setText(this.cardElements.description, value);
		}
	}

	changeButtonStatus(product: IProduct) {
		if (product.basketStatus) {
			this.setText(this.cardElements.button, 'Удалить из заказа');
		} else {
			this.setText(this.cardElements.button, 'В корзину');
		}
	}
}
