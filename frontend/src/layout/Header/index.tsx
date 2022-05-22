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
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
export { Header };
const Header = () => {
  const [disconnectAttempted, setDisconnectAttempted] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));
  const desktop = useMediaQuery(theme.breakpoints.up("md"));
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };
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
    if (mobileMenuOpen) {
      closeMobileMenu();
    }
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
        {desktop && (
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <List
              sx={{ display: "flex", flex: 1, flexDirection: { xs: "column", sm: "row" } }}
            >
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
        )}
        {mobile && (
          <Toolbar sx={{ justifyContent: "flex-end" }}>
            <Drawer open={mobileMenuOpen} onClose={closeMobileMenu} anchor={"bottom"}>
              <Stack rowGap={2} px={3} pt={4}>
                <List
                  sx={{
                    display: "flex",
                    flex: 1,
                    flexDirection: { xs: "column" },
                    rowGap: 2,
                  }}
                >
                  {[
                    { text: "Wave at Me", href: "/" },
                    { text: "Wave Gallery", href: "/wave-gallery" },
                  ].map(({ text, href }) => (
                    <ListItem key={text} sx={{ width: "fit-content", p: 0, fontSize: 24 }}>
                      <Link href={href} passHref>
                        <ListItemButton
                          sx={{ width: "fit-content", p: 0 }}
                          onClick={closeMobileMenu}
                        >
                          {text}
                        </ListItemButton>
                      </Link>
                    </ListItem>
                  ))}
                </List>
                <Stack flex={1} pb={4} rowGap={2}>
                  <Typography variant={"caption"} fontSize={18}>
                    Connected as {account!.slice(0, 16)}...
                    <Tooltip title={account as string}>
                      <IconButton onClick={copyToClipboard}>
                        <ContentCopyIcon sx={{ fontSize: 12 }} />
                      </IconButton>
                    </Tooltip>
                  </Typography>
                  <Button
                    fullWidth
                    sx={{ p: 0, justifyContent: "flex-start", fontSize: 24 }}
                    onClick={disconnect}
                  >
                    Disconnect wallet
                  </Button>
                </Stack>
              </Stack>
            </Drawer>
            <IconButton onClick={toggleMobileMenu}>
              <MenuIcon />
            </IconButton>
          </Toolbar>
        )}
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
          anchorOrigin={
            mobile
              ? { vertical: "top", horizontal: "center" }
              : { vertical: "bottom", horizontal: "right" }
          }
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
