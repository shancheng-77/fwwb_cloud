import Box from "@mui/material/Box";
import * as React from "react";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import {PieCharts} from "../echarts/PieCharts";
import {useEffect, useState} from "react";
import {allErrorsUrl, fetchGet} from "../../requestAddress";

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];

const errObjectToArr = (object) => {
   let arr = Object.keys(object).map((k,i) => {
        return object[k].map((n => {
            return {
                edgeName: k,
                ...n
            }
        }))
    })
    return arr.length === 0 ? [] : arr[0]
}

export function Emergency() {
    const [errorData,setErrorData] = useState([]);
    // 请求信息
    useEffect(() => {
        fetchGet(allErrorsUrl).then(res => {
            console.log(errObjectToArr(res.payload))
            setErrorData(() => errObjectToArr(res.payload))
        })
    },[])

    return(
        <Box sx={{width:'100%',height:554,overflowY:'auto',backgroundColor:'#AFBED0',padding:1, borderRadius:1}}>
            <Box display='grid' gridTemplateColumns="repeat(12, 1fr)" style={{height:250,marginBottom:16}}>
                <Box  gridColumn="span 6" style={{position:'relative'}}>
                    <PieCharts width={500} height={280} style={{position:'absolute',left:-70}}/>
                </Box>
                <Box gridColumn="span 6" style={{height:250,overflowY:'auto'}}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                            <TableHead style={{backgroundColor:'#283A4D',height:50}}>
                                <TableRow>
                                    <TableCell align="center">序号</TableCell>
                                    <TableCell align="center">设备编号</TableCell>
                                    <TableCell align="center">处理人</TableCell>
                                    <TableCell align="center">结果</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row,i) => (
                                    <TableRow
                                        key={row.name+Math.random()}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } ,height:50,backgroundColor:'#eee'}}
                                    >
                                        <TableCell component="th" scope="row" style={{color:'black'}} align="center">
                                            {i}
                                        </TableCell>
                                        <TableCell align="center" style={{color:'black'}}>--</TableCell>
                                        <TableCell align="center" style={{color:'black'}}>--</TableCell>
                                        <TableCell align="center" style={{color:'black'}}>--</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
            <Box style={{height:280,overflowY:'auto'}}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                        <TableHead style={{backgroundColor:'#283A4D',height:50}}>
                            <TableRow>
                                <TableCell align="center">编号</TableCell>
                                <TableCell align="center">所属边端</TableCell>
                                <TableCell align="center">设备编码</TableCell>
                                <TableCell align="center">设备名称</TableCell>
                                <TableCell align="center">故障说明</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody sx={{height:250,overflowY:'auto'}}>
                            {errorData.map((row) => (
                                // console.log(row)
                                <TableRow
                                    key={row.id+Math.random()}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } ,height:50,backgroundColor:'#eee'}}
                                >
                                    <TableCell component="th" scope="row" align="center" style={{color:'black'}}>
                                        {row.id}
                                    </TableCell>
                                    <TableCell align="center" style={{color:'black'}}>{row?.edgeName}</TableCell>
                                    <TableCell align="center" style={{color:'black'}}>{row?.deviceInfo?.code}</TableCell>
                                    <TableCell align="center" style={{color:'black'}}>{row?.deviceInfo?.deviceType?.name}</TableCell>
                                    <TableCell align="center" style={{color:'black'}}>{row?.comment}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    )
}
