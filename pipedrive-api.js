const API_TOKEN = '6a5ede21d8bda2613a7064669667f759c8a00b53';
const API_URL = 'https://api.pipedrive.com/v1/';

// Main function to submit form data to Pipedrive
export async function submitFormToPipedrive(formData) {
    try {
        // Get information about custom deal fields
        const fieldsData = await getCustomFieldsFromPipedrive();
        // Create a deal data object based on form data and custom fields
        const dealData = handleDealData(formData, fieldsData);
        // Send a request to create a deal in Pipedrive
        const responseData = await createDealInPipedrive(dealData);
        // Construct the URL of the created deal
        return constructDealUrl(responseData);
    } catch (error) {
        console.error('Error sending data to Pipedrive:', error);
        throw error;
    }
}

async function getCustomFieldsFromPipedrive() {
    const fieldsResponse = await fetch(`${API_URL}dealFields?api_token=${API_TOKEN}`);
    const fieldsData = await fieldsResponse.json();

    if (!fieldsResponse.ok) {
        throw new Error(`API error: ${fieldsData.error}`);
    }

    return fieldsData;
}

function handleDealData(formData, fieldsData) {
    // Create a basic deal object with a title
    const dealData = {
        title: `${formData.get('firstName')} ${formData.get('lastName')} - ${formData.get('jobType')}`,
    };

    // Object for mapping form fields to Pipedrive fields
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
        technician: 'Technician'
    };

    // Iterate through all custom fields from Pipedrive
    fieldsData.data.forEach(field => {
        // Find the corresponding form field
        const formFieldName = Object.keys(fieldMapping).find(key => fieldMapping[key] === field.name);
        // If the field is found and exists in the form data, add its value to the deal object
        if (formFieldName && formData.has(formFieldName)) {
            dealData[field.key] = formData.get(formFieldName);
        }
    });

    return dealData;
}

async function createDealInPipedrive(dealData) {
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
        throw new Error('Deal ID not found');
    }

    const dealId = responseData.data.id;
    return `https://slowtravel.pipedrive.com/deal/${dealId}`;
}
