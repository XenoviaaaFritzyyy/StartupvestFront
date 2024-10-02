// CompaniesStyles.js
import { styled } from '@mui/material/styles';
import { Paper, Avatar, TableRow, TableCell, Stack } from '@mui/material';

export const StyledPaper = styled(Paper)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(3),
  boxShadow: 'none',
}));

export const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  marginRight: theme.spacing(2),
  border: `2px solid #007490`,
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  cursor: 'pointer',
  height: '75px',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  textAlign: 'left',
  color: 'black'
}));

export const StyledStack = styled(Stack)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'left',
  alignItems: 'center',
}));
