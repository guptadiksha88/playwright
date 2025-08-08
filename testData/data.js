export const LOGIN_CREDENTIALS = {
    username: 'standard_user',
    password: 'secret_sauce'
};


export function generateCustomerInfo() {
    return {
        firstName: 'Diksha',
        lastName: 'Gupta',
        postalCode: '000000'
    };
}


export function generateTestScenario(itemCount = 3) {
    return {
        customer: generateCustomerInfo(),
        credentials: LOGIN_CREDENTIALS,
        expectedItemCount: itemCount,
        timestamp: new Date().toISOString()
    };
}