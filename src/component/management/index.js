import Box from "@mui/material/Box";
import * as React from "react";
import {Button} from "@mui/material";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import {useEffect, useState} from "react";
import {fetchGet, jobsUrl} from "../../requestAddress";

const ProcedureItem = (props) => {
    const {name,status} = props
    return (
        <span style={{display:'inline-block',width:30,textAlign:"center",}}>
            {name}
        </span>
    )
}
export function Management() {
    const [jobData,setJobData] = useState([]);

    // 请求数据
    useEffect(() => {
        fetchGet(jobsUrl).then(({payload}) => {
            // console.log(payload)
            setJobData(payload)
        })
    },[])
    return (
        <Box sx={{width:'100%',height:554,overflowY:'auto',backgroundColor:'#AFBED0',padding:1, borderRadius:1}}>
            <Box sx={{textAlign:'right',p:1}}>
                <Button variant="contained" sx={{mr:5}}>创建任务</Button>
                <Button variant="contained" sx={{mr:1}}>创建工序</Button>
            </Box>
            <Box style={{maxHeight:500,overflowY:'auto',padding:1}}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                        <TableHead style={{backgroundColor:'#283A4D',height:50}}>
                            <TableRow>
                                <TableCell align="center">任务</TableCell>
                                <TableCell align="center" sx={{width:'70%'}}>工序</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {jobData.map((job) => (
                                <TableRow
                                    key={job.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } ,height:50,backgroundColor:'#eee'}}
                                >
                                    <TableCell component="th" scope="row" style={{color:'black'}}  align="center">
                                        {job.name}
                                    </TableCell>
                                    <TableCell align="center" style={{color:'black'}}>
                                        {
                                            job.procedures.map((n,i) => {
                                               return <ProcedureItem {...n} key={i}/>
                                            })
                                        }
                                    </TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    )
}
