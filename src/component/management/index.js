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
import {AddJob} from "./AddJob";
import {AddProcess} from "./AddProcess";

const ProcedureItem = (props) => {

    const {name,desc,status} = props; // 获取名称、描述、状态
    const [isHover,setIsHover] = useState(false); // 当鼠标覆盖时高亮

    return (
       <div style={{display:'inline-block',height:40,lineHeight:'40px',position:"relative"}}>
            <span style={{display:'inline-block',width:50,height:40,textAlign:"center",
                overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',cursor:"pointer",
                lineHeight:'40px'
            }}
                onMouseOver={() => setIsHover(true)}
                  onMouseOut={() => setIsHover(false)}
            >
                {desc}
            </span>
           {/*<span style={{display:"inline-block",height:40,lineHeight:'40px'}}>,</span>*/}
           {
               isHover ? (
                   <p style={{position:'absolute',top:-50,left:(-desc.split('').length*10),textAlign:'center',height:30,width:(desc.split('').length*20),backgroundColor:'rgba(100,94,94,0.8)',padding:5}}>
                        {desc}
                    </p>
               ) : null
           }
       </div>
    )
}
export function Management() {
    const [jobData,setJobData] = useState([]); 
    const [isJobDialogOpen,setIsJobDialogOpen] = useState(false) 
    const [isProcessDialogOpen,setIsProcessDialogOpen] = useState(false) 
    // 请求数据
    useEffect(() => {
        fetchGet(jobsUrl).then(({payload}) => {
            console.log(payload)
            setJobData(payload)
        })
    },[])
    return (
        <Box sx={{width:'100%',height:554,overflowY:'auto',backgroundColor:'#AFBED0',padding:1, borderRadius:1}}>
            <Box sx={{textAlign:'right',p:1}}>
                <Button variant="contained" sx={{mr:5}} onClick={() => setIsJobDialogOpen(true)}>创建任务</Button>
                <Button variant="contained" sx={{mr:1}} onClick={() => setIsProcessDialogOpen(true)}>创建工序</Button>
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
                                        {job.desc}
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
            <AddJob setOpen={setIsJobDialogOpen} open={isJobDialogOpen}/>
            <AddProcess setOpen={setIsProcessDialogOpen} open={isProcessDialogOpen} jobList={jobData.map(j => j.desc)}/>
        </Box>
    )
}
