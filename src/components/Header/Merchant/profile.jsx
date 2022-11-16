import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Avatar } from '@material-ui/core'
import Assignment from '@material-ui/icons/Assignment'
import { useState } from 'react'

export const ProfilePage = () => {

    const [open, setOpen] = useState(false)

    return(
        <div>
            <Button onClick={() => setOpen(true)}>Merchant</Button>
             <Dialog 
                open = {open} 
                onClose={() => setOpen(false)} 
                aria-labelledby='dialog-title' 
                ariadescribedby='dialog-description'
            >
                    <DialogActions>
                            <Button onClick={() => setOpen(false)} autoFocus>X</Button>
                    </DialogActions>
                    <DialogTitle id='dialog-title'>Merchant Details</DialogTitle>
                        <DialogContent>
                            <DialogContentText id='dialog-description'>Bob's Burgers</DialogContentText>
                        </DialogContent>
                    <DialogTitle id='dialog-title'>Active Reservations</DialogTitle>
                        <DialogContent>
                                <DialogContentText id='dialog-description'>Janice at 18:00, party of 4</DialogContentText>
                        </DialogContent>
                </Dialog>
        </div>

    )



}