import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import { useState } from "react";
import { wavePortalContract } from "src/lib/wavePortalContract";

export default WaveGalleryPage;

function WaveGalleryPage() {
  const [waves, setWaves] = useState(0);
  const [wavers, setWavers] = useState<null | string[]>(null);
  const [loading, setLoading] = useState(false);

  const getWaves = async () => {
    setLoading(true);
    try {
      if (wavePortalContract) {
        const waves = await wavePortalContract.getTotalWaves();
        const wavers = await wavePortalContract.getWavers();
        setWavers(wavers);
        setWaves(waves.toNumber());
      }
    } catch (error) {}
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
          <Typography>So far {waves} people waved at me</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {["№", "Address", "Total Waves", "Message"].map((cell) => (
                    <TableCell key={cell}>{cell}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {wavers?.map((waver, idx) => (
                  <TableRow key={waver}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{waver}</TableCell>
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
