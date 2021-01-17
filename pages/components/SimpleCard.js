import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    borderRadius: '2rem',
    padding: '1rem'
  },
});

export default function SimpleCard(props) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <div style={{padding:'1em'}}>
        {props.children}
      </div>
    </Card>
  );
}