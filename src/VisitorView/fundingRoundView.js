import React, { useState, useEffect } from 'react';
import { Box, Divider, Toolbar, Typography, Grid, Button, Pagination, PaginationItem, TableRow, TableBody, TableCell,} from '@mui/material';
import { useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import axios from 'axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import InvestNowDialog from '../Dialogs/InvestNowDialog';
import { StyledAvatar, OverviewBox, OverviewTitle, StyledTable, StyledTableHead, StyledTableCell, PaginationBox, } from '../styles/VisitorView';

const drawerWidth = 240;

function FundingRoundView() {
  const [avatarUrl, setAvatarUrl] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const location = useLocation();
  const { fundinground } = location.state || {};  

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (!fundinground?.startupId) {
        console.error('startupId is undefined');
        setAvatarUrl('path/to/default/image.png');
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/profile-picture/startup/${fundinground.startupId}`,
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

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
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
        <Grid container alignItems="center">
          <Grid item mr={4}>
            <StyledAvatar
              variant="rounded"
              src={avatarUrl || 'path/to/default/image.png'} />
          </Grid>

          <Grid item>
            <Typography variant="h4" gutterBottom>
              {fundinground.fundingType} - {fundinground.startupName}
            </Typography>
            
            <Button variant='outlined' sx={{ width: '150px' }} onClick={handleOpenDialog}>
              Invest Now
            </Button>
          </Grid>
        </Grid>

        <Divider sx={{ mt: 2 }} />

        <Box component="main" sx={{ display: 'flex', flexGrow: 1, p: 4, width: '100%', overflowX: 'hidden' }}>
          <Grid container spacing={2}>
            {/* Left Box. Investor Information */}
            <Grid item xs={10} md={10}>
            <OverviewBox>
              <OverviewTitle variant="h5">Overview</OverviewTitle>
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

                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'rgba(0, 116, 144, 1)', mt: 5, mb: 3 }}>Investors</Typography>
                <StyledTable>
                  <StyledTableHead>
                  <TableRow>
                      <StyledTableCell>Investor Name</StyledTableCell>
                      <StyledTableCell>Title</StyledTableCell>
                      <StyledTableCell>Share</StyledTableCell>
                      <StyledTableCell>Total Share</StyledTableCell>
                    </TableRow>
                  </StyledTableHead>
                  <TableBody>
                    {paginatedInvestors &&
                      paginatedInvestors
                        .filter(investorDetail => {
                          const investor = investorDetail.investor || {};
                          return !investor.isDeleted && !investorDetail.investorRemoved; // Only include non-deleted and non-removed investors
                        })
                        .map((investorDetail, index) => {
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
                </StyledTable>

                {fundinground.capTableInvestors && fundinground.capTableInvestors.length > rowsPerPage && (
                  <PaginationBox>
                    <Pagination 
                      count={Math.ceil(fundinground.capTableInvestors.length / rowsPerPage)}
                      page={currentPage} 
                      onChange={handlePageChange}
                      renderItem={(item) => (
                        <PaginationItem slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }} {...item}/>
                      )}
                    />
                  </PaginationBox>
                )}
              </OverviewBox>
            </Grid>
          </Grid>
        </Box>

        {/* Invest Now Dialog */}
        <InvestNowDialog open={openDialog} onClose={handleCloseDialog} />
      </Box>
    </>
  );
}

export default FundingRoundView;