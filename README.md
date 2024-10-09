https://github.com/dashaleskina/web-larek-frontend.git

# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Описание проекта

Проект "Веб-ларек" это платформа, которая показывает пример небольшого интернет магазина.

Что доступно пользователю? Фундамент - покупка уникальных инструментов для работы за вымышленную виртуальную валюту "синапсы".
1) Просмотр общего каталога товаров. Сами товары оформлены как карточки с основной необходимой информацией для покупателя. 
2) Карточка товара. При клике на товар. пользователю открывается, помимо общей информации, еще и подробное описание товара, а также возможность добавить товар в корзину.
3) Корзина. Тут пользователь может просмотреть выбранные товары (название и стоимость), может удалить товар или перейти к оформлению заказа;
4) Форма оплаты и доставки. Тут все просто - покупатель выбирает способ оплаты и вбивает адрес. Без адреса и способа оплаты оформление товара невозможно
5) Форма с контактами. Пользователю необходимо внести электронную почту и номер телефона для оплаты. Переход к оплате возможен только при заполнении полей
6) Окно успешного заказа. Тут мы видим уведомление о том, что заказ успешно оформлен, а также сумму на которую были совершены покупки 

Проект реализуется на TypeScript

## Типы данных 

Товар 
```
export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}
```
Информация о товаре отображаемая в корзине 
```
export type TProductShort = Pick<IProduct, 'title' | 'price'>;
```
Каталог товаров
```
export interface IProductDisplay {
    productsList: IProduct[]; 
    fullProduct: IProduct; 
    selectCard(product: IProduct): void; 
}
```
Инфо о заказе в корзине
```
export interface IOrderInfo {
    products: IProduct[];
    total: number | null;
    email: string;
    phoneNumber: string;
    payment: TPaymentProcess;
    address: string;
}
```

Виды оплаты
```
export type TPaymentProcess = 'онлайн' | 'при получении';
```

Обработка ошибок в форме
```
export type FormError = Partial<Record<keyof IOrderInfo, string>>;
```

Корзина
```
export interface IBasket {
    productsList: IProduct[];
    addProduct(product: IProduct): void;
    deleteProduct(product: IProduct): void;
    finalPrice(): number;
    clearBasket(): void
}
```

## Архитектура

В данном проекте для разделения слоев используется парадигма MVP, используются следующие слои:
1) Слой для работы с данными, который работает над изменением и хранением данных
2) Слой представления - отображает данные
3) Презентер (представитель) - объединяет слой представления и слой данных, поскольку знать они друг о друге не должны, но при этом работать в тандеме.

## Базовый код
### Класс API
Класс API предназначем для работы с API
Реализует следующие методы:
```
protected handleResponse(response: Response): Promise<object> - обработка ответа сервер

post(uri: string, data: object, method: ApiPostMethods = 'POST') - POST запрос к серверу, обрабатывается методом handleResponse

get(uri: string) - GET запрос к серверу, обрабатывается методом handleResponse
```



### Класс EventEmitter
Класс EventEmitter это брокер событий, связывает между собой отображение и данные. При помощи него можно работать с системой событий в проекте. Имплементируется интерфейсом IEvents.
Реализует следующие методы:
```
on<T extends object>(eventName: EventName, callback: (event: T) => void) - установка обработчика на событие

off(eventName: EventName, callback: Subscriber) - снятие обработчика с события

emit<T extends object>(eventName: string, data?: T) - инициализация события с данными

onAll(callback: (event: EmitterEvent) => void) - слушать все события

offAll() - сброс всех обработчиков

trigger<T extends object>(eventName: string, context?: Partial<T>) -  коллбек триггер, генерирующий событие при вызове
```

## Компоненты модели данных
### Класс ProductData
Хранение и изменение данных карточки продукта. В конструкторе на вход принимается инстанс брокера событий.
Поля класса:
productsList: IProduct[];  - сборка карточек товаров
fullProduct: IProduct; - выбираем карточку для открытия в 
productsList: IProduct[]; 
