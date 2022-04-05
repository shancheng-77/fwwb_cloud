import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import * as React from "react";

export function MyTable({rows=[]}) {
    return (
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
    )
}
