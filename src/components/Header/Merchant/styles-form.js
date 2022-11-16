import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  TextField: {
    marginLeft: '25px', width: '88%'
  },
  DialogTitle: {
    marginBottom: '-20px'
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

}));