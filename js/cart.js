// Загружаем массив пользователей из локального хранилища
let users = JSON.parse(localStorage.getItem('users')) || [];

// Загружаем текущего пользователя
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

window.onload = function () {
    // Проверяем авторизацию
    if (!currentUser) {
        alert('Вы должны войти в аккаунт, чтобы получить доступ к корзине.');
        location.href = 'Authorization.html'; // Перенаправляем на страницу авторизации
        return; // Останавливаем дальнейшее выполнение
    }

    const cart = getUserCart(); // Загружаем корзину текущего пользователя
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const clearCartButton = document.getElementById('clear-cart'); // Кнопка для очистки корзины

    // Очистка корзины
    clearCartButton.addEventListener('click', function () {
        clearCart(); // Очищаем корзину
    });

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Ваша корзина пуста.</p>';
        cartTotal.textContent = '';
    } else {
        cartItemsContainer.innerHTML = ''; // Очистить корзину
        let total = 0;

        // Создаем список товаров в корзине
        cart.forEach((product, index) => {
            const productElement = document.createElement('div');
            productElement.classList.add('cart-item');
            productElement.innerHTML = `
                <span>${product.name} - ${product.price} ₽ x ${product.quantity}</span>
                <button class="remove-item" data-index="${index}">Удалить</button>`;

            // Слушаем кнопку удаления товара
            const removeButton = productElement.querySelector('.remove-item');
            removeButton.addEventListener('click', function () {
                removeFromCart(product.id); // Удаляем товар по его id
            });

            cartItemsContainer.appendChild(productElement);
            total += product.price * product.quantity; // Подсчитываем общую стоимость
        });

        cartTotal.textContent = `Общая стоимость: ${total} ₽`;
    }
    updateHeader(); // Обновляем хедер
};

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

// Функция для удаления товара из корзины
function removeFromCart(productId) {
    const cart = getUserCart();
    const updatedCart = cart.filter(item => item.id !== productId); // Убираем товар из корзины по его id

    saveUserCart(updatedCart); // Сохраняем обновленную корзину в localStorage
    window.location.reload(); // Перезагружаем страницу, чтобы обновить корзину
}

// Функция для очистки всей корзины
function clearCart() {
    saveUserCart([]); // Очищаем корзину текущего пользователя
    window.location.reload(); // Перезагружаем страницу, чтобы очистить корзину
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