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
                        <TextField id="outlined-required" type="required" label="Full Name"/> 
                        <TextField id="outlined-number" type="number" label="Party Size"/> 
                        <h1>Comments: </h1>
                        <TextField id="outlined-required" label="Comment"/> 
                        <DialogContent>
                            <DialogContentText id='dialog-description'>Please arrive at least 10 minutes before your set reservation time.</DialogContentText>
                        </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)}>Cancel</Button>
                        <Button onClick={() => setOpen(false)} autoFocus>Submit</Button>
                    </DialogActions>
            </Dialog>
        </>
        
    )
}