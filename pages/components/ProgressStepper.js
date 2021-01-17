import React from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';



export default function ProgressStepper(props){

    return(
        <div>
            <Stepper activeStep={props.activeStep}>
                {props.steps.map((label, index) => {
                const stepProps = {};
                const labelProps = {};
                return (
                    <Step key={label} {...stepProps}>
                        <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                );
                })}
            </Stepper>            
        </div>
    )
}

ProgressStepper.getInitialProps = (ctx) => {
    return {
        steps:[],
    }
}