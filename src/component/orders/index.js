import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import waitUrl from '../../static/等待.png'
import conductUrl from '../../static/进行中.png'
import finishUrl from '../../static/完成.png'
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {MyTable} from "./MyTable";

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

const OrderItem = ({orderData={},selected=false}) => {
    const {status='wait'} = orderData;
    const bgc = selected ? '#5276A6' : '#1F2D42';

    const statusImgUrl = (status) => {
        if (status === 'wait') return waitUrl
        if (status === 'conduct') return conductUrl
        if (status === 'finish') return finishUrl
        return waitUrl
    }
    return (
        <>
            <div style={{width:'100%',height:90,backgroundColor:bgc,cursor:'pointer',display:'flex',justifyContent:'space-between'}}>
                <div style={{flex:'5 0 0 ',lineHeight:'90px'}}>
                    <p style={{padding:'0 20px',fontSize:16}}>订单编号: ....</p>
                </div>
                <div style={{flex:'3 0 0 ',display:'flex',justifyContent:"center",alignItems:'center'}}>
                    <img alt={'状态'} src={ statusImgUrl(status) }/>
                </div>
            </div>
        </>
    )
}

export function Orders() {

    // 订单列表数据数据
    const OrderListData = [];

    return (
       <>
           <Box display="grid" gridTemplateColumns="repeat(12, 1fr)"  style={{height:570}} gap={2}>
               <Box gridColumn="span 3" style={{backgroundColor:'#AFBED0',padding:10, borderRadius:5}}>
                   {/* TODO 根据数据渲染订单列表*/}
                    <OrderItem selected={false} orderData={{status:'finish'}}/>
               </Box>
               <Box gridColumn="span 9"  style={{backgroundColor:'#AFBED0',padding:10, borderRadius:5}}>
                   <div style={{backgroundColor:'rgb(177 203 226)',height:213}}>
                        <p style={{height:30,padding:'5px 20px',lineHeight:'30px',backgroundColor:'#283A4D'}}>
                            订单编号：.....
                        </p>
                       <div style={{display:'flex',justifyContent:"space-between",alignItems:"center",padding:20,height:133}}>
                            <ul style={{paddingLeft:50}}>
                                <li style={{height:40,lineHeight:'40px'}}>计划开始时间：</li>
                                <li style={{height:40,lineHeight:'40px'}}>计划结束时间：</li>
                                <li style={{height:40,lineHeight:'40px'}}>每小时计划产量：</li>
                            </ul>
                            <div>
                            {/*    echarts图表*/}
                            </div>
                       </div>
                   </div>
                   <div style={{ width: '100%',marginTop:20,maxHeight:310,overflowY:'auto'}}>
                       <MyTable rows={rows}/>
                   </div>
               </Box>
           </Box>
       </>
    )
}
