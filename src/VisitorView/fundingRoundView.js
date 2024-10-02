import React, { useState, useEffect } from 'react';
import { Avatar, Box, Divider, Toolbar, Typography, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Pagination, PaginationItem } from '@mui/material';
import StarsIcon from '@mui/icons-material/Stars';
import { useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import axios from 'axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


const drawerWidth = 240;

function FundingRoundView() {
  const [isFollowed, setIsFollowed] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const location = useLocation();
  const { fundinground } = location.state || {};  

  console.log('Funding Round Data:', fundinground); 

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (!fundinground?.startupId) {
        console.error('startupId is undefined');
        setAvatarUrl('path/to/default/image.png');
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3000/profile-picture/startup/${fundinground.startupId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            responseType: 'blob',
          }
        );

        const imageUrl = URL.createObjectURL(response.data);
        setAvatarUrl(imageUrl);

        // Cleanup function to revoke URL
        return () => {
          URL.revokeObjectURL(imageUrl);
        };
      } catch (error) {
        console.error('Failed to fetch profile picture:', error.message);
        setAvatarUrl('path/to/default/image.png');
      }
    };

    fetchProfilePicture();
  }, [fundinground]);

  const handleFollowToggle = () => {
    setIsFollowed(!isFollowed);
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  if (!fundinground) {
    return <div>No funding round data available</div>;
  }

  // Pagination logic
  const paginatedInvestors = fundinground.capTableInvestors.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <Navbar />
      <Toolbar />

      <Box sx={{ width: '100%', paddingLeft: `${drawerWidth}px`, mt: 5 }}>
        <Box display="flex" alignItems="center">
          <Box mr={4}>
            <Avatar variant="rounded"
              src={avatarUrl || 'path/to/default/image.png'}
              sx={{ width: 150, height: 150, border: '5px solid rgba(0, 116, 144, 1)', borderRadius: 3, ml: 8, }}/>
          </Box>
          <Typography variant="h4" gutterBottom>{fundinground.fundingType} - {fundinground.startupName}</Typography>
          <StarsIcon sx={{ cursor: 'pointer', ml: 1, mt: -1, color: isFollowed ? 'rgba(0, 116, 144, 1)' : 'inherit' }} onClick={handleFollowToggle} />
        </Box>

        <Divider sx={{ mt: 5 }} />

        <Box component="main" sx={{ display: 'flex', flexGrow: 1, p: 4, width: '100%', overflowX: 'hidden' }}>
          <Grid container spacing={2}>
            {/* Left Box. Investor Information */}
            <Grid item xs={12} md={10}>
              <Box sx={{ background: 'white', display: 'flex', flexDirection: 'column', borderRadius: 2, pb: 3, pl: 5, pr: 5 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'rgba(0, 116, 144, 1)', mb: 2 }}>Overview</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Typography variant="body1" textAlign="justify">
                          To invest in our company, we require a minimum purchase of <b>{fundinground.moneyRaisedCurrency}{parseInt(fundinground.minimumShare, 10).toLocaleString()}</b> worth of shares. This ensures a significant commitment to our long-term growth and aligns investors with our strategic goals. By setting this threshold, we aim to attract serious investors who are dedicated to supporting our vision and contributing to our future success. We appreciate your consideration in joining us on this journey.
                          <br /><br />
                          For more information, please contact us.
                        </Typography>
                      </Grid>

                      <Grid item xs={3}>
                        <Typography><strong>Funding Name</strong></Typography>
                        <Typography variant="body1">{fundinground.fundingName}</Typography>
                      </Grid>

                      <Grid item xs={3}>
                        <Typography><strong>Announced Date</strong></Typography>
                        <Typography variant="body1">{formatDate(fundinground.announcedDate)}</Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography><strong>Closed on Date</strong></Typography>
                        <Typography variant="body1">{formatDate(fundinground.closedDate)}</Typography>
                      </Grid>
                      
                      <Grid item xs={3}>
                        <Typography><strong>Funding Type</strong></Typography>
                        {fundinground.fundingType}
                      </Grid>

                      <Grid item xs={3}>
                        <Typography><strong>Money Raised</strong></Typography>
                        {fundinground.moneyRaisedCurrency} {fundinground.moneyRaised ? Number(fundinground.moneyRaised).toLocaleString() : 'N/A'}
                      </Grid>

                      <Grid item xs={4}>
                        <Typography><strong>Pre-Money Valuation</strong></Typography>
                        <Typography variant="body1">
                          {fundinground.moneyRaisedCurrency} {fundinground.preMoneyValuation ? Number(fundinground.preMoneyValuation).toLocaleString() : 'N/A'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                <Divider sx={{mt: 5}}/>

                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'rgba(0, 116, 144, 1)', mt: 5 }}>Investors</Typography>
                <TableContainer component={Box} sx={{ mt: 2, backgroundColor: 'white' }}>
                  <Table>
                    <TableHead sx={{backgroundColor: 'rgba(0, 116, 144, 1)'}}>
                      <TableRow>
                        <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', color: 'white' }}>Investor Name</TableCell>
                        <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', color: 'white'  }}>Title</TableCell>
                        <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', color: 'white'  }}>Share</TableCell>
                        <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', color: 'white'  }}>Total Share</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedInvestors && paginatedInvestors.map((investorDetail, index) => {
                        const investor = investorDetail.investor || {};
                        return (
                          <TableRow key={index}>
                            <TableCell sx={{ textAlign: 'center' }}>
                              {investor.firstName || 
                                fundinground.capTableInvestors[0]?.investorDetails.firstName || 
                                'N/A'} {investor.lastName || 
                                fundinground.capTableInvestors[0]?.investorDetails.lastName || 
                                'N/A'}
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>{investorDetail.title || 'N/A'}</TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                              {Number(investorDetail.shares || 0).toLocaleString()}
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                            {fundinground.moneyRaisedCurrency} {investorDetail.totalInvestment ? Number(investorDetail.totalInvestment).toLocaleString() : 'N/A'}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>

                {fundinground.capTableInvestors && fundinground.capTableInvestors.length > rowsPerPage && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination count={Math.ceil(fundinground.capTableInvestors.length / rowsPerPage)}
                      page={currentPage} onChange={handlePageChange}
                      renderItem={(item) => (
                        <PaginationItem slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                          {...item}/>
                      )}/>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}

export default FundingRoundView;
