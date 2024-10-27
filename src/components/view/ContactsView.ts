import { FormView } from './FormView';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { TPersonalInfo } from '../../types/index';


export class ContactsView extends FormView<TPersonalInfo> {
    protected emailField: HTMLInputElement;
	protected phoneField: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

        this.emailField = ensureElement<HTMLInputElement>('.form__input[name=email]', container);
        this.phoneField = ensureElement<HTMLInputElement>('.form__input[name=phone]', container);

        this.emailField.addEventListener('click', () => {
            this.updateFieldValue('email', this.emailField.value)
        })

        this.phoneField.addEventListener('click', () => {
            this.updateFieldValue('phone', this.phoneField.value)
        }) 
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }  

    set email(value: string) {
            (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }
}