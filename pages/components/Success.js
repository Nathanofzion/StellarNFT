import React from 'react';
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'

export default function publicKey(props){
    const link = "https://ipfs.io/ipfs/" + props.hash
    const accountLink = "https://horizon-testnet.stellar.org/accounts/" + props.publicKey
    const createdAsset = `https://horizon-testnet.stellar.org/assets?asset_code=${props.assetName}&asset_issuer=${props.issuer}`
    return(
        <Grid container alignItems="center" justify="center" spacing={3} style={{padding:"2rem"}}>
            <Grid item>
                <Typography variant="h5">
                    Congratulations! You now have the newly minted {props.assetName} NFT in your Stellar wallet!
                </Typography>
                <Typography align="center">
                    IPFS Link : <Link href={link} target="_blank">{link}</Link><br/>
                    Check Account Balance: <Link href={accountLink} target="_blank">Horizon Stellar</Link><br/>
                    Check Created Asset: <Link href={createdAsset} target="_blank">Horizon Stellar</Link><br/>
                </Typography>
            </Grid>

        </Grid> 
    )
}