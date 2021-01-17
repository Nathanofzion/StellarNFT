import React from 'react';
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

export default function NFTInfo(props){

    const checkErrors = (name) => {
        if(name.length==0) return false
        if(name.length>12) return true;
        if(!name.match(/^[0-9a-zA-Z]+$/)) return true;
        return false;
    }

    const getHelperText = (name) => {
        let errors = []
        if(name.length==0) return errors
        if(name.length>12) errors.push('less than 12 characters')
        if(!name.match(/^[0-9a-zA-Z]+$/)) errors.push("alphanumeric")
        if(errors.length==0) return ''
        return 'Asset code must be ' + errors.join(' and ')
    }

    const checkAmountError = (amount) => {
        if(amount.length===0) return true;
        return !isNaN(amount) && Number.isInteger(parseInt(amount))
    }

    const nameError = checkErrors(props.tokenName);
    const amountError = !checkAmountError(props.tokenAmount);

    const readyForNextStep = props.tokenAmount.length!=0 && props.tokenName.length!=0 && !nameError && !amountError

    return(
        <div>
        <Grid container spacing={3}>
            <Grid item xs={9}>
                <TextField 
                label="Token Name" 
                // variant="outlined" 
                fullWidth
                value={props.tokenName}
                onChange={props.onNameChange}
                error={nameError}
                helperText={getHelperText(props.tokenName)}
                />
            </Grid>
            <Grid item xs={3}>
            <TextField 
                label="Token Amount" 
                // variant="outlined" 
                fullWidth
                value={props.tokenAmount}
                onChange={props.onAmountChange}
                error={amountError}
                helperText={amountError && "Please enter valid integer amount"}
                />
            </Grid>
            <Grid container justify="flex-end" style={{padding:'0.5rem'}}>
                <Button variant="contained" disableElevation onClick={props.nextStep} disabled={!readyForNextStep}>
                    Next step
                </Button>
            </Grid> 
        </Grid> 
        </div>       
    )
}

NFTInfo.getInitialProps = (ctx) => {
    return {
        name:'',
        amount:0
    }
}