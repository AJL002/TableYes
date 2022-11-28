import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  Dialog:{
    height: '500px'
  },
  TextField: {
    marginLeft: '25px', width: '30%', marginRight: '10px', 
  },
  DialogTitle: {
    marginBottom: '-20px',
  },
  Select: {
    marginLeft: '25px', width: '20%'
  },
  markerContainer: {
    position: 'absolute', transform: 'translate(-50%, -50%)', zIndex: 1, '&:hover': { zIndex: 2 },
  },
  pointer: {
    cursor: 'pointer',
  },
  button: {
    width: '50%', 
  },
  reservation: {
    
  }

}));