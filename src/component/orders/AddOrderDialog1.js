import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl, InputLabel, MenuItem, Select, Snackbar,
    TextField
} from "@mui/material";
import Button from "@mui/material/Button";
import * as React from "react";
import {InputWithLabel} from "../log/MyForm";
import {useCallback, useContext, useEffect, useState} from "react";
import Box from "@mui/material/Box";
import {automaticUrl, fetchGet, fetchPost, jobsUrl, manualUrl} from "../../requestAddress";
import {sendMessage, SnackbarContext} from "../../views/main";
import {Alert} from "@mui/lab";
// 自动分配组件
const AutoDistribute = ({data,sendData,error,setError,name='任务安排',jobArr=[],jobNameArr=[]}) => {

    const [orderArr,setOrderArr] = useState(data); // 复选框选中内容
    // const [jobArr,setJobArr] = useState(['job0','job1','job2']); // job数组
    const [jobSelectedCount,setJobSelectedCount] = useState(Array(jobArr.length).fill(0)) // 当前选中的零件的数量，与jobNameArr中一一对应

    // 将当前选中的任务及数量传递至父组件
    const sendNowData = (countArr) => {
        // 将 {job1：***,job1:**} 的对象转化为{job__0:***,job__1:**} 参考接口文档额格式
        const arr = jobNameArr.map((n, i) => {
            if (countArr[i] !== 0) {
                let arr = [];
                for (let j = 0; j < countArr[i]; j++) {
                    arr.push(jobNameArr[i] + '__' + j)
                }
                return arr;
            }else return ''
        }).flat(1).filter(n => n !== '') // 数组扁平化并去空
        // console.log(arr)
        sendData(arr)
    }
    // 点击某个零件的增加按钮
    const countAdd = (index) => {
        // 获取增加后的数组
        const selectedCountArr = jobSelectedCount.map((n,i) => i === index ? n+1 : n)
        // 将选中数组改为值不为0的
        setOrderArr(jobArr.filter((n,i) => selectedCountArr[i] !== 0));
        setJobSelectedCount([...selectedCountArr] );
        sendNowData(selectedCountArr)
    }
    // 点击某个零件的减少按钮
    const countReduce = (index) => {
        const selectedCountArr = jobSelectedCount.map((n,i) => i === index ? (n <= 0 ? n : n-1) : n)
        // console.log(selectedCountArr)
        setOrderArr(jobArr.filter((n,i) => selectedCountArr[i] !== 0));
        setJobSelectedCount([...selectedCountArr] )
        sendNowData(selectedCountArr)
    }
    // 将零件以及选中的数量以 job*3 的形式展示在输入框中
    const getSelectedValueWithCount = (valueArr) => {
        return valueArr.map((n,i) => {
            return n+'*'+jobSelectedCount[jobArr.findIndex(j => j === n)]
        }).join(',')
    }

    return (
            <FormControl>
                <InputLabel id="demo-simple-select-label">{name}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={orderArr}
                    size='small'
                    multiple
                    error={error}
                    label="order"
                    style={{width:200}}
                    onChange={(event) => {
                        setError(event.target.value.length === 0)
                    }}
                    // value是选择的数组
                    renderValue={(val) => {
                        return <p>{getSelectedValueWithCount(val)}</p>
                    } }
                >
                    {jobArr.map((n,i) => {
                        return (
                            <MenuItem value={n} key={n} style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                                {n.split('*')[0]}
                                <span>
                                    <span className='hover' onClick={() => countReduce(i)}>-</span>
                                    <span style={{display:"inline-block",width:15,textAlign:"center"}}>{jobSelectedCount[i]}</span>
                                    <span className='hover' onClick={() => countAdd(i)}>+</span>
                                </span>
                            </MenuItem>
                        )
                    })}
                </Select>
            </FormControl>
    )
}
// 手动分配基于自动分配组件，将多个自动分配组件组合
const ManualDistribute = ({data,sendData,error,setError,jobArr,jobNameArr}) => {
    const [edge0Data,setEdge0Data] = useState([])
    const [edge1Data,setEdge1Data] = useState([])
    const [edge2Data,setEdge2Data] = useState([])

    const [error1,setError1] = useState(false)
    const [error2,setError2] = useState(false)
    const [error3,setError3] = useState(false)

    // args应该是一个edgeData的数组
    const initData = (args) => {
        let obj = {} // 数组保存某job总共出现几次
        return args.map(arg => {
            return arg.map(job => {
                const jobName = job.split('__')[0];
                if (!!obj[jobName]) obj[jobName] += 1;
                else obj[jobName] = 1;
                // console.log(obj)
                return jobName+'__'+(obj[jobName]-1)
            })
        })
    }

    useEffect(() => {
        const edgeDataArr = initData([edge0Data,edge1Data])
        sendData({
            'edge0' : edgeDataArr[0],
            'edge1' : edgeDataArr[1]
        })
        // console.log(edge0Data)
    },[edge0Data,edge1Data])

    return (
        <Box style={{display:'flex',flexDirection:'column',justifyContent:"space-between",height:50}}>
            <AutoDistribute
                data={edge0Data}
                sendData={setEdge0Data}
                error={error1}
                setError={setError1}
                name='Edge0'
                jobArr={jobArr}
                jobNameArr={jobNameArr}
            />
            <div style={{height: 10}}/>
            <AutoDistribute
                data={edge1Data}
                sendData={setEdge1Data}
                error={error2}
                setError={setError2}
                name='Edge1'
                jobArr={jobArr}
                jobNameArr={jobNameArr}
            />
            {/*<AutoDistribute data={edge1Data} sendData={setEdge1Data} error={error2} setError={setError2} name='Edge1'/>*/}
            {/*<AutoDistribute data={edge2Data} sendData={setEdge2Data} error={error3} setError={setError3} name='Edge0'/>*/}
        </Box>
    )
}

