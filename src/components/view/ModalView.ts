import { View } from '../base/View';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

interface IModalData {
	content: HTMLElement;
}

export class ModalView extends View<IModalData> {
	contentElement: HTMLElement;
	closeButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this.container.addEventListener('click', this.close.bind(this));

		this.contentElement = ensureElement<HTMLElement>(
			'.modal__content',
			container
		);
		this.contentElement.addEventListener('click', (event) =>
			event.stopPropagation()
		);

		this.closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this.closeButton.addEventListener('click', this.close.bind(this));
	}

	set content(value: HTMLElement) {
		this.contentElement.replaceChildren(value);
	}

	open() {
		this.container.classList.add('modal_active');
		this.events.emit('modal:open');
	}

	private clearContent() {
		this.content = null;
	}

	close() {
		this.container.classList.remove('modal_active');
		this.clearContent();
		this.events.emit('modal:close');
	}

	render(data: IModalData): HTMLElement {
		this.content = data.content;
		this.open();
		return this.container;
	}
}
