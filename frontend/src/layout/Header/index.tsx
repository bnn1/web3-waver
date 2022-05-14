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
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Link from "next/link";
export { Header };

const Header = () => {
  const [disconnectAttempted, setDisconnectAttempted] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const handleClose = () => {
    setSnackOpen(false);
  };
  const handleOpen = () => {
    setSnackOpen(true);
  };
  const { account } = useAuthContext();
  if (!account) return null;
  const disconnect = async () => {
    setDisconnectAttempted(true);
  };
  const closeDialog = () => {
    setDisconnectAttempted(false);
  };
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(account);
    handleOpen();
  };

  return (
    <Slide in={!!account}>
      <AppBar position={"sticky"}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <List sx={{ display: "flex", flex: 1, flexDirection: { xs: "column", sm: "row" } }}>
            {[
              { text: "Wave at Me", href: "/" },
              { text: "Wave Gallery", href: "/wave-gallery" },
            ].map(({ text, href }) => (
              <ListItem key={text} sx={{ width: "fit-content" }}>
                <Link href={href} passHref>
                  <ListItemButton>{text}</ListItemButton>
                </Link>
              </ListItem>
            ))}
          </List>
          <Stack flex={1} justifyContent={"end"} alignItems={"end"}>
            <Typography variant={"caption"}>
              Connected as {account!.slice(0, 10)}...
              <Tooltip title={account as string}>
                <IconButton onClick={copyToClipboard}>
                  <ContentCopyIcon sx={{ fontSize: 12 }} />
                </IconButton>
              </Tooltip>
            </Typography>
            <Button fullWidth sx={{ maxWidth: 200 }} onClick={disconnect}>
              Disconnect wallet
            </Button>
          </Stack>
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
        <Snackbar
          open={snackOpen}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
            variant={"filled"}
          >
            Copied!
          </Alert>
        </Snackbar>
      </AppBar>
    </Slide>
  );
};
