export const tableStyles = {
  container: {
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
    border: '1px solid #e0e0e0',    
  },
  head: {
    backgroundColor: '#007490',
    textAlign: 'center',
  },
  headerCell: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#F2F2F2',
  },
  cell: {
    textAlign: 'center',
    color: '#333333',
  },
  actionButton: {
    mr: 1,
    background: 'rgba(0, 116, 144, 1)',
    '&:hover': {
      boxShadow: '0 0 10px rgba(0,0,0,0.5)',
      backgroundColor: 'rgba(0, 116, 144, 1)',
    },
  },
  deleteButton: {
    width: 'calc(50% - 5px)',
    color: 'rgba(0, 116, 144, 1)',
  },
  acceptButton: {
    mr: 1,
    background: '#22bb33',
    '&:hover': {
      boxShadow: '0 0 10px rgba(0,0,0,0.5)',
      backgroundColor: '#22bb33',
    },
  },
  rejectButton: {
    width: '50px',
    color: '#bb2124',
  },
  typography: {
    variant: 'subtitle1',
    fontWeight: 'bold',
    color: '#F2F2F2',
  },
};
