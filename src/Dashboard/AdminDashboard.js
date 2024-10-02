import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Toolbar, CssBaseline, AppBar, Box, IconButton, Avatar, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, 
  TextField} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';
import UserRegistrationsChart from '../Components/ChartAdmin';

import { TopInfoBox, TopInfoText, TopInfoTitle, } from '../styles/UserDashboard';

const AdminDashboard = () => {
  const [filter, setFilter] = useState('all');
  const [users, setUsers] = useState([]);
  const [startups, setStartups] = useState([]);
  const [investors, setInvestors] = useState([]);
  const [fundingRounds, setFundingRounds] = useState([]);
  const [profilePictures, setProfilePictures] = useState({});
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, startupsResponse, investorsResponse, fundingRoundsResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/users/all`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          }),
          axios.get(`${process.env.REACT_APP_API_URL}/startups/all`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          }),
          axios.get(`${process.env.REACT_APP_API_URL}/investors/all`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          }),
          axios.get(`${process.env.REACT_APP_API_URL}/funding-rounds/all`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          })
        ]);

        // Filter out admin users
        const nonAdminUsers = usersResponse.data.filter(user => user.role !== 'admin');

        const usersWithPhotos = await Promise.all(
          nonAdminUsers.map(async (user) => {
            try {
              const profilePicResponse = await axios.get(`${process.env.REACT_APP_API_URL}/profile-picture/${user.id}`, {
                responseType: 'blob',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
              });
              const profilePicUrl = URL.createObjectURL(profilePicResponse.data);
              return { ...user, photo: profilePicUrl };
            } catch (picError) {
              console.error('Error fetching profile picture:', picError);
              return { ...user, photo: null };
            }
          })
        );

        setUsers(usersWithPhotos);
        setStartups(startupsResponse.data);
        setInvestors(investorsResponse.data);
        setFundingRounds(fundingRoundsResponse.data);

        const pictures = {};
        await Promise.all([
          ...startupsResponse.data.map(async (startup) => {
            try {
              const response = await axios.get(`${process.env.REACT_APP_API_URL}/profile-picture/startup/${startup.id}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                responseType: 'blob', 
              });
              pictures[`startup_${startup.id}`] = URL.createObjectURL(response.data);
            } catch (error) {
              console.error(`Failed to fetch profile picture for startup ID ${startup.id}:`, error);
            }
          }),
          ...investorsResponse.data.map(async (investor) => {
            try {
              const response = await axios.get(`${process.env.REACT_APP_API_URL}/profile-picture/investor/${investor.id}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                responseType: 'blob', 
              });
              pictures[`investor_${investor.id}`] = URL.createObjectURL(response.data);
            } catch (error) {
              console.error(`Failed to fetch profile picture for investor ID ${investor.id}:`, error);
            }
          })
        ]);
        setProfilePictures(pictures);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.location = '/';
  };

  const getFilteredData = () => {
    switch (filter) {
      case 'all':
        return users;
      case 'startup':
        return startups;
      case 'investor':
        return investors;
      case 'funding':
        return fundingRounds;
      default:
        return [];
    }
  };

  const getStartupName = (startupId) => {
    const startup = startups.find(s => s.id === startupId);
    return startup ? startup.companyName : 'Unknown Startup';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const renderTable = () => {
    const data = getFilteredData();
    return (
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#005b6e' }}>
              {filter === 'startup' ? (
                <>
                  <TableCell sx={{ color: 'white' }}>Company Name</TableCell>
                  <TableCell sx={{ color: 'white' }}>Founded Date</TableCell>
                  <TableCell sx={{ color: 'white' }}>Industry</TableCell>
                  <TableCell sx={{ color: 'white' }}>Contact Email</TableCell>
                  <TableCell sx={{ color: 'white' }}>Company Photo</TableCell>
                </>
              ) : filter === 'investor' ? (
                <>
                  <TableCell sx={{ color: 'white' }}>Name</TableCell>
                  <TableCell sx={{ color: 'white' }}>Email</TableCell>
                  <TableCell sx={{ color: 'white' }}>Contact Information</TableCell>
                  <TableCell sx={{ color: 'white' }}>Address</TableCell>
                  <TableCell sx={{ color: 'white' }}>Investor Photo</TableCell>
                </>
              ) : filter === 'funding' ? (
                <>
                  <TableCell sx={{ color: 'white' }}>Company Name</TableCell>
                  <TableCell sx={{ color: 'white' }}>Funding Type</TableCell>
                  <TableCell sx={{ color: 'white' }}>Announced Date</TableCell>
                  <TableCell sx={{ color: 'white' }}>Target Funding</TableCell>
                  <TableCell sx={{ color: 'white' }}>Money Raised</TableCell>
                </>
              ) : (
                <>
                  <TableCell sx={{ color: 'white' }}>Name</TableCell>
                  <TableCell sx={{ color: 'white' }}>Gender</TableCell>
                  <TableCell sx={{ color: 'white' }}>Email</TableCell>
                  <TableCell sx={{ color: 'white' }}>Contact Number</TableCell>
                  <TableCell sx={{ color: 'white' }}>User Photo</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5}>Loading...</TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id}>
                  {filter === 'startup' ? (
                    <>
                      <TableCell>{item.companyName}</TableCell>
                      <TableCell>{item.foundedDate}</TableCell>
                      <TableCell>{item.industry}</TableCell>
                      <TableCell>{item.contactEmail}</TableCell>
                      <TableCell>
                        {profilePictures[`startup_${item.id}`] ? (
                          <Avatar src={profilePictures[`startup_${item.id}`]} />
                        ) : (
                          <Avatar>{item.companyName[0]}</Avatar>
                        )}
                      </TableCell>
                    </>
                  ) : filter === 'investor' ? (
                    <>
                      <TableCell>{`${item.firstName} ${item.lastName}`}</TableCell>
                      <TableCell>{item.emailAddress}</TableCell>
                      <TableCell>{item.contactInformation}</TableCell>
                      <TableCell>{item.streetAddress}, {item.city}, {item.country}</TableCell>
                      <TableCell>
                        {profilePictures[`investor_${item.id}`] ? (
                          <Avatar src={profilePictures[`investor_${item.id}`]} />
                        ) : (
                          <Avatar>{item.firstName[0]}{item.lastName[0]}</Avatar>
                        )}
                      </TableCell>
                    </>
                  ) : filter === 'funding' ? (
                    <>
                      <TableCell>{item.startup.companyName}</TableCell>
                      <TableCell>{item.fundingType}</TableCell>
                      <TableCell>{formatDate(item.announcedDate)}</TableCell>
                      <TableCell>{`${item.moneyRaisedCurrency}${formatCurrency(item.targetFunding)}`}</TableCell>
                      <TableCell>{`${item.moneyRaisedCurrency}${formatCurrency(item.moneyRaised)}`}</TableCell>
                      {/* <TableCell>
                        {profilePictures[`startup_${item.startupId}`] ? (
                          <Avatar src={profilePictures[`startup_${item.startupId}`]} />
                        ) : (
                          <Avatar>{getStartupName(item.startupId)[0]}</Avatar>
                        )}
                      </TableCell> */}
                    </>
                  ) : filter === 'funding' ? (
                    <>
                      <TableCell>{getStartupName(item.startupId)}</TableCell>
                      <TableCell>{item.roundType}</TableCell>
                      <TableCell>{item.amount}</TableCell>
                      <TableCell>
                        {profilePictures[`startup_${item.startupId}`] ? (
                          <Avatar src={profilePictures[`startup_${item.startupId}`]} />
                        ) : (
                          <Avatar>{getStartupName(item.startupId)[0]}</Avatar>
                        )}
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{item.firstName} {item.lastName}</TableCell>
                      <TableCell>{item.gender}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>{item.contactNumber}</TableCell>
                      <TableCell>
                        {item.photo ? (
                          <Avatar src={item.photo} />
                        ) : (
                          <Avatar>{item.firstName[0]}{item.lastName[0]}</Avatar>
                        )}
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <div style={{ marginTop: '78px', background: '#f5f5f5' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, background: 'rgba(0, 116, 144, 1)' }}>
        <Toolbar>
          <Avatar sx={{ ml: -3, width: 70, height: 70 }} src='images/logoonly.png'></Avatar>
          <Typography variant="h6" noWrap component="div" sx={{ ml: -1 }}>
            StartUp Vest
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton size="medium" aria-label="show 17 new notifications" color="inherit" sx={{ marginRight: 5 }} onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Grid container spacing={3} sx={{ padding: 6 }}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Typography variant="h5" color='#232023'>
                Admin Dashboard
              </Typography>
            </Grid>

            <Grid item xs={12} sm={3}>
              <TopInfoBox>
                <TopInfoText>Total Users</TopInfoText>
                <TopInfoTitle>{loading ? 'Loading...' : users.length}</TopInfoTitle>
              </TopInfoBox>
            </Grid>

            <Grid item xs={12} sm={3}>
              <TopInfoBox>
                <TopInfoText>Total Startups</TopInfoText>
                <TopInfoTitle>{loading ? 'Loading...' : startups.length}</TopInfoTitle>
              </TopInfoBox>
            </Grid>

            <Grid item xs={12} sm={3}>
              <TopInfoBox>
                <TopInfoText>Total Investors</TopInfoText>
                <TopInfoTitle>{loading ? 'Loading...' : investors.length}</TopInfoTitle>
              </TopInfoBox>
            </Grid>

            <Grid item xs={12} sm={3}>
              <TopInfoBox>
                <TopInfoText>Total Funding Rounds</TopInfoText>
                <TopInfoTitle>{loading ? 'Loading...' : fundingRounds.length}</TopInfoTitle>
              </TopInfoBox>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Paper elevation={3} style={{ padding: '20px', height: '100%' }}>
                <Typography variant="h6" color="#007490">User Growth Graph</Typography>
                <UserRegistrationsChart/>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper elevation={3} style={{ padding: '20px', height: '100%' }}>
                <Typography variant="h6" color="#007490">Latest User</Typography>
                <TableContainer component={Paper} sx={{ mt: 1 }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#005b6e'}}>
                        <TableCell sx={{ color: 'white'}}>Name</TableCell>
                        <TableCell sx={{ color: 'white'}}>Photo</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={2}>Loading...</TableCell>
                        </TableRow>
                      ) : (
                      users
                        .sort((a, b) => b.id - a.id)
                        .slice(0, 5)
                        .map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>{user.firstName} {user.lastName}</TableCell>
                            <TableCell>
                              {user.photo ? (
                                <Avatar src={user.photo} />
                              ) : (
                                <Avatar>{user.firstName[0]}{user.lastName[0]}</Avatar>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <Typography variant="h6">
                    {filter === 'all' ? 'User' : filter === 'startup' ? 'Startup' : filter === 'investor' ? 'Investor' : 'Funding Round'} Information
                  </Typography>
                  <Select value={filter} onChange={(e) => setFilter(e.target.value)} sx={{ minWidth: 150 }}>
                    <MenuItem value="all">Users</MenuItem>
                    <MenuItem value="startup">Startups</MenuItem>
                    <MenuItem value="investor">Investors</MenuItem>
                    <MenuItem value="funding">Funding Rounds</MenuItem>
                  </Select>
                </Box>
                {renderTable()}
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default AdminDashboard;