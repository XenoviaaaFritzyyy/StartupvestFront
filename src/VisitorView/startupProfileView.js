import React, { useState, useEffect } from 'react';
import { Avatar, Box, Divider, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, Grid, Button, Stack, Card} from '@mui/material';
import axios from 'axios';
import PaidIcon from '@mui/icons-material/Paid';
import StoreIcon from '@mui/icons-material/Store';
import StarsIcon from '@mui/icons-material/Stars';
import LanguageIcon from '@mui/icons-material/Language';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import { useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import MonthlyFundingChart from "../Components/Chart";

const drawerWidth = 240;

function StartUpView() {
  const [selectedPage, setSelectedPage] = useState('summary');
  const [isFollowed, setIsFollowed] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const location = useLocation();
  const [companyId, setCompanyId] = useState(null);
  const { startup } = location.state || {};


  console.log('Company ID:', companyId);

  // Fetch the profile picture
  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (!startup?.id) return; // Ensure startup exists
      setCompanyId(startup.id);
      try {
        const response = await axios.get(`http://localhost:3000/profile-picture/startup/${startup.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          responseType: 'blob', // Important for getting the image as a blob
        });

        // Create a URL for the blob
        const imageUrl = URL.createObjectURL(response.data);
        setAvatarUrl(imageUrl);
      } catch (error) {
        console.error('Failed to fetch profile picture:', error);
      }
    };

    fetchProfilePicture(); // Always call the fetch function
  }, [startup]); // Re-run the effect if the startup data changes

  const handlePageChange = (page) => {
    setSelectedPage(page);
  };

  const handleFollowToggle = () => {
    setIsFollowed(!isFollowed);
  };

  if (!startup) {
    return <div>No startup data available</div>;
  }

  // Handle 'N/A' values for display
  const streetAddress = startup.streetAddress === "N/A" ? "" : startup.streetAddress || "";
  const city = startup.city === "N/A" ? "" : startup.city || "";
  const state = startup.state === "N/A" ? "" : startup.state || "";

  return (
    <Box sx={{ width: '100%', paddingLeft: `${drawerWidth}px`, mt: 5 }}>
      <Navbar />
      <Toolbar />

      <Box display="flex" alignItems="center">
        <Box mr={4}>
          <Avatar variant="rounded" src={avatarUrl} 
            sx={{ width: 150, height: 150, border: '5px solid rgba(0, 116, 144, 1)', borderRadius: 3, ml: 8 }} />
        </Box>

        <Typography variant="h4" gutterBottom>{startup.companyName}</Typography>
        <StarsIcon sx={{ cursor: 'pointer', ml: 1, mt: -1, color: isFollowed ? 'rgba(0, 116, 144, 1)' : 'inherit'}}
          onClick={handleFollowToggle}/>
      </Box>

      <Box display="flex" alignItems="center" justifyContent="flex-end" sx={{ mt: -3.5 }}>
        <List sx={{ display: 'flex', flexDirection: 'row', mr: 5 }}>
          <ListItem button selected={selectedPage === 'summary'}
            onClick={() => handlePageChange('summary')}
            sx={{ '&.Mui-selected': { backgroundColor: '#C3DDD6' }, '&:hover': { backgroundColor: '#C3DDD6 !important' },
              mr: 1, borderRadius: 1, cursor: 'pointer'}}>
            <ListItemIcon>
              <StoreIcon />
            </ListItemIcon>
            <ListItemText primary="Summary" />
          </ListItem>

          <ListItem button selected={selectedPage === 'financial'}
            onClick={() => handlePageChange('financial')}
            sx={{ '&.Mui-selected': { backgroundColor: '#C3DDD6' },'&:hover': { backgroundColor: '#C3DDD6 !important' },
              borderRadius: 1, cursor: 'pointer'}}>
            <ListItemIcon>
              <PaidIcon />
            </ListItemIcon>
            <ListItemText primary="Financial" />
          </ListItem>
        </List>
      </Box>

      <Divider />

      <Box ml={4} flexGrow={1}>
        {selectedPage === 'summary' && (
          <Box component="main" sx={{ display: 'flex', flexGrow: 1, width: '100%', overflowX: 'hidden' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', flexDirection: 'column', borderRadius: 2, pl: 5, mt: 5}}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'rgba(0, 116, 144, 1)', mb: 1 }}>
                    Overview
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sx={{ textAlign: 'justify' }}>
                          <Typography>
                            <strong>Description</strong>
                          </Typography>
                          <Typography variant="body1">{startup.companyDescription}</Typography>
                        </Grid>

                        <Grid item xs={4}>
                          <Typography>
                            <strong>Founded Date</strong>
                          </Typography>
                          <Typography variant="body1">{startup.foundedDate}</Typography>
                        </Grid>

                        <Grid item xs={4}>
                          <Typography>
                            <strong>Company Type</strong>
                          </Typography>
                          <Typography variant="body1">{startup.typeOfCompany}</Typography>
                        </Grid>

                        <Grid item xs={4}>
                          <Typography>
                            <strong>No. of Employees</strong>
                          </Typography>
                          <Typography variant="body1">{startup.numberOfEmployees}</Typography>
                        </Grid>

                        <Grid item xs={6}>
                        <Typography>
                            <strong>Location</strong>
                          </Typography>
                          <Typography variant="body1">
                            {streetAddress && <>{streetAddress}{(city || state) ? ", " : ""}</>}
                            {city && <>{city}{state ? ", " : ""}</>}
                            {state}
                            {!streetAddress && !city && !state && <span>No address available</span>}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              {/* Right Box with Dynamic Links */}
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 5 }}>
                  <Box sx={{ borderRadius: 2, pt: 2, pr: 5, pl: 6.3 }}>
                    <Stack spacing={2}>
                      <Button
                        variant="outlined"
                        fullWidth
                        href={startup.website ? startup.website : null}
                        target="_blank"
                        rel="noopener noreferrer"
                        startIcon={<LanguageIcon />}
                        disabled={!startup.website} // Disable button if no website
                        sx={{
                          backgroundColor: startup.website ? 'rgba(0, 116, 144, 1)' : '#e0e0e0', 
                          color: startup.website ? 'white' : '#9e9e9e',
                          '&:hover': { backgroundColor: startup.website ? '#005f73' : '#e0e0e0' }
                        }}>
                        Website
                      </Button>

                      <Button
                        variant="contained"
                        fullWidth
                        href={startup.linkedIn ? startup.linkedIn : null}
                        target="_blank"
                        rel="noopener noreferrer"
                        startIcon={<LinkedInIcon />}
                        disabled={!startup.linkedIn}
                        sx={{
                          backgroundColor: startup.linkedIn ? '#0A66C2' : '#e0e0e0',
                          color: startup.linkedIn ? 'white' : '#9e9e9e',
                          '&:hover': { backgroundColor: startup.linkedIn ? '#004182' : '#e0e0e0' }
                        }}>
                        LinkedIn
                      </Button>

                      <Button
                        variant="contained"
                        fullWidth
                        href={startup.facebook ? startup.facebook : null}
                        target="_blank"
                        rel="noopener noreferrer"
                        startIcon={<FacebookIcon />}
                        disabled={!startup.facebook} 
                        sx={{
                          backgroundColor: startup.facebook ? '#1877F2' : '#e0e0e0',
                          color: startup.facebook ? 'white' : '#9e9e9e',
                          '&:hover': { backgroundColor: startup.facebook ? '#0a52cc' : '#e0e0e0' }
                        }}>
                        Facebook
                      </Button>

                      <Button
                        variant="contained"
                        fullWidth
                        href={startup.twitter ? startup.twitter : null}
                        target="_blank"
                        rel="noopener noreferrer"
                        startIcon={<TwitterIcon />}
                        disabled={!startup.twitter} 
                        sx={{
                          backgroundColor: startup.twitter ? '#1DA1F2' : '#e0e0e0',
                          color: startup.twitter ? 'white' : '#9e9e9e',
                          '&:hover': { backgroundColor: startup.twitter ? '#0a8ddb' : '#e0e0e0' }
                        }}>
                        Twitter
                      </Button>

                      <Button
                        variant="contained"
                        fullWidth
                        href={startup.instagram ? startup.instagram : null}
                        target="_blank"
                        rel="noopener noreferrer"
                        startIcon={<InstagramIcon />}
                        disabled={!startup.instagram} 
                        sx={{
                          backgroundColor: startup.instagram ? '#E1306C' : '#e0e0e0',
                          color: startup.instagram ? 'white' : '#9e9e9e',
                          '&:hover': { backgroundColor: startup.instagram ? '#b02e5a' : '#e0e0e0' }
                        }}>
                        Instagram
                      </Button>
                    </Stack>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        {selectedPage === 'financial' && (
          <Box  component="main" 
            sx={{  display: 'flex',  flexGrow: 1,  width: '100%',  overflowX: 'hidden',  pl: 3,  pr: 5, pb: 4, pt: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Total Investment Card */}
                  <Card  sx={{  p: 3,  boxShadow: 3,  borderRadius: 2,  transition: '0.3s', border: '1px solid #007490',
                      '&:hover': { 
                        boxShadow: 6, 
                        transform: 'translateY(-5px)',
                        border: '1px solid #005f73',
                      } }}>
                    <Typography sx={{  mb: 1, fontSize: '1.25rem',  fontWeight: 'bold',  color: 'rgba(0, 116, 144, 1)' }}>
                      Total Investment
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    <Typography sx={{ fontSize: '1.1rem', color: '#333' }}>
                      Total Funds Raised: <strong>P50,000</strong>
                    </Typography>

                    <Typography variant="body2" sx={{ color: 'gray', mt: 1 }}>
                      *Funds raised through various funding rounds.
                    </Typography>
                  </Card>

                  {/* Number of Funding Rounds Card */}
                  <Card  sx={{  p: 3,  boxShadow: 3,  borderRadius: 2,  transition: '0.3s', border: '1px solid #007490',
                      '&:hover': { 
                        boxShadow: 6, 
                        transform: 'translateY(-5px)' // Slight lift on hover
                      } }}>
                    <Typography sx={{  mb: 1, fontSize: '1.25rem',  fontWeight: 'bold',  color: 'rgba(0, 116, 144, 1)' }}>
                      Funding Rounds
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    <Typography sx={{ fontSize: '1.1rem', color: '#333' }}>
                      Total Number of Rounds: <strong>2</strong>
                    </Typography>

                    <Typography variant="body2" sx={{ color: 'gray', mt: 1 }}>
                      *Includes all rounds since inception.
                    </Typography>
                  </Card>

                  {/* Investors Card */}
                  <Card  sx={{  p: 3,  boxShadow: 3,  borderRadius: 2,  transition: '0.3s', border: '1px solid #007490',
                      '&:hover': { 
                        boxShadow: 6, 
                        transform: 'translateY(-5px)'
                      } }}>
                    <Typography sx={{  mb: 1, fontSize: '1.25rem',  fontWeight: 'bold',  color: 'rgba(0, 116, 144, 1)' }}>
                      Investors
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    <Typography sx={{ fontSize: '1.1rem', color: '#333' }}>
                      Total Number of Investors: <strong>10</strong>
                    </Typography>

                    <Typography variant="body2" sx={{ color: 'gray', mt: 1 }}>
                      Lead Investor: <strong>XYZ Capital</strong>
                    </Typography>

                    <Typography variant="body2" sx={{ color: 'gray' }}>
                      Repeat Investor: <strong>Rob Borinaga</strong>
                    </Typography>
                  </Card>
                </Box>
              </Grid>

              {/* Graph Section */}
              <Grid item xs={12} md={8}>
                <Card  sx={{  boxShadow: 3, borderRadius: 2, height: '100%', p: 3, border: '1px solid #007490' }}>
                  <Typography sx={{ ml: 3, fontSize: '1.2rem', fontWeight: 'bold', color: 'rgba(0, 116, 144, 1)' }}>
                    Funding Progress Chart
                  </Typography>

                  <Divider sx={{ mb: 2, mt: 1 }} />

                  <Box sx={{ width: '100%' }}>
                    {companyId && <MonthlyFundingChart companyId={companyId} />}
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default StartUpView;