/**
 * 此组件逻辑较为复杂，根据已有组件实现了手动分配和自动分配任务的选择器。
 * @param {*} param0 
 * @returns 
 */
export function AddOrderDialog1({open,setOpen,setSOpen,setMessage}) {

    const [nameValue,setNameValue] = useState('') // 订单名称
    const [typeValue,setTypeValue] = useState('自动分配') // 订单类型 手动分配 | 自动分配
    const [decValue,setDecValue] = useState('') // 订单描述
    
    // 根据typeValue的值选取对应的存储data
    const [autoData,setAutoData] = useState([]); // 自动分配的参数
    const [manualData,setManualData] = useState({}); // 手动分配的参数
    // job数组
    const [jobArr,setJobArr] = useState([])
    const [jobNameArr,setJobNameArr] = useState([])
    // 表单校验
    // 该部分做的不全面，全部为必选
    const [nameError,setNameError] = useState(false);
    const [typeError,setTypeError] = useState(false);
    const [decError,setDecError] = useState(false)
    const [autoError,setAutoError] = useState(false)
    const [manualError,setManualError] = useState(false)

    // 当分配方式更改后清除任务安排内容
    useEffect(() => {
        setAutoData([]);
        setManualData({})
    },[typeValue])

    // 请求job
    // 请求数据
    useEffect(() => {
        fetchGet(jobsUrl).then(({payload=[]}) => {
            console.log(payload)
            const arr = payload.map(n => n.desc)
            setJobArr(arr)
            setJobNameArr(payload.map(n => n.name))
        })
    },[])

    const initError = () => {
        setNameError(false);
        setDecError(false);
        setAutoError(false);
    }

    const initData = () => {
        setNameValue('');
        setDecValue('');
        setTypeValue('自动分配');
        setAutoData([]);
    }
    // 弹窗关闭实践
    const handleClose = () => {
        initData();
        initError();
        setOpen(false);
    };
    // 表单校验 规则
    const checkoutValue = (value,setValueError) => {
        let bol = false;
        if (typeof value === "string") {
            bol = value === '';
        }else if (value instanceof Array) {
            bol =value.length === 0;
        } else {
            // TODO
            bol = Object.values(value).filter(n => n.length === 0).length === 0
        }
        setValueError(bol);
        return !bol;
    }
    const addOrder = () => {
        // 表单校验
        let nameBol = checkoutValue(nameValue,setNameError)
        let decBol = checkoutValue(decValue,setDecError)
        
        let dataBol = (typeValue === '自动分配' ?
            checkoutValue(autoData,setAutoError) :
            true
            );
        // console.log(bol)
        // 如果上述都为真则发送数据并将数据初始化和关闭弹窗
        if (nameBol && decBol && dataBol) {
            initError();
            initData();
            sendValue();
            setOpen(false)
        }
    }

    const sendValue = async () => {
        const getAutoValue = () => {
            return {
                orderName: nameValue,
                orderDesc: decValue,
                jobNames: autoData
                // jobNames: ["job0__0",
                //     "job1__0",
                //     "job2__0"]
            }
        }
        const getManualValue = () => {
            return {
                orderName: nameValue,
                orderDesc: decValue,
                edgeJobNames: manualData
                // edgeJobNames: {
                //     edge0:  ["job0__0",
                //         "job1__0",
                //         "job2__0"]
                // }
            }
        }
        const data = typeValue === '自动分配' ? getAutoValue() : getManualValue()
        const url =  typeValue === '自动分配' ? automaticUrl : manualUrl
        const res = await fetchPost(url,[data])
        if (res.code === 500) {
            setSOpen(true)
            setMessage(res.message)
        }
    }

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
            >
                <DialogTitle id="alert-dialog-title">
                    {"添加订单"}
                </DialogTitle>
                <DialogContent>
                    <Box>
                        <InputWithLabel name={'名称'} style={{margin:'15px 0'}}>
                            <TextField id="outlined-basic" label="名称"
                                       size='small' variant="outlined"
                                       color='primary' sx={{width:200}}
                                       value={nameValue}
                                       error={nameError}
                                       onChange={(event) => {
                                           setNameValue(event.target.value)
                                           checkoutValue(event.target.value,setNameError)
                                       }}
                            />
                        </InputWithLabel>
                        <InputWithLabel name={'描述'} style={{marginBottom:15}}>
                            <TextField id="outlined-basic" label="描述"
                                       size='small' variant="outlined"
                                       color='primary' sx={{width:200}}
                                       error={decError}
                                       value={decValue}
                                       onChange={(event) => {
                                           setDecValue(event.target.value)
                                           checkoutValue(event.target.value,setDecError)
                                       }}
                            />
                        </InputWithLabel>
                        <InputWithLabel name={'分配方式'} style={{marginBottom:15}}>
                            <FormControl>
                                <InputLabel id="demo-simple-select-label">分配方式</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={typeValue}
                                    size='small'
                                    label="Age"
                                    error={typeError}
                                    style={{width:200}}
                                    onChange={(e) => {
                                        setTypeValue(e.target.value)
                                    }}
                                >
                                    <MenuItem value={'自动分配'}>自动分配</MenuItem>
                                    <MenuItem value={'手动分配'}>手动分配</MenuItem>
                                </Select>
                            </FormControl>
                        </InputWithLabel>
                        <InputWithLabel name={'任务安排'} alignItems='start'>
                            {typeValue === '自动分配'
                                ? <AutoDistribute
                                    data={autoData}
                                    sendData={(data) => setAutoData(data)}
                                    error={autoError}
                                    setError={setAutoError}
                                    jobArr={jobArr}
                                    jobNameArr={jobNameArr}
                                />
                                : <ManualDistribute
                                    data={manualData}
                                    sendData={setManualData}
                                    jobArr={jobArr}
                                    jobNameArr={jobNameArr}
                                />
                            }
                        </InputWithLabel>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={addOrder}>添加</Button>
                    <Button onClick={handleClose} autoFocus>
                        取消
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    )
}
