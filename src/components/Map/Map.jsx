import React from 'react';
import GoogleMapReact from 'google-map-react';
import { Paper, Typography, useMediaQuery } from '@material-ui/core';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import Rating from '@material-ui/lab/Rating';

import useStyles from './styles';
import Marker from './Marker.tsx';


const Map = () => {
    
    const classes = useStyles();
    const isMobile = useMediaQuery('(min-width:600px)');

    const coordinates = {lat: 29.03455, lng: -81.30300};


    return(
        <div className={classes.mapContainer}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: 'AIzaSyCzoHfjtNVA9-iou0ZZCsUSqkmU_5zLRDE' }}
                defaultCenter={coordinates}
                center={coordinates}
                defaultZoom={14}
                margin={[50, 50, 50, 50]}
                options={''}
                onChange={''}
                onChildClick={''}
                
            >
            <Marker
                lat={29.0392}
                lng={-81.304}
                name="Pointer"
                color="red"
            />
            </GoogleMapReact>
        </div>
    );
}

export default Map;