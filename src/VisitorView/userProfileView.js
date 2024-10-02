import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Avatar, Box, Divider, Toolbar, Typography, Grid, Button, Stack } from '@mui/material';
import StarsIcon from '@mui/icons-material/Stars';
import LanguageIcon from '@mui/icons-material/Language';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import { useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

const drawerWidth = 240;

const getInitials = (firstName, lastName) => {
  const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
  return `${firstInitial}${lastInitial}`;
};

function UserProfileView() {
  const [isFollowed, setIsFollowed] = useState(false);
  const [businessProfiles, setBusinessProfiles] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState('');
  const location = useLocation();
  const profile = location.state?.profile;

  const handleFollowToggle = () => {
    setIsFollowed(!isFollowed);
  };

  const fetchBusinessProfiles = async () => {
    try {
      const responseInvestors = await axios.get('http://localhost:3000/investors', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const investors = responseInvestors.data.map(profile => ({ ...profile, type: 'Investor' }));
      setBusinessProfiles(investors);
    } catch (error) {
      console.error('Failed to fetch business profiles:', error);
    }
  };

    // Function to fetch the profile picture
    const fetchProfilePicture = async () => {
      if (!profile?.id) return;
    
      try {
        const response = await axios.get(`http://localhost:3000/profile-picture/investor/${profile.id}`, {
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

  useEffect(() => {
    fetchBusinessProfiles();
  }, []);

  useEffect(() => {
    fetchProfilePicture(); // Fetch profile picture on component mount or when profile ID changes
  }, [profile?.id]); 

  if (!profile) {
    return <div>Loading...</div>;
  }

  // Set location parts to empty if "N/A"; otherwise, use the profile value.
  const streetAddress = profile.streetAddress === "N/A" ? "" : profile.streetAddress || "";
  const city = profile.city === "N/A" ? "" : profile.city || "";
  const country = profile.country === "N/A" ? "" : profile.country || "";

  // Construct the location string dynamically
  const locationParts = [streetAddress, city, country].filter(part => part !== "").join(", ");

  // Check if all fields are empty, then show 'Address not available'
  const locationDisplay = locationParts ? locationParts : "Address not available";

  return (
    <>
      <Navbar />
      <Toolbar />

      <Box sx={{ width: '100%', paddingLeft: `${drawerWidth}px`, mt: 5 }}>
        <Box display="flex" alignItems="center">
          <Box mr={4}>
          <Avatar
            variant="rounded"
            src={avatarUrl}
            sx={{ 
              width: 150, 
              height: 150, 
              border: '5px solid rgba(0, 116, 144, 1)', 
              borderRadius: 3, 
              ml: 8,
              fontSize: '3rem',
              bgcolor: 'rgba(0, 116, 144, 1)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {!profile.photo && `${profile.firstName[0]}${profile.lastName[0]}`}
          </Avatar>
          </Box>
          <Typography variant="h4" gutterBottom>{`${profile.firstName} ${profile.lastName}`}</Typography>
          <StarsIcon sx={{ cursor: 'pointer', ml: 1, mt: -1, color: isFollowed ? 'rgba(0, 116, 144, 1)' : 'inherit' }} onClick={handleFollowToggle} />
        </Box>

        <Divider sx={{ mt: 5 }} />

        <Box component="main" sx={{ display: 'flex', flexGrow: 1, p: 4, width: '100%', overflowX: 'hidden' }}>
          <Grid container spacing={2}>
            {/* Left Box: User Information */}
            <Grid item xs={12} md={8}>
              <Box sx={{ background: 'white', display: 'flex', flexDirection: 'column', borderRadius: 2, pl: 5, pr: 5 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'rgba(0, 116, 144, 1)', mb: 2 }}>Overview</Typography>
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
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Right Box with Dynamic Links */}
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ borderRadius: 2, pt: 2, pr: 5, pl: 6.3 }}>
                <Stack spacing={2}>
                    {/* Website Button */}
                    <Button
                      variant="outlined"
                      fullWidth
                      href={profile.website || "#"}
                      target={profile.website ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      startIcon={<LanguageIcon />}
                      sx={{
                        backgroundColor: profile.website ? 'rgba(0, 116, 144, 1)' : 'rgba(211, 211, 211, 1)', // Gray if no link
                        color: 'white',
                        '&:hover': {
                          backgroundColor: profile.website ? '#005f73' : 'rgba(211, 211, 211, 1)', // No change on hover if no link
                        },
                        cursor: profile.website ? 'pointer' : 'not-allowed', // Not-allowed cursor if no link
                      }}
                      disabled={!profile.website} // Disable button if no link
                    >
                      Website
                    </Button>

                    {/* LinkedIn Button */}
                    <Button
                      variant="contained"
                      fullWidth
                      href={profile.linkedIn || "#"}
                      target={profile.linkedIn ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      startIcon={<LinkedInIcon />}
                      sx={{
                        backgroundColor: profile.linkedIn ? '#0A66C2' : 'rgba(211, 211, 211, 1)', // Gray if no link
                        color: 'white',
                        '&:hover': {
                          backgroundColor: profile.linkedIn ? '#004182' : 'rgba(211, 211, 211, 1)',
                        },
                        cursor: profile.linkedIn ? 'pointer' : 'not-allowed',
                      }}
                      disabled={!profile.linkedIn}
                    >
                      LinkedIn
                    </Button>

                    {/* Facebook Button */}
                    <Button
                      variant="contained"
                      fullWidth
                      href={profile.facebook || "#"}
                      target={profile.facebook ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      startIcon={<FacebookIcon />}
                      sx={{
                        backgroundColor: profile.facebook ? '#1877F2' : 'rgba(211, 211, 211, 1)',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: profile.facebook ? '#0a52cc' : 'rgba(211, 211, 211, 1)',
                        },
                        cursor: profile.facebook ? 'pointer' : 'not-allowed',
                      }}
                      disabled={!profile.facebook}
                    >
                      Facebook
                    </Button>

                    {/* Twitter Button */}
                    <Button
                      variant="contained"
                      fullWidth
                      href={profile.twitter || "#"}
                      target={profile.twitter ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      startIcon={<TwitterIcon />}
                      sx={{
                        backgroundColor: profile.twitter ? '#1DA1F2' : 'rgba(211, 211, 211, 1)',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: profile.twitter ? '#0a8ddb' : 'rgba(211, 211, 211, 1)',
                        },
                        cursor: profile.twitter ? 'pointer' : 'not-allowed',
                      }}
                      disabled={!profile.twitter}
                    >
                      Twitter
                    </Button>

                    {/* Instagram Button */}
                    <Button
                      variant="contained"
                      fullWidth
                      href={profile.instagram || "#"}
                      target={profile.instagram ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      startIcon={<InstagramIcon />}
                      sx={{
                        backgroundColor: profile.instagram ? '#E1306C' : 'rgba(211, 211, 211, 1)',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: profile.instagram ? '#b02e5a' : 'rgba(211, 211, 211, 1)',
                        },
                        cursor: profile.instagram ? 'pointer' : 'not-allowed',
                      }}
                      disabled={!profile.instagram}
                    >
                      Instagram
                    </Button>
                  </Stack>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}

export default UserProfileView;
