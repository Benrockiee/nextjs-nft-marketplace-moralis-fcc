
1. Home Page >> INDEX.JS
1. Show recently listed NFTS
a. If you own the NFTS, You can update the listings
b. If not, you can buy the listings

2. Sell page
1. You can list your NFT on the market place
2. You can withdraw the proceeds


a) So first, how do we show the listed NFTS? We will index the events off-chain and then read from
our database
b) We set up a server to listen to those events to be fired and then we will add them to a data base
to query, this means any single time a data is listed, we are going to index it in the data base for
ourselves and then we are going to call our centralised data base to start, and we are gonna call that
data base to do that.
Now the question remains, isnt that centralised? 
The answer is not necessarily so the graph is a protocol that does exactly this, its a protocol that
listens to events off chain and sticks it into the graph protocol and it does it in a decentralised way
but moralis does this in a centralised way and comes with a ton of other features which might be the
route that we wanna go for speed and all these other features so that we can do a local development 
(which we are going to do here) or any other functionalities that moralis comes with because moralis
does more than just events, something to keep in mind is even though we are adding a centralised 
component, our logic, our smart contracts, the real book of this application is decentralised and you 
can verify all your interactions are working with the decentralised smart contracts.
We've actually been using some of these centralized protocols like Etherscan, Opensea, and they are 
really important to this space.

We show moralis to get us familiar with working with one of these centralised servers, incase we 
optionally want to make use of an application that provides a centralised service and theres a tons 
of tools in space like openzeppelin defender, tinderly and more that are centralised but gives us massive
benefits and then the graph is going to be the decentralised way which is a bit of a longer process to 
go mainnet, but it will all be explained when we get there, FIRST lets learn how we can list the most 
recently listed NFTs.
Normally if we are reading from the contract, we usuallyu do something like 
const value = await contract.getListing(Stuffs in here) but instead we are going to :
a) we will read from a database that has all the mappings in an easier to read data structure, both 
moralis and the graph do this


MORALIS 
1 Provides a single work flow for doing things and building high performance dapps
2 fully compatible with our favorite web3 tools and services

IN our .env, in other for our frontends to read file from our .env varaiables, we need to use "NEXT_PUBLIC" to be
able to stick it in our Application 

