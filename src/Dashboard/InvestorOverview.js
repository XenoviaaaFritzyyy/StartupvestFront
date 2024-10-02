import React, { useState, useEffect } from 'react';
import { Typography, Toolbar, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Box, Pagination, Tabs, Tab, Stack } from "@mui/material";
import Navbar from "../Navbar/Navbar";
import { tableStyles } from '../styles/tables';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TopInfoBox, TopInfoText, TopInfoTitle } from '../styles/UserDashboard';

const drawerWidth = 285;

function createData(id, fundingName, startupName, fundingType, moneyRaised, moneyRaisedCurrency,
  announcedDate, closedDate, avatar, preMoneyValuation, capTableInvestors, minimumShare, startupId, totalShares) {
  return {
    id,
    fundingName,
    startupName,
    fundingType,
    moneyRaised,
    moneyRaisedCurrency,
    announcedDate,
    closedDate,
    avatar,
    preMoneyValuation,
    capTableInvestors,
    minimumShare,
    startupId,
    totalShares
  };
}

function InvestorOverview() {
  const userId = localStorage.getItem('userId');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [profilePictures, setProfilePictures] = useState({});
  const [topInvestedCompany, setTopInvestedCompany] = useState('None');
  const [averageInvestmentSize, setAverageInvestmentSize] = useState(0);
  const [totalInvestmentAmount, setTotalInvestmentAmount] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);

  const conversionRates = {
    USD: 50.0,
    EUR: 60.0,
    GBP: 70.0,
    JPY: 0.45,
    KRW: 0.045,
    PHP: 1
  };

  const handleChangeTab = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    document.body.style.backgroundColor = "#f5f5f5";
  
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  useEffect(() => {
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

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchFundingRounds = async () => {
      if (!userData?.id) return;

      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3000/funding-rounds/all');
        const fetchedRows = response.data.map(fundingRound => {
          const investors = fundingRound.capTableInvestors || [];
          const totalShares = investors.reduce((sum, investor) => sum + (investor.shares || 0), 0);
          const userInvestors = investors.filter(investor => investor.investor?.id === userData.id);

          return createData(
            fundingRound.id,
            fundingRound.fundingName || 'N/A',
            fundingRound.startup?.companyName ?? 'N/A',
            fundingRound.fundingType || 'N/A',
            fundingRound.moneyRaised || '---',
            fundingRound.moneyRaisedCurrency || 'USD',
            fundingRound.announcedDate ? new Date(fundingRound.announcedDate).toLocaleDateString() : 'N/A',
            fundingRound.closedDate ? new Date(fundingRound.closedDate).toLocaleDateString() : 'N/A',
            fundingRound.avatar || '',
            fundingRound.preMoneyValuation || 'N/A',
            userInvestors.map(investor => ({
              id: investor.id,
              title: investor.title,
              shares: investor.shares,
              totalInvestment: investor.totalInvestment || 'N/A',
              investorDetails: {
                firstName: investor.investor?.firstName || 'N/A',
                lastName: investor.investor?.lastName || 'N/A',
                email: investor.investor?.emailAddress || 'N/A',
                contactInfo: investor.investor?.contactInformation || 'N/A',
              },
            })),
            fundingRound.minimumShare || 'N/A',
            fundingRound.startup?.id || null,
            totalShares
          );
        });

        const userInvestedRows = fetchedRows.filter(row => row.capTableInvestors.length > 0);
        setRows(userInvestedRows);
        setFilteredRows(userInvestedRows);
        await fetchAllProfilePictures(userInvestedRows);
      } catch (error) {
        console.error('Error fetching funding rounds:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userData && userData.id) {
      fetchFundingRounds();
    }
  }, [userData]);

  useEffect(() => {
    if (rows.length > 0) {
      const investmentTotals = {};

      rows.forEach(row => {
        row.capTableInvestors.forEach(investor => {
          if (!investmentTotals[row.startupName]) {
            investmentTotals[row.startupName] = 0;
          }
          investmentTotals[row.startupName] += investor.totalInvestment || 0;
        });
      });

      const topCompany = Object.entries(investmentTotals).reduce((a, b) => a[1] > b[1] ? a : b, [])[0];
      setTopInvestedCompany(topCompany || 'None');
    }
  }, [rows]);

  useEffect(() => {
    if (rows.length > 0) {
      let totalInvestmentPHP = 0;
      let totalInvestments = 0;

      rows.forEach(row => {
        row.capTableInvestors.forEach(investor => {
          const investmentValue = investor.shares * (row.minimumShare || 0);
          const investmentValuePHP = investmentValue * (conversionRates[row.moneyRaisedCurrency] || 1);
          totalInvestmentPHP += investmentValuePHP;
          totalInvestments++;
        });
      });

      const averageInvestmentPHP = totalInvestments > 0 ? totalInvestmentPHP / totalInvestments : 0;
      setAverageInvestmentSize(averageInvestmentPHP);
      setTotalInvestmentAmount(totalInvestmentPHP);
    }
  }, [rows]);

  const fetchAllProfilePictures = async (fundingRounds) => {
    const pictures = {};
    await Promise.all(
      fundingRounds.map(async (fundingRound) => {
        const startupId = fundingRound.startupId;
        if (!startupId) return;

        try {
          const response = await axios.get(`http://localhost:3000/profile-picture/startup/${startupId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            responseType: 'blob',
          });
          const imageUrl = URL.createObjectURL(response.data);
          pictures[startupId] = imageUrl;
        } catch (error) {
          console.error(`Failed to fetch profile picture for startup ID ${startupId}:`, error);
        }
      })
    );
    setProfilePictures(pictures);
  };

  const handleRowClick = (fundinground) => {
    navigate(`/fundingroundview`, { state: { fundinground } });
  };

  return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%'}}>
      <Navbar />
      <Toolbar />

      <Grid container spacing={2} sx={{ paddingLeft: `${drawerWidth}px`, pt: 8, pr: 6,}}>
        <Grid item xs={12}>
          <Typography variant="h5" color='#232023'>
            Investor Dashboard
          </Typography>
        </Grid>

        <Grid item xs={12} sm={3}>
          <TopInfoBox>
            <TopInfoText>Top Company Invested</TopInfoText>
            <TopInfoTitle>{topInvestedCompany}</TopInfoTitle>
          </TopInfoBox>
        </Grid>

        <Grid item xs={12} sm={3}>
          <TopInfoBox>
            <TopInfoText>Investment Count</TopInfoText>
            <TopInfoTitle>{rows.length}</TopInfoTitle>
          </TopInfoBox>
        </Grid>

        <Grid item xs={12} sm={3}>
          <TopInfoBox>
            <TopInfoText>Average Investment Size</TopInfoText>
            <TopInfoTitle>₱{averageInvestmentSize.toLocaleString('en-PH', { maximumFractionDigits: 2 })}</TopInfoTitle>
          </TopInfoBox>
        </Grid>

        <Grid item xs={12} sm={3}>
          <TopInfoBox>
            <TopInfoText>Total Investment Amount</TopInfoText>
            <TopInfoTitle>₱{totalInvestmentAmount.toLocaleString('en-PH', { maximumFractionDigits: 2 })}</TopInfoTitle>
          </TopInfoBox>
        </Grid>
      </Grid>

      {/* Tabs Section */}
      <Box sx={{ width: '100%', pl: '285px', pr: '50px', pt: 3}}>
        <Tabs value={tabIndex} onChange={handleChangeTab} aria-label="Investor Profile Tabs">
          <Tab label="My Investments" />
        </Tabs>

        {tabIndex === 0 && (
            <TableContainer component={Paper} sx={{ mt: 3 }}>
              <Table sx={tableStyles} aria-label="investments table">
                <TableHead sx={tableStyles.head}>
                  <TableRow>
                    <TableCell>
                      <Typography sx={{ fontWeight: 'bold', color: 'white', ml: 10 }}>Company Name</Typography>
                    </TableCell>
                    
                    <TableCell sx={tableStyles.head}>
                      <Typography sx={tableStyles.typography}>Funding Name</Typography>
                    </TableCell>

                    <TableCell sx={tableStyles.head}>
                      <Typography sx={tableStyles.typography}>Type</Typography>
                    </TableCell>

                    <TableCell sx={tableStyles.head}>
                      <Typography sx={tableStyles.typography}>Shares</Typography>
                    </TableCell>

                    <TableCell sx={tableStyles.head}>
                      <Typography sx={tableStyles.typography}>Total Share</Typography>
                    </TableCell>

                    <TableCell sx={tableStyles.head}>
                      <Typography sx={tableStyles.typography}>Percentage</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredRows.length > 0 ? (
                    filteredRows.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((row) => (
                      <TableRow key={row.id} hover onClick={() => handleRowClick(row)}
                        sx={{ cursor: 'pointer'}}>
                          <TableCell sx={{ ...tableStyles.cell, width: '30%'}}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', ml: 5 }}>
                            <Avatar src={profilePictures[row.startupId]} sx={{ mr: 2, border: '2px rgba(0, 116, 144, 1) solid', borderRadius: 1 }} variant='square' />
                            {row.startupName}
                          </Box>
                        </TableCell>

                        <TableCell sx={tableStyles.cell}>{row.fundingName}</TableCell>

                        <TableCell sx={tableStyles.cell}>{row.fundingType}</TableCell>
                        
                        <TableCell sx={tableStyles.cell}>
                          {row.capTableInvestors.map((investor, index) => (
                            <div key={index}>
                              {Number(investor.shares).toLocaleString()}
                            </div>
                          ))}
                        </TableCell>

                        <TableCell sx={tableStyles.cell}>
                          {row.capTableInvestors.map((investor, index) => (
                            <div key={index}>
                              {row.moneyRaisedCurrency} {Number(investor.totalInvestment).toLocaleString()}
                            </div>
                          ))}                        
                        </TableCell>

                        <TableCell sx={tableStyles.cell}>
                            {row.capTableInvestors.map((investor) => {
                                const userShares = investor.shares || 0;
                                const percentage = row.totalShares ? ((userShares / row.totalShares) * 100).toFixed(2) : '0.00';
                                return (
                                    <div key={investor.id}>
                                        {percentage}%
                                    </div>
                                );
                            })}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" color="textSecondary">
                          You currently have no active investments.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {filteredRows.length > 0 && (
                <Stack spacing={2} sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                  <Pagination count={Math.ceil(filteredRows.length / rowsPerPage)}
                    page={page} onChange={handleChangePage} size="medium"/>
                </Stack>
              )}
            </TableContainer>
        )}
      </Box>
    </Box>
  );
}

export default InvestorOverview;