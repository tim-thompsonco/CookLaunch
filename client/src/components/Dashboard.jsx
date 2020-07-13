import React from 'react';
import {Redirect} from 'react-router-dom';
import Ingredients from './Ingredients/Ingredients';
import {Grid} from '@material-ui/core';

function Dashboard(props) {
  return !props.isLoggedIn ? (
    <Redirect to='/login' />
  ) : (
    <Grid container>
      <Grid item xs={12} sm={4}>
        <Ingredients
          key={props.ingredients}
          getIngredientData={props.getIngredientData}
          ingredients={props.ingredients}
          id={props.id}
          email={props.email}
          firstName={props.firstName}
          lastName={props.lastName}
          handleLoggedIn={props.handleLoggedIn}
          isLoggedIn={props.isLoggedIn}
        />
      </Grid>
    </Grid>
  );
}

export default Dashboard;