so in our database, we make it in the sense that whenever somebody buys or cancels an item, you need to remove that 
from your data base
so how do we tell MORALIS to start listening to our events?
1. We first need to connect it to our Blockchain
2. Then we say, which contracts, which events, and what to do when it hears those events.


 so how do we connect our moralis server to our blockchain?
 we have to go to our backend and spin up that node again (Localhost)
 after spinning it up, we go to moralis Dev chain proxy server and this is how we tell moralis to listen to 
 our locally running hardhat node
 so now we download a file in other for moralis to be able to listen to our events and index them, 
  "frp_0.37.0_windows_amd64.zip" when we are done with the installation, we make frc folder and we see those
  files pasted, then we go to our dev chain proxy server and copy the hardhat thing and paste it into our frpx.ini
  file..Then we cd into frp and run "chmod +x frpc.exe" to give permission and to avoid any errors, then we paste
  ./frpc.exe -c frpc.ini to initialise that moralis server or we can simply use a CLI (Command Line Interface)
  so we install with "yarn global add moralis-admin-cli then we can now run "moralis-admin-cli" and we will see a
  lot of stuff but one of the most important ones we are going to work with is "connect-local-devchain" so we can now jump into our package.json and add an additional script in there under "lint" called "moralis sync" just to make it easier for us to connect to our local-devchain, if we run "yarn moralis:sync", its going to ask us to
  specify our moralis Api Key so we need to add our Moralis Api key and Api secret to our dotenv file, the reason
  "moralisApiSecret" and "moralisApiKey" did not start with "NEXT PUBLIC" is because these are not going to be part
  of our front end piece, they are just keys we use for our backend to test and for our local-devchain connection.

  So once we run "yarn moralis:sync" in our therminals and see "Starting connection to Hardhat", we go back
  to our servers >>>, if its connected, then we've successfully connected our moralis server to our hardhat node.

 SO HOW DO WE TELL MORALIS SERVER TO START LISTENING TO EVENTS:
  1. We can do this through the user interface by going to sync >> Add new sync >> we sync and watch "contract
  events" then we can manually add all the information there OR
  2. We can do this programmatically, we create a little scripts to tell our moralis server to watch for those 
  scripts then we see our database get upgraded to listen for those events. So we create a new file called 
  "addEvents.js' but if we go to the moralis Docs, there are many ways we can connect with SDK, we have learnt
  to do this with react but we will use nodeJs to do it this time around.. But first we go back to our backend to
  update our front end.. After all that, we continue with our "addEvents.js" script.. 

  What events Do we wanna listen for? In our NFT marketPlace, we have 3 events which are 
  1. itemListed
  2. itemBought
  3. itemCanceled.. These are the events we are going to listen to in our Moralis Database and we follow up that 
     moralis documentation on "Add new Event sync from code"
     So as we write that scripts, we follow up that information in our code.. 
     CHAINID = We are done with it
     DESCRIPTION = We leave it blank
     SYNC-HISTORICAL = Allows the node to go back throughout the blockchain, grab all the events ever emitted 
                       by that contract, since this is a very small local blockchain, we just set it to true.
     TOPIC = The topic is gonna be your event information, so to get the topic, we go back to our event code and the
             topic is just going to be the name of our event plus the type of our parameters.
    ABI(of just the events) =
    TABLE = This is gonna be the name of the table that we update in our Data base..

  

   itemBought : We do all these for itemBought and repeat the process.. When we are all done with these addEvents
   script and stuff, we can now send these items to our dataBase for indexing by running "node addEvents.js" and 
   go to our dataBase to see these enlisted options.. In our DataBase we see "EventSyncStatus", this is how our
   database knows that it needs to be listening to some events. What this means is that our data base is now listening to our blockchain node.

   So going back to our NFT Marketplace in our "mint and list" script, when we list an item, our moralis database 
   should hear that item listed and go ahead and stick it into this itemListed table that it made so for us to 
   test this out, we run that "mint and list" for our local host but before running this, we need to make sure that
   our hardhat node is synced with the moralis server, we do "yarn hardhat run scripts/mint-and-list-item.js --network localhost" and enter, after minting this, if  we switch back to our database and refresh, we see 
   that there is an itemListed in our data base..
   NOTE: Anytime we stop our hardhat node and goes back to our moralis server>> DevchainProxyServer and tries to 
   connect, it will already be disconnected and thats because our node is not running, if we restart our node now 
   and our connect local dev chain command is still running (yarn moralis:sync), if we go bacck to the server and 
   our node is still running,  it will now say connected but if we go back to our backend(NFT market place) and run 
   "yarn hardhat run scripts/mint-and-list-item.js --network localhost, if we go back to our database now and hit refresh, we dont see that item listed in there so our moralis server is looking to make sure that the blockchain 
   we are working with is the same one so if we cancel that blockchain(node) like we did, our moralis would be confused so what we need to do is to go back to the server and click "reset local chain" and this will tell moralis to continue, so then we can rerrun that mint-and-list-item.js with this reset local chain that we did,
   we can go back to our moralis and see the item listed.
   
    MORALIS CLOUD FUNCTIONS
  In our data base as we now have table of events from listed nfts and items, we could just query this item listed 
  table and grab everything in there, however we have an issue here, what happens if someone buys an NFT, if someone buys an NFT, the itemListed events will still be on our database but technically it wont be on the market
  place, it will be gone and wont be listed, so what we can do is to use moralis cloud functions so moralis cloud 
  functions allows us to really add anything we want our front end to do from the moralis server, and these are
  functions, these are scripts that are going to run on a moralis server whenever we want them to so we go to our server and hit "cloud function" this is where we can write moralis stuff to run on our server whenever we want,
  we can sync up our visual studio code with moralis by running a command on our terminals but we will rather add up that script in our package.json named "moralis:cloud and stuff", so now We create a folder called cloudFunctions and a file called "updateActiveItems.js"
  when we have added those scripts, we can run "yarn moralis"cloud", if it goes successfully, we go back to our moralsi server/cloud function, we see our front end updated.. NOTE: After that recent update, it only functions on IDE..
  The reason we create our updateActiveItems is so that whenever an item is bought or canceled, we update it and remove it from the update item list, updateActiveItems also means that anytime its listed, it will be active.. so our cloud functions is going to run only when one of these items are synced.. (itemBought, itemCanceled, itemListed)..
 As we are creating "updateActiveItems" script, we can see those logs happening on our logs database, but if we scroll futher on our listItems, we can see that it is still confirmed to be false, so we need to make a script in other to move one block and make this confirmation to be true, so in our backend(NFT MarketPlace) in our utils folder, we can make a file called move-blocks to move that block number so that when we run our own hardhat node, we actually have a complete control of what we want our hardhat node to do so we can actually mine nodes and move blocks ahead so that moralis knows that this transactions are confirmed because we are mining the block with the transaction and thats it cos moralis ends up waiting for that next block so we actually need to make a script for this block and we are also going to "evm_mine" for this blocks that comes with our hardhat blockchain, we make this script so that moralis can get that Block confirmation that its looking for..
 After we have done that and updatedActiveItems scripts(itemListed).. We can run up moralis server with "yarn moralis:server", we refresh and go back to our database, we wont find that active item table listed but when we go back to our NFT Marketplace backend and run "yarn hardhat run scripts/mint-and-list-item.js --network localhost",
 since now that we have that cloud functions that says okay anytime an item listed events happens, update that active item table. We should see active item update, now we run this (with our hardhat node always running of course) 

   PRACTICE RESETTING THE LOCAL CHAIN
   When we stop our terminals from running, we can restart everything and reenter into this local development environment cos normally when every connections is stopped in our terminals and we go back to the moralis server, it will automatically be disconnected because we arent up and running so therefore we do the following to start back up..
