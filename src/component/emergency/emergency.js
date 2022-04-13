import Box from "@mui/material/Box";
import * as React from "react";
import {useEffect, useState} from "react";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import {PieCharts} from "../echarts/PieCharts";
import {allErrorsUrl, fetchGet} from "../../requestAddress";
import {Loading} from "../loading";
import {Button} from "@mui/material";
import {initTime} from "../orders/MyTable";

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    {
        "id": 1,
        "deviceFullName": "machine0::d0",
        "operatedBy": "王明"
    },
    {
        "id": 2,
        "deviceFullName": "machine1::d4",
        "operatedBy": "胡晓瑄"
    },
    {
        "id": 3,
        "deviceFullName": "machine2::d8",
        "operatedBy": "王明"
    },
    {
        "id": 4,
        "deviceFullName": "machine4::d13",
        "operatedBy": "王明"
    }
];

const errObjectToArr = (object) => {
    return Object.keys(object).map((k, i) => {
        return object[k].map((n => {
            return {
                edgeName: k,
                ...n
            }
        }))
    }).flat(1)
}
const errTypeObject = {
    PROGRAM :'程序故障',
    ELECTRIC :'电气故障',
    MACHINE : '机械故障',
    OTHER :'其他故障'
}
const initChartsData = (data=[]) => {
    const o = {}
    data.forEach((n) => {
        if (!o[n.errorType])  o[n.errorType]=1
        else o[n.errorType]+=1
    })
    return Object.keys(o).map(n => {
        return {
            name : errTypeObject[n],
            value : o[n]
        }
    })
}
export function Emergency() {
    const [errorData,setErrorData] = useState([]);
    const [chartsData,setChartsData] = useState([])
    // 请求信息
    useEffect(() => {
        fetchGet(allErrorsUrl).then(res => {
            // console.log(errObjectToArr(res.payload))
            const data =  errObjectToArr(res.payload);
            const o = initChartsData(data)
            console.log(data)
            setChartsData(o)
            setErrorData(data)
        })
    },[])

    return(
        <Box sx={{width:'100%',height:554,overflowY:'auto',backgroundColor:'#AFBED0',padding:1, borderRadius:1}}>
            <Box display='grid' gridTemplateColumns="repeat(12, 1fr)" style={{height:250,marginBottom:16}}>
                <Box  gridColumn="span 6" style={{position:'relative'}}>
                    <PieCharts width={500} height={280} style={{position:'absolute',left:-70}} data={chartsData}/>
                </Box>
                <Box gridColumn="span 6" style={{height:250,overflowY:'auto'}}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 350 }} size="small" aria-label="a dense table">
                            <TableHead style={{backgroundColor:'#283A4D',height:50}}>
                                <TableRow>
                                    <TableCell align="center">序号</TableCell>
                                    <TableCell align="center">设备编号</TableCell>
                                    <TableCell align="center">处理人</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row,i) => (
                                    <TableRow
                                        key={row.id+Math.random()}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } ,height:50,backgroundColor:'#eee'}}
                                    >
                                        <TableCell component="th" scope="row" style={{color:'black'}} align="center">
                                            {row.id}
                                        </TableCell>
                                        <TableCell align="center" style={{color:'black'}}>{row.deviceFullName}</TableCell>
                                        <TableCell align="center" style={{color:'black'}}>{row.operatedBy}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
            <Box style={{height:280,overflowY:'auto'}}>
                {
                    errorData.length === 0 ? <Loading width={50}/> :
                        <>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                                    <TableHead style={{backgroundColor:'#283A4D',height:50}}>
                                        <TableRow>
                                            <TableCell align="center">编号</TableCell>
                                            <TableCell align="center">所属边端</TableCell>
                                            <TableCell align="center">设备编码</TableCell>
                                            <TableCell align="center">故障类型</TableCell>
                                            <TableCell align="center">故障说明</TableCell>
                                            <TableCell align="center">异常时间</TableCell>
                                            <TableCell align="center">操作</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody sx={{height:250,overflowY:'auto'}}>
                                        {errorData.map((row) => (
                                            // console.log(row)
                                            <TableRow
                                                key={row.id+Math.random()}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } ,maxHeight:30,backgroundColor:'#eee'}}
                                            >
                                                <TableCell component="th" scope="row" align="center" style={{color:'black'}}>
                                                    {row.id}
                                                </TableCell>
                                                <TableCell align="center" style={{color:'black'}}>{row?.edgeName}</TableCell>
                                                <TableCell align="center" style={{color:'black'}}>{row?.deviceInfo?.deviceType?.name+'::'+row?.deviceInfo?.code}</TableCell>
                                                <TableCell align="center" style={{color:'black'}}>{errTypeObject[row.errorType]}</TableCell>
                                                <TableCell align="center" style={{color:'black'}}>{row?.comment}</TableCell>
                                                <TableCell align="center" style={{color:'black'}}>{initTime(row?.errorTime)}</TableCell>
                                                <TableCell align="center" style={{color:'black'}}><Button>修复</Button></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </>
                }
            </Box>
        </Box>
    )
}
