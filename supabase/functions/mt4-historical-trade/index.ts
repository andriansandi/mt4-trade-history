import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import axiod from "https://deno.land/x/axiod/mod.ts";

// Configuration
const ApiKey = Deno.env.get('METAAPI_APIKEY');
const AccountId = Deno.env.get('METAAPI_ACCOUNT');

async function fetchHistoricalTrades() {
  const apiUrl = `https://metastats-api-v1.london.agiliumtrade.ai/users/current/accounts/${AccountId}/historical-trades/2023-08-17%2000%3A00%3A00/2023-08-17%2020%3A00%3A00?updateHistory=true`;

  console.log(`ApiKey: ${ApiKey}`);
  console.log(`AccountId: ${AccountId}`);

  try {
    const response = await axiod.get(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        "auth-token": ApiKey,
      },
    });

    console.log('Response data:', response.data); // Log the content of response.data

    // Assuming response.data is already an object
    const trades = response.data;
    return trades;
  } catch (error) {
    console.error('An error occurred:', error.message);
    throw error; // Rethrow the error to be caught later
  }
}

serve(async (server) => {
  try {
    const tradeHistory = await fetchHistoricalTrades();
    console.log(JSON.stringify(tradeHistory));
    return new Response("Success", { status: 200 }); // Send the fetched data as the response
  } catch (error) {
    return new Response("An error occurred.", { status: 500 }); // Handle the error response
  }
});





