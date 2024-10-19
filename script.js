document.addEventListener('DOMContentLoaded', function () {

    const createDealButton = document.querySelector('.deal-creator__button');
    const modal = document.querySelector('.modal_deal');
    const closeButton = document.querySelector('.modal__close');

    let isModalOpen = false;

    createDealButton.addEventListener('click', function (event) {
        if (!isModalOpen) {
            openModal();
        }
    });

    closeButton.addEventListener('click', closeModal);

    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    function openModal() {
        if (!isModalOpen) {
            isModalOpen = true;
            modal.style.display = 'block';
        }
    }

    function closeModal() {
        isModalOpen = false;
        modal.style.display = 'none';
    }
});
