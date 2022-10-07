//Create a new item called Active items
//Add items when they are listed on the market place
//Remove them when they are bought or canceled

//This line means anytime something is listed in the itemListed tabble, we run an async function, anytime
//an itemListed happens, we wanna add it to our active items List.
//We only want to update active items when the transaction is confirmed..

Moralis.Cloud.afterSave("ItemListed", async (request) => {
    const confirmed = request.object.get("confirmed")
    const logger = Moralis.Cloud.getLogger()
    logger.info("Looking for confirmed TX...")
    if (confirmed) {
        logger.info("Found item!")
        const ActiveItem = Moralis.Object.extend("ActiveItem")

        // In case of listing update, search for already listed ActiveItem and delete
        const query = new Moralis.Query(ActiveItem)
        query.equalTo("nftAddress", request.object.get("nftAddress"))
        query.equalTo("tokenId", request.object.get("tokenId"))
        query.equalTo("marketplaceAddress", request.object.get("address"))
        query.equalTo("seller", request.object.get("seller"))
        logger.info(`Marketplace | Query: ${query}`)
        const alreadyListedItem = await query.first()
        console.log(`alreadyListedItem ${JSON.stringify(alreadyListedItem)}`)
        if (alreadyListedItem) {
            logger.info(`Deleting ${alreadyListedItem.id}`)
            await alreadyListedItem.destroy()
            logger.info(
                `Deleted item with tokenId ${request.object.get(
                    "tokenId"
                )} at address ${request.object.get(
                    "address"
                )} since the listing is being updated. `
            )
        }

        // Add new ActiveItem
        const activeItem = new ActiveItem()
        activeItem.set("marketplaceAddress", request.object.get("address"))
        activeItem.set("nftAddress", request.object.get("nftAddress"))
        activeItem.set("price", request.object.get("price"))
        activeItem.set("tokenId", request.object.get("tokenId"))
        activeItem.set("seller", request.object.get("seller"))
        logger.info(
            `Adding Address: ${request.object.get("address")} TokenId: ${request.object.get(
                "tokenId"
            )}`
        )
        logger.info("Saving...")
        await activeItem.save()
    }
})
//afterSave is called the trigger for our cloud function
Moralis.Cloud.afterSave("ItemCanceled", async (request) => {
    const confirmed = request.object.get("confirmed")
    const logger = Moralis.Cloud.getLogger()
    logger.info(`Marketplace | Object: ${request.object}`)
    if (confirmed) {
        //"itemListed" = if Active item exists, grab it, if it doesnt, create it
        //"itemCanceled" = if this transaction is confirmed after one block, we remove it from active item
        const ActiveItem = Moralis.Object.extend("ActiveItem")
        //"itemListed" = we now create a new entry in this active item that we are creating..
        //"itemCanceled" = And we use query to first find out that active item that is being canceled
        // or that is going to match the request here so we can cancel it
        const query = new Moralis.Query(ActiveItem)
        //"itemListed" = we can set any of the columns we want for this new table that we are
        // creating(in our database)  so we give it a marketplaceAddress Column and this will come from
        // request.object.get("address"))
        // ItemCanceled = we are looking for an active item where the marketPlaceAddress is going to be the same
        //as the address of the item canceled so in essence, we are looking for the address of the seller, address
        // of the marketPlace and tokenId, we dont need to look for the seller
        // (input parameters for itemCanceled events)
        query.equalTo("marketplaceAddress", request.object.get("address"))
        query.equalTo("nftAddress", request.object.get("nftAddress"))
        //we get the token id
        query.equalTo("tokenId", request.object.get("tokenId"))
        //we print out this query that we are running
        logger.info(`Marketplace | Query: ${query}`)
        //we are gonna find the first active item in the address and tokenId that just got canceled
        const canceledItem = await query.first()
        //we print out the canceled item here
        logger.info(`Marketplace | CanceledItem: ${JSON.stringify(canceledItem)}`)
        //if the query doesnt find anything, it will return undefined
        if (canceledItem) {
            logger.info(`Deleting ${canceledItem.id}`)
            //we remove it from the active item
            await canceledItem.destroy()
            logger.info(
                `Deleted item with tokenId ${request.object.get(
                    "tokenId"
                )} at address ${request.object.get("address")} since it was canceled. `
            )
        } else {
            logger.info(
                `No item canceled with address: ${request.object.get(
                    "address"
                )} and tokenId: ${request.object.get("tokenId")} found.`
            )
        } //To test that this code is actually working, we go to our Nft MarketPlace backend and make a new script
    } // called cancelItem (inside scripts folder)
}) //Now we have a cloud function thats going to create a new entry and a new table

Moralis.Cloud.afterSave("ItemBought", async (request) => {
    //we get whether this transaction is confirmed
    const confirmed = request.object.get("confirmed")
    const logger = Moralis.Cloud.getLogger()
    logger.info(`Marketplace | Object: ${request.object}`)
    if (confirmed) {
        const ActiveItem = Moralis.Object.extend("ActiveItem")
        const query = new Moralis.Query(ActiveItem)
        query.equalTo("marketplaceAddress", request.object.get("address"))
        query.equalTo("nftAddress", request.object.get("nftAddress"))
        query.equalTo("tokenId", request.object.get("tokenId"))
        logger.info(`Marketplace | Query: ${query}`)
        const boughtItem = await query.first()
        logger.info(`Marketplace | boughtItem: ${JSON.stringify(boughtItem)}`)
        if (boughtItem) {
            logger.info(`Deleting boughtItem ${boughtItem.id}`)
            await boughtItem.destroy()
            logger.info(
                `Deleted item with tokenId ${request.object.get(
                    "tokenId"
                )} at address ${request.object.get(
                    "address"
                )} from ActiveItem table since it was bought.`
            )
        } else {
            logger.info(
                `No item bought with address: ${request.object.get(
                    "address"
                )} and tokenId: ${request.object.get("tokenId")} found`
            )
        }
    }
})
//To test that this code is actually working, we go to our Nft MarketPlace backend again and make a new script
// called buyItem (inside scripts folder)
