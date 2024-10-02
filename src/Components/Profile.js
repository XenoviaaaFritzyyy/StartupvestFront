import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import CreateBusinessProfileDialog from '../Dialogs/CreateBusinessProfileDialog';

import { Box, Typography, Toolbar, TextField, Avatar, Button, Select, MenuItem, Grid} from '@mui/material';

const drawerWidth = 240;

function Profile( hasInvestorProfile ) {
  const [isEditable, setIsEditable] = useState(false);
  const [openCreateBusinessProfile, setCreateBusinessProfile] = useState(false);
  const [businessProfiles, setBusinessProfiles] = useState([]);

    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        contactNumber: '',
        gender: '',
        avatar: '',
    });

    // New state for the profile picture URL
    const [profilePicUrl, setProfilePicUrl] = useState('');

    // Fetch user data when the component mounts.
    useEffect(() => {
        fetchUserData();
        fetchBusinessProfiles();
    // Call fetchProfilePicture here using the user ID from userData
        if (userData.id) {
            fetchProfilePicture(userData.id);
        }
    }, [userData.id]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/users/profile', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      setUserData(response.data);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

    const fetchBusinessProfiles = async () => {
        try {
            const responseStartups = await axios.get(`http://localhost:3000/startups`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const responseInvestors = await axios.get(`http://localhost:3000/investors`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const startups = responseStartups.data.filter(profile => !profile.isDeleted).map(profile => ({ ...profile, type: 'Startup' }));
            const investors = responseInvestors.data.filter(profile => !profile.isDeleted).map(profile => ({ ...profile, type: 'Investor' }));
    
            setBusinessProfiles([...investors, ...startups]);
        } catch (error) {
            console.error('Failed to fetch business profiles:', error);
        }
    };
    
    const handleEditClick = () => {
        setIsEditable(!isEditable);
    };

    // Function to handle file upload
    const handleAvatarUpload = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
    
        try {
        // const userId = /* logic to get the user's ID */;
        await axios.post(`http://localhost:3000/profile-picture/${userData.id}/upload`, formData, {
            headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
            },
        });
        // After uploading, fetch the profile picture to update the avatar
        fetchProfilePicture(userData.id);
        } catch (error) {
        console.error('Error uploading profile picture:', error);
        }
    };

    // Function to fetch and display the profile picture
    const fetchProfilePicture = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/profile-picture/${userData.id}`, {
            responseType: 'blob',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
          const url = URL.createObjectURL(response.data);
            setProfilePicUrl(url); // Update the profile picture URL state
                } catch (error) {
                console.error('Error fetching profile picture:', error);
                }
    };

    // Function to handle profile picture update
    const updateProfilePicture = async (userId, file) => {
        const formData = new FormData();
        formData.append('file', file);
    
        try {
        const response = await axios.put(`http://localhost:3000/profile-picture/${userData.id}`, formData, {
            headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
            },
        });
        // After updating, fetch the new profile picture to update the avatar
        fetchProfilePicture(userData.id);
        console.log(response.data); // Log the response from the server
        } catch (error) {
        console.error('Error updating profile picture:', error);
        }
    };
      

  const handleOpenBusinessProfile = () => {
    setCreateBusinessProfile(true);
  };

  const handleCloseBusinessProfile = () => {
    setCreateBusinessProfile(false);
    fetchBusinessProfiles();
  };

  const handleSaveChanges = async () => {
    try {
      await updateUser(userData);
      setIsEditable(false);
    } catch (error) {
      console.error('Failed to update user data:', error);
    }
  };
  
  const updateUser = async (userData) => {
    try {
      const response = await axios.put(`http://localhost:3000/users/${userData.id}`, userData, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      console.log('User data updated successfully:', response.data);
      setUserData(userData); // Update local state with new user data
    } catch (error) {
      console.error('Failed to update user data:', error);
      throw error;
    }
  };  
    
  return (
    <>
      <Navbar />
      <Toolbar />
      <Box component="main" sx={{ flexGrow: 1, p: 4, mt: 3, paddingLeft: `${drawerWidth}px`, width: '100%', overflowX: 'hidden' }}>
        <Typography variant="h5" sx={{ paddingLeft: 8, color: 'rgba(0, 116, 144, 1)', fontWeight: 'bold' }}>
          Account Information
        </Typography>

        <Box component="main" sx={{ mr: 5, borderRadius: 2, ml: 8, pb: 6, mt: 3, boxShadow: '0 0 10px rgba(0,0,0,0.25)' }}>
          <Typography sx={{ color: 'white', background: 'rgba(0, 116, 144, 1)', fontWeight: '500', pl: 8, pt: 1.5, pb: 1.5, mb: 3, fontSize: '20px' }}>
            Personal Information
          </Typography>
          
            <Grid container spacing={2} sx={{ ml: 7 }}>
              <Grid item xs={12} sm={2.5}>
                <label htmlFor="avatar-upload">
                  <Avatar sx={{ width: 200, height: 200, mt: 4, cursor: 'pointer', border: '5px rgba(0, 116, 144, 1) solid' }}
                    src={profilePicUrl}/>
                </label>
                
                <input type="file" accept="image/*" id="avatar-upload" style={{ display: 'none' }}
                  onChange={(event) => {
                    const file = event.target.files[0];
                      if (file && userData.id) {
                        updateProfilePicture(userData.id, file);
                      }
                    }}
                disabled={!isEditable}/>
              <Typography sx={{ mt: 1, ml: 6.5, color: 'rgba(0, 116, 144, 1)' }}>Upload Photo</Typography>
            </Grid>

            <Grid item xs={12} sm={7.8}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <label>First Name</label>
                  <TextField fullWidth variant="outlined" value={userData.firstName} onChange={(e) => setUserData((prevData) => ({ ...prevData, firstName: e.target.value }))} InputProps={{ disabled: !isEditable, style: {
                     height: '45px', boxShadow: '0 0 10px rgba(0,0,0,0.1)'
                  } }} />
                </Grid>

                <Grid item xs={6}>
                  <label>Last Name</label>
                  <TextField fullWidth variant="outlined" value={userData.lastName} onChange={(e) => setUserData((prevData) => ({ ...prevData, lastName: e.target.value }))} InputProps={{ disabled: !isEditable, style: {
                     height: '45px', boxShadow: '0 0 10px rgba(0,0,0,0.1)'
                    } }} />
                </Grid>

                <Grid item xs={12}>
                  <label>Email Address</label>
                  <TextField fullWidth variant="outlined" value={userData.email} onChange={(e) => setUserData((prevData) => ({ ...prevData, email: e.target.value }))} InputProps={{ disabled: !isEditable, style: {
                     height: '45px', boxShadow: '0 0 10px rgba(0,0,0,0.1)'
                    } }} />
                </Grid>

                <Grid item xs={6}>
                  <label>Phone Number</label>
                  <TextField fullWidth variant="outlined" value={userData.contactNumber} onChange={(e) => setUserData((prevData) => ({ ...prevData, contactNumber: e.target.value }))} InputProps={{ disabled: !isEditable, style: {
                     height: '45px', boxShadow: '0 0 10px rgba(0,0,0,0.1)'
                    } }} />
                </Grid>

                <Grid item xs={6}>
                  <label>Gender</label>
                  <Select fullWidth variant="outlined" value={userData.gender} onChange={(e) => setUserData((prevData) => ({ ...prevData, gender: e.target.value }))} disabled={!isEditable} style={{ height: '45px', boxShadow: '0 0 10px rgba(0,0,0,0.2)' }}>
                    <MenuItem value={'Male'}>Male</MenuItem>
                    <MenuItem value={'Female'}>Female</MenuItem>
                    <MenuItem value={'Neutral'}>Neutral</MenuItem>
                    <MenuItem value={'Other'}>Other</MenuItem>
                  </Select>
                </Grid>

                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Button variant="contained"
                      sx={{ mt: 3, width: 150, background: 'rgba(0, 116, 144, 1)', '&:hover': { boxShadow: '0 0 10px rgba(0,0,0,0.5)', backgroundColor: 'rgba(0, 116, 144, 1)' } }}
                      onClick={isEditable ? handleSaveChanges : handleEditClick}>
                      {isEditable ? 'Save Changes' : 'Edit Profile'}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>

        <Box component="main" sx={{ display: 'flex', flexDirection: 'column', mt: 8, mb: 4 }}>
          <Typography variant="h5" sx={{ pl: 8, color: 'rgba(0, 116, 144, 1)', fontWeight: 'bold' }}>
            Business Profile
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', mt: 4, ml: 8, mr: 5 }}>
            <Box sx={{ borderRadius: 2, p: 4, display: 'flex', alignItems: 'center', boxShadow: '0 0 10px rgba(0,0,0,0.25)', width: '70%' }}>
              <Avatar src="/images/prof.jpg" variant='square' sx={{ mr: 3, width: 200, height: 250, border: '4px rgba(0, 116, 144, 1) solid', borderRadius: 2}}></Avatar>
              <Typography align='justify' sx={{ color: '#414a4c', fontWeight: '500' }}>
                <b>Why Create a Business Profile?</b><br/>
                Establishing a business profile on Startup Vest offers significant advantages for both startups and investors.
                <br /><br /><b>For Startups</b> creating a profile enhances visibility and credibility, making it easier to attract funding and connect with industry leaders and potential partners.<br /><br /><b>For Investors</b> they can discover a diverse range of startups, invest in promising opportunities, and track progress over time.
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', borderRadius: 2, p: 4, display: 'flex', alignItems: 'center', boxShadow: '0 0 10px rgba(0,0,0,0.5)', width: '28%', backgroundColor: '#007490'}}>
              <Typography align='justify' sx={{ color: 'white', fontWeight: '500', mb: 2, mt: 5 }}>
                <b>Don’t miss out on opportunities.</b><br /><br /> Create your business profile today and unlock limitless potential for growth and success!
              </Typography>

              <Button variant="contained" fullWidth sx={{ color: '#007490', background: 'white', '&:hover': { boxShadow: '0 0 10px rgba(0,0,0,0.5)', backgroundColor: 'white'} }} onClick={handleOpenBusinessProfile}>
                Create Profile
              </Button>
            </Box>
          </Box>
        </Box>

        <CreateBusinessProfileDialog open={openCreateBusinessProfile} onClose={handleCloseBusinessProfile} 
        hasInvestorProfile={hasInvestorProfile}/>
      </Box>
    </>
  );
}

export default Profile;