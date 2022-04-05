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

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];
export function Management() {
    return (
        <Box sx={{width:'100%',height:554,overflowY:'auto',backgroundColor:'#AFBED0',padding:1}}>
            <Box sx={{textAlign:'right',p:1}}>
                <Button variant="contained" sx={{mr:5}}>创建任务</Button>
                <Button variant="contained" sx={{mr:1}}>创建工序</Button>
            </Box>
            <Box style={{maxHeight:500,overflowY:'auto',padding:1}}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                        <TableHead style={{backgroundColor:'#283A4D',height:50}}>
                            <TableRow>
                                <TableCell>Dessert (100g serving)</TableCell>
                                <TableCell align="right">Calories</TableCell>
                                <TableCell align="right">Fat&nbsp;(g)</TableCell>
                                <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                                <TableCell align="right">Protein&nbsp;(g)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow
                                    key={row.name+Math.random()}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } ,height:50,backgroundColor:'#eee'}}
                                >
                                    <TableCell component="th" scope="row" style={{color:'black'}}>
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right" style={{color:'black'}}>{row.calories}</TableCell>
                                    <TableCell align="right" style={{color:'black'}}>{row.fat}</TableCell>
                                    <TableCell align="right" style={{color:'black'}}>{row.carbs}</TableCell>
                                    <TableCell align="right" style={{color:'black'}}>{row.protein}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    )
}
