import React from 'react';
import ProgressStepper from './components/ProgressStepper'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import SimpleCard from './components/SimpleCard'
import NFTInfo from './components/NFTInfo'
import PublicKey from './components/PublicKey'
import Transaction from './components/Transaction'
import FileUploader from './components/FileUploader'
import * as Stellar from '../stellar/stellar'
import Success from './components/Success'
import AppBar from '@material-ui/core/AppBar'
import Typography from '@material-ui/core/Typography'
import Head from 'next/head'

export default function Main(){
    const [activeStep, setActiveStep] = React.useState(0);
    const [errorMessage, setErrorMessage] = React.useState('');
  
    const [tokenName, setTokenName] = React.useState('');
    const [tokenAmount, setTokenAmount] = React.useState(1)
    
    const [publicKey, setPublicKey] = React.useState('');
    
    const [uri, setUri] = React.useState('')
    const [privateKey, setPrivateKey] = React.useState('')

    const [generatedTransaction, setGeneratedTransaction] = React.useState('')
    const [issuerPublicKey, setIssuerPublicKey] = React.useState('')
    const [issuerPrivateKey, setIssuerPrivateKey] = React.useState('')
    const [NFTAsset, setNFTAsset] = React.useState('')
    const [formData, setFormData] = React.useState('')

    const [hash, setHash] = React.useState('')

    const steps = ['Upload image', 'NFT info', 'Enter Public Key', 'Create Transaction', 'Success!']


    const handleNameChange = (event) => {
        setTokenName(event.target.value);
    }

    const handleAmountChange = (event) => {
        setTokenAmount(event.target.value);
    }

    const handlePublicKeyChange = (event) => {
        setPublicKey(event.target.value)
    }

    const handlePrivateKeyChange = (event) => {
        setPrivateKey(event.target.value)
    }

    const goToPublicKey = () => {
        setActiveStep(2)
    }

    const validatePublicKey = async () => {
        const accountCheck = await Stellar.checkAccount(publicKey)
        if(accountCheck.passed){
            setErrorMessage('');
            const response = await Stellar.createIssuerAccount(publicKey, tokenName, tokenAmount)
            setUri(response.uri)
            setGeneratedTransaction(response.transaction)
            setIssuerPrivateKey(response.issuerPrivateKey)
            setIssuerPublicKey(response.issuerPublicKey)
            setNFTAsset(response.NFTAsset)
            setActiveStep(3)
            console.log(response)
        } else{
            setErrorMessage(accountCheck.errorMessage);
        }
    }

    const createFromPrivateKey = async () =>{
        const response = await Stellar.createNFTFromPrivateKey(issuerPrivateKey, 
            privateKey, generatedTransaction, NFTAsset, formData, Number.parseInt(tokenAmount))
        console.log(response);
        setHash(response.ipfsHash)
        if(response.successful) setActiveStep(4)
    }

    const createFromQr = async () => {
        const response = await Stellar.createNFTFromQRCode(issuerPrivateKey, publicKey, NFTAsset, formData, Number.parseInt(tokenAmount))
        setHash(response.ipfsHash)
        if(response.successful) setActiveStep(4)
    }

    const storeImageTemp = (data) => {
        setFormData(data)
        setActiveStep(1)
    }

    return(
        <div>
            <Head>
                <title>Stellar NFT Wizard</title>
                <link rel="icon" href="favicon.ico"></link>
            </Head>
            <AppBar>
                <Typography variant="h5" style={{padding:"1rem"}}>
                🧙 Stellar NFT Wizard
                </Typography>
            </AppBar>
            <Grid
            container
            spacing={0}
            style={{ minHeight: '100vh' }}
            >
                <Container 
                maxWidth="md" 
                style={{paddingTop:'20vh'}}
                >
                    <SimpleCard>
                        <ProgressStepper activeStep={activeStep} steps={steps}/> 
                        {activeStep==0 &&
                            <FileUploader
                                onUpload={storeImageTemp}
                            />
                        } 
                        {activeStep==1 && <NFTInfo 
                            tokenName={tokenName} 
                            tokenAmount={tokenAmount} 
                            onAmountChange={handleAmountChange}
                            onNameChange={handleNameChange}
                            nextStep={goToPublicKey}/>}

                        {activeStep==2 &&  <PublicKey
                            publicKey={publicKey}
                            onChange={handlePublicKeyChange}
                            validate={validatePublicKey}
                            errorMessage={errorMessage}
                        />}
                        {activeStep==3 && <Transaction
                            uri={uri}
                            privateKey={privateKey}
                            onChange={handlePrivateKeyChange}
                            errorMessage={errorMessage}
                            createFromPrivateKey={createFromPrivateKey}
                            createFromQr={createFromQr}
                        />}
                        {activeStep==4 &&
                            <Success 
                            hash={hash}
                            publicKey={publicKey}
                            assetName={tokenName}
                            issuer={issuerPublicKey}
                            quanity={tokenAmount}
                            />
                        }
                    </SimpleCard> 
                </Container>
            </Grid>                
        </div>
    )
}