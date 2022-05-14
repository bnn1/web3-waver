import Slide from "@mui/material/Slide";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { useAuthContext } from "../Auth";
import Button from "@mui/material/Button";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";

export { Header };

const Header = () => {
  const [disconnectAttempted, setDisconnectAttempted] = useState(false);
  const { account } = useAuthContext();
  const disconnect = async () => {
    setDisconnectAttempted(true);
  };
  const closeDialog = () => {
    setDisconnectAttempted(false);
  };

  return (
    <Slide in={!!account}>
      <AppBar position={"sticky"}>
        <Toolbar>
          <List sx={{ width: 1, display: "flex", flexDirection: { xs: "column", sm: "row" } }}>
            {["Wave at Me", "About"].map((text) => (
              <ListItem key={text} sx={{ width: "fit-content" }}>
                <ListItemButton>{text}</ListItemButton>
              </ListItem>
            ))}
          </List>
          <Button fullWidth sx={{ maxWidth: 200 }} onClick={disconnect}>
            Disconnect wallet
          </Button>
        </Toolbar>
        <Dialog open={disconnectAttempted} onClose={closeDialog}>
          <DialogTitle variant={"h4"}>Sorry...</DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", rowGap: 1 }}>
            {[
              {
                text: "I couldn't implement disconnect functionality",
                sx: {},
              },
              {
                text: "If you really want to disconnect your wallet, please do so from within Metamask",
                sx: {},
              },
            ].map(({ text, sx }) => (
              <DialogContentText textAlign={"justify"} key={text} sx={sx}>
                {text}
              </DialogContentText>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog}>OK</Button>
          </DialogActions>
        </Dialog>
      </AppBar>
    </Slide>
  );
};
