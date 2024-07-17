import fetch from 'node-fetch';

const baseURL = 'http://www.mcaps.com/api/v0';

async function getPrice(token) {
    const url = `${baseURL}/price/pump/${token}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log(responseData);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Example usage
getPrice('2dRJvQpBQK4PhVDsRosqsLtxWKKerhrVkukPkCDepump');
