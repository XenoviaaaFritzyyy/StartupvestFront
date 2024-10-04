import React, { useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography, Pagination, Avatar
} from '@mui/material';

import { tableStyles } from '../styles/tables';

function PendingRequestInvestor() { 
  return (
    <Box component="main" sx={{ display: 'flex', flexDirection: 'column' }}>
      <TableContainer sx={tableStyles.container}>
        <Table>
          <TableHead sx={tableStyles.head}>
            <TableRow>
              <TableCell sx={{ ...tableStyles.cell }}>
                <Typography sx={tableStyles.typography}>Date</Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: 'bold', color: 'white', ml: 5 }}>Company Name</Typography>
              </TableCell>
              <TableCell sx={{ ...tableStyles.cell}}>
                <Typography sx={tableStyles.typography}>Investor</Typography>
              </TableCell>
              <TableCell sx={{ ...tableStyles.cell }}>
                <Typography sx={tableStyles.typography}>Title</Typography>
              </TableCell>
              <TableCell sx={{ ...tableStyles.cell }}>
                <Typography sx={tableStyles.typography}>Shares</Typography>
              </TableCell>
              <TableCell sx={{ ...tableStyles.cell}}>
                <Typography sx={tableStyles.typography}>Action</Typography>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
              <TableRow sx={{ backgroundColor: 'white' }}>
                <TableCell sx={tableStyles.cell}>October 31, 2024</TableCell>
                <TableCell sx={{ ...tableStyles.cell, width: '20%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', ml: 5 }}>
                    <Avatar sx={{ mr: 2, border: '2px rgba(0, 116, 144, 1) solid', borderRadius: 1 }} variant='square' />
                    ChaChing
                  </Box>
                </TableCell>                
                <TableCell sx={tableStyles.cell}>Hazelyn Balingcasag</TableCell>
                <TableCell sx={tableStyles.cell}>Dog</TableCell>
                <TableCell sx={tableStyles.cell}>4</TableCell>
                <TableCell sx={tableStyles.cell}>
                      <Button variant="contained" sx={tableStyles.acceptButton}>
                        Accept
                      </Button>
                      <Button variant="text" sx={tableStyles.rejectButton}>
                        Reject
                      </Button>
                    </TableCell>
              </TableRow>
          </TableBody>
        </Table>

        {/* <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 2, background: 'white' }}>
          <Pagination count={totalPageCount} page={page} onChange={handleChangePage} size="medium" />
        </Box> */}

      </TableContainer>
    </Box>
  );
}

export default PendingRequestInvestor;
