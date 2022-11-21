import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Avatar } from '@material-ui/core'
import Assignment from '@material-ui/icons/Assignment'
import { useState } from 'react'
import useStyles from '././styles-form.js';

export const ProfilePage = () => {

    const [open, setOpen] = useState(false)
    const classes = useStyles();

    return(
        <div>
            <Button onClick={() => setOpen(true)}>Merchant</Button>
             <Dialog 
                open = {open} 
                onClose={() => setOpen(false)} 
                aria-labelledby='dialog-title' 
                ariadescribedby='dialog-description'
                autoWidth
            >
                    {/* <DialogActions>
                            <Button className = {classes.button} onClick={() => setOpen(false)} autoFocus>X</Button>
                    </DialogActions> */}
                    <DialogTitle className = {classes.DialogTitle} id='dialog-title'>Your Restaurants</DialogTitle>
                        <DialogContent>
                            <Button>Bob's Burgers - Daytona Beach</Button>
                            <Button>Bob's Burgers - DeLand</Button>
                        </DialogContent>
                        
                    <DialogActions>
                        <TextField className = {classes.TextField}/>
                        <Button>Enter</Button>
                    </DialogActions>
                        
                </Dialog>
        </div>

    )



}