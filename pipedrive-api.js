const API_TOKEN = '6a5ede21d8bda2613a7064669667f759c8a00b53';
const API_URL = 'https://api.pipedrive.com/v1/';

export async function submitFormToPipedrive(formData) {
    try {
        const fieldsData = await getCustomFields();
        const dealData = createDealData(formData, fieldsData);
        const responseData = await createDeal(dealData);
        return constructDealUrl(responseData);
    } catch (error) {
        console.error('Ошибка при отправке данных в Pipedrive:', error);
        throw error;
    }
}

async function getCustomFields() {
    const fieldsResponse = await fetch(`${API_URL}dealFields?api_token=${API_TOKEN}`);
    const fieldsData = await fieldsResponse.json();

    if (!fieldsResponse.ok) {
        throw new Error(`API error: ${fieldsData.error}`);
    }

    return fieldsData;
}

function createDealData(formData, fieldsData) {
    const dealData = {
        title: `${formData.get('firstName')} ${formData.get('lastName')} - ${formData.get('jobType')}`,
    };

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

    fieldsData.data.forEach(field => {
        const formFieldName = Object.keys(fieldMapping).find(key => fieldMapping[key] === field.name);
        if (formFieldName && formData.has(formFieldName)) {
            dealData[field.key] = formData.get(formFieldName);
        }
    });

    return dealData;
}

async function createDeal(dealData) {
    const response = await fetch(`${API_URL}deals?api_token=${API_TOKEN}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dealData),
    });

    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(`API error: ${responseData.error}`);
    }

    return responseData;
}

function constructDealUrl(responseData) {
    if (!responseData.data || !responseData.data.id) {
        throw new Error('ID сделки не найден');
    }

    const dealId = responseData.data.id;
    return `https://slowtravel.pipedrive.com/deal/${dealId}`;
}
