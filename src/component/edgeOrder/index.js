import Box from "@mui/material/Box";
import addOrderImg from "../../static/增加添加加号.png";
import {OrderItem} from "../orders/orderItem";
import {ProgressBarChart} from "../echarts/ProgressBarChart";
import {getTime, initTime, MyTable} from "../orders/MyTable";
import * as React from "react";
import {GanttCharts, getColor} from "../echarts/GanttCharts";
import {useCallback, useContext, useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {edgeOrderWebSocket, fetchGet, historyEdgeOrderUrl, historyOrderUrl, orderWebSocket} from "../../requestAddress";
import {sendMessage, SnackbarContext} from "../../views/main";
import {EdgeOrderItem} from "./EdgeOrderItem";
import {Loading} from "../loading";
// 为每一个订单生成唯一颜色
const getJobColor = (edgeOrderData) => {
    const proceduresMap = edgeOrderData?.procedureTable?.proceduresMap || {}

    const pStatus = Object.keys(proceduresMap).map((p,i) => {
        return proceduresMap[p].map((n,j) => {
            const name = p+'::'+n.name;
            return {
                [name]: n.status
            }
        })
    }).flat(1).reduce((a,b) => ({...a,...b}),{})
    // console.log(pStatus)
    const jobArr = Object.keys(pStatus).map(n => n.split('::')[0])

    return jobArr.map(n => ({
        [n] : getColor()
    })).reduce((a,b) => ({...a,...b}),{});
}
// 边端订单组件
export function EdgeOrder() {
    const [pendingEdgeOrder,setPendingEdgeOrder] = useState([]); // 进行中中订单
    const [historyEdgeOrder,setHistoryEdgeOrder] = useState([]); // 历史订单
    const [selectedItemInfo,setSelectedItemInfo] = useState({}); // 选中订单信息
    const [selectedItemID,setSelectedItemId] = useState(''); // 选中订单id
    const [isChart,setIsChart] = useState(true); // 是否展示图表（订单正在等待态不加载甘特图）

    const [jobColor,setJobColor] = useState({}); // 订单中各个工序在甘特图中的颜色
    const [progress,setProgress] = useState(0) // 环形进度条

    const {state} = useLocation(); // 路由相关

    const {dispatch} = useContext(SnackbarContext) // 全局消息提示
    // 根据订单中任务完成数量计算订单进度
    const getOrderProgress = (orderInfo) => {
        const proceduresMap = orderInfo?.procedureTable?.proceduresMap || {};
        const arr = Object.values(proceduresMap).map(n => {
            let i = (n.filter(a => a.status === 'FINISHED').length / n.length).toFixed(2)
            return parseFloat(i)
        })
        return  (arr.filter(n => n === 1).length / arr.length*100).toFixed(0)
    }
    // websocket
    useEffect(() => {
        // 获取边端订单的url
        const url = edgeOrderWebSocket(state.edgeName)
        // 开启websocket 
        const socket = new WebSocket(url);
        let job = {}
        socket.addEventListener('message', function (event) {
            let data = JSON.parse(event.data)
            // console.log(data)
            // 后台报错的情况
            if (data.code === 500) {
                dispatch(sendMessage({open:true,message:data.message,type:'error'}))
            }
            else {
                // 在websocket结束时候请求一次历史订单
                if (data.payload.length === 0) {
                    fetchGet(historyEdgeOrderUrl(state.edgeName)).then((res) => {
                        const data = res.payload.reverse();
                        setIsChart(true)
                        setHistoryEdgeOrder(data)
                        setSelectedItemInfo(data[0]);
                        setSelectedItemId(data[0].taskCode)
                    })
                }
                // 不显示甘特图
                setIsChart(data.payload[0]?.taskStatus === 'PROCESSING')
                
                setPendingEdgeOrder(data.payload);
                // 默认选中第一个订单 
                setSelectedItemId(data.payload[0]?.taskCode)
                setSelectedItemInfo(data.payload[0]);

                // 为该订单生成唯一色卡
                if (!job[data.payload[0].taskCode]) {
                    job = {
                        [data.payload[0].taskCode] : getJobColor(data.payload[0])
                    }
                }
                setJobColor(job)
            }
        });
        return () => {
            socket.close()
        }
    },[])

    // 设置选中订单的进度
    useEffect(() => {
        setProgress(() => getOrderProgress(selectedItemInfo))
    },[selectedItemInfo])

    // 在页面初始化时候请求历史订单数据
    useEffect(() => {
        fetchGet(historyEdgeOrderUrl(state.edgeName)).then((res) => {
            const data = res.payload.reverse();
            // 对数据初始化
            setIsChart(true)
            setHistoryEdgeOrder(data)
            setSelectedItemInfo(data[0]);
            setSelectedItemId(data[0].taskCode)
        })
    },[])

    // useEffect(() => {
    //     console.log(getEdgeOrderList())
    // },[pendingEdgeOrder,historyEdgeOrder])
    // 将正在进行订单与历史订单组合为全部订单
    const getEdgeOrderList = useCallback(() => {
        return [
            ...pendingEdgeOrder,
            ...historyEdgeOrder
        ]
    },[pendingEdgeOrder,historyEdgeOrder])

    return (
       <>
           <Box display="grid" gridTemplateColumns="repeat(12, 1fr)"  style={{height:570}} gap={2}>

               <Box gridColumn="span 3" style={{backgroundColor:'#AFBED0',padding:10, borderRadius:5,position:'relative',height:570,overflowY:'auto'}}>
                   {
                       getEdgeOrderList().length === 0 ? <Loading width={80}/> :
                       getEdgeOrderList().map((e,i) => {
                           return <EdgeOrderItem
                               key={e.taskCode}
                               edgeOrderData={e}
                               setOrderID={setSelectedItemId}
                               setThisOrderInfo={setSelectedItemInfo}
                               selected={selectedItemID === e.taskCode}
                           />
                       })
                   }
               </Box>
               <Box gridColumn="span 9"  style={{backgroundColor:'#AFBED0',padding:10, borderRadius:5}}>
                   <div style={{backgroundColor:'rgb(177 203 226)',height:213}}>
                       {
                           !selectedItemInfo ? <Loading width={50}/> :
                               <>
                                   <p style={{height:30,padding:'5px 20px',lineHeight:'30px',backgroundColor:'#283A4D'}}>
                                       车间任务编号：{selectedItemID?.split('-')[2]}
                                   </p>
                                   <div style={{display:'flex',justifyContent:"space-between",alignItems:"center",padding:20,height:133}}>
                                       <ul style={{paddingLeft:50}}>
                                           <li style={{height:40,lineHeight:'40px'}}>开始时间：{selectedItemInfo?.taskStartTime ? initTime(getTime(selectedItemInfo.taskStartTime)): '--'}</li>
                                           <li style={{height:40,lineHeight:'40px'}}>结束时间：{selectedItemInfo?.taskFinishTime ? initTime(getTime(selectedItemInfo.taskFinishTime)):'--'}</li>
                                       </ul>
                                       <div style={{marginRight:150}}>
                                           <ProgressBarChart schedule={progress} />
                                       </div>
                                   </div>
                               </>
                       }
                   </div>
                   <div style={{ width: '100%',marginTop:20,height:330,overflowY:'auto',backgroundColor:'rgb(177 203 226)',position:"relative"}}>
                       <p style={{height:30,padding:'5px 20px',lineHeight:'30px',backgroundColor:'#283A4D'}}>
                           车间任务工序流程
                       </p>
                       {
                           isChart && selectedItemInfo ? <GanttCharts width={760} height={280} orderData={selectedItemInfo} jobColors={jobColor}/> :
                               <Loading width={50}/>

                       }
                   </div>
               </Box>
           </Box>
       </>
    )
}
