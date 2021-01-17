import React from 'react';
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

export default function publicKey(props){

    return(
        <Grid container alignItems="center" spacing={3}>
            <Grid item xs={9}>
                <TextField 
                label="Public Key" 
                // variant="outlined" 
                fullWidth
                value={props.publicKey}
                onChange={props.onChange}
                error={props.errorMessage!=''}
                helperText={props.errorMessage}
                />
            </Grid>
            <Grid item xs={3}>
                <Button variant="contained" disableElevation disabled={props.publicKey.length!=56} onClick={props.validate}>
                    Verify Account
                </Button>
            </Grid>
        </Grid> 
    )
}

publicKey.getInitialProps = (ctx) => {
    return {publicKey:''}
}