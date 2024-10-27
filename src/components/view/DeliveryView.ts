import { FormView } from './FormView';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { TPaymentProcess, TDelivery } from '../../types/index';

interface IDeliveryElements {
	addressField: HTMLInputElement;
	cardButton: HTMLButtonElement;
	cashButton: HTMLButtonElement;
}

export class DeliveryView extends FormView<TDelivery> {
	private deliveryElements: IDeliveryElements;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this.deliveryElements = {
			addressField: ensureElement<HTMLInputElement>(
				'.form__input[name=address]',
				container
			),
			cardButton: ensureElement<HTMLButtonElement>(
				'.button_alt[name=card]',
				container
			),
			cashButton: ensureElement<HTMLButtonElement>(
				'.button_alt[name=cash]',
				container
			),
		};

		this.deliveryElements.addressField.addEventListener('click', () => {
			this.updateFieldValue(
				'address',
				this.deliveryElements.addressField.value
			);
		});

		this.deliveryElements.cardButton.addEventListener('click', () => {
			this.payment = 'онлайн';
			this.updateFieldValue('payment', 'онлайн');
		});

		this.deliveryElements.cashButton.addEventListener('click', () => {
			this.payment = 'при получении';
			this.updateFieldValue('payment', 'при получении');
		});
	}

	set payment(value: TPaymentProcess) {
		this.deliveryElements.cardButton.classList.toggle(
			'button_alt-active',
			value === 'онлайн'
		);
		this.deliveryElements.cashButton.classList.toggle(
			'button_alt-active',
			value === 'при получении'
		);
	}

	set address(value: string) {
		this.deliveryElements.addressField.value = value;
	}
}
