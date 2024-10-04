import React from 'react';
import { Typography, Table, TableBody, TableCell, TableHead, TableRow, Avatar, TableContainer, Paper, Stack, Pagination, Box } from "@mui/material";
import { tableStyles } from '../styles/tables';

const InvestmentTable = ({ filteredRows, page, rowsPerPage, handleRowClick, profilePictures, handleChangePage }) => {
  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Table sx={tableStyles} aria-label="investments table">
        <TableHead sx={tableStyles.head}>
          <TableRow>
            <TableCell>
              <Typography sx={{ fontWeight: 'bold', color: 'white', ml: 5 }}>Company Name</Typography>
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
              <TableRow key={row.id} hover onClick={() => handleRowClick(row)} sx={{ cursor: 'pointer' }}>
                <TableCell sx={{ ...tableStyles.cell, width: '20%' }}>
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
              <TableCell colSpan={6} sx={{ textAlign: 'center' }}>
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
  );
};

export default InvestmentTable;