require('dotenv').config();

// let MetaStats = require('metaapi.cloud-sdk').MetaStats;
// let MetaApi = require('metaapi.cloud-sdk').default;
const axios = require('axios');
const Table = require('cli-table');

// Configuration
const ApiKey = process.env.METAAPI_APIKEY;
const AccountId = process.env.METAAPI_ACCOUNT;

// console.log('API KEY: ' + ApiKey);
// console.log('----');
// console.log('Account ID: ' + AccountId);

async function fetchHistoricalTrades() {

    const apiUrl = `https://metastats-api-v1.london.agiliumtrade.ai/users/current/accounts/${AccountId}/historical-trades/2023-08-17%2000%3A00%3A00/2023-08-17%2020%3A00%3A00?updateHistory=true`;

    try {
        const response = await axios.get(apiUrl, {
            headers: {
            'auth-token': ApiKey
            }
        });

        const trades = response.data.trades;

        // Process the response data here
        // console.log(JSON.stringify(trades));

        const table = new Table({
            head: ['Type', 'Volume', 'Profit'],
            colWidths: [30, 15, 15],
        });

        trades.forEach(row => {
            if(row.type != 'DEAL_TYPE_BALANCE') {
                // console.log(`TYPE: ${row.type} VOLUME: ${row.volume} PROFIT: ${row.profit}`);
                const rowData = [row.type, row.volume, row.profit];
                table.push(rowData);
                // console.log(JSON.stringify(rowData));
                // sumProfit += row.profit;
            }
            
        });

        console.log(table.toString());

    } catch (error) {
        console.error('An error occurred:', error.message);
    }
}

// Call the function to fetch historical trades
fetchHistoricalTrades();