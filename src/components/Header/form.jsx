import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from '@material-ui/core'
import { useState } from 'react'



export const ReserveForm = () => {

    const [open, setOpen] = useState(false)

    return (
        <>
            <Button onClick={() => setOpen(true)}>Test123</Button>
            <Dialog 
                open = {open} 
                onClose={() => setOpen(false)} 
                aria-labelledby='dialog-title' 
                ariadescribedby='dialog-description'
            >
                    <DialogTitle id='dialog-title'>Reservation Details</DialogTitle>
                        <TextField id="outlined-required" type="required" label="First Name"/> 
                        <TextField id="outlined-required" label="Last Name"/> 
                        <TextField id="outlined-number" type="number" label="Party Size"/> 
                        <TextField id="outlined-required" label="Comment"/> 
                        <DialogContent>
                            <DialogContentText id='dialog-description'>Are you sure you want to submit?</DialogContentText>
                        </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)}>Cancel</Button>
                        <Button onClick={() => setOpen(false)} autoFocus>Submit</Button>
                    </DialogActions>
            </Dialog>
        </>
        
    )
}