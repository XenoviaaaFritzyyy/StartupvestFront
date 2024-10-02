// steps.js
import { Box, Typography, Grid } from "@mui/material";

const steps = [
    {   
        label: "Overview", 
        content: (
            <Box>
                <Typography variant="body1" textAlign='justify'>
                    Startup Vest is a dynamic platform designed to bridge the gap between startup owners and investors, providing a comprehensive solution for both parties. Whether you're a startup owner seeking funding or an investor looking for high-potential ventures, Startup Vest offers a streamlined, user-friendly environment.
                </Typography>

                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12}>
                        <Typography variant="body2" textAlign='justify' sx={{ mb: 1}}>
                            As a <b>startup owner</b> on Startup Vest, you can track investors who have invested in your company, gaining insights into key metrics such as the number of shares purchased, their professional title, and their percentage of ownership. You can also monitor your startup profiles and funding rounds, enabling you to efficiently manage both investor relations and the progress of your fundraising efforts.
                        </Typography>
                        <img src="/images/startupDash.png" alt="Overview" style={{ width: '100%', borderRadius: '8px' }} /> 
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
                            As an <b>investor</b> on Startup Vest, you can create a profile to explore startups that match your interests, view detailed funding round information, and track your investments, including the amount invested and potential returns based on the company's performance.
                        </Typography>
                        <img src="/images/investorDash.png" alt="Overview" style={{ width: '100%', borderRadius: '8px' }} />   
                    </Grid>
                </Grid>
            </Box>
        ) 
    },
    {   
        label: "Create Business Profile", 
        content: (
            <Box>
                <Typography variant="body1">
                    With StartUp Vest, you can create a detailed business profile as either a startup owner or an investor. 
                    <br /><br />Startup owners have the ability to set up and manage funding rounds for their ventures, while investors can explore and engage with promising opportunities. This dual functionality ensures that both sides of the investment equation are well-supported and connected.
                </Typography>

                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12}>
                            <Typography variant="body2" sx={{ mt: 1, mb: 1, fontWeight: 'bold' }}>
                                Step 1: Click 'create' button and select business profile
                            </Typography>
                            <img src="/images/createbutton.png" alt="Overview" style={{ width: '100%', borderRadius: '8px' }} />
                            <Typography variant="body2" sx={{ mt: 2,  mb: 1, fontWeight: 'bold' }}>
                                Step 2: Click the profile you want to create
                            </Typography>
                            <img src="/images/chooseprofile.png" alt="Overview" style={{ width: '100%', borderRadius: '8px' }} />    
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="body2" sx={{  mt: 1, fontWeight: 'bold' }}>
                           Step 3: Fill up the form
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                            <Typography variant="body2" gutterBottom>Startup Owner Form</Typography>
                            <img src="/images/startupForm.png" alt="Startup Owner" style={{ width: '100%', borderRadius: '8px' }} />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                            <Typography variant="body2" gutterBottom>Investor Form</Typography>
                            <img src="/images/investorForm.png" alt="Investor" style={{ width: '100%', borderRadius: '8px' }} />
                    </Grid>
                </Grid>
            </Box>
        ) 
    },
    {   
        label: "Create Funding Round", 
        content: (
            <Box>
                <Typography variant="body1">
                    To set up a funding round on Startup Vest, startup owners must first create a complete business profile. This ensures that all essential information about the company is ready and accessible, giving potential investors the insights they need before engaging in the funding process.
                </Typography>

                <Grid container spacing={2} sx={{ mt: 1, mb: 1 }}>
                    <Grid item xs={12}>
                            <Typography variant="body2" sx={{ mt: 1, mb: 1, fontWeight: 'bold' }}>
                                Step 1: Click 'create' button and select funding round
                            </Typography>
                            <img src="/images/createbuttonF.png" alt="Overview" style={{ width: '100%', borderRadius: '8px' }} />
                            <Typography variant="body2" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
                                Step 2: Fill up the form
                            </Typography>
                            <img src="/images/fundingForm.png" alt="Overview" style={{ width: '100%', borderRadius: '8px' }} />    
                    </Grid>
                </Grid>
            </Box>
        ) 
    },
];

export default steps;