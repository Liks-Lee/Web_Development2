window.onload = function () {
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
                <button class="remove-item" data-index="${index}">Удалить</button>
            `;

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
