import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, 
Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core'
import { useState } from 'react'
import makeStyles from '././styles-form.js';

export const RestaurantInfo = () => {

    const [open, setOpen] = useState(false)
    const classes = makeStyles();

    function createData(name, time, size) {
        return { name, time, size };
    }

    const rows = [
        createData('Louis Johnson', '15:30', '5'),
        createData('Mary Welsh', '12:00', '2'),
        createData('Larry Bold', '18:45', '3'),
    ]


    // {places?.map((place, i) => (
    //     <Grid ref={elRefs[i]} item key = {i} xs={12}>
    //         <PlaceDetails 
    //             place={place}
    //             selected={Number(childClicked) === i}
    //             refProp={elRefs[i]}
    //         />
    //     </Grid>
    // ))}

    return(
        <div>
            <Button onClick={() => setOpen(true)}>Restaurant</Button>
             <Dialog 
                open = {open} 
                onClose={() => setOpen(false)} 
                aria-labelledby='dialog-title' 
                ariadescribedby='dialog-description'
                fullWidth
                maxWidth="sm"
            >
                    {/* <DialogActions>
                            <Button className = {classes.button} onClick={() => setOpen(false)} autoFocus>X</Button>
                    </DialogActions> */}
                    <DialogTitle className = {classes.DialogTitle} id='dialog-title'>Your Reservations</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Restaurant Name
                            </DialogContentText>
                            <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                <TableRow>
                                    <TableCell>Customer</TableCell>
                                    <TableCell align="right">Time</TableCell>
                                    <TableCell align="right">Party</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {rows.map((row) => (
                                    <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">{row.time}</TableCell>
                                    <TableCell align="right">{row.size}</TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                            </TableContainer>
                        </DialogContent>
                        
                    <DialogActions>
                        {/* <TextField className = {classes.TextField}/>
                        <Button>Enter</Button> */}
                    </DialogActions>
                        
                </Dialog>
        </div>

    )



}