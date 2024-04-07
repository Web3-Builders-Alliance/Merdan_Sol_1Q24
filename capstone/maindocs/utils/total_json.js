// utils/total_json.js

const axios = require("axios");

const apikey = "";
const solanafmBaseUrl = "https://api.solana.fm";
const birdeyeBaseUrl = "https://public-api.birdeye.so";
const tokenPriceApiKey = "";

export const fetchTransactionHistoryJSON = async (walletAddress, epochFromTimestamp, epochToTimestamp) => {
  try {
    let totalPages = 1;
    let page = 1;
    let allRecords = [];

    do {
      const response = await axios.get(
        `${solanafmBaseUrl}/v0/accounts/${walletAddress}/transfers`,
        {
          params: {
            utcFrom: epochFromTimestamp,
            utcTo: epochToTimestamp,
            page: page,
          },
          headers: {
            ApiKey: apikey,
          },
        }
      );

      if (totalPages === 1) {
        console.log(
          "Total pages to index: ",
          response.data.pagination.totalPages
        );
        totalPages = response.data.pagination.totalPages;
      }
      console.log("Retrieving data for page: ", page);
      let responseData = response.data.results;

      // Convert epoch timestamp to UTC format for each movement
      responseData.forEach((transaction) => {
        transaction.data.forEach((movement) => {
          const timestampUTC = new Date(movement.timestamp * 1000).toUTCString();
          movement.timestampUTC = timestampUTC;
        });
      });

      // Process each transaction
      for (const transaction of responseData) {
        for (const movement of transaction.data) {
          const tokenHash = movement.token;
          const time_from = movement.timestamp;
          const time_to = movement.timestamp + 87433;

          if (tokenHash) {
            const tokenResponse = await axios.get(
              `${solanafmBaseUrl}/v1/tokens/${tokenHash}`,
              {
                headers: {
                  ApiKey: apikey,
                },
              }
            );

            const tokenData = tokenResponse.data;
            let symbol = "";
            let decimals = "";
            if (tokenData && tokenData.tokenList) {
              symbol = tokenData.tokenList.symbol || "";
              decimals = tokenData.decimals || "";
            }

            movement.amount_decimal = movement.amount / Math.pow(10, decimals);

            const priceResponse = await axios.get(
              `${birdeyeBaseUrl}/public/history_price`,
              {
                params: {
                  address: tokenHash,
                  address_type: "token",
                  time_from: time_from,
                  time_to: time_to,
                },
                headers: {
                  "X-API-KEY": tokenPriceApiKey,
                },
              }
            );

            if (
              priceResponse.data &&
              priceResponse.data.data &&
              priceResponse.data.data.items &&
              priceResponse.data.data.items.length > 0
            ) {
              const closePrice = priceResponse.data.data.items[0].value;
              movement.closePrice = closePrice;
              movement.total_worth = closePrice * movement.amount_decimal;
            } else {
              console.log(
                "No price data found for token:",
                tokenHash
              );
            }
            movement.symbol = symbol;
            movement.decimals = decimals;
          }
        }
      }

      allRecords = allRecords.concat(responseData);
      console.log(JSON.stringify(responseData, null, 2));
      page++;
    } while (page <= totalPages);

    return allRecords;
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    throw error;
  }
};
