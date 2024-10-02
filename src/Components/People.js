import React, { useState, useEffect, useMemo } from 'react';
import { Box, Table, TableBody, TableContainer, TableHead, TableSortLabel, Pagination, Toolbar, Typography, TextField, TableRow
} from '@mui/material';
import PropTypes from 'prop-types';
import SearchIcon from '@mui/icons-material/Search';
import { visuallyHidden } from '@mui/utils';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { StyledPaper, StyledAvatar, StyledTableRow, StyledTableCell, StyledStack, } from '../styles/components';

const drawerWidth = 240;

const headCells = [
  { id: 'name', numeric: false, disablePadding: false, label: 'Full Name' },
  { id: 'location', numeric: false, disablePadding: false, label: 'Location' },
  { id: 'email', numeric: false, disablePadding: false, label: 'Email Address' },
  { id: 'biography', numeric: false, disablePadding: false, label: 'Biography', width: '38%' },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <StyledTableCell key={headCell.id} align="left" padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{ width: headCell.width, fontWeight: 'bold', backgroundColor: '#007490', color: '#ffffff' }}>
            <TableSortLabel active={orderBy === headCell.id} direction={orderBy === headCell.id ? order : 'asc'} onClick={createSortHandler(headCell.id)} style={{ color: '#ffffff' }} >
              {headCell.label}
            {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

function EnhancedTableToolbar({ onRequestSearch }) {
  const [searchText, setSearchText] = useState('');

  const handleSearch = (event) => {
    setSearchText(event.target.value);
    onRequestSearch(event.target.value);
  };

  return (
    <Toolbar sx={{ pt: 12, mb: 3, ml: -3 }}>
      <Typography sx={{ flex: '1 1 100%', color: 'rgba(0, 116, 144, 1)', fontWeight: 'bold' }} variant="h5">
        Search People
      </Typography>

      <TextField variant="standard" placeholder="Search…" onChange={handleSearch} value={searchText} sx={{ width: 350 }}
        InputProps={{ startAdornment: <SearchIcon /> }} />
    </Toolbar>
  );
}

const getInitials = (firstName, lastName) => {
  const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
  return `${firstInitial}${lastInitial}`;
};

export default function Companies() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [investors, setInvestors] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [profilePictures, setProfilePictures] = useState({});

  const formatAddress = (streetAddress, city, country) => {
    const parts = [streetAddress, city, country].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Address not available';
  };  

  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        const response = await axios.get('http://localhost:3000/investors/all');
        setInvestors(response.data);
      } catch (error) {
        console.error('Error fetching investors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestors();
  }, []);

  useEffect(() => {
    setFilteredRows(investors);
  }, [investors]);

  const fetchProfilePicture = async (investorId) => {
    try {
      const response = await axios.get(`http://localhost:3000/profile-picture/investor/${investorId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        responseType: 'blob',
      });
  
      const imageUrl = URL.createObjectURL(response.data);
  
      setProfilePictures((prevState) => ({
        ...prevState,
        [investorId]: imageUrl,
      }));
    } catch (error) {
      console.error('Failed to fetch profile picture:', error);
      // Set a null value to indicate the image failed to load
      setProfilePictures((prevState) => ({
        ...prevState,
        [investorId]: null,
      }));
    }
  };

  useEffect(() => {
    investors.forEach((investor) => {
      if (profilePictures[investor.id] === undefined) {
        fetchProfilePicture(investor.id);
      }
    });
  }, [investors, profilePictures]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleSearch = (searchText) => {
    const filtered = investors.filter((row) =>
      row.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
      row.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
      row.emailAddress.toLowerCase().includes(searchText.toLowerCase()) ||
      row.contactInformation.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredRows(filtered);
  };

  const handleRowClick = (investor) => {
    navigate(`/userview`, { state: { profile: investor } });
  };

  const visibleRows = useMemo(
    () =>
      stableSort(filteredRows, getComparator(order, orderBy)).slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage, filteredRows],
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ width: '100%', paddingLeft: `${drawerWidth}px` }}>
      <Navbar />
      <StyledPaper elevation={0}>
        <EnhancedTableToolbar onRequestSearch={handleSearch} />
        <TableContainer sx={{ flex: 1 }}>
          <Table>
            <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
            <TableBody>
              {visibleRows.map((row) => (
                <StyledTableRow key={row.id} onClick={() => handleRowClick(row)}>
                  <StyledTableCell>
                    <StyledStack direction='row'>
                    <StyledAvatar 
                        variant="rounded" 
                        src={profilePictures[row.id] || ''}
                        alt={getInitials(row.firstName, row.lastName)}
                      >
                        {(!profilePictures[row.id] || profilePictures[row.id] === null) && 
                          getInitials(row.firstName, row.lastName)}
                      </StyledAvatar>
                      {row.firstName} {row.lastName}
                    </StyledStack>
                  </StyledTableCell>
                  <StyledTableCell>  {formatAddress(row.streetAddress, row.city, row.country)}</StyledTableCell>
                  <StyledTableCell>{row.emailAddress}</StyledTableCell>
                  <StyledTableCell sx={{ textAlign: 'justify' }}>
                    {row.biography.split(' ').slice(0, 20).join(' ')}...
                  </StyledTableCell>
                </StyledTableRow>
              ))}
              {filteredRows.length === 0 && (
                <StyledTableRow>
                  <StyledTableCell colSpan={headCells.length} align="center">No results found</StyledTableCell>
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <StyledStack spacing={2} sx={{ mt: 2, alignItems: 'center' }}>
          <Pagination
            count={Math.ceil(filteredRows.length / rowsPerPage)}
            page={page}
            onChange={handlePageChange}
            size="large"
          />
        </StyledStack>
      </StyledPaper>
    </Box>
  );
}