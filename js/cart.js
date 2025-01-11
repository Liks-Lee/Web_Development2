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

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
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

// Функция для удаления товара из корзины
function removeFromCart(productId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = cart.filter(item => item.id !== productId); // Убираем товар из корзины по его id

    localStorage.setItem('cart', JSON.stringify(updatedCart)); // Сохраняем обновленную корзину в localStorage
    window.location.reload(); // Перезагружаем страницу, чтобы обновить корзину
}

// Функция для очистки всей корзины
function clearCart() {
    localStorage.removeItem('cart'); // Удаляем корзину из localStorage
    window.location.reload(); // Перезагружаем страницу, чтобы очистить корзину
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


