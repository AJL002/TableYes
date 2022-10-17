import React from 'react';
import { Grid } from '@material-ui/core';
import CssBaseLine from '@material-ui/core/CssBaseLine';
import Header from './components/Header/Header';
import List from './components/List/List';
import Map from './components/Map/Map';
import { CropFree } from '@material-ui/icons';

const App = () => {
    return (
        <>
            <CssBaseLine/>
            <Header />
            <Grid container spacing={3} style={{width: '100%'}}>
                <Grid item xs = {12} md={4}>
                    <List />
                </Grid>
                <Grid item xs = {12} md={8}>
                    <Map />
                </Grid>
            </Grid>
        </>
    )
}

export default App;