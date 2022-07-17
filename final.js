const { ethers, Contract } = require("ethers");
const rpcURL = "https://cloudflare-eth.com/";
const provider = new ethers.providers.JsonRpcProvider(rpcURL);
const https = require("https");

const Twitter = require("twitter");
const { receiveMessageOnPort } = require("worker_threads");

const client = new Twitter({
  consumer_key: "nZ2svFKO1dDiogksJNhH05u76",
  consumer_secret: "20h8F6WayuYcpEdVgaGo8AN3DflQV2RE6p3OuFIqGlMEQ2D5CH",
  access_token_key: "1486096407299694593-xXHWqu7N6TwABsNyh17Xbw3Mwnjmyv",
  access_token_secret: "3Ep5A6hUOTZyy77thXudXKO0r5UzT4hE41imlxlQQnFqZ",
});

const contractAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const abi = require("./abi.json");

const contract = new Contract(contractAddress, abi, provider);

const TRANSFER_THRESHOLD = 500000000000;

const main = async () => {
  const name = await contract.name();
  const symbol = await contract.symbol();
  console.log(
    `Whale tracker statrted! \nListening for large transfers on ${name}`
  );

  contract.on("Transfer", (from, to, amount, data) => {
    if (amount.toNumber() >= TRANSFER_THRESHOLD) {
      https
        .get(
          `https://api.whale-alert.io/v1/transaction/ethereum/${data.transactionHash}?api_key=ZAH7vlqi4m9vdSk89LKPeyaAfhCp3Ke9`,
          (resp) => {
            let data = "";

            // A chunk of data has been received.
            resp.on("data", (chunk) => {
              data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on("end", () => {
              data = JSON.parse(data);
              console.log(data);
              console.log(data.transactions[0].from);
              let sender=from;
              let receiver=to;

              if(data.transactions[0].from.owner_type=="unknown"){
                sender="an unknown address";
              }else if(data.transactions[0].from.owner_type=="exchange"){
                sender=data.transactions[0].from.owner;
              }

              

              if(data.transactions[0].to.owner_type=="Unknown"){
                receiver="an unknown address";
              }else if(data.transactions[0].to.owner_type=="Exchange"){
                receiver=data.transactions[0].to.owner;
              }



              client.post(
                "statuses/update",
                {
                  status: `New whale transfer for ${name}: https://etherscan.io/tx/${
                    data.transactionHash
                  } ${(amount / 10 ** 6).toFixed(
                    2
                  )} ${symbol} transferred from ${sender} to ${receiver}`,
                },
                function (error, tweet, response) {
                  if (error) throw error;
                //   console.log(tweet); // Tweet body.
                //   console.log(response); // Raw response object.
                }
              );
            });
          }
        )
        .on("error", (err) => {
          console.log("Error: " + err.message);
        });
    }
  });
};

main();
