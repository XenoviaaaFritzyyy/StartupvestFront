import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Divider, Toolbar, Typography, Grid, IconButton,} from '@mui/material';
import StarsIcon from '@mui/icons-material/Stars';
import LanguageIcon from '@mui/icons-material/Language';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import { useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { StyledAvatar, UserInfoBox, OverviewTitle, IconsContainer,} from '../styles/VisitorView';

const drawerWidth = 240;

const getInitials = (firstName, lastName) => {
  const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
  return `${firstInitial}${lastInitial}`;
};

function UserProfileView() {
  const [avatarUrl, setAvatarUrl] = useState('');
  const location = useLocation();
  const profile = location.state?.profile;

  // Function to fetch the profile picture
  const fetchProfilePicture = async () => {
     if (!profile?.id) return;
    
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/profile-picture/investor/${profile.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        responseType: 'blob',
      });
  
      const imageUrl = URL.createObjectURL(response.data);
      setAvatarUrl(imageUrl);
    } catch (error) {
      console.error('Failed to fetch profile picture:', error);
      setAvatarUrl('');
    }
  };

  useEffect(() => {
    fetchProfilePicture();
  }, [profile?.id]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  const streetAddress = profile.streetAddress === "N/A" ? "" : profile.streetAddress || "";
  const city = profile.city === "N/A" ? "" : profile.city || "";
  const country = profile.country === "N/A" ? "" : profile.country || "";
  const locationParts = [streetAddress, city, country].filter(part => part !== "").join(", ");
  const locationDisplay = locationParts ? locationParts : "Address not available";

  return (
    <>
      <Navbar />
      <Toolbar />

      <Box sx={{ width: '100%', paddingLeft: `${drawerWidth}px`, mt: 5 }}>
        <Box display="flex" alignItems="center">
          <Box mr={4}>
            <StyledAvatar
              variant="rounded"
              src={avatarUrl}>
              {!profile.photo && `${profile.firstName[0]}${profile.lastName[0]}`}
            </StyledAvatar>
          </Box>
          <Typography variant="h4" gutterBottom>{`${profile.firstName} ${profile.lastName}`}</Typography>
        </Box>

        <Divider sx={{ mt: 5 }} />

        <Box component="main" sx={{ display: 'flex', flexGrow: 1, p: 4, width: '100%', overflowX: 'hidden' }}>
          <Grid container spacing={2}>
            <Grid item xs={10} md={8}>
              <UserInfoBox>
                <OverviewTitle variant="h5">Overview</OverviewTitle>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Typography><strong>Biography</strong></Typography>
                        <Typography variant="body1" textAlign="justify">{profile.biography}</Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography><strong>Email Address</strong></Typography>
                        <Typography variant="body1">{profile.emailAddress}</Typography>
                      </Grid>

                      <Grid item xs={4}>
                        <Typography><strong>Contact Number</strong></Typography>
                        <Typography variant="body1">{profile.contactInformation}</Typography>
                      </Grid>

                      <Grid item xs={2}>
                        <Typography><strong>Gender</strong></Typography>
                        <Typography variant="body1">{profile.gender}</Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography><strong>Location</strong></Typography>
                        <Typography variant="body1">{locationDisplay}</Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <IconsContainer>
                          <IconButton
                            href={profile.website || "#"}
                            target="_blank"
                            disabled={!profile.website}
                            sx={{
                              backgroundColor: profile.website ? '#007bff' : '#e0e0e0',
                              color: 'white',
                              '&:hover': { backgroundColor: profile.website ? '#0069d9' : '#e0e0e0' },
                              borderRadius: '50%',
                            }}>
                            <LanguageIcon />
                          </IconButton>

                          <IconButton
                            href={profile.linkedIn || "#"}
                            target="_blank"
                            disabled={!profile.linkedIn}
                            sx={{
                              backgroundColor: profile.linkedIn ? '#0A66C2' : '#e0e0e0',
                              color: 'white',
                              '&:hover': { backgroundColor: profile.linkedIn ? '#004182' : '#e0e0e0' },
                              borderRadius: '50%',
                            }}>
                            <LinkedInIcon />
                          </IconButton>

                          <IconButton
                            href={profile.facebook || "#"}
                            target="_blank"
                            disabled={!profile.facebook}
                            sx={{
                              backgroundColor: profile.facebook ? '#1877F2' : '#e0e0e0',
                              color: 'white',
                              '&:hover': { backgroundColor: profile.facebook ? '#0a52cc' : '#e0e0e0' },
                              borderRadius: '50%',
                            }}>
                            <FacebookIcon />
                          </IconButton>

                          <IconButton
                            href={profile.twitter || "#"}
                            target="_blank"
                            disabled={!profile.twitter}
                            sx={{
                              backgroundColor: profile.twitter ? '#1DA1F2' : '#e0e0e0',
                              color: 'white',
                              '&:hover': { backgroundColor: profile.twitter ? '#0a8ddb' : '#e0e0e0' },
                              borderRadius: '50%',
                            }}>
                            <TwitterIcon />
                          </IconButton>

                          <IconButton
                            href={profile.instagram || "#"}
                            target="_blank"
                            disabled={!profile.instagram}
                            sx={{
                              backgroundColor: profile.instagram ? '#E1306C' : '#e0e0e0',
                              color: 'white',
                              '&:hover': { backgroundColor: profile.instagram ? '#b02e5a' : '#e0e0e0' },
                              borderRadius: '50%',
                            }}>
                            <InstagramIcon />
                          </IconButton>
                        </IconsContainer>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </UserInfoBox>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}

export default UserProfileView;
