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

async function submitFormToPipedrive(formData) {
    const API_TOKEN = '6a5ede21d8bda2613a7064669667f759c8a00b53';
    const API_URL = 'https://api.pipedrive.com/v1/';

    try {
        // Get information about custom fields
        const fieldsResponse = await fetch(`${API_URL}dealFields?api_token=${API_TOKEN}`);
        const fieldsData = await fieldsResponse.json();

        if (!fieldsResponse.ok) {
            throw new Error(`API error: ${fieldsData.error}`);
        }

         // Create an object with deal data
        const dealData = {
            title: `${formData.get('firstName')} ${formData.get('lastName')} - ${formData.get('jobType')}`,
        };

        // Mapping form fields to Pipedrive keys
        const fieldMapping = {
            firstName: 'First name',
            lastName: 'Last name',
            phone: 'Phone',
            email: 'Email',
            adress: 'Adress',
            city: 'City',
            state: 'State',
            zipCode: 'Zip code',
            area: 'Area',
            jobType: 'Job type',
            jobSource: 'Job source',
            jobDescription: 'Job description',
            startDate: 'Date',
            startTime: 'Start time',
            endTime: 'End time',
            testSelect: 'Technician'
        };

         // Fill custom fields with form data
        fieldsData.data.forEach(field => {
            const formFieldName = Object.keys(fieldMapping).find(key => fieldMapping[key] === field.name);
            if (formFieldName && formData.has(formFieldName)) {
                dealData[field.key] = formData.get(formFieldName);
            }
        });

        console.log('Данные для отправки:', dealData);

         // Send data to create a deal
        const response = await fetch(`${API_URL}deals?api_token=${API_TOKEN}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dealData),
        });

        const responseData = await response.json();
        console.log('Ответ от API Pipedrive:', responseData);

        if (!response.ok) {
            throw new Error(`API error: ${responseData.error}`);
        }

        console.log('Сделка успешно создана!');
        
        if (!responseData.data || !responseData.data.id) {
            console.error('ID сделки отсутствует в ответе API');
            throw new Error('ID сделки не найден');
        }

        const dealId = responseData.data.id;
        const dealUrl = `https://slowtravel.pipedrive.com/deal/${dealId}`; // Замените 'your-company-domain' на ваш домен в Pipedrive
        console.log('Сконструированный URL сделки:', dealUrl);

        // Отправляем сообщение родительскому окну с URL сделки
        window.parent.postMessage({ 
            type: 'formSubmitted', 
            success: true,
            formData: Object.fromEntries(formData),
            dealUrl: dealUrl
        }, '*');

        return dealUrl;
    } catch (error) {
        console.error('Ошибка при отправке данных в Pipedrive:', error);
        throw error;
    }
}
