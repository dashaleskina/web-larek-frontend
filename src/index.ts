import './scss/styles.scss';
//model
import { BasketData } from './components/model/BasketData';
import { OrderData } from './components/model/OrderData';
import { ProductsData } from './components/model/ProductsData';
//base
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
//view
import { BasketView } from './components/view/BasketView';
import { CardView } from './components/view/CardView';
import { ContactsView } from './components/view/ContactsView';
import { DeliveryView } from './components/view/DeliveryView';
import { SuccessView } from './components/view/SuccessView';
import { PageView } from './components/view/PageView';
import { ModalView } from './components/view/ModalView';
//api
import { API_URL } from './utils/constants';
//utils
import { cloneTemplate, ensureElement } from './utils/utils';
//types & interfaces
import { IProduct, TPaymentProcess, IOrderInfo } from './types';

// ШАБЛОНЫ
const shopProductTemplate = ensureElement<HTMLTemplateElement>('#card-catalog'); //главная страница
const modalTemplate = ensureElement<HTMLElement>('#modal-container'); // шаблон модалки
const productPreviewTemplate =
	ensureElement<HTMLTemplateElement>('#card-preview'); //превью продукта

const productBasketTemplate =
	ensureElement<HTMLTemplateElement>('#card-basket'); //продукт в корзине
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket'); // корзина

const deliveryTemplate = ensureElement<HTMLTemplateElement>('#order'); // модалка с выбором способа доставки и адреса
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts'); // модалка с контактными данными
const successTemplate = ensureElement<HTMLTemplateElement>('#success'); // модалка с инфо об успешном заказе

// СОЗДАНИЕ МОДЕЛЕЙ ДАННЫХ
const api = new Api(API_URL);
const events = new EventEmitter();

const basketData = new BasketData({}, events);
const orderData = new OrderData({}, events);
const productsData = new ProductsData([], events);

// СОЗДАНИЕ ПРЕДСТАВЛЕНИЙ
const basketView = new BasketView(
	cloneTemplate(basketTemplate),
	'basket',
	events
);

const contactsView = new ContactsView(cloneTemplate(contactsTemplate), events);
const deliveryView = new DeliveryView(cloneTemplate(deliveryTemplate), events);
const successView = new SuccessView(
	cloneTemplate(successTemplate),
	'order-success',
	{
		onClick: () => events.emit('success:close'),
	}
);

const modalView = new ModalView(modalTemplate, events);
const pageView = new PageView(document.body, events);

// ПОДПИСЫВАЕМСЯ НА СОБЫТИЯ
//---ГЛАВНАЯ---
events.on('products:update', loadProductsCatalog); //первичная загрузка товаров
events.on('products:selectProduct', openSelectProduct); //выбор продукта, превью
events.on('modal:close', scrollUnlock); //скролл работает
events.on('modal:open', scrollLock); //скролл выключается
//---КОРЗИНА---
events.on('product:addToBasket', updateBasket); // добавляем или удаляем товар из корзины
events.on('basket:open', openBasket); //октрываем корзину
events.on('basket:remove', removeFromBasket); //удаляем товар в корзине и обновляем счетчик
//---ДОСТАВКА---
events.on('basket:order', openDeliveryModal); //модальное окно с созданием заказа
events.on('payment:change', switchPaymentProcess); //переключаем способ оплаты
events.on('address:change', fillAdressField); //назначаем адрес
events.on('DeliveryFormError:change', checkDeliveryValidation); //валидируем всю форму
//---ИНФОРМАЦИЯ О КЛИЕНТЕ---
events.on('order:submit', openPersonalInfoModal); // модальное окно с личной информацией
events.on('email:change', fillEmailField); //заполняем поле с почтой
events.on('phone:change', fillPhoneNumberField); //заполняем поле с номером
events.on('personalInfoFormError:change', checkPersonalInfoValidation); // общая валидация формы с персональными данными
//---ЗАВЕРШЕНИЕ ЗАКАЗА---
events.on('contacts:submit', finishOrder); //отправка данных на сервер
events.on('success:close', closeSuccess); //закрываем модалку

//ЗАГРУЖАЕМ ТОВАРЫ С СЕРВЕРА - START
api
	.get('/product')
	.then((res: { items: IProduct[] }) => {
		productsData.loadProducts(res.items as IProduct[]);
	})
	.catch((err) => {
		console.error(err);
	});

//ОТПРАВЛЯЕМ ЗАКАЗ НА СЕРВЕР - FINISH
function finishOrder() {
	api
		.post('/order', orderData)
		.then((res) => {
			modalView.render({
				content: successView.render({
					finalSum: orderData.total,
				}),
			});

			basketView.products = [];
			orderData.clear();
			basketData.clearBasket();

			productsData.productsList.map(
				(product) => (product.basketStatus = false)
			);
			pageView.counter = 0;
		})
		.catch((err) => {
			console.error('Ошибка при отправке заказа:', err);
		});
}

// ОТРИСОВЫВАЕМ ТОВАРЫ НА СТРАНИЦЕ
// Функция-обработчик для события 'products:update'
function loadProductsCatalog() {
	pageView.catalog = productsData.productsList.map((item) => {
		const catalogItem = new CardView(
			cloneTemplate(shopProductTemplate),
			'card',
			{
				onClick: () => events.emit('products:selectProduct', item),
			}
		);
		return catalogItem.render(item);
	});
}

