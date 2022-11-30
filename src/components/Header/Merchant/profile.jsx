import * as React from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Avatar,
Select, MenuItem, Box, FormControl, InputLabel } from '@material-ui/core'
import axios from 'axios';
import { useState } from 'react'
import useStyles from '././styles-form.js';
import { RestaurantInfo } from '././restaurantInfo.jsx';
import { Details } from '@material-ui/icons';

export const ProfilePage = () => {

    const [open, setOpen] = useState(false)

    
    const classes = useStyles();


    const [age, setAge] = React.useState('');

    const handleChange = (event) => {
        setAge(event.target.value);
    };

    
    return(
        <div>
            {/* <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Merchant</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={age}
                    label="Merchant"
                    onChange={handleChange}
                >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                </Select>
                </FormControl>
            </Box> */}

            <Button onClick={() => setOpen(true)}>Merchant</Button>
             <Dialog 
                open = {open} 
                onClose={() => setOpen(false)} 
                aria-labelledby='dialog-title' 
                ariadescribedby='dialog-description'
                fullWidth
            >
                    {/* <DialogActions>
                            <Button className = {classes.button} onClick={() => setOpen(false)} autoFocus>X</Button>
                    </DialogActions> */}
                    <DialogTitle className = {classes.DialogTitle} id='dialog-title'>Restaurants</DialogTitle>
                        <DialogContent>
                            <RestaurantInfo/>
                            {/* <Button>TEST</Button> */}
                            {/* <Button>Bob's Burgers - Daytona Beach</Button>
                            <Button>Bob's Burgers - DeLand</Button> */}
                        </DialogContent>
                        
                    <DialogActions>
                    </DialogActions>
                        
                </Dialog>
        </div>

    )



}