"yarn hardhat node" in our backend(NFT MarketPlace) to restart our local blockchain
  "yarn moralis:sync" in our frontend to sync back or connect back to our moralsi server
  Once we do the both and checks back in our moralis server, we will see that we are already connected back again and due to re-doing all these stuffs, we can now click on "reset local chain" to get things back up and running.
  Then we can just run "yarn run dev" to start back our front end if we want to but back in our data base when we refresh, it will still have all those items on it.
 We  update our Active items code, after each function we go back to our Back end and make scripts to ensure that it really works.. like itemBought >> scripts "buyItem", itemCanceled >> "cancelItem..
 We can run yarn moralis:cloud to update our database, when its been updated, then back in our Nft MarketPlace front end we can run "yarn hardhat run scripts/cancel-item.js --network localhost" or "yarn hardhat run scripts/buy-item.js --network localhost" and check back on our database and see it updated according to how we run these scripts..

 So we are now able to answer the question about how we can show the recently listed NFTS, we only want to show the Active NFTS(Active items) on the market place and now we have a system to get only the active ones that are currently on the market because we are indexing thesse events.
 NFT BOX is meant to show what our NFT should look like.. WE CAN NOW CONTINUE SETTING UP OUR FRONT END HERE..

   If you own the NFTS, You can update the listings SO WE ARE DONE WITH THE MORALIS AND NFT MARKETPLACE!!!

    The GraphProtocol
   Unlike the moralis server that is centralized, this is a decentralized event indexer.


