// Загружаем массив пользователей из локального хранилища
let users = JSON.parse(localStorage.getItem('users')) || [];

// Загружаем текущего пользователя
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

document.addEventListener("DOMContentLoaded", function () {
    // Список товаров
    const products = [
        {
            id: 1,
            name: 'Товар 1',
            description: 'Описание товара 1.',
            fullDescription: 'Это расширенное описание товара один. Тут рассказывается о характеристиках и преимуществах.',
            price: 1500,
            image: 'images/product1.jpg'
        },
        {
            id: 2,
            name: 'Товар 2',
            description: 'Описание товара 2.',
            fullDescription: 'Это расширенное описание товара два. Тут рассказывается о характеристиках и преимуществах.',
            price: 1500,
            image: 'images/product2.jpg'
        },
        {
            id: 3,
            name: 'Товар 3',
            description: 'Описание товара 3.',
            fullDescription: 'Это расширенное описание товара три. Тут рассказывается о характеристиках и преимуществах.',
            price: 1500,
            image: 'images/product3.jpg'
        }
    ];

    // Функция для отображения товаров
    function displayProducts() {
        const productGrid = document.getElementById('product-grid');
        productGrid.innerHTML = '';

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.dataset.id = product.id;
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <p>Цена: ${product.price} ₽</p>
                <button class="add-to-cart">Добавить</button>
            `;
            productCard.querySelector('.add-to-cart').addEventListener('click', () => addToCart(product));
            productCard.addEventListener('click', (event) => {
                if (!event.target.classList.contains('add-to-cart')) {
                    showModal(product);
                }
            });
            
            productGrid.appendChild(productCard);
        });
    }

    // Функция для отображения модального окна
    function showModal(product) {
        const modal = document.getElementById('modal');
        document.getElementById('modal-image').src = product.image;
        document.getElementById('modal-title').textContent = product.name;
        document.getElementById('modal-description').textContent = product.description;
        document.getElementById('modal-full-description').textContent = product.fullDescription; // Расширенное описание товара
    
        // Убираем класс hidden, чтобы расширенное описание стало видимым
        document.getElementById('modal-full-description').classList.remove('hidden');
        
        document.getElementById('modal-price').textContent = `Цена: ${product.price} ₽`;
    
        // Открываем модальное окно
        modal.classList.remove('hidden');
        
        // Обработчик кнопки закрытия
        document.querySelector('.close-button').addEventListener('click', () => {
            modal.classList.add('hidden');
        });
        
        // Обработчик кнопок увеличения/уменьшения количества
        let quantity = 1;
        document.getElementById('increase-quantity').addEventListener('click', () => {
            quantity++;
            document.getElementById('quantity-value').textContent = quantity;
        });
        
        document.getElementById('decrease-quantity').addEventListener('click', () => {
            if (quantity > 1) {
                quantity--;
                document.getElementById('quantity-value').textContent = quantity;
            }
        });
    
        // Обработчик кнопки "Добавить в корзину"
        document.getElementById('add-to-cart-modal').addEventListener('click', () => {
            addToCart(product, quantity);
            modal.classList.add('hidden');
        });
    }

    // Функция для добавления товара в корзину
    function addToCart(product, quantity = 1) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];    
        const existingProduct = cart.find(item => item.id === product.id);
        if (existingProduct) {
            existingProduct.quantity += quantity;  
            // обновляем количество товара    
            } else {
            product.quantity = quantity;        
            cart.push(product);
        }
        localStorage.setItem('cart', JSON.stringify(cart));  
        // сохраняем корзину в localStorage    
        updateCartCount();  
        // обновляем отображение количества товаров
    }


    // Функция для обновления количества товаров в корзине
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCount = cart.reduce((total, product) => total + product.quantity, 0);
        document.getElementById('cart-count').textContent = cartCount;
    }

    // Функция для отображения корзины
    function updateCart() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartContainer = document.getElementById('cart-container');
        cartContainer.innerHTML = ''; // Очищаем корзину перед добавлением новых элементов

        let totalPrice = 0;
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.setAttribute('data-id', item.id);
            
            cartItem.innerHTML = `
                <span>${item.name}</span>
                <span>${item.quantity} x ${item.price} ₽</span>
                <button class="remove-item">Удалить</button>
                <button class="increase-quantity">+</button>
                <button class="decrease-quantity">-</button>
            `;
            
            cartItem.querySelector('.increase-quantity').addEventListener('click', () => updateQuantity(item.id, 1));
            cartItem.querySelector('.decrease-quantity').addEventListener('click', () => updateQuantity(item.id, -1));
            cartItem.querySelector('.remove-item').addEventListener('click', () => removeFromCart(item.id));

            cartContainer.appendChild(cartItem);
            totalPrice += item.price * item.quantity;
        });

        document.getElementById('total-price').textContent = `Общая сумма: ${totalPrice} ₽`;
    }

    // Функция для обновления количества товара в корзине
    function updateQuantity(id, change) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];    
        const product = cart.find(item => item.id === id);
        if (product) {
            product.quantity += change;        
            if (product.quantity <= 0) {
                removeFromCart(id);        
            } else {
                localStorage.setItem('cart', JSON.stringify(cart));            
                updateCart();  // обновляем корзину
            }    
        }
    }

    // Функция для удаления товара из корзины
    function removeFromCart(id) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const updatedCart = cart.filter(item => item.id !== id);  // удаляем товар

        localStorage.setItem('cart', JSON.stringify(updatedCart));  // сохраняем обновленную корзину
        updateCartCount();  // обновляем количество товаров в корзине
        updateCart();  // обновляем отображение корзины
    }

    function updateHeader() { 
        const authLink = document.getElementById('auth-link'); 
        const logoutBtn = document.getElementById('logout-btn'); 
        const username = currentUser ? currentUser.username : 'Гость'; // Получаем имя пользователя или 'Гость' 
     
        if (authLink) { 
            if (currentUser) { 
                authLink.textContent = `Привет, ${username}`; // Отображаем имя пользователя 
                authLink.href = 'Authorization.html'; // Ссылка на страницу входа 
            } else { 
                authLink.textContent = 'Войти'; // Если не авторизован, показываем "Войти" 
                authLink.href = 'Authorization.html'; // Ссылка на страницу входа 
            } 
        } 
     
        if (logoutBtn) { 
            if (currentUser) { 
                logoutBtn.style.display = 'block'; // Показываем кнопку выхода 
                logoutBtn.addEventListener('click', function () { 
                    localStorage.removeItem('currentUser'); 
                    alert('Вы вышли из аккаунта'); 
                    location.href = 'Authorization.html'; 
                }); 
            } else { 
                logoutBtn.style.display = 'none'; // Скрываем кнопку выхода, если не авторизован 
            } 
        } 
    }
    

        // Регистрация
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const newUsername = document.getElementById('new-username').value;
            const newPassword = document.getElementById('new-password').value;

            if (users.find(user => user.username === newUsername)) {
                alert('Пользователь с таким именем уже существует!');
                return;
            }

            users.push({ username: newUsername, password: newPassword });
            localStorage.setItem('users', JSON.stringify(users));
            alert('Регистрация прошла успешно!');
            location.href = 'Authorization.html';
        });
    }

    // Событие авторизации
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const user = users.find(u => u.username === username && u.password === password);
            if (user) {
                alert('Вы успешно вошли в систему!');
                localStorage.setItem('currentUser', JSON.stringify(user)); // Сохраняем текущего пользователя
                location.href = 'index.html';
            } else {
                alert('Неверный логин или пароль');
            }
        });
    }

    // Событие выхода из аккаунта
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            localStorage.removeItem('currentUser');
            alert('Вы вышли из аккаунта');
            location.href = 'Authorization.html';
        });
    }
    // Проверка состояния авторизации при загрузке страницы
    window.onload = function () {
        updateHeader();
        updateCartCount(); // Обновляем счетчик корзины
        if (currentUser) {
            updateCart();
        }
    };
    // Проверка состояния авторизации при загрузке страницы 
    window.onload = function () { 
        updateHeader(); // Обновляем хедер 
    };


    // Загружаем товары при загрузке страницы
    displayProducts();
    
    // Инициализация корзины
    updateCartCount();
    updateCart();
});