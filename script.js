document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');

    const createDealButton = document.querySelector('.deal-creator__button');
    const modal = document.querySelector('.modal_deal');
    const closeButton = document.querySelector('.modal__close');
    const iframe = document.querySelector('.modal__form');

    createDealButton.addEventListener('click', function() {
        modal.style.display = 'block';
    });

    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Listen messages from iframe
    window.addEventListener('message', function(event) {
        if (event.data.type === 'formSubmitted') {
            console.log('Форма отправлена:', event.data.formData);
            modal.style.display = 'none';
        }
    });
});

console.log('Script file loaded');
