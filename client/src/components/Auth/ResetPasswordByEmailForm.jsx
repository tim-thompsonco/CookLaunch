import React, {useState} from 'react';
import {Redirect, useParams} from 'react-router-dom';
import isEmpty from 'is-empty';
import FormSubmitMessage from '../FormSubmitMessage';
import {
  checkResetPasswordToken,
  loginUser,
  validatePassword,
  resetPassword,
} from '../../actions/authActions';
import {REQUEST_SUCCESS} from '../../actions/types';
import {useStylesForm} from '../../Styles';
import {themeMain} from '../../Theme';
import {
  Button,
  Card,
  Container,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';

function ResetPasswordByEmailForm(props) {
  const classes = useStylesForm(themeMain);

  const token = useParams().token;

  const [password, setPassword] = useState({
    password: '',
    password2: '',
  });
  const [error, setError] = useState({
    errorMessage: '',
  });

  const handleChange = async (e) => {
    const {name, value} = e.target;

    setPassword((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordCheck = await validatePassword(
      password.password,
      password.password2
    );

    if (passwordCheck.isValid) {
      const tokenResponse = await checkResetPasswordToken(token);

      if (tokenResponse.authResponseType === REQUEST_SUCCESS) {
        const userData = {
          email: tokenResponse.authResponsePayload.email,
          password: password.password,
        };

        const changeResponse = await resetPassword(userData);

        if (changeResponse.authResponseType === REQUEST_SUCCESS) {
          const loginResponse = await loginUser(userData);

          if (loginResponse.authResponseType === REQUEST_SUCCESS) {
            // If password reset and login are successful, set user as logged in
            props.handleLoggedIn(true);
          } else {
            setError({
              errorMessage: changeResponse.authResponsePayload,
            });
          }
        } else {
          setError({
            errorMessage: changeResponse.authResponsePayload,
          });
        }
      } else {
        setError({
          errorMessage: tokenResponse.authResponsePayload,
        });
      }
    } else {
      setError({
        errorMessage: passwordCheck.error,
      });
    }
  };

  return props.isLoggedIn ? (
    <Redirect to='/dashboard' />
  ) : (
    <Container component='main' maxWidth='xs'>
      <Card>
        <Grid className={classes.paper}>
          <Typography component='h1' variant='h5'>
            Reset Your Password
          </Typography>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  onChange={handleChange}
                  value={password.password}
                  variant='outlined'
                  required
                  fullWidth
                  label='Password'
                  type='password'
                  name='password'
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  onChange={handleChange}
                  value={password.password2}
                  variant='outlined'
                  required
                  fullWidth
                  label='Confirm password'
                  type='password'
                  name='password2'
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  onClick={handleSubmit}
                  fullWidth
                  type='submit'
                  variant='contained'
                  color='primary'
                  className={classes.submit}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              {!isEmpty(error.errorMessage) && (
                <FormSubmitMessage submitMessage={error.errorMessage} />
              )}
            </Grid>
          </form>
        </Grid>
      </Card>
    </Container>
  );
}

export default ResetPasswordByEmailForm;