const Instagram = require('instagram-web-api');
 
// const { username, password } = process.env // Only required when no cookies are stored yet
 
const client = new Instagram({ username: 'numan.eth', password: 'numan2000' })
 

// main=async()=>{
// // const { username, password, cookies } = await client.login({ username: 'mohd.numan_', password: 'Mohd@numan786' })
// const { authenticated, user } = await client.login({ username: 'numan.eth', password: 'Mohd@numan786' })
// console.log(user,authenticated);
// }

// main();

main=async()=>{
  // URL or path of photo
  const photo ="https://bafybeihp5pwxp5ralzfd7wvghzmysim44asav5jpqox5y6owazo7hyjkn4.ipfs.nftstorage.link/4129.png?ext=png"

  console.log(photo);


   client.login({ username: 'numan.eth', password: 'numan2000' })
  .then(async () => {
    challengeUrl="/challenge/action/AXH5uuE5N3nGmlNIiHfddC2tPaQvt52k37ynURNmpePBc3p5_uy8WlNE7Tn5K-0Du3yqhJw/AfwIUmxMi0d_j42zSKeczNG_ZcVxsOI-ovYmH89_Y1kv1kPZmEm4UfoG5zZho3Xva-80q37Vz3UT9g/ffc_lCXaZ95nEexIf9it2QxI2dDXKVoDLDsP7ULMj4gLl3YPjDqm3xIMZfNd0baOtjgr/";
    await client.updateChallenge({ challengeUrl, choice: 1  });
    await client.uploadPhoto({ photo, caption: "testing", post: 'feed' });
  })

  

}

main();