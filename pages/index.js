import Image from "next/image"
import styles from "../styles/Home.module.css"
//This allows us to use and fetch queries from our data base in a react context
import { useMoralisQuery, useMoralis } from "react-moralis"
import NFTBox from "../components/NFTBox"
//First thing we always need is to create a connect button so we make a component folder and create new file
//>> Header.js so we move over to that file now
export default function Home() {
    const { isWeb3Enabled } = useMoralis()
    //To get all of our active items from our Database and check if this query is still fetching, we say:
    const { data: listedNfts, isFetching: fetchingListedNfts } = useMoralisQuery(
        // TableName
        // Function for the query
        "ActiveItem",
        (query) => query.limit(10).descending("tokenId")
    )
    console.log(listedNfts)

    return (
        <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
            <div className="flex flex-wrap">
                {isWeb3Enabled ? (
                    fetchingListedNfts ? (
                        <div>Loading...</div>
                    ) : (
                        listedNfts.map((nft) => {
                            console.log(nft.attributes)
                            const { price, nftAddress, tokenId, marketplaceAddress, seller } =
                                nft.attributes
                            return (
                                <NFTBox
                                    price={price}
                                    nftAddress={nftAddress}
                                    tokenId={tokenId}
                                    marketplaceAddress={marketplaceAddress}
                                    seller={seller}
                                    key={`${nftAddress}${tokenId}`}
                                />
                            )
                        })
                    )
                ) : (
                    <div>Web3 Currently Not Enabled</div>
                )}
            </div>
        </div>
    )
}
/* We did this to check if we are fetching those NFTS
      fetchingListedNfts ? (
        <div>Loading...</div>
        ) : ( 
            listedNfts.map((nft) =>  //THIS means that we are basically going to loop through each NFT
             console.log(nft.attributes) //Inside these attributes are the attributes we want like price, etc..
                            const { price, nftAddress, tokenId, marketplaceAddress, seller } =
                                nft.attributes
                            return ( //We pull them out by returning it
                                <NFTBox  //we add our NFT Box component an pass in all the parameters it takes
                                    price={price}
                                    nftAddress={nftAddress}
                                    tokenId={tokenId}
                                    marketplaceAddress={marketplaceAddress}
                                    seller={seller}
                              key={`${nftAddress}${tokenId}`} //nftAddress combined with the tokenId can be the key
                                    */
