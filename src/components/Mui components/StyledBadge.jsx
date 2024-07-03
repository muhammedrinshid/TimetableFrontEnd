import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';

const StyledBadge = styled(Badge)(({ theme, status }) => ({
  
  
  '& .MuiBadge-badge': {
    backgroundColor: status === 'free' ? '#44b700' : status === 'leave' ? '#808080' : '#0000FF', // Adjust colors as needed
    color: status === 'free' ? '#44b700' : status === 'leave' ? '#ffffff' : '#0000FF', // White text for grey background
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));


  
  export default StyledBadge
  