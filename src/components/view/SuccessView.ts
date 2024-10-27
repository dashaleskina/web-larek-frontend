import { View } from "../base/View";
import { ensureElement } from '../../utils/utils';
import { IMouseEvent } from "../../types";

interface ISuccessElements {
	finalSum: number;
}

export class SuccessView extends View<ISuccessElements> {
    protected closeButton: HTMLButtonElement;
    protected finalOrderInfo: HTMLElement;

    constructor(container: HTMLElement, element: string,  actions: IMouseEvent) {
        super(container);

        this.closeButton = ensureElement<HTMLButtonElement>(`.${element}__close`, container);
        if(actions?.onClick) {
            this.closeButton.addEventListener('click', actions.onClick);
        }

		this.finalOrderInfo = ensureElement<HTMLElement>(`.${element}__description`, container);
    }

    set finalSum(value: number) {
        this.setText(this.finalOrderInfo, 'Списано ' + value + ' синапсов')
    }
}
