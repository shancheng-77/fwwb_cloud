
import * as echarts from 'echarts';
import {useEffect, useState} from "react";
const  defaultData =  [
    { value: 1048, name: 'Search Engine' },
    { value: 735, name: 'Direct' },
    { value: 580, name: 'Email' },
    { value: 484, name: 'Union Ads' },
    { value: 300, name: 'Video Ads' }
]

export function PieCharts({style,data=defaultData,width=150,height=150}) {

    // const [progress,setProgress] = useState(schedule)
    const [dom,setDom ]= useState(null)
    const chartsId = 'chart'+Date.now()
    let chartDom = null;

    const option = {
        title: {
            text: "设备故障分布",
                left: 80,
            top: 0
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '20%',
            right:'10%',
            left: 'right',
            orient: 'vertical'
        },
        grid: [{
            left: -70
        }],
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    // borderColor: '#fff',
                    // borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '40',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: data
            }
        ]
    };

    useEffect(() => {
        chartDom = document.getElementById(chartsId);
        setDom(chartDom)
        // setProgress(schedule)
    },[])
    useEffect(() =>{
        if ( !dom ) {
            // console.log(chartDom)
            const myChart = echarts.init(chartDom);
            myChart.resize({ height,width })
            myChart.setOption(option)
        }
        // console.log(chartDom)
    },[chartDom])
    return (
        <>
            <div style={{...style}} id={chartsId}/>
        </>
    )
}
