import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import {EdgeItem} from "./EdgeItem";
import {useEffect, useState} from "react";
import {edgesUrl, edgeWebSocket, fetchGet, orderWebSocket} from "../../requestAddress";
import {GanttCharts} from "../echarts/GanttCharts";
import {Loading} from "../loading";

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
    // const edgeData = getData(10);
    const [edgeData,setEdgeData] = useState([]);
    const [errorNumber,setErrorNumber] = useState([])
    // 请求节点数据
    useEffect(() => {
        const socket = new WebSocket(edgeWebSocket);
        socket.addEventListener('message', function (event) {
            let data = JSON.parse(event.data)
            // console.log(data)
            const errorNumber = Object.values(data.payload).map(n => Object.values(n.deviceTable.deviceStatusTable).filter(n => n!=='ERROR').length)
            // console.log(errorNumber)
            setErrorNumber(errorNumber)
            setEdgeData(Object.values(data.payload))
        });
        return () => {
            socket.close()
        }
    },[])

    return (
        <Box sx={{width:'100%',height:554,overflowY:'auto',backgroundColor:'#AFBED0',padding:1, borderRadius:1}}>
            <Grid container rowSpacing={2} columnSpacing={2} style={{height:570}}>
                {
                    edgeData.length == 0 ? <Loading/> :
                    edgeData.map((d,i) => {
                        return (
                            <Grid item xs={4} key={i}>
                                <EdgeItem {...d} errorNumber={errorNumber[i]}/>
                            </Grid>
                        )
                    })
                }
            </Grid>

        </Box>
    )
}
