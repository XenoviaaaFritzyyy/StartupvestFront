import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';

export const StyledCard = styled(Card)(({ theme, selected, color, disabled }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  width: '500px',
  height: '120px',
  cursor: disabled ? 'not-allowed' : 'pointer', // Change cursor when disabled
  border: selected ? `3px solid ${color}` : '2px solid grey',
  backgroundColor: selected ? '#e0f7fa' : (disabled ? '#f5f5f5' : '#ffffff'), // Change background if disabled
  opacity: disabled ? 0.5 : 1, // Reduce opacity when disabled
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: disabled ? 'none' : '0 8px 16px rgba(0, 0, 0, 0.2)', // No hover effect if disabled
    transform: disabled ? 'none' : 'scale(1.02)', // No scaling effect if disabled
  },
}));
