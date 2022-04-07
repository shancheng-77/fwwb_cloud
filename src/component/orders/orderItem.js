import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import waitUrl from "../../static/等待.png";
import conductUrl from "../../static/进行中.png";
import finishUrl from "../../static/完成.png";

export const OrderItem = ({orderData = {}, selected=false,setThisOrderInfo,setOrderID}) => {
    const {taskStatus: status = 'wait', taskCode = '**'} = orderData;

    const bgc = selected ? '#5276A6' : '#1F2D42';

    const statusImgUrl = (status) => {
        if (status === 'wait') return waitUrl
        if (status === 'PROCESSING') return conductUrl
        if (status === 'FINISHED') return finishUrl
        return waitUrl
    }

    const handleClick = () => {
        setOrderID(orderData.taskCode)
        setThisOrderInfo({...orderData})
    }
    return (
        <>
            <div style={{
                width: '100%',
                height: 90,
                backgroundColor: bgc,
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 10
            }}
                 onClick={handleClick}
            >
                <div style={{flex: '5 0 0 ',padding:'25px 10px 25px 20px',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
                    <p style={{padding: '0 5px', fontSize: 16,height:20}}>订单编号:</p>
                    <p style={{padding: '0 5px', fontSize: 16,height:20}}>{taskCode}</p>
                </div>
                <div style={{flex: '3 0 0 ', display: 'flex', justifyContent: "center", alignItems: 'center'}}>
                    <img alt={'状态'} src={statusImgUrl(status)}/>
                </div>
            </div>
        </>
    )
}
