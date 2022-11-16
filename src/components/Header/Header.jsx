import React, {useState} from 'react';
import { Autocomplete } from '@react-google-maps/api';
import { AppBar, Toolbar, Typography, InputBase, Box, Button } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import useStyles from './styles';
import { ReserveForm } from '././form.jsx'
import axios from 'axios'

// Restaurant Submit
const handleSubmit = (e) => {
    axios.post("https://rrz0qonpwi.execute-api.us-east-1.amazonaws.com/dev/restaurants", 
    {
        fullname: "Alex's Steakhouse", // string
        email: "email@email.com", // string
        lat: 48.300, // float
        long: 50.000, // float
    })
    .then((response) => console.log(response))
    .catch((err) => console.log(err));
}

const Header = ({ setCoordinates }) => {
    const classes = useStyles();
    const [autocomplete, setAutocomplete] = useState(null);
    
    const onLoad = (autoC) => setAutocomplete(autoC);

    const onPlaceChanged = () => {
        const lat = autocomplete.getPlace().geometry.location.lat();
        const lng = autocomplete.getPlace().geometry.location.lng();

        setCoordinates({ lat, lng });
    }
    
    return (
        <AppBar position="static">
            <Toolbar className={classes.toolbar}>
                <Typography variant ="h5" className={classes.title}>
                    TableYes
                </Typography>
                <Box display="flex">
                    <Typography variant ="h6" className={classes.title}>
                        Find restaurants
                    </Typography>
                    <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                        <div className={classes.search}>
                            <div className={classes.searchIcon}>
                                <SearchIcon />
                            </div>
                            <InputBase placeholder="Search... " classes={{ root: classes.inputRoot, input: classes.inputInput}}/>
                        </div>
                    </Autocomplete>
                </Box>
                <Button onClick={handleSubmit}>R-Submit</Button>
                <ReserveForm/>
            </Toolbar>
        </AppBar>
    );
}

export default Header;