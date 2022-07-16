const { ethers, Contract } = require("ethers");
const rpcURL = "https://cloudflare-eth.com/";
const provider = new ethers.providers.JsonRpcProvider(rpcURL);

const Twitter = require("twitter");

const client = new Twitter({
  consumer_key: "7nx3DkuKdwnvmyUJcAxBhgClx",
  consumer_secret: "4ouCKdFrTtWlTQTVwqswLCyJqXB6GJER7hyduWohJqmZW1lQD6",
  access_token_key: "1486096407299694593-J9FeKnXEour4QztNcmkMRaToe33dwh",
  access_token_secret: "f03xBTiN2pA0FoQu0TxgrpCpwEEDPvSvJgPoiMVEl8LpW",
});

const contractAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const abi =require("./abi.json");

const contract = new Contract(contractAddress, abi, provider);

const TRANSFER_THRESHOLD = 100000000000;

const main = async () => {
  const name = await contract.name();
  console.log(
    `Whale tracker statrted! \nListening for large transfers on ${name}`
  );

  contract.on("Transfer", (from, to, amount, data) => {
    if (amount.toNumber() >= TRANSFER_THRESHOLD) {
      client.post(
        "statuses/update",
        {
          status: `New whale transfer for ${name}: https://etherscan.io/tx/${data.transactionHash} from ${from} to ${to}`,
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
