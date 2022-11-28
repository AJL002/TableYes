import { Button, Dialog, DialogTitle, DialogContent, 
    DialogContentText, DialogActions, TextField, Radio,
    RadioGroup, FormControlLabel, Select, MenuItem, CardMedia} from '@material-ui/core'
import {Form} from 'react-bootstrap'
import axios from 'axios'
import { useState } from 'react'
import useStyles from './styles-form';
import { restaurant } from "../../api/index.js"



export const ReserveForm = ({place}) => {

    const classes = useStyles();
    // restaurant(pass), lat(pass), lng(pass), name, size, time, comments 

    const [name, setName] = useState('');
    const [comment, setComment] = useState('');
    const [restaurantID, setRestaurantID] = useState('');
    const [size, setSize] = useState('');
    const [time, setTime] = useState('');
    
    const [open, setOpen] = useState(false);

    

    // store and pass token
    const handleSubmit = async () => {
        //setOpen(false)
        axios.post("https://tjcc5pqmel.execute-api.us-east-1.amazonaws.com/dev/reservations", 
        JSON.stringify({
            token: 'eyJraWQiOiJwYVVSeVN0WUk3V1BJdWhCc1JjZUdnZ0NcLzdQY0dVUEdCOEFKYlVYa3NqST0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI2NmI4MmE2OC0zNDY2LTRjNzctOWVmNS03YzRiNjNkNzdkZDciLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV95SnRjckdBQ0YiLCJjbGllbnRfaWQiOiI1ajRxbjNoY3RiNDY2ZGM2dm81bHY4OWs0ZiIsIm9yaWdpbl9qdGkiOiI4NDU2NmExMC05OGY3LTQ3ZWYtOGVkZi1mNjNlYTcwOTIyZWEiLCJldmVudF9pZCI6IjUyMTQxMTkwLTU1NDktNDliZS04ZmVmLWIyNjFkMWQ4YjZkZiIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE2Njg2MjkwODEsImV4cCI6MTY2ODY0NzA4MSwiaWF0IjoxNjY4NjI5MDgxLCJqdGkiOiIyOTY0ZDQ1ZC00YzY3LTQxMWYtYjM3My0wYWM5NWEyNGYzODkiLCJ1c2VybmFtZSI6InN1Y2Nlc3MrMUBzaW11bGF0b3IuYW1hem9uc2VzLmNvbSJ9.LF7ZUagJyEtKoczVU1nElUwEgTCFDiprt3Z8uYX-zFX2uURo3J7cx4R0Lk9gpw-b5jzv5adYktL5ID6iJgKJDKq7EWlm7u2P2-mFSQg1IoyYVolumlAblXpWCWophPTujyqGPAKz6vFBKni_LI86iOEMYPLiA-TOiCAFOZDT6OuqfHl0Oj3L2fyxIjvvP61Bbe1yp1jyPflipmsMHz4YwxBiW-d0l-nSdm_B8ouvZmwOfa6VRHr3K9yYnW39KU7fN17W5zNFqvwfwcDN0m0RcZW2oYFJOZm_Os9uX2rmkUSPLQlODjNjgdjnwVoEFwAAABaSLJL63DQ4em9-VM4YZw', // token
            restaurantID: 'e043fae0-651a-11ed-833e-4d1a621d7aaf', // string
            reserveTime: time, // string
            partySize: size, // int
        }),
        {
            headers: {
                //"access-control-allow-origin": "*",
                //"Access-Control-Allow-Headers": "Accept",
                //"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
                "Authorization": 'eyJraWQiOiJuT3NYQ1pSRTFLS3pDRjNSUEZXMXkwYVFcL0J5MUtaSVNqWkxWdUYxSlpwWT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI2NmI4MmE2OC0zNDY2LTRjNzctOWVmNS03YzRiNjNkNzdkZDciLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfeUp0Y3JHQUNGIiwiY29nbml0bzp1c2VybmFtZSI6InN1Y2Nlc3MrMUBzaW11bGF0b3IuYW1hem9uc2VzLmNvbSIsIm9yaWdpbl9qdGkiOiJhMzRhY2RkZS02MThhLTRmZjctOWU5ZS01MWI0YzdiODQ4YWUiLCJhdWQiOiI1ajRxbjNoY3RiNDY2ZGM2dm81bHY4OWs0ZiIsImV2ZW50X2lkIjoiYjdjODgzMDMtM2I1Yy00ZDZhLWFkNTYtZGE4MzczMzVmNTI4IiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2Njg2MTIzMjIsImV4cCI6MTY2ODYzMDMyMiwiaWF0IjoxNjY4NjEyMzIyLCJqdGkiOiIxODIzMzA4ZC03ZjBlLTQxNTUtYjc5ZS01ZmQ3ZDg1N2ZmNzciLCJlbWFpbCI6InN1Y2Nlc3MrMUBzaW11bGF0b3IuYW1hem9uc2VzLmNvbSJ9.jQ3t1mMu73JU-asJXhHJyUMiiKBfqEqpnEGm2B-caci0ey9VxbdUJQTQdfd5LdgppB-VXU63CJV6frb-KyURMH9DMg1rOE5qZ9lKiCDhmCZlgT587qmSGikJfzrOLeMqKUIOg_niJW4OyWZcHEpOlm33Il7zk55eOSzykLXsVp-wvKDi__ebW6sVKH4rAOZME9v7i-rAIbevwH-94039shNpTP_UiEWlaoCjQiFQmUW6fiXxpR3AvxRyAVDpSXAKUX6Gprhhq8neoT8lIkZii8j3FCZj2ZHlghtBiX6ai5se8tZeapja58CkPYB7Q5loN7i2RGlXUIS96O9OtJ9kpA'
                //idToken ^^
            }
        })
        .then((response) => console.log(response))
        .catch((err) => console.log(err));
    }

    const testSubmit = async () => {
        //setOpen(false)
        axios.post("https://tjcc5pqmel.execute-api.us-east-1.amazonaws.com/dev/api/private", 
        JSON.stringify({
            
        }),
        {
            headers: {
                //"access-control-allow-origin": "*",
                //"Access-Control-Allow-Headers": "Accept",
                //"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
                "Authorization": localStorage.getItem('idToken')
                //idToken ^^
            }
        })
        .then((response) => console.log(response))
        .catch((err) => console.log(err));
    }

    const restaurantSubmit = async () => {
        axios.post("https://tjcc5pqmel.execute-api.us-east-1.amazonaws.com/dev/restaurants", 
        {
            "fullname" : place.name,
            "email" : "test@simulator.amazonses.com", // string
            "lat" : parseFloat(place.latitude), 
            "long" : parseFloat(place.longitude),
            "token" : 'eyJraWQiOiJwYVVSeVN0WUk3V1BJdWhCc1JjZUdnZ0NcLzdQY0dVUEdCOEFKYlVYa3NqST0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI2NmI4MmE2OC0zNDY2LTRjNzctOWVmNS03YzRiNjNkNzdkZDciLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV95SnRjckdBQ0YiLCJjbGllbnRfaWQiOiI1ajRxbjNoY3RiNDY2ZGM2dm81bHY4OWs0ZiIsIm9yaWdpbl9qdGkiOiJhMzRhY2RkZS02MThhLTRmZjctOWU5ZS01MWI0YzdiODQ4YWUiLCJldmVudF9pZCI6ImI3Yzg4MzAzLTNiNWMtNGQ2YS1hZDU2LWRhODM3MzM1ZjUyOCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE2Njg2MTIzMjIsImV4cCI6MTY2ODYzMDMyMiwiaWF0IjoxNjY4NjEyMzIyLCJqdGkiOiJlMTkzNzQxOS0xMzgwLTRlNmUtYWQ0Ny0yNjhjMzJkNjlhMTIiLCJ1c2VybmFtZSI6InN1Y2Nlc3MrMUBzaW11bGF0b3IuYW1hem9uc2VzLmNvbSJ9.bcRx25j1M7BdOZ-E5_rzZI8LLuhjeBgFqIv5cQXLIQKtuOz1qr5ngOZ5MuaIkwctx3J8mmwQqFQl6FM_KmYuSOaPbpi6yIcts12MDD8kwXFd1Z2Adty20_3V4JkLHXCRzNnfSYO7zL_Jq94NTV_aQOSwiHA_4oKfs91QTKWaFSJMwoJK8OTQMBegEJUF2ClCal4v8TQo4j2P9hn-acAFBToGe5Y0LqAkadI9h1BAWNrvHHFBaYILNSdCUrm_UogLsMIHr_RGUQpM-1o0jelR8Ohd9SjljHEKfGrcot2HMvWeHt1Zg26AaHmxrtmEIb1-kSBFPP70P7d7D8CN0Vt2zg'
        }, 
        {
            headers: {
                "Access-Control-Allow-Origin": true,
                "Access-Control-Allow-Headers": "Accept",
                //"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
                "Authorization": 'eyJraWQiOiJuT3NYQ1pSRTFLS3pDRjNSUEZXMXkwYVFcL0J5MUtaSVNqWkxWdUYxSlpwWT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI2NmI4MmE2OC0zNDY2LTRjNzctOWVmNS03YzRiNjNkNzdkZDciLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfeUp0Y3JHQUNGIiwiY29nbml0bzp1c2VybmFtZSI6InN1Y2Nlc3MrMUBzaW11bGF0b3IuYW1hem9uc2VzLmNvbSIsIm9yaWdpbl9qdGkiOiJhMzRhY2RkZS02MThhLTRmZjctOWU5ZS01MWI0YzdiODQ4YWUiLCJhdWQiOiI1ajRxbjNoY3RiNDY2ZGM2dm81bHY4OWs0ZiIsImV2ZW50X2lkIjoiYjdjODgzMDMtM2I1Yy00ZDZhLWFkNTYtZGE4MzczMzVmNTI4IiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2Njg2MTIzMjIsImV4cCI6MTY2ODYzMDMyMiwiaWF0IjoxNjY4NjEyMzIyLCJqdGkiOiIxODIzMzA4ZC03ZjBlLTQxNTUtYjc5ZS01ZmQ3ZDg1N2ZmNzciLCJlbWFpbCI6InN1Y2Nlc3MrMUBzaW11bGF0b3IuYW1hem9uc2VzLmNvbSJ9.jQ3t1mMu73JU-asJXhHJyUMiiKBfqEqpnEGm2B-caci0ey9VxbdUJQTQdfd5LdgppB-VXU63CJV6frb-KyURMH9DMg1rOE5qZ9lKiCDhmCZlgT587qmSGikJfzrOLeMqKUIOg_niJW4OyWZcHEpOlm33Il7zk55eOSzykLXsVp-wvKDi__ebW6sVKH4rAOZME9v7i-rAIbevwH-94039shNpTP_UiEWlaoCjQiFQmUW6fiXxpR3AvxRyAVDpSXAKUX6Gprhhq8neoT8lIkZii8j3FCZj2ZHlghtBiX6ai5se8tZeapja58CkPYB7Q5loN7i2RGlXUIS96O9OtJ9kpA'
                //idToken
            }
        })
        .then((response) => console.log(response))
        .catch((err) => console.log(err));
    }

    const restaurantGo = async () => {
        try {
            await restaurant({
                "fullname" : place.name,
                "email" : "testing@simulator.amazonses.com", // string
                "lat" : parseFloat(place.latitude), 
                "long" : parseFloat(place.longitude),
                "token" : localStorage.getItem('accessToken')
            });
        } catch (error) {
            console.log(error);
          }
    };
    
    const handleChange = (e) => {
        setSize(e.target.value);
    };

    return (
        <div>
            <Button onClick={() => setOpen(true)}>Book Now</Button>
            <Dialog 
                open = {open} 
                onClose={() => setOpen(false)} 
                aria-labelledby='dialog-title' 
                ariadescribedby='dialog-description'
            >
                <Form>
                    <DialogTitle className={classes.DialogTitle}>{place.name || 'Test'} | {place.address || '1234 Street'}</DialogTitle>
                    <CardMedia
                        style={{ height: 300 }}
                        image={'https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg'}
                        title={place.name}
                    />
                    <DialogTitle className={classes.DialogTitle}>Reservation Details</DialogTitle>
                        {/* <TextField // Name
                            className={classes.TextField} 
                            required
                            id="outlined-required" 
                            type="required" 
                            label="Full Name"
                            value={name}
                            onChange = {(e) => setName(e.target.value)}
                        />  */}
                    <DialogTitle className={classes.DialogTitle}>Party Size</DialogTitle>
                        <Select // Size
                            className = {classes.Select}
                            required
                            labelId="party-size-select"
                            id="party-size-select"
                            value={size}
                            label="Size"
                            onChange= {(e) => setSize(e.target.value)}
                        >
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={2}>2</MenuItem>
                            <MenuItem value={3}>3</MenuItem>
                            <MenuItem value={4}>4</MenuItem>
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={6}>6</MenuItem>
                            <MenuItem value={7}>7</MenuItem>
                            <MenuItem value={8}>8</MenuItem>
                            <MenuItem value={9}>9</MenuItem>
                        </Select>
                        <DialogTitle className={classes.DialogTitle}>Time</DialogTitle>
                            <TextField
                                className={classes.TextField} // Time Select
                                required
                                id="time"
                                type="time"
                                defaultValue="19:30"
                                value={time}
                                onChange = {(e) => setTime(e.target.value)}
                                InputLabelProps={{
                                shrink: true,
                                }}
                                inputProps={{
                                step: 300, // 5 min
                                }}
                                autoWidth
                            />
                        {/* <DialogTitle className={classes.DialogTitle}>Comments</DialogTitle>
                        <TextField className={classes.TextField} // Comment field
                            autoFocus
                            margin="dense"
                            id='dialog-title'
                            label="Write a note here..."
                            type="text"
                            variant="standard"
                            value={comment}
                            onChange = {(e) => setComment(e.target.value)}
                        />   */}
                        <DialogContent>
                            <DialogContentText id='dialog-description'>Please arrive at least 10 minutes before your reserved time.</DialogContentText>
                        </DialogContent>
                    {/* <p>{localStorage.getItem("accessToken")} and {place.name} and {place.latitude} and {place.longitude} and key: {place.location_id}</p> */}
                    <DialogActions>
                        <Button onClick={() => setOpen(false)}>Cancel</Button>
                        <Button variant='outlined' onClick={handleSubmit}>Submit</Button>
                        <Button onClick={testSubmit}>Test</Button>
                    </DialogActions>
                </Form>
            </Dialog>
        </div>
        
    )
}