- [Full-Stack Setup](#full-stack-setup)
  - [1. Git clone the contracts repo](#1-git-clone-the-contracts-repo)
  - [2. Start your node](#2-start-your-node)
  - [3. Connect your codebase to your moralis server](#3-connect-your-codebase-to-your-moralis-server)
  - [4. Globally install the `moralis-admin-cli`](#4-globally-install-the-moralis-admin-cli)
  - [5. Setup your Moralis reverse proxy](#5-setup-your-moralis-reverse-proxy)
    - [IMPORTANT](#important)
  - [6. Setup your Cloud functions](#6-setup-your-cloud-functions)
  - [7. Add your event listeners](#7-add-your-event-listeners)
    - [You can do this programatically by running:](#you-can-do-this-programatically-by-running)
    - [Or, if you want to do it manually](#or-if-you-want-to-do-it-manually)
  - [8. Mint and List your NFT](#8-mint-and-list-your-nft)
  - [9. Start your front end](#9-start-your-front-end)
- [Minimal Quickstart](#minimal-quickstart)

# Full-Stack Setup

## 1. Git clone the contracts repo

In it's own terminal / command line, run: 

```
git clone https://github.com/PatrickAlphaC/hardhat-nft-marketplace-fcc
cd hardhat-nextjs-nft-marketplace-fcc
yarn
```

## 2. Start your node 

After installing dependencies, start a node on it's own terminal with:

```
yarn hardhat node
```

## 3. Connect your codebase to your moralis server

Setup your event [moralis](https://moralis.io/). You'll need a new moralis server to get started. 

Sign up for a [free account here](https://moralis.io/).

Once setup, update / create your `.env` file. You can use `.env.example` as a boilerplate. 

```
NEXT_PUBLIC_APP_ID=XXXX
NEXT_PUBLIC_SERVER_URL=XXXX
moralisApiKey=XXX
moralisSubdomain=XXX
masterKey=XXX
chainId=31337
```

With the values from your account. 

Then, in your `./package.json` update the following lines:
```
"moralis:sync": "moralis-admin-cli connect-local-devchain --chain hardhat --moralisSubdomain XXX.usemoralis.com --frpcPath ./frp/frpc",
"moralis:cloud": "moralis-admin-cli watch-cloud-folder  --moralisSubdomain XXX.usemoralis.com --autoSave 1 --moralisCloudfolder ./cloudFunctions",
"moralis:logs": "moralis-admin-cli get-logs --moralisSubdomain XXX.usemoralis.com"
```

Replace the `XXX.usemoralis.com` with your subdomain, like `4444acatycat.usemoralis.com` and update the `moralis:sync` script's path to your instance of `frp` (downloaded as part of the Moralis "Devchain Proxy Server" instructions mentioned above)

## 4. Globally install the `moralis-admin-cli`

```
yarn global add moralis-admin-cli
```

## 5. Setup your Moralis reverse proxy 

> Optionally: On your server, click on "View Details" and then "Devchain Proxy Server" and follow the instructions. You'll want to use the `hardhat` connection. 

- Download the latest reverse proxy code from [FRP](https://github.com/fatedier/frp/releases) and add the binary to `./frp/frpc`. 
- Replace your content in `frpc.ini`, based on your devchain. You can find the information on the `DevChain Proxy Server` tab of your moralis server. 

In some Windows Versions, FRP could be blocked by firewall, just use a older release, for example frp_0.34.3_windows_386

Mac / Windows Troubleshooting: https://docs.moralis.io/faq#frpc

Once you've got all this, you can run: 

```
yarn moralis:sync
``` 

You'll know you've done it right when you can see a green `connected` button after hitting the refresh symbol next to `DISCONNECTED`. *You'll want to keep this connection running*.

<img src="./img/connected.png" width="200" alt="Connected to Moralis Reverse Proxy">

### IMPORTANT

Anytime you reset your hardhat node, you'll need to press the `RESET LOCAL CHAIN` button on your UI!

## 6. Setup your Cloud functions

In a separate terminal (you'll have a few up throughout these steps)

Run `yarn moralis:cloud` in one terminal, and run `yarn moralis:logs` in another. If you don't have `moralis-admin-cli` installed already, install it globally with `yarn global add moralis-admin-cli`.

> Note: You can stop these after running them once if your server is at max CPU capactity. 

If you hit the little down arrow in your server, then hit `Cloud Functions` you should see text in there. 

<img src="./img/down-arrow.png" width="500" alt="Cloud Functions Up">
<img src="./img/functions.png" width="250" alt="Cloud Functions Up">

Make sure you've run `yarn moralis:sync` from the previous step to connect your local Hardhat devchain with your Moralis instance. You'll need these 3 moralis commands running at the same time. 

## 7. Add your event listeners

### You can do this programatically by running:

```
node watchEvents.js
```

### Or, if you want to do it manually

Finally, go to `View Details` -> `Sync` and hit `Add New Sync` -> `Sync and Watch Contract Events`

Add all 3 events by adding it's information, like so: 

1. ItemListed:
   1. Description: ItemListed
   2. Sync_historical: True
   3. Topic: ItemListed(address,address,uint256,uint256)
   4. Abi: 
```
{
  "anonymous": false,
  "inputs": [
    {
      "indexed": true,
      "internalType": "address",
      "name": "seller",
      "type": "address"
    },
    {
      "indexed": true,
      "internalType": "address",
      "name": "nftAddress",
      "type": "address"
    },
    {
      "indexed": true,
      "internalType": "uint256",
      "name": "tokenId",
      "type": "uint256"
    },
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "price",
      "type": "uint256"
    }
  ],
  "name": "ItemListed",
  "type": "event"
}
```
    5. Address: <YOUR_NFT_MARKETPLACE_DEPLOYED_ADDRESS_FROM_HARDHAT>
    6. TableName: ItemListed

You can add the canceled and bought events later. 

## 8. Mint and List your NFT

Back in the main directory, run:

```
yarn hardhat run scripts/mint-and-list-item.js --network localhost
```

And you'll now have an NFT listed on your marketplace. 

## 9. Start your front end

At this point, you'll have a few terminals running:

- Your Hardhat Node
- Your Hardhat Node syncing with your moralis server
- Your Cloud Functions syncing
- Your Moralis Logging

And you're about to have one more for your front end. 

```
yarn run dev
```

And you'll have your front end, indexing service running, and blockchain running.

# Minimal Quickstart

1. Clone the backend repo

```
git clone https://github.com/PatrickAlphaC/hardhat-nft-marketplace-fcc
cd hardhat-nextjs-nft-marketplace-fcc
yarn
yarn hardhat node
```
Leave that terminal running^

2. Clone the frontend

```
git clone https://github.com/PatrickAlphaC/nextjs-nft-marketplace-moralis-fcc
cd nextjs-nft-marketplace-moralis-fcc
yarn
```

Setup your `.env` with moralis info and update your `package.json` with moralis subdomain.

3. Sync your hardhat node with moralis

Update your `frpc.ini` file with what you see in the moralis UI.

Leave this terminal running: 

```
yarn moralis:sync
```

4. Watch for events && Update cloud functions

Run once:
```
yarn moralis:cloud
```

```
node watchEvents.js
```

5. Emit an event

Back in your hardhat project, run:

```
yarn hardhat run scripts/mint-and-list-item.js --network localhost
```

And you should see it updated in the database
