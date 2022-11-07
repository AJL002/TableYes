import { Button, Dialog, DialogTitle, DialogContent, 
    DialogContentText, DialogActions, TextField, Radio,
    RadioGroup, FormControlLabel, Select, MenuItem, CardMedia} from '@material-ui/core'
import { useState } from 'react'
import useStyles from './styles-form';



export const ReserveForm = ({place}) => {

    const classes = useStyles();
    const [open, setOpen] = useState(false)
    const [size, setSize] = useState('');

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
                <DialogTitle className={classes.DialogTitle}>{place.name} | {place.address}</DialogTitle>
                <CardMedia
                    style={{ height: 300 }}
                    image={'https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg'}
                    title={place.name}
                />
                <DialogTitle className={classes.DialogTitle}>Reservation Details</DialogTitle>
                    <TextField 
                        className={classes.TextField} 
                        id="outlined-required" 
                        type="required" 
                        label="Full Name"
                    /> 
                <DialogTitle className={classes.DialogTitle}>Party Size</DialogTitle>
                    <Select
                        className = {classes.Select}
                        labelId="party-size-select"
                        id="party-size-select"
                        value={size}
                        label="Size"
                        onChange={handleChange}
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
                            id="time"
                            type="time"
                            defaultValue="19:30"
                            InputLabelProps={{
                            shrink: true,
                            }}
                            inputProps={{
                            step: 300, // 5 min
                            }}
                            autoWidth
                        />
                    <DialogTitle className={classes.DialogTitle}>Comments</DialogTitle>
                    <TextField className={classes.TextField} // Comment field
                        autoFocus
                        margin="dense"
                        id='dialog-title'
                        label="Write a note here..."
                        type="text"
                        variant="standard"
                    />  
                    <DialogContent>
                        <DialogContentText id='dialog-description'>Please arrive at least 10 minutes before your reserved time.</DialogContentText>
                    </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={() => setOpen(false)} autoFocus>Submit</Button>
                </DialogActions>
            </Dialog>
        </div>
        
    )
}