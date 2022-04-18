import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import Box from "@mui/material/Box";
import {InputWithLabel} from "../log/MyForm";
import Button from "@mui/material/Button";
import * as React from "react";
import {useContext, useState} from "react";
import {sendMessage, SnackbarContext} from "../../views/main";

export function AddJob({open,setOpen}) {

    const [nameValue,setNameValue] = useState('')
    const [decValue,setDecValue] = useState('')

    const {dispatch} = useContext(SnackbarContext)
    const initData = () => {
        setNameValue('');
        setDecValue('');
    }
    const handleClose = () => {
        initData()
        setOpen(false)
    }
    const addOrder = () => {
        setOpen(false)
        dispatch(sendMessage({open:true,message:'设置成功',type:'success'}))
        initData()
    }
    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
            >
                <DialogTitle id="alert-dialog-title">
                    {"添加任务"}
                </DialogTitle>
                <DialogContent>
                    <Box>
                        <InputWithLabel name={'名称'} style={{margin:'15px 0'}}>
                            <TextField id="outlined-basic" label="名称"
                                       size='small' variant="outlined"
                                       color='primary' sx={{width:200}}
                                       value={nameValue}
                                       onChange={(event) => {
                                           setNameValue(event.target.value)
                                       }}
                            />
                        </InputWithLabel>
                        <InputWithLabel name={'描述'} style={{marginBottom:15}}>
                            <TextField id="outlined-basic" label="描述"
                                       size='small' variant="outlined"
                                       color='primary' sx={{width:200}}
                                       value={decValue}
                                       onChange={(event) => {
                                           setDecValue(event.target.value)
                                       }}
                            />
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
