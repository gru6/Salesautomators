document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');

    const modal = document.querySelector(".modal_deal");
    const modalOpenBtn = document.querySelector(".deal-creator__button");
    const modalCloseBtn = document.querySelector(".modal__close");
    const modalForm = document.querySelector(".modal__form");

    modalOpenBtn.addEventListener('click', function() {
        console.log('Button clicked');
        modal.style.display = "block";
    });

    modalCloseBtn.addEventListener('click', function() {
        modal.style.display = "none";
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});

console.log('Script file loaded');
