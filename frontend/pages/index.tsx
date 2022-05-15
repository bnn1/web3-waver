/* eslint-disable react/no-unescaped-entities */
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useRef, useState } from "react";
import { wavePortalContract } from "src/lib/wavePortalContract";
import { useAuthContext } from "../src/layout/Auth";

export default HomePage;

function HomePage() {
  const { account, connect, isPending } = useAuthContext();
  const [sendingWave, setSendingWave] = useState(false);
  const [error, setError] = useState("");
  const [winner, setWinner] = useState("");
  const [mining, setMining] = useState<boolean>();
  const wave = async () => {
    if (wavePortalContract && textFieldRef.current) {
      setSendingWave(true);
      try {
        const txn = await wavePortalContract.wave(textFieldRef.current.value, {
          gasLimit: 300000,
        });
        textFieldRef.current.value = "";
        setSendingWave(false);
        setMining(true);
        await txn.wait();
        setMining(false);
      } catch (error) {
        setError("Wait 15m");
      }
    }
  };

  useEffect(() => {
    if (wavePortalContract) {
      const onWin = (winner: string) => {
        setWinner(winner);
      };
      wavePortalContract.on("WinPrize", onWin);
      return () => {
        wavePortalContract?.removeListener("WinPrize", onWin);
      };
    }
  }, []);

  useEffect(() => {
    if (mining === false) {
      const timerId = setTimeout(() => {
        setMining(undefined);
      }, 6000);
      return () => {
        clearInterval(timerId);
      };
    }
  }, [mining]);

  const textFieldRef = useRef<HTMLTextAreaElement>(null);

  return (
    <Stack justifyContent={"center"} alignItems={"center"} height={1}>
      <Dialog open={winner === account} onClose={() => setWinner("")}>
        <DialogTitle>Congrats! 🎉</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You just won... *ta-da-da-da*
            <Typography>0.001 ether!!!</Typography>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Snackbar
        open={mining}
        autoHideDuration={6000}
        onClose={() => setMining(undefined)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setMining(undefined)}
          severity={"info"}
          sx={{ width: "100%" }}
          variant={"filled"}
        >
          Mining transaction... Please wait
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setError("")}
          severity={"error"}
          sx={{ width: "100%" }}
          variant={"filled"}
        >
          {error}
        </Alert>
      </Snackbar>
      <Snackbar
        open={mining === false}
        autoHideDuration={6000}
        onClose={() => setMining(undefined)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setMining(undefined)}
          severity={"success"}
          sx={{ width: "100%" }}
          variant={"filled"}
        >
          Mined!
        </Alert>
      </Snackbar>
      {account && (
        <Stack justifyContent={"center"} alignItems={"center"} rowGap={4}>
          <Stack direction={"row"} alignItems={"center"}>
            <Typography fontSize={"4rem"}>👋</Typography>
            <Typography fontSize={"4rem"}>Welcome</Typography>
          </Stack>
          <TextField
            multiline
            rows={4}
            label={"Leave me a message. It will be publicly available"}
            variant={"outlined"}
            inputRef={textFieldRef}
            InputLabelProps={{ shrink: true }}
            placeholder={"Dang! This app is awesome! Dang! How did you make it?"}
            fullWidth
          />
          <Button
            variant={"contained"}
            sx={{ fontSize: "2rem" }}
            disabled={sendingWave}
            onClick={wave}
          >
            Wave at me
          </Button>
        </Stack>
      )}
      {!account && (
        <>
          <Typography
            variant={"h1"}
            sx={{
              color: "transparent",
              background: "linear-gradient(180deg, #54fc12, #90caf9, #54fc12)",
              textShadow: "1px 1px 12px #90caf9",
              backgroundClip: "text",
            }}
          >
            Wave Portal
          </Typography>
          <Button
            variant={"contained"}
            onClick={connect}
            sx={{ fontSize: "2rem" }}
            disabled={isPending}
          >
            {isPending ? "Connecting..." : "Connect Wallet 🦊"}
          </Button>
          <Typography variant={"caption"} mt={2}>
            Goerli network
          </Typography>
        </>
      )}
    </Stack>
  );
}
