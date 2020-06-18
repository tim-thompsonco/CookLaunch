import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { loginUser } from "../../actions/authActions";
import isEmpty from "is-empty";
import { REQUEST_SUCCESS } from "../../actions/types";
import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: theme.spacing(2, 2, 2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(2),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
	},
}));

function Login() {
  const classes = useStyles();

  const [isLoggedin, setLoggedIn] = useState(false);
	const [user, setUser] = useState({
		email: "",
		password: "",
	});
	const [error, setError] = useState({
    errorMessage: ""
  });

	const handleChange = async e => {
		const { name, value } = e.target;

    setUser(prevValue => {
			return {
				...prevValue,
				[name]: value
			}
		});
  };

  const handleLoginClick = async e => {
    e.preventDefault();
    
		const requestResponse = await loginUser(user);

		if (requestResponse.authResponseType === REQUEST_SUCCESS) {

      // If login request is successful, clear login form
      setUser({
        email: "",
        password: "",
      });

      // If login request is successful, clear old errors from state
      setError({
        errorMessage: ""
      });

      // Set user as logged in
      setLoggedIn(true);

		} else {
			setError({
				errorMessage: requestResponse.authResponsePayload
			});
		}
	};

	return (
    isLoggedin ? <Redirect to="/dashboard" /> :

    <Container component="main" maxWidth="xs">
			<Card>
				<CssBaseline />
				<div className={classes.paper}>
          <Typography component="h1" variant="h5">
						Sign In Here
					</Typography>
					<form className={classes.form} noValidate>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<TextField
									onChange={handleChange}
									value={user.email}
									variant="outlined"
									required
									fullWidth
									id="email"
									label="Email Address"
									name="email"
									autoComplete="email"
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									onChange={handleChange}
									value={user.password}
									variant="outlined"
									required
									fullWidth
									name="password"
									label="Password"
									type="password"
									id="password"
									autoComplete="password"
								/>
							</Grid>
						</Grid>
						<Button
							onClick={handleLoginClick}
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
						>
							Login
						</Button>
						<Grid container justify="flex-end">
							<Grid item>
								<Link href="/" variant="body2">
								  Don't have an account? Register
								</Link>
							</Grid>
						</Grid>
						<div>
							{(!isEmpty(error.errorMessage) && <strong class="error-text">{error.errorMessage}</strong>)}
						</div>
					</form>
				</div>
   		</Card>
		</Container>
	);
}

export default Login;