import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Image from "../../assets/images/image1.jpeg";

export default function ImageAvatars() {
  return (
    <Stack direction="row" spacing={3}>
      <Avatar alt="Remy Sharp" src={Image} />
      <Avatar alt="Travis Howard" src={Image} />
      <Avatar alt="Cindy Baker" src={Image} />
    </Stack>
  );
}
