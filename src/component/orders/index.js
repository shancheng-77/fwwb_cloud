import Box from '@mui/material/Box';
// import {AddOrderDialog} from "./AddOrderDialog";
import * as React from 'react';
import {useCallback, useContext, useEffect, useState} from 'react';
import {getTime, initTime, MyTable} from "./MyTable";
import {AddOrderDialog1} from "./AddOrderDialog1";
import {fetchGet, historyOrderUrl, orderWebSocket} from "../../requestAddress";
import {OrderItem} from "./orderItem";
import {CircularProgress, Snackbar} from "@mui/material";
import addOrderImg from '../../static/增加添加加号.png'
import {ProgressBarChart} from "../echarts/ProgressBarChart";
import {sendMessage, SnackbarContext} from "../../views/main";
import {Loading} from '../loading'
import {Alert} from "@mui/lab";
const fixed = (number) => {
    return parseFloat(number.toFixed(3))
}
export function Orders() {
    const [isAddOrderDialogOpen,setIsAddOrderDialogOpen] = useState(false);

    const [pendingOrderList,setPendingOrderList] = useState([]);
    const [historyOrderList,setHistoryOrderList] = useState([]);

    const [selectedOrderId,setSelectedOrderId] = useState('');

    const [openList,setOpenList] = useState([])

    // 弹出窗
    const [sopen,setSOpen] = useState(false);
    const [message,setMessage] = useState('hello')


    // 订单列表数据数据
    const getOrderList = useCallback(() => {
        return [
            ...pendingOrderList,
            ...historyOrderList
        ]
    },[pendingOrderList,historyOrderList])
    const [showOrderInfo,setShowOrderInfo] = useState({});

    const [orderProgress,setOrderProgress] = useState([])

    const getOrderProgress = (orderInfo) => {
        const proceduresMap = orderInfo?.procedureTable?.proceduresMap || {};
        const arr = Object.values(proceduresMap);
        return  arr.map(n => {
            let i = (n.filter(a => a.status === 'FINISHED').length / n.length).toFixed(2)
           return parseFloat(i)
        })
    }

    const {dispatch} = useContext(SnackbarContext)
    useEffect(() => {
        setOrderProgress(() => getOrderProgress(showOrderInfo))
    },[showOrderInfo])
    // websocket
    useEffect(() => {
        const socket = new WebSocket(orderWebSocket);
        socket.addEventListener('message', function (event) {
            let data = JSON.parse(event.data)
            console.log(event.data)
            if (data.code === 500) {
                dispatch(sendMessage({open:true,message:data.message,type:'error'}))
            }
            // console.log(data)
            if (data.payload.length === 0) {
                fetchGet(historyOrderUrl).then((res) => {
                    const data = res.payload.reverse();
                    setHistoryOrderList(data)
                    setShowOrderInfo(data[0]);
                    setSelectedOrderId(data[0].taskCode)
                })
            }
            setPendingOrderList(data.payload);
            setSelectedOrderId( data.payload[0]?.taskCode)
            setShowOrderInfo(data.payload[0]);
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
                       getOrderList().length === 0 ? <Loading width={80}/> :
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
                       {  !showOrderInfo?.procedureTable ? <Loading width={50}/> :
                           <>
                               <p style={{height:30,padding:'5px 20px',lineHeight:'30px',backgroundColor:'#283A4D'}}>
                                   订单编号：{selectedOrderId}
                               </p>
                               <div style={{display:'flex',justifyContent:"space-between",alignItems:"center",padding:20,height:133}}>
                                   <ul style={{paddingLeft:50}}>
                                       <li style={{height:40,lineHeight:'40px'}}>
                                           订单完成进度：{(orderProgress.filter(n => n === 1).length / orderProgress.length*100).toFixed(0)+'%'}
                                       </li>
                                       <li style={{height:40,lineHeight:'40px'}}>开始时间：{showOrderInfo?.taskStartTime ? initTime(getTime(showOrderInfo.taskStartTime)) : '--'}</li>
                                       <li style={{height:40,lineHeight:'40px'}}>结束时间：{showOrderInfo?.taskFinishTime ? initTime(getTime(showOrderInfo?.taskFinishTime)) : '--'}</li>
                                   </ul>
                                   <div style={{marginRight:150}}>
                                       <ProgressBarChart schedule={(orderProgress.filter(n => n ===1).length / orderProgress.length*100).toFixed(0)} />
                                   </div>
                               </div>
                           </>
                       }
                   </div>
                   <div style={{ width: '100%',marginTop:20,height:310,overflowY:'auto'}}>
                       {
                           !showOrderInfo?.procedureTable ?
                               <Loading width={50}/> :
                           <MyTable rows={showOrderInfo?.procedureTable?.proceduresMap}
                                    openList={openList}
                                    setOpenList={setOpenList}
                                    orderProgress={orderProgress}
                           />
                       }
                   </div>
               </Box>
           </Box>
           <AddOrderDialog1 open={isAddOrderDialogOpen} setOpen={(bol) => setIsAddOrderDialogOpen(bol)}
                             setSOpen={setSOpen} setMessage={setMessage}/>

           <Snackbar
               anchorOrigin={{ vertical:'top', horizontal:'right' }}
               open={sopen}
               onClose={() => setSOpen(false)}
               autoHideDuration={3000}
               message={message}
               key={1}
           >
               <Alert  severity={'error'} sx={{ width: '100%' }}>
                   {message}
               </Alert>
           </Snackbar>
       </>
    )
}
