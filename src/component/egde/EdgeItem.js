import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import * as React from "react";
import {Grid} from "@mui/material";
import {ProgressBarChart} from "../echarts/ProgressBarChart";
import BuildIcon from '@mui/icons-material/Build';
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

export const EdgeItem = (data) => {
    // const {title='Edge',schedule=100,effectiveness='100%',utilization='100%'} = data;
    const {edgeName,edgeHost,deviceTable,edgeTasks,errorNumber=0} = data;
    useEffect(() => {
        console.log(deviceTable.devices,errorNumber)
    })
    const navigate = useNavigate();
    return (
        <>
            <Card variant="outlined" sx={{backgroundColor:'#283A4D',height:185}}>
                <Grid container rowSpacing={1} columnSpacing={2}>
                    <Grid item xs={7} sx={{pr:0}}>
                        <CardContent sx={{pl:2,pt:2,pr:0}}>
                            <Typography variant="h5" component="div" sx={{ mb: 2 }}>
                                {edgeName}
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                车间设备健康比
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                生产效率：{Math.floor(Math.random()*20)+80+'%'}
                            </Typography>
                            <Typography sx={{ mb: 1 }} color="text.secondary">
                                资源利用率：{Math.floor(Math.random()*20)+80+'%'}
                            </Typography>
                        </CardContent>
                    </Grid>
                    <Grid item xs={5} sx={{pl:0}}>
                        <CardContent sx={{width:150,height:150,position:'relative',p:0}}>
                            <ProgressBarChart schedule={(errorNumber/deviceTable.devices.length).toFixed(2)*100} style={{position:'absolute',left:-30,top:10}} width={130} height={130}/>
                        </CardContent>
                        <CardActions sx={{margin:0,p:0,position:'relative'}}>
                            <Button size="middle"
                                    style={{position:'absolute',left:-40,top:-20}}
                                    onClick={() => {
                                        navigate('/equipment?edgeName='+edgeName,{state:{deviceTable,edgeName}})}
                            }
                            >设备监控</Button>
                            <Button size="middle"
                                    style={{position:'absolute',left:30,top:-20}}
                                    onClick={() => {
                                        navigate('/edgeOrder?edgeName='+edgeName,{state:{edgeName}})
                                    }
                                    }
                            >订单信息</Button>
                        </CardActions>
                    </Grid>
                </Grid>
            </Card>
        </>
    )
}
