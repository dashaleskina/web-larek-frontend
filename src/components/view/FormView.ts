import { View } from '../base/View';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

type TFormState = {
	isValid: boolean;
	formError: {};
};

export class FormView<T> extends View<TFormState> {
	protected submit: HTMLButtonElement;
	protected error: HTMLElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this.container.addEventListener('input', (event: Event) => {
			const target = event.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.updateFieldValue(field, value);
		});

		this.container.addEventListener('submit', (event: Event) => {
			event.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});

		this.submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);
		this.error = ensureElement<HTMLElement>('.form__errors', this.container);
	}

	protected updateFieldValue(field: keyof T, value: string) {
		this.events.emit(`${String(field)}:change`, { field, value });
	}

	set valid(value: boolean) {
		this.setDisabled(this.submit, !value)
	}

	set errors(value: string) {
		this.setText(this.error, value);
	}

	render(state: Partial<T> & TFormState) {
		const { isValid, formError, ...inputs } = state;
		super.render({ isValid });
		Object.assign(this, inputs);

		return this.container;
	}
}
