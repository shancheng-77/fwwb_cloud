import Box from '@mui/material/Box';
// import {AddOrderDialog} from "./AddOrderDialog";
import * as React from 'react';
import {useCallback, useContext, useEffect, useState} from 'react';
import {MyTable} from "./MyTable";
import {AddOrderDialog1} from "./AddOrderDialog1";
import {fetchGet, historyOrderUrl, orderWebSocket} from "../../requestAddress";
import {OrderItem} from "./orderItem";
import {CircularProgress} from "@mui/material";
import addOrderImg from '../../static/增加添加加号.png'
import {ProgressBarChart} from "../echarts/ProgressBarChart";
import {sendMessage, SnackbarContext} from "../../views/main";

export function Orders() {
    const [isAddOrderDialogOpen,setIsAddOrderDialogOpen] = useState(false);

    const [pendingOrderList,setPendingOrderList] = useState([]);
    const [historyOrderList,setHistoryOrderList] = useState([]);

    const [selectedOrderId,setSelectedOrderId] = useState('');

    const [openList,setOpenList] = useState([])
    // 订单列表数据数据
    const getOrderList = useCallback(() => {
        return [
            ...pendingOrderList,
            ...historyOrderList
        ]
    },[pendingOrderList,historyOrderList])
    const [showOrderInfo,setShowOrderInfo] = useState({});

    const {dispatch} = useContext(SnackbarContext)
    // websocket
    useEffect(() => {
        const socket = new WebSocket(orderWebSocket);
        socket.addEventListener('message', function (event) {
            let data = JSON.parse(event.data)
            // console.log(event.data)
            if (data.code === 500) {
                dispatch(sendMessage({open:true,message:data.message,type:'error'}))
            }
            else {
                // dispatch(sendMessage({open:true,message:'操作成功',type:'success'}))
                // console.log(1)
                // 在websocket结束时候请求一次历史订单
                if (data.payload.length === 0) {
                    fetchGet(historyOrderUrl).then((res) => {
                        const data = res.payload.reverse();
                        setHistoryOrderList(data)
                        // setShowOrderInfo(data[0]);
                        // setSelectedOrderId(data[0].taskCode)
                    })
                }
                setPendingOrderList(data.payload);
                setSelectedOrderId(data.payload[0]?.taskCode)
                setShowOrderInfo(data.payload[0]);
            }


        });
        return () => {
            socket.close()
        }
    },[])
    // 在页面初始化时候请求历史订单数据
    useEffect(() => {
        fetchGet(historyOrderUrl).then((res) => {
            const data = res.payload.reverse();
            setHistoryOrderList(data)
            setShowOrderInfo(data[0]);
            setSelectedOrderId(data[0].taskCode)
        })
    },[])

    return (
       <>
           <Box display="grid" gridTemplateColumns="repeat(12, 1fr)"  style={{height:570}} gap={2}>

               <Box gridColumn="span 3" style={{backgroundColor:'#AFBED0',padding:10, borderRadius:5,position:'relative',height:570,overflowY:'auto'}}>
                    <span style={{position:"absolute",top:0,left:0,width:30,height:30,borderRadius:5,backgroundColor:'#eee',lineHeight:'20px',textAlign:"center",cursor:"pointer"}}
                          onClick={() => setIsAddOrderDialogOpen(true)}
                    >
                        <img src={addOrderImg} width={30}/>
                    </span>
                   {/*<button onClick={() =>dispatch(sendMessage({open:true,message:'操作成功',type:'error'})) }>click</button>*/}
                   {
                       // getOrderList().length === 0 ? <CircularProgress/> :
                       getOrderList().map((n,i) => {
                           return (
                               <OrderItem selected={n.taskCode === selectedOrderId}
                                          orderData={n}
                                          key={i}
                                          setThisOrderInfo={setShowOrderInfo}
                                          setOrderID = {setSelectedOrderId}
                               />
                           )
                       })
                   }
               </Box>
               <Box gridColumn="span 9"  style={{backgroundColor:'#AFBED0',padding:10, borderRadius:5}}>
                   <div style={{backgroundColor:'rgb(177 203 226)',height:213}}>
                        <p style={{height:30,padding:'5px 20px',lineHeight:'30px',backgroundColor:'#283A4D'}}>
                            订单编号：{selectedOrderId}
                        </p>
                       <div style={{display:'flex',justifyContent:"space-between",alignItems:"center",padding:20,height:133}}>
                            <ul style={{paddingLeft:50}}>
                                <li style={{height:40,lineHeight:'40px'}}>计划开始时间：</li>
                                <li style={{height:40,lineHeight:'40px'}}>计划结束时间：</li>
                                <li style={{height:40,lineHeight:'40px'}}>每小时计划产量：</li>
                            </ul>
                            <div style={{marginRight:150}}>
                                <ProgressBarChart schedule={50} />
                            </div>
                       </div>
                   </div>
                   <div style={{ width: '100%',marginTop:20,maxHeight:310,overflowY:'auto'}}>
                       {
                           <MyTable rows={showOrderInfo?.procedureTable?.proceduresMap} openList={openList} setOpenList={setOpenList}/>
                       }
                   </div>
               </Box>
           </Box>
           <AddOrderDialog1 open={isAddOrderDialogOpen} setOpen={(bol) => setIsAddOrderDialogOpen(bol)}/>
       </>
    )
}
