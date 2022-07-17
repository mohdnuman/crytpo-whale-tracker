const { ethers, Contract } = require("ethers");
const rpcURL = "https://cloudflare-eth.com/";
const provider = new ethers.providers.JsonRpcProvider(rpcURL);

const Twitter = require("twitter");

const client = new Twitter({
  consumer_key: "nZ2svFKO1dDiogksJNhH05u76",
  consumer_secret: "20h8F6WayuYcpEdVgaGo8AN3DflQV2RE6p3OuFIqGlMEQ2D5CH",
  access_token_key: "1486096407299694593-xXHWqu7N6TwABsNyh17Xbw3Mwnjmyv",
  access_token_secret: "3Ep5A6hUOTZyy77thXudXKO0r5UzT4hE41imlxlQQnFqZ",
});


const contractAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const abi =require("./abi.json");

const contract = new Contract(contractAddress, abi, provider);

const TRANSFER_THRESHOLD = 100000000000;

const main = async () => {
  const name = await contract.name();
  const symbol=await contract.symbol();
  console.log(
    `Whale tracker statrted! \nListening for large transfers on ${name}`
  );

  contract.on("Transfer", (from, to, amount, data) => {
    if (amount.toNumber() >= TRANSFER_THRESHOLD) {
      client.post(
        "statuses/update",
        {
          status: `New whale transfer for ${name}: https://etherscan.io/tx/${data.transactionHash} ${(amount/10**6).toFixed(2)} ${symbol} transferred from ${from} to ${to}`,
        },
        function (error, tweet, response) {
          if (error) throw error;
          console.log(tweet); // Tweet body.
          console.log(response); // Raw response object.
        }
      );
    }
  });
};

main();
