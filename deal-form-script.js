import { submitFormToPipedrive } from './pipedrive-api.js';

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, скрипт инициализирован');

    const form = document.getElementById('dealForm');
    const formStatus = document.querySelector('.form-status');
    const statusMessage = document.querySelector('.status-message');
    const loadingSpinner = document.querySelector('.loading-spinner');

    function hideStatus() {
        formStatus.style.display = 'none';
        form.style.display = 'grid';
        form.reset();
    }

    function showForm() {
        formStatus.style.display = 'none';
        form.style.display = 'grid';
    }

    function showLoading() {
        formStatus.style.display = 'block';
        loadingSpinner.style.display = 'block';
        statusMessage.textContent = 'Отправка данных...';
        form.style.display = 'none';
    }

    function showSuccess(dealUrl) {
        formStatus.style.display = 'block';
        loadingSpinner.style.display = 'none';
        form.style.display = 'none';
        statusMessage.innerHTML = `
            Форма успешно отправлена!<br>
            ${dealUrl ? `<a href="${dealUrl}" target="_blank" class="deal-link">Посмотреть созданную сделку</a>` : 'URL сделки недоступен'}
        `;
    }

    function showError(error) {
        formStatus.style.display = 'block';
        loadingSpinner.style.display = 'none';
        form.style.display = 'none';
        statusMessage.textContent = `Ошибка: ${error}`;
    }

    // Обработчик сообщений
    window.addEventListener('message', function(event) {
        if (event.data === 'resetForm') {
            hideStatus();
            /* showForm(); */
        }
    });

    // Обработчик отправки формы
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        if (form.checkValidity()) {
            const formData = new FormData(form);
            showLoading();
            
            try {
                const dealUrl = await submitFormToPipedrive(formData);
                showSuccess(dealUrl);
                // Отправляем сообщение родительскому окну
                window.parent.postMessage({ type: 'formSubmitted', success: true, dealUrl: dealUrl }, '*');
            } catch (error) {
                console.error('Ошибка при отправке данных в Pipedrive:', error);
                showError(error.message);
            }
        } else {
            console.log('Форма не прошла валидацию');
        }
    });

    // Показываем форму при загрузке страницы
    showForm();
});
