import {useLocation, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import {OrderItem} from "../orders/orderItem";
import {MyTable} from "../orders/MyTable";
import * as React from "react";
import Grid from "@mui/material/Grid";
import {EdgeItem} from "../egde/EdgeItem";
import {EquipmentItem} from "./EquipmentItem";
import imgUrl from '../../static/机械.png'
import onImg from '../../static/关机on1.png';
import offImg from '../../static/关机off.png'
import errorImg from '../../static/故障信息.png'
export function Equipment() {
    const {state} = useLocation();
    const {devices} =state.deviceTable;
    // const params = useParams();
    const [selectedEquipment,setSelectedEquipment] = useState({});
    // useEffect(() => {
    //         console.log(state)
    //     }
    // )
    return (
        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)"  style={{height:570}} gap={2}>
            <Box gridColumn="span 8" style={{backgroundColor:'#AFBED0',padding:10, borderRadius:5,position:'relative',height:570,overflowY:'auto'}}>
                <Box style={{height:400,overflowY:"auto",overflowX:'hidden'}}>
                    <div style={{display:"flex",height:50,justifyContent:"center",alignItems:"center",marginBottom:10}}>
                        <div style={{display:"flex",height:50,justifyContent:"center",cursor:"pointer",alignItems:"center",marginRight:20}}>
                            <img src={onImg} width={30}/> <span>开机</span>
                        </div>
                        <div style={{display:"flex",height:50,justifyContent:"center",cursor:"pointer",alignItems:"center",marginRight:20}}>
                            <img src={offImg} width={30}/> <span>关机</span>
                        </div>
                        <div style={{display:"flex",height:50,justifyContent:"center",cursor:"pointer",alignItems:"center"}}>
                            <img src={errorImg} width={30}/> <span>故障</span>
                        </div>
                    </div>
                    <Grid container rowSpacing={1} columnSpacing={2} >
                        {
                            devices.map((d,i) => {
                                return (
                                    <Grid item xs={4} key={i}>
                                        <EquipmentItem
                                            {...d}
                                            selected={d.name === selectedEquipment.name}
                                            setSelectedData={setSelectedEquipment}
                                        />
                                    </Grid>
                                )
                            })
                        }
                    </Grid>
                </Box>
                <Box style={{borderTop:'2px solid black'}}>
                    <p>这是一个图表</p>
                </Box>
            </Box>
            <Box gridColumn="span 4"  style={{backgroundColor:'#AFBED0',padding:10, borderRadius:5}}>
                <Box style={{height:400,display:"flex",justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
                    <div style={{backgroundColor:'#eee',padding:5}}>
                        <img width={100} src={imgUrl}/>
                    </div>
                    <h3 style={{borderRadius:5,backgroundColor:'rgb(48 63 81)',color:'#eee',margin:'5px 10px',width:150,textAlign:"center",height:30,lineHeight:'30px'}}>
                        设备实时状态
                    </h3>
                    <div style={{display:'flex',marginTop:10,color:'#020202'}}>
                        <div >
                            <p style={{color:'#020202'}}>设备名称：</p>
                            <p style={{color:'#020202'}}>设备状态：</p>
                            <p style={{color:'#020202'}}>其他属性：</p>
                            <p style={{color:'#020202'}}>其他属性：</p>
                            <p style={{color:'#020202'}}>其他属性：</p>
                        </div>
                        <div>
                            <p style={{color:'#020202'}}>{selectedEquipment?.name || '--'}</p>
                            <p style={{color:'#020202'}}>{selectedEquipment?.status || '--'}</p>
                            <p style={{color:'#020202'}}>--</p>
                            <p style={{color:'#020202'}}>--</p>
                            <p style={{color:'#020202'}}>--</p>
                        </div>
                    </div>
                </Box>
                <Box style={{borderTop:'2px solid black'}}>
                    <p>这也是一个图表</p>
                </Box>
            </Box>
        </Box>
    )

}
