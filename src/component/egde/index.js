import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import {EdgeItem} from "./EdgeItem";

const getRandom = () => {
    return Math.floor(Math.random()*100+1)
}
const getData = (length) => {
    return Array(length).fill(0).map((n,i) => ({
        title: 'Edge'+i,
        schedule: getRandom(),
        effectiveness: getRandom()+'%',
        utilization: getRandom()+'%'
    }))
}


export function Edge() {
    const edgeData = getData(10);
    return (
        <Box sx={{width:'100%',maxHeight:554,overflowY:'auto',backgroundColor:'#AFBED0',padding:1}}>
            <Grid container rowSpacing={2} columnSpacing={2} >
                {
                    edgeData.map((d,i) => {
                        return (
                            <Grid item xs={4} key={i}>
                                <EdgeItem {...d}/>
                            </Grid>
                        )
                    })
                }
            </Grid>
        </Box>
    )
}