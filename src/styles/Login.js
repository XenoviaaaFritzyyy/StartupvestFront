const styles = {
  container: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh',
  },
  paperLeft: {
    pt: 8, pb: 8, background: 'rgba(0, 116, 144, 1)',
  },
  welcomeText: {
    color: '#F2F2F2', fontWeight: 'bold',
  },
  subtitleText: {
    mt: 3, mb: 3, color: '#F2F2F2',
  },
  logoImage: {
    width: '80%', maxWidth: '100%', boxShadow: '10px 10px 10px rgba(0,0,0,.2)', borderRadius: 10,
  },
  formContainer: {
    padding: '50px', position: 'relative', width: '70%', maxWidth: '400px',
  },
  form: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
  },
  signInText: {
    textAlign: 'center', mb: 1, color: 'rgba(0, 116, 144, 1)', fontWeight: 'bold',
  },
  errorText: {
    textAlign: 'center',
  },
  emailLabel: {
    color: '#007490', mb: -1,
  },
  passwordLabel: {
    color: '#007490', mt: 1.5, mb: -1,
  },
  textField: {
    height: '45px', 
    '& .MuiInputBase-root': { height: '45px' },
    boxShadow: '1px 2px 8px rgba(0,0,0,0.1)',
    '& input:-webkit-autofill': {
      WebkitBoxShadow: '0 0 0 1000px #ffffff inset',
    },
  },
  passwordField: {
    height: '45px', '& .MuiInputBase-root': { height: '45px' },
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#007490',
    },
    boxShadow: '1px 2px 8px rgba(0,0,0,0.1)',
  },
  forgotPassword: {
    textAlign: 'right', cursor: 'pointer', color: 'rgba(0, 116, 144, 1)',
  },
  signInButton: {
    marginTop: 3, width: '100%', background: 'rgba(0, 116, 144, 1)', '&:hover': { boxShadow: '0 0 10px rgba(0,0,0,0.5)', backgroundColor: 'rgba(0, 116, 144, 1)' },
  },
  signUpLink: {
    textAlign: 'center', color: 'rgba(0, 116, 144, 1)', fontWeight: 'bold',
  },
  snackbar: {
    width: '100%',
  },
};

export default styles;
