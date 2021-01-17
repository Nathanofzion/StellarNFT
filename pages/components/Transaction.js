import React from 'react';
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
var QRCode = require('qrcode.react');

export default function Transaction(props){

    return(
        <div>
        <Typography style={{padding:'1rem'}}>
            Scan QR code with wallet or enter private key to fund NFT (2XLM) <br/>
            (No information is stored and all transactions are done locally)
        </Typography>
        <Grid container spacing={3}>
            <Grid item xs={5}>
            <QRCode size={350} value={props.uri} />
            </Grid>
            <Grid item xs={7}>
                <TextField 
                label="Private Key" 
                // variant="outlined" 
                fullWidth
                value={props.privateKey}
                onChange={props.onChange}
                error={props.errorMessage!=''}
                helperText={props.errorMessage}
                />
                <Grid style={{display:"flex", justifyContent: "space-between", padding:'0.5rem'}}>
                    <Button variant="contained" disableElevation onClick={props.createFromQr}>
                        I scanned the QR code
                    </Button>
                    <Button variant="contained" disableElevation onClick={props.createFromPrivateKey}>
                        I entered my private key
                    </Button>
                </Grid>
            </Grid>
        </Grid> 
        </div>
    )
}