// ПРЕВЬЮ ЭЛЕМЕНТОВ
function openSelectProduct(item: IProduct) {
	const itemPreview = new CardView(
		cloneTemplate(productPreviewTemplate),
		'card',
		{
			onClick: () => {
				events.emit('product:addToBasket', item);
				itemPreview.changeButtonStatus(item);
			},
		}
	);

	itemPreview.changeButtonStatus(item);
	modalView.render({ content: itemPreview.render(item) });
}

// ОТКРЫТИЕ КОРЗИНЫ
function openBasket() {
	modalView.render({
		content: basketView.render(basketData),
	});
	basketView.setButtonDisabled(basketData.productsList.length === 0);
}

// ОТРИСОВКА ТОВАРОВ В КОРЗИНЕ
function renderBasketItems() {
	basketView.products = basketData.productsList.map((item, ind) => {
		const basketElement = new CardView(
			cloneTemplate(productBasketTemplate),
			'card',
			{
				onClick: () => {
					events.emit('basket:remove', item);
				},
			}
		);
		basketElement.index = ++ind;
		return basketElement.render(item);
	});
	
}

// ИНСТРУМЕНТ ДОБАВЛЕНИЯ ИЛИ УДАЛЕНИЯ ТОВАРОВ (модель)
function updateBasket(item: IProduct) {
	const productInBasket = basketData.productsList.some(
		(product) => product.id === item.id
	);

	if (productInBasket) {
		basketData.deleteProduct(item);
	} else {
		basketData.addProduct(item);
	}

	pageView.counter = basketData.productsList.length;
	basketView.basketSum = basketData.total;
	renderBasketItems();
}

//ОБНОВЛЕНИЕ СЧЕТЧИКА ПРИ УДАЛЕНИИ ТОВАРА ИЗ КОРЗИНЫ
function removeFromBasket(item: IProduct) {
	basketData.deleteProduct(item);
	basketView.basketSum = basketData.total;
	pageView.counter = basketData.productsList.length;
	renderBasketItems();
}

//ОТКРЫТИЕ МОДАЛЬНОГО ОКНА С ЗАПОЛНЕНИЕМ ДАННЫХ О ДОСТАВКЕ
function openDeliveryModal() {
	orderData.items = basketData.productsList.map((item) => item.id);
	orderData.total = basketData.total;

	if (orderData.validateDelivery()) {
		orderData.isValid = true;
	}
	modalView.render({
		content: deliveryView.render(orderData),
	});
}

//ПЕРЕКЛЮЧЕНИЕ СПОСОБА ОПЛАТЫ
function switchPaymentProcess(data: {
	field: keyof IOrderInfo;
	value: TPaymentProcess;
}) {
	orderData.payment = data.value;
	orderData.validateDelivery();
	console.log(orderData.payment);
}

//ЗАПОЛНЕНИЕ ПОЛЕ АДРЕСА
function fillAdressField(data: { field: keyof IOrderInfo; value: string }) {
	orderData.address = data.value;
	orderData.validateDelivery();
	console.log(orderData.address);
}

//ОБЩАЯ ВАЛИДАЦИЯ ФОРМЫ С ИНФО О ДОСТАВКЕ
function checkDeliveryValidation(formError: Partial<IOrderInfo>) {
	deliveryView.valid = !Object.keys(formError).length;
	deliveryView.errors = Object.values(formError).join(' , ');
}

//ПЕРЕХОД К ФОРМЕ ЗАПОЛНЕНИЯ ПЕРСОНАЛЬНОЙ ИНФОРМАЦИИ
function openPersonalInfoModal() {
	if (orderData.validatePersonalInfo()) {
		orderData.isValid = true;
		console.log(orderData.isValid, 'hi');
	}
	modalView.render({
		content: contactsView.render(orderData),
	});
}

//ЗАПОЛНЯЕМ ПОЛЕ ПОЧТОВОГО АДРЕСА
function fillEmailField(data: { field: keyof IOrderInfo; value: string }) {
	orderData.email = data.value;
	orderData.validatePersonalInfo();
}

//ЗАПОЛНЯЕМ ПОЛЕ С НОМЕРОМ ТЕЛЕФОНА
function fillPhoneNumberField(data: {
	field: keyof IOrderInfo;
	value: string;
}) {
	orderData.phone = data.value;
	orderData.validatePersonalInfo();
	//console.log(orderData.phoneNumber, orderData.validatePersonalInfo())
}

//ВАЛИДИРУЕМ ВСЮ ФОРМУ С ПЕРСОНАЛЬНОЙ ИНФОРМАЦИЕЙ
function checkPersonalInfoValidation(formError: Partial<IOrderInfo>) {
	contactsView.valid = !Object.keys(formError).length;
	contactsView.errors = Object.values(formError).join(' , ');
}

//ЗАКРЫТИЕ ПОСЛЕДНЕГО МОДАЛЬНОГО ОКНА
function closeSuccess() {
	modalView.close();
}

//ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ -
//БЛОКИРОВКА ПРОКРУТКИ ПРИ ЗАКРЫТОМ/ОТКРЫТОМ МОДАЛЬНОМ ОКНЕ

function scrollUnlock() {
	pageView.locked = false;
}

function scrollLock() {
	pageView.locked = true;
}