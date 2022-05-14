import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useAuthContext } from "../src/layout/Auth";

export default HomePage;

function HomePage() {
  const { account, connect, isPending } = useAuthContext();

  return (
    <Stack justifyContent={"center"} alignItems={"center"} height={1} rowGap={4}>
      {account && (
        <Stack component={"header"}>
          <Typography fontSize={"4rem"}>
            🎉 You are connected!{" "}
            <Typography
              fontSize={"4rem"}
              display={"inline-block"}
              sx={{ transform: "scale(-1,1)" }}
              component={"span"}
            >
              🎉
            </Typography>
          </Typography>
          <Typography>You can now start sending me waves</Typography>
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
          <Button variant={"contained"} onClick={connect} sx={{ fontSize: "2rem" }}>
            Connect Wallet
          </Button>
        </>
      )}
    </Stack>
  );
}
