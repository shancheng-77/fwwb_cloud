import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl, InputLabel, MenuItem, Select,
    TextField
} from "@mui/material";
import Button from "@mui/material/Button";
import * as React from "react";
import {InputWithLabel} from "../log/MyForm";
import {useCallback, useEffect, useState} from "react";
import Box from "@mui/material/Box";
import {automaticUrl, fetchGet, fetchPost, jobsUrl, manualUrl} from "../../requestAddress";

const AutoDistribute = ({data,sendData,error,setError,name='任务安排',jobArr=[],jobNameArr=[]}) => {

    const [orderArr,setOrderArr] = useState(data); // 复选框选中内容
    // const [jobArr,setJobArr] = useState(['job0','job1','job2']); // job数组
    const [jobSelectedCount,setJobSelectedCount] = useState(Array(jobArr.length).fill(0))

    const sendNowData = (countArr) => {
        const arr = jobNameArr.map((n, i) => {
            if (countArr[i] !== 0) {
                let arr = [];
                for (let j = 0; j < countArr[i]; j++) {
                    arr.push(jobNameArr[i] + '__' + j)
                }
                return arr;
            }else return ''
        }).flat(1).filter(n => n !== '')
        console.log(arr)
        sendData(arr)
    }

    const countAdd = (index) => {
        // 获取增加后的数组
        const selectedCountArr = jobSelectedCount.map((n,i) => i === index ? n+1 : n)
        // 将选中数组改为值不为0的
        setOrderArr(jobArr.filter((n,i) => selectedCountArr[i] !== 0));
        setJobSelectedCount([...selectedCountArr] );
        sendNowData(selectedCountArr)
    }
    const countReduce = (index) => {
        const selectedCountArr = jobSelectedCount.map((n,i) => i === index ? (n <= 0 ? n : n-1) : n)
        console.log(selectedCountArr)
        setOrderArr(jobArr.filter((n,i) => selectedCountArr[i] !== 0));
        setJobSelectedCount([...selectedCountArr] )
    }

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

const ManualDistribute = ({data,sendData,error,setError,jobArr,jobNameArr}) => {
    const [edge0Data,setEdge0Data] = useState([])
    const [edge1Data,setEdge1Data] = useState([])
    const [edge2Data,setEdge2Data] = useState([])

    const [error1,setError1] = useState(false)
    const [error2,setError2] = useState(false)
    const [error3,setError3] = useState(false)

    useEffect(() => {
        sendData({
            'edge0' : edge0Data,
            'edge1' : edge1Data
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
            <AutoDistribute
                data={edge1Data}
                sendData={setEdge1Data}
                error={error1}
                setError={setError1}
                name='Edge1'
                jobArr={jobArr}
                jobNameArr={jobNameArr}
            />
            {/*<AutoDistribute data={edge1Data} sendData={setEdge1Data} error={error2} setError={setError2} name='Edge1'/>*/}
            {/*<AutoDistribute data={edge2Data} sendData={setEdge2Data} error={error3} setError={setError3} name='Edge0'/>*/}
        </Box>
    )
}


export function AddOrderDialog1({open,setOpen}) {

    const [nameValue,setNameValue] = useState('')
    const [typeValue,setTypeValue] = useState('自动分配')
    const [decValue,setDecValue] = useState('')

    const [autoData,setAutoData] = useState([]);
    const [manualData,setManualData] = useState({});
    // job数组
    const [jobArr,setJobArr] = useState([])
    const [jobNameArr,setJobNameArr] = useState([])
    // 表单校验
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
    const handleClose = () => {
        initData();
        initError();
        setOpen(false);
    };
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
        // TODO 完善校验
        let nameBol = checkoutValue(nameValue,setNameError)
        let decBol = checkoutValue(decValue,setDecError)
        let dataBol = (typeValue === '自动分配' ?
            checkoutValue(autoData,setAutoError) :
            true
            );
        // console.log(bol)
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
            }
        }
        const getManualValue = () => {
            return {
                orderName: nameValue,
                orderDesc: decValue,
                edgeJobNames: manualData
            }
        }
        const data = typeValue === '自动分配' ? getAutoValue() : getManualValue()
        const url =  typeValue === '自动分配' ? automaticUrl : manualUrl
        const res = await fetchPost(url,[data])
        // TODO 弹出完成的消息框
        console.log(res)
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
