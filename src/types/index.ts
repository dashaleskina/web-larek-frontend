//карточка товара
export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null; //null указываем, так как в апи есть товар с 'price': null
}

//информация о товаре, которую ипользуем в карточке
export type TProductShort = Pick<IProduct, 'title' | 'price'>;

//инфо о конкретном заказе в корзине
export interface IOrderInfo {
    products: IProduct[];
    totalBasketSum: number | null;
    email: string;
    phoneNumber: string;
    payment: TPaymentProcess;
    address: string;
    formError: Partial<Record<keyof IOrderInfo, string>>;
    isValid: boolean;
}

//типы оплаты
export type TPaymentProcess = 'онлайн' | 'при получении';

export type TFormValid = Pick<IOrderInfo, 'formError' | 'isValid'>;
export type TPersonalInfo = Pick<IOrderInfo, 'email' | 'phoneNumber'>;
export type TDelivery = Pick<IOrderInfo, 'payment' | 'address'>;
export type TOrderList = Pick<IOrderInfo, 'totalBasketSum' | 'products'>
