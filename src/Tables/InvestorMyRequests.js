import React from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography, Avatar } from '@mui/material';
import { tableStyles } from '../styles/tables';

function InvestorRequest() { 
  return (
    <Box component="main" sx={{ display: 'flex', flexDirection: 'column', height: '100%', mt: 3 }}>
      <TableContainer sx={tableStyles.container}>
        <Table>
          <TableHead sx={tableStyles.head}>
            <TableRow>
              <TableCell sx={{ ...tableStyles.head }}>
                <Typography sx={tableStyles.typography}>Date</Typography>
              </TableCell>
              <TableCell sx={{   }}>
                <Typography sx={tableStyles.typography}>Company Name</Typography>
              </TableCell>
              <TableCell sx={{ ...tableStyles.head }}>
                <Typography sx={tableStyles.typography}>Shares</Typography>
              </TableCell>
              <TableCell sx={{ ...tableStyles.head }}>
                <Typography sx={tableStyles.typography}>Total Shares</Typography>
              </TableCell>
              <TableCell sx={{ ...tableStyles.head }}>
                <Typography sx={tableStyles.typography}>Status</Typography>
              </TableCell>
              <TableCell sx={{ ...tableStyles.head }}>
                <Typography sx={tableStyles.typography}>Action</Typography>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow sx={{ backgroundColor: 'white' }}>
              <TableCell sx={tableStyles.cell}>October 31, 2024</TableCell>
              <TableCell sx={{ ...tableStyles.cell, width: '20%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start',}}>
                  <Avatar 
                    src="https://via.placeholder.com/40" 
                    sx={{ mr: 2, border: '2px rgba(0, 116, 144, 1) solid', borderRadius: 1 }} 
                    variant='square' />
                  ChaChing
                </Box>
              </TableCell>
              <TableCell sx={tableStyles.cell}>4</TableCell>
              <TableCell sx={tableStyles.cell}>P 10,500</TableCell>
              <TableCell sx={tableStyles.cell}>Pending</TableCell>
              <TableCell sx={tableStyles.cell}>
                <Button variant="text" sx={tableStyles.rejectButton}>
                  Cancel
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* Pagination can be added here if necessary */}
        {/* <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 2, background: 'white' }}>
          <Pagination count={totalPageCount} page={page} onChange={handleChangePage} size="medium" />
        </Box> */}
      </TableContainer>
    </Box>
  );
}

export default InvestorRequest;
