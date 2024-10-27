import { View } from '../base/View';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

export interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

export interface IPageElements {
	counter: HTMLElement;
	wrapper: HTMLElement;
	basket: HTMLElement;
	store: HTMLElement;
}

export class PageView extends View<IPage> {
	protected pageElements: IPageElements;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.pageElements = {
			counter: ensureElement<HTMLElement>('.header__basket-counter', container),
			wrapper: ensureElement<HTMLElement>('.page__wrapper', container),
			basket: ensureElement<HTMLElement>('.header__basket', container),
			store: ensureElement<HTMLElement>('.gallery', container),
		};

		this.pageElements.basket.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	set counter(value: number) {
		this.setText(this.pageElements.counter, String(value));
	}

	set catalog(items: HTMLElement[]) {
		this.pageElements.store.replaceChildren(...items);
	}

	set locked(value: boolean) {
		if (value) {
			this.pageElements.wrapper.classList.add('page__wrapper_locked');
		} else {
			this.pageElements.wrapper.classList.remove('page__wrapper_locked');
		}
	}
}
