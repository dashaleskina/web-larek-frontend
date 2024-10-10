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

// работаем с карточками товаров
export interface IProductDisplay {
    products: IProduct[]; 
    fullProduct: IProduct; 
    selectCard(product: IProduct): void; 
}

//инфо о конкретном заказе в корзине
export interface IOrderInfo {
    products: IProduct[];
    total: number | null;
    email: string;
    phoneNumber: string;
    payment: TPaymentProcess;
    address: string;
}

//типы оплаты
export type TPaymentProcess = 'онлайн' | 'при получении';

//отработка ошибок в форме
export interface IFormValid extends IOrderInfo {
    formError: Partial<Record<keyof IOrderInfo, string>>;
    isValid: boolean;
}
 

//работаем с корзиной
export interface IBasket {
    productsList: IProduct[];
    addProduct(product: IProduct): void;
    deleteProduct(product: IProduct): void;
    finalCount(): number;
    finalPrice(): number;
    clearBasket(): void
}