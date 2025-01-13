// Загружаем массив пользователей из локального хранилища
let users = JSON.parse(localStorage.getItem('users')) || [];

// Загружаем текущего пользователя
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

document.addEventListener("DOMContentLoaded", function () {
    // Список товаров, храним в локальном хранилище
    let products = JSON.parse(localStorage.getItem('products')) || [
        {
            id: 1,
            name: 'Товар 1',
            description: 'Funko pop 1.',
            fullDescription: 'Это расширенное описание Funko pop 1. Тут рассказывается о характеристиках и преимуществах.',
            price: 1500,
            image: 'images/product1.jpg',
            quantityAvailable: 10 // Количество в наличии
        },
        {
            id: 2,
            name: 'Товар 2',
            description: 'Funko pop 2.',
            fullDescription: 'Это расширенное описание Funko pop 2. Тут рассказывается о характеристиках и преимуществах.',
            price: 1500,
            image: 'images/product2.jpg',
            quantityAvailable: 15 // Количество в наличии
        },
        {
            id: 3,
            name: 'Товар 3',
            description: 'Funko pop 3.',
            fullDescription: 'Это расширенное описание Funko pop 3. Тут рассказывается о характеристиках и преимуществах.',
            price: 1500,
            image: 'images/product3.jpg',
            quantityAvailable: 10 // Количество в наличии
        },
        {
            id: 4,
            name: 'Товар 4',
            description: 'Funko pop 4.',
            fullDescription: 'Это расширенное описание Funko pop 4. Тут рассказывается о характеристиках и преимуществах.',
            price: 1500,
            image: 'images/product4.jpg',
            quantityAvailable:0 // Количество в наличии
        },
    ];

    console.log(products);

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
                <p>Осталось в наличии: ${product.quantityAvailable}</p>
                <button class="add-to-cart" ${product.quantityAvailable <= 0 ? 'disabled' : ''}>Добавить</button>
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
        document.getElementById('quantity-value').textContent = quantity;

        document.getElementById('increase-quantity').addEventListener('click', () => {
            if (quantity < product.quantityAvailable) {  // Запрещаем увеличить количество, если его нет в наличии
                quantity++;
                document.getElementById('quantity-value').textContent = quantity;
            }
        });

        document.getElementById('decrease-quantity').addEventListener('click', () => {
            if (quantity > 1) {
                quantity--;
                document.getElementById('quantity-value').textContent = quantity;
            }
        });

        // Обработчик кнопки "Добавить в корзину"
        document.getElementById('add-to-cart-modal').addEventListener('click', () => {
            if (quantity > product.quantityAvailable) {
                alert('Невозможно добавить больше товара, чем есть в наличии.');
            } else {
                addToCart(product, quantity);
                modal.classList.add('hidden');
            }
        });
    }

    // Функция для загрузки корзины текущего пользователя
    function getUserCart() {
        if (!currentUser) return [];
        const userCarts = JSON.parse(localStorage.getItem('userCarts')) || {};
        return userCarts[currentUser.username] || [];
    }

    // Функция для сохранения корзины текущего пользователя
    function saveUserCart(cart) {
        if (!currentUser) return;
        const userCarts = JSON.parse(localStorage.getItem('userCarts')) || {};
        userCarts[currentUser.username] = cart;
        localStorage.setItem('userCarts', JSON.stringify(userCarts));
    }

    // Функция для добавления товара в корзину
    function addToCart(product, quantity = 1) {
        if (!currentUser) {
            alert('Войдите в аккаунт, чтобы добавить товар в корзину.');
            return;
        }
        if (quantity > product.quantityAvailable) {
            alert('Невозможно добавить больше товара, чем есть в наличии.');
            return;
        }
        const cart = getUserCart();
        const existingProduct = cart.find(item => item.id === product.id);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            product.quantity = quantity;
            cart.push(product);
        }

        // Обновляем количество товара на складе
        const productIndex = products.findIndex(item => item.id === product.id);
        if (productIndex !== -1) {
            products[productIndex].quantityAvailable -= quantity;
        }

        // Сохраняем обновленный список товаров
        localStorage.setItem('products', JSON.stringify(products));

        saveUserCart(cart);
        updateCartCount();
        displayProducts();  // Обновляем отображение товаров, чтобы показать актуальные остатки
    }

    // Функция для обновления количества товаров в корзине
    function updateCartCount() {
        const cart = getUserCart();
        const cartCount = cart.reduce((total, product) => total + product.quantity, 0);
        document.getElementById('cart-count').textContent = cartCount;
    }

    // Функция для обновления шапки
    function updateHeader() {
        const authLink = document.getElementById('auth-link');
        const logoutBtn = document.getElementById('logout-btn');
        const username = currentUser ? currentUser.username : 'Гость';

        if (authLink) {
            if (currentUser) {
                authLink.textContent = `Привет, ${username}`;
                authLink.href = 'Authorization.html';
            } else {
                authLink.textContent = 'Войти';
                authLink.href = 'Authorization.html';
            }
        }

        if (logoutBtn) {
            if (currentUser) {
                logoutBtn.style.display = 'block';
                logoutBtn.addEventListener('click', function () {
                    localStorage.removeItem('currentUser');
                    alert('Вы вышли из аккаунта');
                    location.href = 'Authorization.html';
                });
            } else {
                logoutBtn.style.display = 'none';
            }
        }
    }

    // Показываем форму обратной связи, если пользователь авторизован
    const contactFormContainer = document.getElementById('contact-form-container');
    if (contactFormContainer && currentUser) {
        contactFormContainer.classList.remove('hidden');
    }

    // Обработчик отправки формы обратной связи
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const message = document.getElementById('contact-message').value;
            alert(`Сообщение отправлено!\n\nИмя: ${name}\nEmail: ${email}\nСообщение: ${message}`);
        });
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

    // Проверка состояния авторизации при загрузке страницы
    window.onload = function () {
        updateHeader();
        updateCartCount(); // Обновляем счетчик корзины
        if (currentUser) {
            updateCart();
        }
    };

    // Загружаем товары при загрузке страницы
    displayProducts();

    // Проверка состояния авторизации при загрузке страницы
    updateHeader();
    updateCartCount();
});
