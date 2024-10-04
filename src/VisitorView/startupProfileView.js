import React, { useState, useEffect } from 'react';
import { Box, Divider, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, Grid, IconButton } from '@mui/material';
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
import { StyledAvatar, OverviewTitle, CardStyled, FundingChartCard, FundingBox, FundingTitle, FundingDescription, FundingNote, IconsContainer} from '../styles/VisitorView';

const drawerWidth = 240;

function StartUpView() {
  const [selectedPage, setSelectedPage] = useState('summary');
  const [isFollowed, setIsFollowed] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const location = useLocation();
  const [companyId, setCompanyId] = useState(null);
  const { startup } = location.state || {};

  // Fetch the profile picture
  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (!startup?.id) return; // Ensure startup exists
      setCompanyId(startup.id);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/profile-picture/startup/${startup.id}`, {
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

  if (!startup) {
    return <div>No startup data available</div>;
  }

  // Handle 'N/A' values for display
  const streetAddress = startup.streetAddress === "N/A" ? "" : startup.streetAddress || "";
  const city = startup.city === "N/A" ? "" : startup.city || "";
  const state = startup.state === "N/A" ? "" : startup.state || "";

  const totalMoneyRaised = startup.fundingRounds
  .filter(fundingRound => !fundingRound.isDeleted) // Filter out deleted funding rounds
  .reduce((total, fundingRound) => {
    return total + (fundingRound.moneyRaised || 0); // Default to 0 if moneyRaised is undefined
  }, 0);

  return (
    <Box sx={{ width: '100%', paddingLeft: `${drawerWidth}px`, mt: 5 }}>
      <Navbar />
      <Toolbar />

      <Box display="flex" alignItems="center">
        <StyledAvatar variant="rounded" src={avatarUrl}  />
        <Typography variant="h4" gutterBottom sx={{ ml: 4}}>{startup.companyName}</Typography>
      </Box>

      <Box display="flex" alignItems="center" justifyContent="flex-end" sx={{ mt: -7 }}>
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

      <Divider sx={{ mt: 2 }} />

      <Box ml={4} flexGrow={1}>
        {selectedPage === 'summary' && (
          <Box component="main" sx={{ display: 'flex', flexGrow: 1, width: '100%', overflowX: 'hidden' }}>
            <Grid container spacing={2}>
              <Grid item xs={10} md={8}>
                <Box sx={{ display: 'flex', flexDirection: 'column', borderRadius: 2, pl: 5, mt: 5}}>
                  <OverviewTitle variant="h5">Overview</OverviewTitle>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sx={{ textAlign: 'justify' }}>
                          <Typography>
                            <strong>Description</strong>
                          </Typography>
                          <Typography variant="body1">{startup.companyDescription}</Typography>
                        </Grid>

                        <Grid item xs={3}>
                          <Typography>
                            <strong>Founded Date</strong>
                          </Typography>
                          <Typography variant="body1">{startup.foundedDate}</Typography>
                        </Grid>

                        <Grid item xs={3}>
                          <Typography>
                            <strong>Company Type</strong>
                          </Typography>
                          <Typography variant="body1">{startup.typeOfCompany}</Typography>
                        </Grid>

                        <Grid item xs={3}>
                          <Typography>
                            <strong>No. of Employees</strong>
                          </Typography>
                          <Typography variant="body1">{startup.numberOfEmployees}</Typography>
                        </Grid>

                        <Grid item xs={12}>
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

                        {/* ICONS */}
                        <Grid item xs={12}>
                            <IconsContainer>
                              <IconButton
                                  href={startup.website || "#"}
                                  target="_blank"
                                  disabled={!startup.website}
                                  sx={{
                                    backgroundColor: startup.linkedIn ? '#007bff' : '#e0e0e0',
                                    color: 'white',
                                    '&:hover': { backgroundColor: startup.website ? '#0069d9' : '#e0e0e0' },
                                    borderRadius: '50%',}}>
                                  <LanguageIcon />
                                </IconButton>

                              <IconButton
                                href={startup.linkedIn || "#"}
                                target="_blank"
                                disabled={!startup.linkedIn}
                                sx={{
                                  backgroundColor: startup.linkedIn ? '#0A66C2' : '#e0e0e0',
                                  color: 'white',
                                  '&:hover': { backgroundColor: startup.linkedIn ? '#004182' : '#e0e0e0' },
                                  borderRadius: '50%',}}>
                                <LinkedInIcon />
                              </IconButton>

                              <IconButton
                                href={startup.facebook || "#"}
                                target="_blank"
                                disabled={!startup.facebook}
                                sx={{
                                  backgroundColor: startup.facebook ? '#1877F2' : '#e0e0e0',
                                  color: 'white',
                                  '&:hover': { backgroundColor: startup.facebook ? '#0a52cc' : '#e0e0e0' },
                                  borderRadius: '50%',}}>
                                <FacebookIcon />
                              </IconButton>

                              <IconButton
                                href={startup.twitter || "#"}
                                target="_blank"
                                disabled={!startup.twitter}
                                sx={{
                                  backgroundColor: startup.twitter ? '#1DA1F2' : '#e0e0e0',
                                  color: 'white',
                                  '&:hover': { backgroundColor: startup.twitter ? '#0a8ddb' : '#e0e0e0' },
                                  borderRadius: '50%',
                                }}>
                                <TwitterIcon />
                              </IconButton>

                              <IconButton
                                href={startup.instagram || "#"}
                                target="_blank"
                                disabled={!startup.instagram}
                                sx={{
                                  backgroundColor: startup.instagram ? '#E1306C' : '#e0e0e0',
                                  color: 'white',
                                  '&:hover': { backgroundColor: startup.instagram ? '#b02e5a' : '#e0e0e0' },
                                  borderRadius: '50%',}}>
                                <InstagramIcon />
                              </IconButton>
                            </IconsContainer>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        {selectedPage === 'financial' && (
          <Box component="main" sx={{ display: 'flex', flexGrow: 1, width: '100%', overflowX: 'hidden', pl: 3, pr: 5, pb: 3, pt: 4.5 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <FundingBox>
                  {/* Total Investment Card */}
                  <CardStyled>
                    <FundingTitle>Total Investment</FundingTitle>

                    <Divider sx={{ mb: 2 }} />

                    <FundingDescription>
                      Total Funds Raised: 
                      <strong>
                        {startup.fundingRounds.length > 0 ? (
                          <div>
                            <p>
                              {startup.fundingRounds[0].moneyRaisedCurrency} {totalMoneyRaised.toLocaleString()}
                            </p>
                          </div>
                        ) : (
                          <p>No funding rounds available</p>
                        )}
                      </strong>
                    </FundingDescription>
                    <FundingNote>*Funds raised through various funding rounds.</FundingNote>
                  </CardStyled>

                  {/* Number of Funding Rounds Card */}
                  <CardStyled>
                    <FundingTitle>Funding Rounds</FundingTitle>
                    <Divider sx={{ mb: 2 }} />
                    <FundingDescription>
                      Total Number of Rounds: <strong>{startup.fundingRounds.filter(round => !round.isDeleted).length}</strong>
                    </FundingDescription>
                    <FundingNote>*Includes all rounds since inception.</FundingNote>
                  </CardStyled>

                  {/* Investors Card */}
                  <CardStyled>
                    <FundingTitle>Investors</FundingTitle>
                    <Divider sx={{ mb: 2 }} />

                    {/* Total Number of Investors */}
                    <FundingDescription>
                      Total Number of Investors: <strong>{startup.fundingRounds.flatMap(round => round.capTableInvestors)
                        .filter(investorDetail => !investorDetail.isDeleted && !investorDetail.investorRemoved)
                        .map(investorDetail => investorDetail.investor.id) // To get unique investor IDs
                        .filter((value, index, self) => self.indexOf(value) === index).length}</strong>
                    </FundingDescription>

                    {/* Lead Investor */}
                    <FundingNote>
                      Lead Investor: <strong>
                        {
                          (() => {
                            const allInvestors = startup.fundingRounds.flatMap(round => round.capTableInvestors)
                              .filter(investorDetail => !investorDetail.isDeleted && !investorDetail.investorRemoved);

                            const leadInvestor = allInvestors.reduce((prev, current) => {
                              return (prev.totalInvestment > current.totalInvestment) ? prev : current;
                            }, { totalInvestment: 0 });

                            return leadInvestor.investor?.firstName ? `${leadInvestor.investor.firstName} ${leadInvestor.investor.lastName}` : 'N/A';
                          })()
                        }
                      </strong>
                    </FundingNote>

                    {/* Repeat Investor */}
                    <FundingNote>
                      Repeat Investor: <strong>
                        {
                          (() => {
                            const investmentCounts = {};
                            const allInvestors = startup.fundingRounds.flatMap(round => round.capTableInvestors)
                              .filter(investorDetail => !investorDetail.isDeleted && !investorDetail.investorRemoved);

                            allInvestors.forEach(investorDetail => {
                              const investorId = investorDetail.investor.id;
                              if (investmentCounts[investorId]) {
                                investmentCounts[investorId].count += 1;
                                investmentCounts[investorId].investor = investorDetail.investor;
                              } else {
                                investmentCounts[investorId] = { count: 1, investor: investorDetail.investor };
                              }
                            });

                            const repeatInvestors = Object.values(investmentCounts).filter(investor => investor.count > 1);
                            return repeatInvestors.length > 0 ? `${repeatInvestors[0].investor.firstName} ${repeatInvestors[0].investor.lastName}` : 'N/A';
                          })()
                        }
                      </strong>
                    </FundingNote>
                  </CardStyled>

                </FundingBox>
              </Grid>

              {/* Graph Section */}
              <Grid item xs={12} md={8}>
                <FundingChartCard>
                  <Typography sx={{ ml: 3, fontSize: '1.2rem', fontWeight: 'bold', color: 'rgba(0, 116, 144, 1)' }}>
                    Funding Progress Chart
                  </Typography>
                  <Box sx={{ width: '100%' }}>
                    {companyId && <MonthlyFundingChart companyId={companyId} />}
                  </Box>
                </FundingChartCard>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default StartUpView;