document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, скрипт инициализирован');

    const form = document.querySelector('.deal-form');
    const submitButton = document.querySelector('.deal-form__submit');

    if (submitButton) {
        submitButton.addEventListener('click', function(event) {
            event.preventDefault();
            console.log('Кнопка Create Job нажата');

            const formData = new FormData(form);
            submitFormToPipedrive(formData);
        });
    } else {
        console.warn('Кнопка Create Job не найдена');
    }
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
    } catch (error) {
        console.error('Ошибка при отправке данных в Pipedrive:', error);
    }
}
