import React, {useEffect, useState} from 'react';
import {Redirect} from 'react-router-dom';
import _ from 'lodash';
import {
  addIngredientToPantry,
  deleteIngredientFromPantry,
  updateIngredientInPantry,
} from '../actions/pantryActions';
import IngredientAdd from './Ingredients/IngredientAdd';
import IngredientItem from './Ingredients/IngredientItem';
import {useStylesMain} from '../Styles';
import {themeMain} from '../Theme';
import {Card, Container, Grid, List} from '@material-ui/core';
import CardTitle from './CardTitle';

function Pantry(props) {
  const classes = useStylesMain(themeMain);

  const [pantry, setPantry] = useState({data: []});

  useEffect(() => {
    if (props.pantry && props.pantry.length > 0) {
      let rawPantryList = props.pantry;
      let sortedPantry = rawPantryList.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });

      setPantry({data: sortedPantry});
    }
  }, [props.pantry]);

  const handleDelete = async (ingredientId) => {
    const requestResponse = await deleteIngredientFromPantry(ingredientId);

    if (requestResponse.status === 204) {
      // Update user payload to re-render pantry
      await props.getUserPayload();
    } else {
      // If request failed, return error message to child component
      return requestResponse.data;
    }
  };

  const handleUpdateIngredient = async (updateIngredient) => {
    const requestResponse = await updateIngredientInPantry(updateIngredient);

    if (requestResponse.status === 204) {
      // Update user payload to re-render pantry
      await props.getUserPayload();
    } else {
      // If request failed, return error message to child component
      return requestResponse.data;
    }
  };

  const handleAddIngredient = async (addIngredient) => {
    const requestResponse = await addIngredientToPantry(addIngredient);

    if (requestResponse.status === 201) {
      // Update user payload to re-render pantry
      await props.getUserPayload();
    } else {
      // If request failed, return error message to child component
      return requestResponse.data;
    }
  };

  if (!props.isLoggedIn) {
    return <Redirect to='/login' />;
  } else {
    return (
      <Container component='main' maxWidth='md'>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Card>
              <Grid className={classes.paper}>
                <Grid container>
                  <Grid item xs={12} align='center'>
                    <CardTitle title={`${props.firstName}'s Pantry`} />
                  </Grid>
                  <List className={classes.list}>
                    {pantry.data.map((ingredient) => {
                      const formatName = _.startCase(
                        _.toLower(ingredient.name)
                      );
                      const formatQuantityType = _.startCase(
                        _.toLower(ingredient.quantityType)
                      );

                      return (
                        <Grid item xs={12}>
                          <IngredientItem
                            key={ingredient.name + ingredient.dateLastChanged}
                            id={ingredient._id}
                            name={formatName}
                            quantity={ingredient.quantity}
                            quantityType={formatQuantityType}
                            handleDelete={handleDelete}
                            handleUpdateIngredient={handleUpdateIngredient}
                          />
                        </Grid>
                      );
                    })}
                  </List>
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <IngredientAdd
              key={props.pantry}
              name='Pantry'
              pantry={props.pantry}
              ingredients={props.ingredients}
              handleAddIngredient={handleAddIngredient}
              handleUpdateIngredient={handleUpdateIngredient}
            />
          </Grid>
        </Grid>
      </Container>
    );
  }
}

export default Pantry;
