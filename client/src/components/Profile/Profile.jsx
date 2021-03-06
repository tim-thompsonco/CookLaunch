import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Card, Grid } from '@material-ui/core';
import isEmpty from 'is-empty';

import { useStylesMain } from '../../Styles';
import { themeMain } from '../../Theme';
import { updateUserProfile } from '../../actions/userActions';
import ProfileField from './ProfileField';
import ProfileButtons from './ProfileButtons';
import FormSubmitMessage from '../FormSubmitMessage';
import CardTitle from '../CardTitle';
import Loader from '../Loader';

const Profile = (props) => {
  const { email, firstName, lastName } = props;

  const classes = useStylesMain(themeMain);

  const [profileData, setProfileData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState({
    message: '',
  });

  useEffect(() => {
    setProfileData({
      email: email,
      firstName: firstName,
      lastName: lastName,
    });

    setEditMode(false);

    setError({
      message: '',
    });
  }, [email, firstName, lastName]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfileData((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    const response = await updateUserProfile(profileData);

    if (response.status === 200) {
      props.getUserPayload();
    } else {
      setError({
        message: response.data,
      });
    }
  };

  const handleCancel = () => {
    setProfileData({
      email: email,
      firstName: firstName,
      lastName: lastName,
    });

    setEditMode(false);
  };

  if (!props.isLoggedIn) {
    return <Redirect to='/login' />;
  }

  if (!profileData?.email) {
    return <Loader data-testid='loader' />;
  }

  return (
    <div className={classes.minHeight} data-testid='top-profile-div'>
      <div className={classes.pageMargin}>
        <Grid container>
          <Grid item xs={12} className={classes.buttonMargin}>
            <ProfileButtons
              editMode={editMode}
              handleEdit={handleEdit}
              handleSave={handleSave}
              handleCancel={handleCancel}
            />
          </Grid>
          <Card className={classes.pageCard}>
            <div className={classes.paper}>
              <Grid container spacing={1}>
                <Grid item xs={12} className={classes.title}>
                  <CardTitle title='My Profile' />
                </Grid>
                <Grid item xs={12}>
                  <ProfileField
                    editMode={editMode}
                    label='Email'
                    name='email'
                    handleChange={handleChange}
                    content={profileData.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <ProfileField
                    editMode={editMode}
                    label='First Name'
                    name='firstName'
                    handleChange={handleChange}
                    content={profileData.firstName}
                  />
                </Grid>
                <Grid item xs={12}>
                  <ProfileField
                    editMode={editMode}
                    label='Last Name'
                    name='lastName'
                    handleChange={handleChange}
                    content={profileData.lastName}
                  />
                </Grid>
                <Grid item xs={12}>
                  {!isEmpty(error.message) && (
                    <FormSubmitMessage submitMessage={error.message} />
                  )}
                </Grid>
              </Grid>
            </div>
          </Card>
        </Grid>
      </div>
    </div>
  );
};

export default Profile;
