import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import axiod from "https://deno.land/x/axiod/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Configuration
const ApiKey = Deno.env.get('METAAPI_APIKEY');
const AccountId = Deno.env.get('METAAPI_ACCOUNT');

// Supabase configuration
const SUPABASE_URL = Deno.env.get("SUP_URL");
const SUPABASE_KEY = Deno.env.get("SUP_ANON_KEY");
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Postgresql
import { pgsql } from './db';

async function fetchHistoricalTrades() {

  // Calculate the date range for the last week
  const currentDate = new Date();
  const lastWeekStartDate = new Date(currentDate);
  lastWeekStartDate.setDate(currentDate.getDate() - 7);

  const formattedStartDate = lastWeekStartDate.toISOString();
  const formattedEndDate = currentDate.toISOString();

  const apiUrl = `https://metastats-api-v1.london.agiliumtrade.ai/users/current/accounts/${AccountId}/historical-trades/${formattedStartDate}/${formattedEndDate}?updateHistory=true`;

  // const apiUrl = `https://metastats-api-v1.london.agiliumtrade.ai/users/current/accounts/${AccountId}/historical-trades/2023-08-18%2000%3A00%3A00/2023-08-18%2020%3A00%3A00?updateHistory=true`;

  console.log(`METAAPI ApiKey: ${ApiKey}`);
  console.log(`METAAPI AccountId: ${AccountId}`);
  console.log(`----`);
  console.log(`SUPABASE_URL: ${SUPABASE_URL}`);
  console.log(`SUPABASE_KEY: ${SUPABASE_KEY}`);


  try {
    const response = await axiod.get(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        "auth-token": ApiKey,
      },
    });

    // console.log('Response data:', response.data); // Log the content of response.data

    // Assuming response.data is already an object
    const trades = response.data.trades;

    // loop data 
    trades.forEach(async trade => {
      if(trade.type != 'DEAL_TYPE_BALANCE') {
        const tradeData = {
          type: trade.type,
          symbol: trade.symbol,
          volume: trade.volume,
          profit: trade.profit,
          openPrice: trade.openPrice,
          closePrice: trade.closePrice,
          openTime: trade.openTime,
          closeTime: trade.closeTime,
          durationInMinutes: trade.durationInMinutes
        };
        // ORDER CLOSED BUY OR SELL
        // const [tradingHistory] = await
        const { data, error } = await supabase.from('trades')
                                        .upsert(tradeData)
                                        .select();

        console.log(JSON.stringify(data));
        console.log(JSON.stringify(error));
                      
        // console.log(JSON.stringify(tradeData));
      } else {
        // WD
      }
      
    });

    return trades;
  } catch (error) {
    console.error('An error occurred:', error.message);
    throw error; // Rethrow the error to be caught later
  }
}

serve(async (server) => {
  try {
    const tradeHistory = await fetchHistoricalTrades();
    // console.log(JSON.stringify(tradeHistory));
    return new Response("Success", { status: 200 }); // Send the fetched data as the response
  } catch (error) {
    return new Response("An error occurred.", { status: 500 }); // Handle the error response
  }
});





