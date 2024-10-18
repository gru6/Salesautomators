document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');

    const createDealButton = document.querySelector('.deal-creator__button');
    const modal = document.querySelector('.modal_deal');
    const closeButton = document.querySelector('.modal__close');
    const iframe = document.querySelector('.modal__form');

    let isModalOpening = false;

    createDealButton.addEventListener('click', function() {
        if (!isModalOpening) {
            isModalOpening = true;
            modal.style.display = 'block';
            
            // Перезагружаем iframe только если модальное окно было закрыто
            if (iframe && iframe.contentWindow.location.href === 'about:blank') {
                iframe.src = iframe.src;
            }
            
            setTimeout(() => {
                isModalOpening = false;
            }, 100);
        }
    });

    closeButton.addEventListener('click', closeModal);

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    function closeModal() {
        modal.style.display = 'none';
        // Сбрасываем форму и скрываем модальное окно
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage('resetForm', '*');
        }
    }

    /* // Слушаем сообщения от iframe
    window.addEventListener('message', function(event) {
        if (event.data.type === 'formSubmitted') {
            console.log('Форма отправлена:', event.data.success);
            if (event.data.success) {
                console.log('URL созданной сделки:', event.data.dealUrl);
                // Здесь можно что-то сделать с URL сделки, например, показать его пользователю
            }
        }
    }); */
});

console.log('Script file loaded');
