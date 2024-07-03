import { AvatarGroup } from "@mui/material";
import { styled } from "@mui/system";


const StyledAvatarGroup = styled(AvatarGroup)(({ theme }) => {
    return {
      "& .css-17o22dy-MuiAvatar-root": {
        width: 25,
        height: 25,
        fontSize: 10,
      },
    };
  });


  export default StyledAvatarGroup