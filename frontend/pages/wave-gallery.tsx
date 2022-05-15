/* eslint-disable react/no-unescaped-entities */
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { BigNumber } from "ethers";
import { useEffect } from "react";
import { useState } from "react";
import { wavePortalContract } from "src/lib/wavePortalContract";

export default WaveGalleryPage;

type WaverResponse = [string, string, BigNumber];
type Waver = {
  address: string;
  message: string;
  date: string;
};

function WaveGalleryPage() {
  const [waves, setWaves] = useState(0);
  const [wavers, setWavers] = useState<null | Waver[]>(null);
  const [loading, setLoading] = useState(false);

  const getWaves = async () => {
    setLoading(true);
    try {
      if (wavePortalContract) {
        const waves = await wavePortalContract.getTotalWaves();
        const wavers: WaverResponse[] = await wavePortalContract.getWavers();
        const transformedWavers: Waver[] = wavers
          .slice()
          .sort(([, , at], [, , bt]) => bt.toNumber() - at.toNumber())
          .map(([address, message, timestamp]) => {
            const txDate = new Date(timestamp.toNumber() * 1000);
            const today = new Date().toLocaleDateString();
            const date =
              txDate.toLocaleDateString() === today
                ? txDate.toLocaleTimeString()
                : txDate.toLocaleDateString();

            return {
              address,
              message,
              date,
            };
          });

        setWavers(transformedWavers);
        setWaves(waves.toNumber());
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getWaves().then(() => {
      setLoading(false);
    });
  }, []);
  return (
    <Stack justifyContent={"center"} alignItems={"center"} height={1} rowGap={4}>
      {loading ? (
        <CircularProgress size={200} />
      ) : (
        <>
          <Typography variant={"h1"}>Wave Gallery</Typography>
          <Typography>So far I've got {waves} waves</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {["Date", "Address", "Message"].map((cell) => (
                    <TableCell key={cell}>{cell}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {wavers?.map(({ address, message, date }, idx) => (
                  <TableRow key={address + message + date}>
                    <TableCell>{date}</TableCell>
                    <TableCell>
                      <Box
                        maxWidth={{ xs: 100, sm: 150, md: "unset" }}
                        sx={{ wordWrap: "break-word" }}
                      >
                        {address}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ width: 3 / 5 }}>{message}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Stack>
  );
}
