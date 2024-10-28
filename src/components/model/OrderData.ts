import { Model } from '../base/Model';
import { IOrderInfo, TPaymentProcess } from '../../types/index';

export class OrderData extends Model<IOrderInfo> {
    items: string[] = [];
    total: number | null = null;
    email: string = '';
    phone: string = '';
    payment: TPaymentProcess = undefined;
    address: string = '';
    formError: Partial<Record<keyof IOrderInfo, string>>;
    isValid: boolean = false;

    validateDelivery() {
        const formError: typeof this.formError = {}
        if (!this.payment) {
            formError.payment = 'Укажите тип оплаты'
        }

        if (!this.address) {
            formError.address = 'Укажите адрес'
        }

        this.formError = formError;
        this.events.emit('DeliveryFormError:change', this.formError);
        return Object.keys(formError).length === 0
    }
    
    validatePersonalInfo() {
        const regexpEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const regexpPhone = /^(?:\+7|8)\s?\d{3}[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;


        const formError: typeof this.formError = {}
        if (!this.email || !regexpEmail.test(this.email)) {
            formError.email = 'Укажите почтовый ящик'
        }

        if (!this.phone || !regexpPhone.test(this.phone)) {
            formError.phone = 'Укажите номер телефона'
        }

        this.formError = formError;
        this.events.emit('personalInfoFormError:change', this.formError);
        return Object.keys(formError).length === 0
    }

    clear() {
        Object.assign(this, {
            products: [],
            total: null,
            email: '',
            phoneNumber: '',
            payment: undefined,
            address: '',
            formError: {},
            isValid: false,
        })
    }

}

