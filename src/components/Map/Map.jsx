import React from 'react';
import GoogleMapReact from 'google-map-react';
import { Paper, Typography, useMediaQuery } from '@material-ui/core';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import Rating from '@material-ui/lab/Rating';

import useStyles from './styles';
import mapStyles from './mapStyles';
import Marker from './Marker.tsx';
import { useState } from 'react';


const Map = ({setCoordinates, setBounds, coordinates, places, setChildClicked}) => {
    
    const classes = useStyles();
    const isDesktop = useMediaQuery('(min-width:600px)');

    return(
        <div className={classes.mapContainer}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: 'KEY' }}
                defaultCenter={coordinates}
                center={coordinates}
                defaultZoom={14}
                margin={[50, 50, 50, 50]}
                options={{ disableDefaultUI: true, zoomControl: true, styles: mapStyles }}
                onChange={(e) =>{
                    setCoordinates({lat: e.center.lat, lng: e.center.lng});
                    setBounds({ne: e.marginBounds.ne, sw: e.marginBounds.sw})
                }}
                onChildClick={(child) => setChildClicked(child)}
            >
                <Marker
                    id = {0}
                    lat={29.035623638879386}
                    lng={-81.30318668706671}
                    name="Test Restaurant"
                    color="blue"
                />
                <Marker
                    id = {1}
                    lat={29.03545781486162}
                    lng={-81.30221183048803}
                    name="Test Restaurant 2"
                    color="blue"
                />
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
                ))}

                    <div   
                        className={classes.markerContainer}
                        lat={29.03545781486162}
                        lng={-81.30221183048803}
                        key={0}
                    >
                        {
                            !isDesktop ? (
                                <LocationOnOutlinedIcon color ="primary" fontSize="large"/>
                            ) : (
                                <Paper elevation={3} className={classes.paper}>
                                    <Typography className={classes.typography} variant="subtitle2" gutterBottom>
                                        Test Restaurant
                                    </Typography>
                                    <img 
                                        className={classes.pointer}
                                        src={'https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg'}
                                        alt='Test Restaurant'
                                    />
                                </Paper>)
                        }
                    </div>

            </GoogleMapReact>
        </div>
    );
}

export default Map;