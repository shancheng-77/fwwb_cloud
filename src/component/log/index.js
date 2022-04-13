import Box from "@mui/material/Box";
import {MyForm} from "./MyForm";
import * as React from "react";
import {useEffect, useState} from "react";
import {Button} from "@mui/material";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import {fetchGet, logUrl} from "../../requestAddress";
import {Loading} from "../loading";

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

export function Log() {
    const [logData,setLogData] = useState([]);
    // 请求数据
    useEffect(() => {
        fetchGet(logUrl).then(res => {
            // console.log(res.payload)
            setLogData(res.payload.slice(0,10))
        })
    },[])
    const searchInTable = (value) => {
        console.log(value)
    }
    return (
        <Box display="grid" gridTemplateRows="repeat(12, 1fr)"  style={{height:570}} gap={2}>
            <Box gridRow="span 3"  style={{backgroundColor:'#AFBED0', borderRadius:5,padding:'20px 20px',display:'flex',flexDirection:'column' ,justifyContent:'space-between',alignContent:'space-around'}} component='form'>
                <MyForm getValue={(value) => searchInTable(value)}/>
            </Box>
            <Box gridRow="span 9"  style={{backgroundColor:'#AFBED0',padding:10, borderRadius:5}}>
                <Box style={{textAlign:"right"}}>
                    <Button variant="contained"  color="primary" size='small' style={{marginRight:20}}>
                        导出
                    </Button>
                    <Button variant="contained"  color="error" size='small'>
                        清空
                    </Button>
                </Box>
                <Box style={{height:360,overflowY:'auto',marginTop:10}}>
                    {
                        logData.length === 0 ? <Loading width={50}/> :
                            <>
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                                        <TableHead style={{backgroundColor:'#283A4D',height:50}}>
                                            <TableRow>
                                                <TableCell align="center">日志编号</TableCell>
                                                <TableCell align="center">名称</TableCell>
                                                <TableCell align="center">操作类型</TableCell>
                                                <TableCell align="center">请求方式</TableCell>
                                                <TableCell align="center">操作状态</TableCell>
                                                <TableCell align="center">完成时间</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {logData.map((row) => (
                                                <TableRow
                                                    key={row.id+Math.random()}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } ,height:50,backgroundColor:'#eee'}}
                                                >
                                                    <TableCell component="th" scope="row" style={{color:'black'}} align="center">
                                                        {row.id}
                                                    </TableCell>
                                                    <TableCell align="center" style={{color:'black'}}>{row.title}</TableCell>
                                                    <TableCell align="center" style={{color:'black'}}>{row.businessType}</TableCell>
                                                    <TableCell align="center" style={{color:'black'}}>{row.requestMethod}</TableCell>
                                                    <TableCell align="center" style={{color:'black'}}>{row.status}</TableCell>
                                                    <TableCell align="center" style={{color:'black'}}>{row.operationTime}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </>
                     }
                </Box>
            </Box>
        </Box>
    )
}
