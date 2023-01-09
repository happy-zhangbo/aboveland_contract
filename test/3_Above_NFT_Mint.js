
describe("Base Test", function () {

    async function signMetadata(types, contents, owner){
        var msg = ethers.utils.keccak256(ethers.utils.solidityPack(types, contents));
        var msgHash = ethers.utils.arrayify(msg);
        var sign = await owner.signMessage(msgHash);
        return sign;
      }

    describe("NFT", async function(){
        it("Test NFT1155 Mint", async function(){
            const [ owner ] = await ethers.getSigners();
            const NFTContract = await ethers.getContractFactory("AboveAssets");
            gameItems = await NFTContract.attach("0x8203d612DE5242d40d9bF1824568B4a128CB4a20")
            const nonce = await gameItems._nonce(owner.address);
            const sign = await signMetadata(
                ["address", "uint256","string", "string", "uint256"],
                 [owner.address, 4258,"legend", "QmSsw6EcnwEiTT9c4rnAGeSENvsJMepNHmbrgi2S9bXNJr", nonce], 
                 owner);
            console.log(sign, nonce);

            // const tx = await gameItems.mintNft(owner.address, 4258, "legend", "QmSsw6EcnwEiTT9c4rnAGeSENvsJMepNHmbrgi2S9bXNJr", sign);
            // const receipt = await tx.wait()
            // let tokenId = -1;
            // for (const event of receipt.events) {
            //     if(event.event == "TransferSingle"){
            //       tokenId = event.args.id;
            //     }
            // }
            // const uri = await gameItems.uri(tokenId);
            // console.log(uri);

        });

    });

});