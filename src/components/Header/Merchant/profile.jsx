import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Avatar } from '@material-ui/core'
import axios from 'axios';
import { useState } from 'react'
import useStyles from '././styles-form.js';
import { RestaurantInfo } from '././restaurantInfo.jsx';

export const ProfilePage = () => {

    const [open, setOpen] = useState(false)
    const classes = useStyles();

    const state = {
        restaurants: []
    }

    const handleSubmit = async () => {
        //setOpen(false)
        axios.get("https://tjcc5pqmel.execute-api.us-east-1.amazonaws.com/dev/restaurants", 
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
            console.log(response);
            const restaurants = response.data;
        })
        .catch((err) => console.log(err));
    }

    function assignRestaurant(locationId){

    }

    
    return(
        <div>
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
                            {/* <Button>Bob's Burgers - Daytona Beach</Button>
                            <Button>Bob's Burgers - DeLand</Button> */}
                        </DialogContent>
                        
                    <DialogActions>
                        <TextField className = {classes.TextField} placeholder = "Location-ID"/>
                        <Button onClick={handleSubmit}>Enter</Button>
                    </DialogActions>
                        
                </Dialog>
        </div>

    )



}