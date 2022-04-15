import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import * as React from "react";
import {useEffect, useMemo, useState} from "react";
import {Button} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {AppWithRouter} from "../../AppWithRouter";
import {fetchGet, orderMappingUrl} from "../../requestAddress";
const lightTheme = createTheme({
    palette: {
        mode: 'light',
    },
});

const getMinTime = (timeArr) => {
    return timeArr.sort((a,b) => a>b?1:-1)[0]
}
const getMaxTime = (timeArr) => {
    return timeArr.sort((a,b) => a>b?1:-1)[timeArr.length-1]
}
// 对时间进行格式化
export const getTime = (time) => (new Date(time)).getTime();
export const isUndefined = (value) => (value === void 0)
// 历史订单和正在进行订单格式不一样
export const initTime = (time) => {
    const a = (number) => {
        if (number < 10) {
            return '0' +number
        }
        return number
    }
    if (!isUndefined(time)) {
        let date = new Date(time);
        let year = date.getFullYear();
        let month = a(date.getMonth()+1);
        let day = a(date.getDay());

        let hour = a(date.getHours());
        let minutes = a(date.getMinutes());
        let seconds = a(date.getSeconds());

        return year+'-'+month+'-'+day+' '+hour+':'+minutes+':'+seconds;
    }
    return  '--'
}

const getData = (data) => {
    return Object.keys(data).map((k,i) => {
        let value = data[k];
        let startTime =  getMinTime(value.map(n => n.startTime));
        let finishTime =  getMaxTime(value.map(n => n.finishTime));
        let costTime = isUndefined(finishTime)||isUndefined(startTime) ?'--' :(getTime(finishTime) - getTime(startTime)) / (1000) //转换成秒
        return {
            name: k,
            startTime : initTime(startTime),
            finishTime : initTime(finishTime),
            costTime: costTime,
            process: value,
            key: i
        }
    })
}

//  将open转为外部属性
const Row = (props) => {
    const { row ,index,openList,setOpen,progress,orderMapping} = props;

    // const {name,setName} = useState('');
    const getChineseName = (row,object) => {
        const b = row.name.includes('&&');
        const s = b ? row.name.split('&&')[1] : row.name
        return object[s.split('__')[0]]
    }
    const nameValue = getChineseName(row,orderMapping)
    // useEffect(() => {
    //     console.log('row',row)
    // },[row,orderMapping])

    const open = openList.includes(index)
    // const [open, setOpen] = useState(false);
    const setRow = () => {
        if (open) {
            setOpen(() => openList.filter(n => n !== index))
        }else {
            setOpen([...openList,index])
        }
    }
    return (
        <>
            <TableRow
                key={row.name+Math.random()}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } ,height:50,backgroundColor:'#eee'}}
            >
                <TableCell component="th" scope="row" style={{color:'black'}} width={100}>
                    {nameValue}
                </TableCell>
                <TableCell align="center" style={{color:'black'}}>{row.costTime}</TableCell>
                <TableCell align="center" style={{color:'black'}}>{row.startTime}</TableCell>
                <TableCell align="center" style={{color:'black'}}>{row.finishTime}</TableCell>
                <TableCell align="center" style={{color:'black'}}>{(progress*100).toFixed(0)+'%'}</TableCell>
                <TableCell align="center" style={{color:'black'}}>
                    <Button variant="contained" size={"small"}
                            onClick={setRow}
                    >
                        {open ? '收起工序' : '查看工序'}
                    </Button>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ padding:0,}} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit >
                        <TableContainer component={Paper} >
                            {/*<ThemeProvider theme={lightTheme}>*/}
                                <Table size="small" style={{border:0}}>
                                    <TableHead >
                                        <TableRow>
                                            <TableCell  align="center" >名称</TableCell>
                                            <TableCell  align="center" >状态</TableCell>
                                            <TableCell  align="center" >花费时间</TableCell>
                                            <TableCell  align="center" >执行设备</TableCell>
                                            <TableCell  align="center" >开始时间</TableCell>
                                            <TableCell  align="center" >终止时间</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {row.process.map((processRow) => (
                                            <TableRow key={processRow.name} >
                                                <TableCell align="center">{processRow.desc}</TableCell>
                                                <TableCell align="center">{processRow.status}</TableCell>
                                                <TableCell align="center">{processRow.cost}</TableCell>
                                                <TableCell align="center">{processRow.executeDeviceName}</TableCell>
                                                <TableCell align="center">{initTime(processRow?.startTime)}</TableCell>
                                                <TableCell align="center">{initTime(processRow?.finishTime)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            {/*</ThemeProvider>*/}
                        </TableContainer>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

export function MyTable({rows={},openList=[],setOpenList,orderProgress=[]}) {

    const data = getData(rows)
    const [orderMapping,setOrderMapping] = useState({});
    // useEffect(() => {
    //     console.log(rows)
    // },[])
    useEffect(() => {
        fetchGet(orderMappingUrl).then(res => {
            const data = res.payload.map(n => ({
                [n.name] : n.desc
            })).reduce((a,b) => ({...a,...b}),{})
            // console.log(data,s)
            setOrderMapping(data)
        })
    },[])
    return (
        <TableContainer component={Paper} style={{backgroundColor:'rgb(175, 190, 208)'}}>
            <Table sx={{ maxWidth: 795 }} size="small" aria-label="a dense table">
                <TableHead style={{backgroundColor:'#283A4D',height:50}}>
                    <TableRow>
                        <TableCell>名称</TableCell>
                        <TableCell align="center">花费时间(s)</TableCell>
                        <TableCell align="center">开始时间</TableCell>
                        <TableCell align="center">结束时间</TableCell>
                        <TableCell align="center">完成进度</TableCell>
                        <TableCell align="center">工序</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row,i) => (
                       <Row row={row}
                            key={row.name+Math.random()}
                            index={i}
                            openList={openList}
                            setOpen={setOpenList}
                            progress={orderProgress[i]}
                            orderMapping={orderMapping}
                       />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
