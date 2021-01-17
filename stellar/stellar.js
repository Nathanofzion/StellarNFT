const StellarSdk = require('stellar-sdk');
const TransactionStellarUri = require('@stellarguard/stellar-uri').TransactionStellarUri;

const checkAccount = async (publicKey) => {
    let passed = true;
    let errorMessage = '';
    try{
        const server = new StellarSdk.Server("https://horizon-testnet.stellar.org");
        const account=await server.loadAccount(publicKey);
        const stellarBalance = account.balances.find(balance => balance.asset_type == 'native')
        if(stellarBalance<3){
            passed=false;
            errorMessage="Insufficient account balance"
        }
    } catch (error){
        passed=false
        console.log(error)
        errorMessage = error.response.extras.reason
    }
    console.log({passed, errorMessage})
    return {passed, errorMessage}
}

const getIpfsHash = async (body) => {
    const response = await fetch("/api/uploadImage", {
        method: "POST",
        body
    })
    const json = await response.json()
    const hash = json.hash
    return hash
}

const getFee = async () => {
    let fee;
    try{
        fee = await server.fetchBaseFee();
    }catch(error){
        fee = 200
    }
    return fee;
}

const createIssuerAccount = async (creatorPublicId, name, quantity) => {
    try {
        const issuerAccount = StellarSdk.Keypair.random();
        var server = new StellarSdk.Server("https://horizon-testnet.stellar.org");
        const payingAccount = await server.loadAccount(creatorPublicId)
        const fee = await getFee()
        const NFTAsset = new StellarSdk.Asset(name, issuerAccount.publicKey())
        const amount = quantity * 0.0000001
        
        const networkPassphrase = StellarSdk.Networks.TESTNET
        const transaction = new StellarSdk.TransactionBuilder(payingAccount, { fee, networkPassphrase })
            .addOperation(
                StellarSdk.Operation.createAccount({
                    destination: issuerAccount.publicKey(),
                    startingBalance: '2'
                })
            )
            .addOperation(
                StellarSdk.Operation.changeTrust({
                    asset: NFTAsset,
                    limit: amount.toString(),
                })
            )
            .setTimeout(300)
            .build();

        const uri = TransactionStellarUri.forTransaction(transaction);
        return {
            uri: uri.toString(),
            transaction,
            NFTAsset,
            issuerPrivateKey: issuerAccount.secret(),
            issuerPublicKey: issuerAccount.publicKey()
        }
    } catch (err) {
        console.log(err)
        return err
    }
}

const createNFTFromPrivateKey = async (issuerPrivateKey, creatorPrivateKey, transaction, NFTAsset, formData, quantity) => {
    var server = new StellarSdk.Server("https://horizon-testnet.stellar.org");
    const creatorKeypair = StellarSdk.Keypair.fromSecret(creatorPrivateKey);
    transaction.sign(creatorKeypair)
    const transactionOutput = await server.submitTransaction(transaction, {skipMemoRequiredCheck: true});
    const hash = await getIpfsHash(formData);
    console.log(hash)
    const sendNFTOutput = await sendNFT(issuerPrivateKey, creatorKeypair.publicKey(), server, "hi", NFTAsset, quantity)
    return {
        ipfsHash: hash,
        ...sendNFTOutput
    }
}

const createNFTFromQRCode = async (issuerPrivateKey, creatorPublicKey, NFTAsset, formData, quantity) => {
    const issuerKeypair = StellarSdk.Keypair.fromSecret(issuerPrivateKey);
    const issuerAccount=await server.loadAccount(issuerKeypair.publicKey());
    const stellarBalance = issuerAccount.balances.find(balance => balance.asset_type == 'native')
    if(stellarBalance<2){
        return "Insufficient account balance"
    }

    const creatorAccount=await server.loadAccount(creatorPublicKey);
    const nftTrust = creatorAccount.balances.find(balance => balance.asset_issuer === issuerAccount.publicKey())
    if(!nftTrust){
        return 'Transaction not completed properly'
    }
    const hash = await getIpfsHash(formData);
    const transactionOutput = await sendNFT(issuerPrivateKey, creatorPublicKey, server, hash, NFTAsset, quantity)
    return {
        ipfsHash: hash,
        ...transactionOutput
    }
}

const sendNFT = async (issuerPrivateKey, creatorPublicKey, server, ipfsHash, NFTAsset, quantity) => {
    const issuerKeypair = StellarSdk.Keypair.fromSecret(issuerPrivateKey);
    const payingAccount = await server.loadAccount(issuerKeypair.publicKey())
    const fee = await getFee();
    const amount = quantity * 0.0000001
        
    const networkPassphrase = StellarSdk.Networks.TESTNET
    const transaction = new StellarSdk.TransactionBuilder(payingAccount, { fee, networkPassphrase })
        .addOperation(
            StellarSdk.Operation.manageData({
                name: 'ipfs_hash',
                value: ipfsHash
            })
        )
        .addOperation(
            StellarSdk.Operation.payment({
                destination: creatorPublicKey,
                asset: NFTAsset,
                amount: amount.toString(),
            })
        )
        .addOperation(
            StellarSdk.Operation.setOptions({
                masterWeight: 0
            })
        )
        .setTimeout(60)
        .build();
    transaction.sign(issuerKeypair);
    const transactionOutput = await server.submitTransaction(transaction, {skipMemoRequiredCheck: true});
    return transactionOutput
}

export {checkAccount, createIssuerAccount, createNFTFromPrivateKey, createNFTFromQRCode, getIpfsHash }

// (async() => {
//     const account = await checkAccount("GAQDA7LTYBWGXKG4OUWREPTQKRGUCKA6ARBAPSY6PJ3XISW7WQ37MDCC");
//     console.log(account)
// })()