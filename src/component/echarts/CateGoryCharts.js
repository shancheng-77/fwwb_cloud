
import * as echarts from 'echarts';
import {useEffect, useState} from "react";
const  defaultData =  [
    { value: 10, name: '程序故障' },
    { value: 7, name: '电器故障' },
    { value: 5, name: '机械故障' },
    { value: 4, name: '其他故障' },
]
// echarts的包装组件
export function CateGoryCharts({style,data={},width=150,height=150}) {

    // const [progress,setProgress] = useState(schedule)
    const [dom,setDom ]= useState(null)
    const [mycharts,setMycharts] = useState(null)
    const chartsId = 'chart'+Date.now()
    let chartDom = null;
    
    useEffect(() => {
        chartDom = document.getElementById(chartsId);
        setDom(chartDom)
        // setProgress(schedule)
    },[])
    // 数据或dom修改时重新渲染
    useEffect(() => {
        const xData = data.map(n => n.name?.split('::')[1])
        const yData = data.map(n => n.utilization*100)
        const option = {
            xAxis: {
                type: 'category',
                data: xData
            },
            grid: {
                top:30,
                left:50,
                right:50,
                bottom:50
            },
            yAxis: {
                max: 100,
                type: 'value'
            },
            series: [
                {
                    data: yData,
                    type: 'bar'
                }
            ]
        };
        mycharts?.setOption(option)
    },[data,mycharts])

    useEffect(() =>{
        if ( !dom ) {
            // console.log(chartDom)
            const myChart = echarts.init(chartDom);
            myChart.resize({ height,width })
            const xData = data.map(n => n.name?.split('::')[1])
            const yData = data.map(n => n.utilization*100)
            const option = {
                xAxis: {
                    type: 'category',
                    data: xData
                },
                grid: {
                    top:30,
                    left:50,
                    right:50,
                    bottom:50
                },
                yAxis: {
                    max: 100,
                    type: 'value'
                },
                series: [
                    {
                        data: yData,
                        type: 'bar'
                    }
                ]
            };
            setMycharts(myChart)
            myChart.setOption(option)
        }
        // console.log(chartDom)
    },[chartDom,data])
    
    return (
        <>
            <div style={{...style}} id={chartsId}/>
        </>
    )
}
