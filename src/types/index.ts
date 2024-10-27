//карточка товара
export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    basketStatus: boolean;
    price: number | null; //null указываем, так как в апи есть товар с 'price': null
}

//инфо о конкретном заказе в корзине
export interface IOrderInfo {
    items: IProduct[];
    total: number | null;
    email: string;
    phone: string;
    payment: TPaymentProcess;
    address: string;
    formError: Partial<Record<keyof IOrderInfo, string>>;
    isValid: boolean;
}

//типы оплаты
export type TPaymentProcess = 'онлайн' | 'при получении';
//для работы с персональными данными
export type TPersonalInfo = Pick<IOrderInfo, 'email' | 'phone'>;
//для работы с заказом (оплата + адрес)
export type TDelivery = Pick<IOrderInfo, 'payment' | 'address'>;
//для работы с данными о наполнении корзины
export type TOrderList = Pick<IOrderInfo, 'total' | 'items'>

//отработка клика мышкой
export interface IMouseEvent {
	onClick: (event: MouseEvent) => void;
}

export interface ICardDetails {
    category: HTMLElement;
    title: HTMLElement;
    image: HTMLImageElement;
    price: HTMLElement;
    description: HTMLElement;
    button: HTMLButtonElement;
    removeButton: HTMLButtonElement;
    index: HTMLElement;
}

export enum CategoryList {
    SOFT = 'софт-скил',
	OTHER = 'другое',
    EXTRA = 'дополнительное',
	BUTTON = 'кнопка',
	HARD = 'хард-скил',
}