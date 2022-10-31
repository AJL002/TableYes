import React from 'react';
import GoogleMapReact from 'google-map-react';
import { Paper, Typography, useMediaQuery } from '@material-ui/core';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import Rating from '@material-ui/lab/Rating';
import axios from 'axios';

import useStyles from './styles';
import Marker from './Marker.tsx';


const Map = () => {
    
    // submitHandler = e => {
    //     e.preventDefault()
    //     console.log(this.state) //change state
    //     axios
    //         .post('link', this.state) //change state
    //         .then(response => {
    //             console.log(response)
    //         })
    //         .catch(error => {
    //             console.log(error)
    //         })
    // }

    const classes = useStyles();
    const isMobile = useMediaQuery('(min-width:600px)');

    const coordinates = {lat: 29.03455, lng: -81.30300};


    return(
        <div className={classes.mapContainer}>
            <GoogleMapReact
<<<<<<< HEAD
                bootstrapURLKeys={{ key: 'AIzaSyCtU3aQTO7ODWILPEsbso8SFv0Flzy7ABw' }}
=======
                bootstrapURLKeys={{ key: 'AIzaSyCzoHfjtNVA9-iou0ZZCsUSqkmU_5zLRDE' }}
>>>>>>> parent of aa07b9f (TableYes Map 99% There)
                defaultCenter={coordinates}
                center={coordinates}
                defaultZoom={14}
                margin={[50, 50, 50, 50]}
                options={''}
                onChange={''}
                onChildClick={''}
                
            >
<<<<<<< HEAD
                {places?.map((place, i) => (
                    <div   
                        className={classes.markerContainer}
                        lat={Number(place.latitude)}
                        lng={Number(place.longitude)}
                        key={i}
                    >
                        {
                            !isDesktop ? (
                                <LocationOnOutlinedIcon color ="primary" fontSize="large"/>
                            ) : (
                                <Paper elevation={3} className={classes.paper}>
                                    <Typography className={classes.typography} variant="subtitle2" gutterBottom>
                                        {place.name}
                                        
                                    </Typography>
                                    <img 
                                        className={classes.pointer}
                                        src={place.photo ? place.photo.images.large.url : 'https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg'}
                                        alt={place.name}
                                    />
                                    <Rating size="small" value={Number(place.rating)} readOnly />
                                </Paper>)
                        }
                    </div>
                ))
                }

=======
            <Marker
                lat={29.0392}
                lng={-81.304}
                name="Pointer"
                color="red"
            />
>>>>>>> parent of aa07b9f (TableYes Map 99% There)
            </GoogleMapReact>
        </div>
        
    );
}

export default Map;