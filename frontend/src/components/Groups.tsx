import React from 'react'
import { createStyles, Grid } from '@mantine/core';

const useStyles = createStyles((theme) => ({
    box: {
        backgroundColor: 'orange'
    }
    
}));

export function Groups () {
    const { classes } = useStyles();
  return (
    <Grid>
      <Grid.Col className={classes.box} span={4}>1</Grid.Col>
      <Grid.Col className={classes.box} span={4}>3</Grid.Col>
      <Grid.Col className={classes.box} span={4}>2</Grid.Col>
      <Grid.Col className={classes.box} span={4}>4</Grid.Col>
      <Grid.Col className={classes.box} span={4}>5</Grid.Col>
      <Grid.Col className={classes.box} span={4}>6</Grid.Col>
      <Grid.Col className={classes.box} span={4}>7</Grid.Col>
      <Grid.Col className={classes.box} span={4}>8</Grid.Col>
    </Grid>
  );
}