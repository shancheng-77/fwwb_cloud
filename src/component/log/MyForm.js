import Box from "@mui/material/Box";
import {Button, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DatePicker from "@mui/lab/DatePicker";
import * as React from "react";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {useEffect, useState} from "react";
const lightTheme = createTheme({
    palette: {
        mode: 'light',
    },
});
export const InputWithLabel = (props) => {
    let {children,name,style,alignItems='center'} = props;
    return (
        <div style={{display:'flex',alignItems:alignItems,...style}}>
            <span style={{ textAlign: 'justify',width:80}}>{name}：</span>
            {children}
        </div>

    )
}
export function MyForm({getValue}) {

    const [modelValue,setModelValue] = useState('');
    const [peopleValue,setPeopleValue] = useState('');
    const [typeValue,setTypeValue] = useState('');
    const [statusValue,setStatusValue] = useState('');
    const [startTimeValue,setStartTimeValue] = useState('');
    const [endTimeValue,setEndTimeValue] = useState('');

    const resetValue = () => {
      setModelValue('');
      setPeopleValue('');
      setTypeValue('');
      setStatusValue('');
      setStartTimeValue('');
      setEndTimeValue('');
    }
    const searchClick = () => {
      getValue({
          model: modelValue,
          people: peopleValue,
          type: typeValue,
          status: statusValue,
          startTime: startTimeValue,
          endTime: endTimeValue
      })
    }

    return (
        <ThemeProvider theme={lightTheme} >
            <Box style={{display:'flex',justifyContent:'space-between'}}>
                <InputWithLabel name={'系统模块'}>
                    <TextField id="outlined-basic" label="操作人员"
                               size='small' variant="outlined"
                               color='primary' sx={{width:150}}
                               value={modelValue}
                               onChange={(event) => {
                                   setModelValue(event.target.value)
                               }}
                    />
                </InputWithLabel>
                <InputWithLabel name={'操作人员'}>
                    <TextField id="outlined-basic" label="操作人员"
                               size='small' variant="outlined"
                               color='primary' sx={{width:150}}
                               value={peopleValue}
                               onChange={(e) => {
                                   setPeopleValue(e.target.value)
                               }}
                    />
                </InputWithLabel>
                <InputWithLabel name={'操作类型'}>
                    <FormControl>
                        <InputLabel id="demo-simple-select-label">操作类型</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={typeValue}
                            size='small'
                            label="Age"
                            style={{width:150}}
                            onChange={(e) => {
                                setTypeValue(e.target.value)
                            }}
                        >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>
                </InputWithLabel>
                <InputWithLabel name={'操作状态'} >
                    <FormControl>
                        <InputLabel id="demo-simple-select-label">操作状态</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={statusValue}
                            size='small'
                            label="Age"
                            style={{width:150}}
                            onChange={(e) => {
                                setStatusValue(e.target.value)
                            }}
                        >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>
                </InputWithLabel>
            </Box>
            <Box style={{display:'flex',justifyContent:'space-between'}}>
                <InputWithLabel name={'开始时间'}>
                    <FormControl>
                        <InputLabel id="demo-simple-select-label">开始时间</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={startTimeValue}
                            size='small'
                            label="Age"
                            style={{width:150}}
                            onChange={(e) => {
                                setStartTimeValue(e.target.value)
                            }}
                        >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>
                </InputWithLabel>
                <InputWithLabel name={'终止时间'}>
                    <FormControl>
                        <InputLabel id="demo-simple-select-label">结束时间</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={endTimeValue}
                            size='small'
                            label="Age"
                            style={{width:150}}
                            onChange={(e) => {
                                setEndTimeValue(e.target.value)
                            }}
                        >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>
                </InputWithLabel>
                <Box style={{width:230}}/>
                <Box style={{flexBasis:230,display:'flex',justifyContent:'space-between'}}>
                    <Button variant="contained"  color="primary"
                            style={{width:100}}
                            onClick={searchClick}
                    >
                        搜索
                    </Button>
                    <Button variant="contained"  color="error"
                            style={{width:100}}
                            onClick={resetValue}
                    >
                        重置
                    </Button>
                </Box>
            </Box>
        </ThemeProvider>

    )
}
