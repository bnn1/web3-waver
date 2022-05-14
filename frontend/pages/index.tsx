import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { wavePortalContract } from "src/lib/wavePortalContract";
import { useAuthContext } from "../src/layout/Auth";

export default HomePage;

function HomePage() {
  const { account, connect, isPending } = useAuthContext();
  const [sendingWave, setSendingWave] = useState(false);
  const wave = async () => {
    if (wavePortalContract) {
      setSendingWave(true);
      const txn = await wavePortalContract.wave();
      await txn.wait();
    }
  };

  return (
    <Stack justifyContent={"center"} alignItems={"center"} height={1} rowGap={4}>
      {account && (
        <>
          <Stack direction={"row"} alignItems={"center"}>
            <Typography fontSize={"4rem"}>👋</Typography>
            <Stack component={"header"} justifyContent={"center"} alignItems={"center"}>
              <Typography fontSize={"4rem"}>Welcome</Typography>
              <Typography>You can now start sending me waves</Typography>
            </Stack>
          </Stack>
          <Button
            variant={"contained"}
            sx={{ fontSize: "2rem" }}
            disabled={sendingWave}
            onClick={wave}
          >
            Wave at me
          </Button>
        </>
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
            sx={{ fontSize: "2rem", mb: 10 }}
            disabled={isPending}
          >
            {isPending ? "Connecting..." : "Connect Wallet 🦊"}
          </Button>
        </>
      )}
    </Stack>
  );
}
