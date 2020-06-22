import React from 'react';
import RegisterForm from '../auth/RegisterForm';
import {useStylesLanding} from '../../Styles';

import {Grid} from '@material-ui/core';

function Landing(props) {
  const classes = useStylesLanding();

  return (
    <div className='landing-background background-image-full'>
      <div>
        <Grid className={classes.position} item xs={4}>
          <RegisterForm
            handleLoggedIn={props.handleLoggedIn}
            isLoggedIn={props.isLoggedIn}
          />
        </Grid>
      </div>
    </div>
  );
}

export default Landing;
