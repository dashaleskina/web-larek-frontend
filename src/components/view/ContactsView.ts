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
    }

    set phone(value: string) {
        (this.phoneField as HTMLInputElement).value = value;
    }  

    set email(value: string) {
            (this.emailField as HTMLInputElement).value = value;
    }
}