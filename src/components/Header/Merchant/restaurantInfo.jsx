import * as React from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, 
Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core'
import axios from 'axios';
import { useState } from 'react'
import makeStyles from '././styles-form.js';

export const RestaurantInfo = () => {

    const [open, setOpen] = useState(false)
    const classes = makeStyles();
    let rows = []

    function createData(name, time, size) {
        return { name, time, size };
    }

    // function selectRows(){
    //     console.log("SELECTROWS")
    //     for (let i = 0; i < 15; i++) {
    //         var name = '';
    //         var time = '';
    //         var size = '';
    //         if (JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(JSON.parse(details)["data"]))["reservations"]))))[i]))['userID'] != null) {
    //             name = JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(JSON.parse(details)["data"]))["reservations"]))))[i]))['userID'];
                
    //         }
    //         if (JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(JSON.parse(details)["data"]))["reservations"]))))[i]))['reserveTime'] != null) {
    //             time = JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(JSON.parse(details)["data"]))["reservations"]))))[i]))['reserveTime'];
    //         }
    //         if (JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(JSON.parse(details)["data"]))["reservations"]))))[i]))['partySize'] != null) {
    //             size = JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(JSON.parse(details)["data"]))["reservations"]))))[i]))['partySize'];
    //         }
            
    //         if(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(JSON.parse(details)["data"]))["reservations"]))))[i]))['userID'] != null){
    //             rows.push(createData(name, time, size))
    //         }
    //     };

    //     // createData('Louis Johnson', '15:30', '5'),
    //     // createData('Mary Welsh', '12:00', '2'),
    //     // createData('Larry Bold', '18:45', '3'),
    // }

    let [details, setDetails] = useState([])
    let [user, setUser] = useState([])
    let [time, setTime] = useState([])
    let [size, setSize] = useState([])
    
    const getReservations = async () => {
        //setOpen(false)
        axios.get("https://tjcc5pqmel.execute-api.us-east-1.amazonaws.com/dev/restaurants/2371005", 
        {
            headers: {
                //"access-control-allow-origin": "*",
                //"Access-Control-Allow-Headers": "Accept",
                //"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
                "Authorization": localStorage.getItem('idToken')
                //idToken ^^
            }
        })
        .then((response) => {
            console.log(JSON.stringify(response));
            details = JSON.stringify(response);
             var name = '';
             var time = '';
             var size = '';
            for (let i = 0; i < 1; i++) {
                name = JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(JSON.parse(details)["data"]))["reservations"]))))[i]))['userID']
                console.log("TEMP!!! " + name)
            }
            for (let i = 0; i < 1; i++) {
                time = JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(JSON.parse(details)["data"]))["reservations"]))))[i]))['reserveTime']
                console.log("TEMP!!! " + time)
            }
            for (let i = 0; i < 1; i++) {
                size = JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(JSON.parse(details)["data"]))["reservations"]))))[i]))['partySize']
                console.log("TEMP!!! " + size)
            }
            setUser(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(JSON.parse(details)["data"]))["reservations"]))))[0]))['userID'])
            setSize(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(JSON.parse(details)["data"]))["reservations"]))))[0]))['partySize'])
            console.log('DETAILS - ' + details)
            console.log('DETAILS - ' + time)
            console.log('USER - ' + user)
            console.log('SIZE - ' + size)
            
            //const restaurants = response.data;
        })
        .catch((err) => console.log(err));
        //selectRows()
        setOpen(true)
    }

    const [age, setAge] = React.useState('');

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
            <Button onClick={() => getReservations()}>Restaurant</Button>
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
                                        {user}
                                    </TableCell>
                                    <TableCell align="right">{time}</TableCell>
                                    <TableCell align="right">{size}</TableCell>
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