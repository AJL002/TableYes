import React, { useState, useEffect, createRef } from 'react';
import { CircularProgress, Grid, Typography, InputLabel, MenuItem, FormControl, Select, Menu } from '@material-ui/core';
import PlaceDetails from '../PlaceDetails/PlaceDetails'

import useStyles from './styles';
const List = ({ places, childClicked, isLoading }) => {
    const classes = useStyles();
    const [type, setType] = useState('restaurants');
    const [rating, setRating] = useState('');
    const [elRefs, setElRefs] = useState([]);

    console.log(childClicked);
    useEffect(() => {
        const refs = Array(places?.length).fill().map((_, i) => elRefs[i] || createRef());

        setElRefs(refs);
    }, [places])

    return(
        <div className={classes.container}>
            <Typography variant="h4">Restaurants Near You</Typography>
            {isLoading ? (
                <div className={classes.loading}>
                    <CircularProgress size="5rem" />
                </div>
            ) : (
                <>
            <FormControl className={classes.formControl}>
                <InputLabel>Type</InputLabel>
                <Select value={type} onChange={(e) => setType(e.target.value)}>
                    <MenuItem value="restaurants">Restaurants</MenuItem> {/* When selected, it populates with restaurants */}
                </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
                <InputLabel>Rating</InputLabel>
                <Select value={rating} onChange={(e) => setRating(e.target.value)}>
                    <MenuItem value={0}>All</MenuItem> {/* When selected, it populates with restaurants */}
                    <MenuItem value={3}>Above 3</MenuItem>
                    <MenuItem value={4}>Above 4</MenuItem>
                    <MenuItem value={5}>Above 5</MenuItem>
                </Select>
            </FormControl>
            <Grid container spacing = {3} className={classes.list}>
                {places?.map((place, i) => (
                    <Grid ref={elRefs[i]} item key = {i} xs={12}>
                        <PlaceDetails 
                            place={place}
                            selected={Number(childClicked) === i}
                            refProp={elRefs[i]}
                        />
                    </Grid>
                ))}
            </Grid>
            </>
            )}
        </div>
    );
}

export default List;