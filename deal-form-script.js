import { submitFormToPipedrive } from './pipedrive-api.js';

let isSubmitted = false;

const form = document.getElementById('dealForm');
const formStatus = document.querySelector('.form-status');
const statusMessage = document.querySelector('.status-message');
const loadingSpinner = document.querySelector('.loading-spinner');

function saveFormDataInLocalStorage() {
    if (!isSubmitted) {
        const formData = new FormData(form);
        const formDataObj = {};
        formData.forEach((value, key) => {
            formDataObj[key] = value;
        });
        localStorage.setItem('dealFormData', JSON.stringify(formDataObj));
    }
}

function loadFormDataFromLocalStorage() {
    const savedData = localStorage.getItem('dealFormData');
    if (savedData) {
        const formDataObj = JSON.parse(savedData);
        Object.keys(formDataObj).forEach(key => {
            const field = form.elements[key];
            if (field) {
                field.value = formDataObj[key];
            }
        });
    }
}

function resetForm() {
    form.reset();
    localStorage.removeItem('dealFormData');
    hideStatus();
    showForm();
    isSubmitted = false;
}

function hideStatus() {
    formStatus.style.display = 'none';
    form.style.display = 'grid';
}

function showForm() {
    formStatus.style.display = 'none';
    form.style.display = 'grid';
}

function showLoading() {
    formStatus.style.display = 'block';
    loadingSpinner.style.display = 'block';
    statusMessage.textContent = 'Sending data...';
    form.style.display = 'none';
}

function showSuccess(dealUrl) {
    formStatus.style.display = 'block';
    loadingSpinner.style.display = 'none';
    form.style.display = 'none';
    statusMessage.innerHTML = `
            Form successfully submitted!<br>
            ${dealUrl ? `<a href="${dealUrl}" target="_blank" class="deal-link">View created deal</a>` : 'Deal URL is not available'}
        `;
    setTimeout(() => {
        resetForm();
    }, 5000);
}

function showError(error) {
    formStatus.style.display = 'block';
    loadingSpinner.style.display = 'none';
    form.style.display = 'none';
    statusMessage.textContent = `Error: ${error}`;
}

// Form submission handler
form.addEventListener('submit', async function (event) {
    event.preventDefault();

    if (form.checkValidity()) {
        const formData = new FormData(form);
        showLoading();

        try {
            const dealUrl = await submitFormToPipedrive(formData);
            showSuccess(dealUrl);
            isSubmitted = true;
            localStorage.removeItem('dealFormData');
        } catch (error) {
            console.error('Error sending data to Pipedrive:', error);
            showError(error.message);
        }
    } else {
        console.log('Form did not pass validation');
    }
});

form.addEventListener('input', saveFormDataInLocalStorage);

loadFormDataFromLocalStorage();

showForm();
