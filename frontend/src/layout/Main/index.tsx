import { SxProps } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Image from "next/image";
import { ReactNode } from "react";
import PortalImage from "./assets/portal.webp";
export { Main };

const Main = ({ children, ...rest }: { children: ReactNode } & SxProps) => {
  return (
    <Container maxWidth={false} sx={{ height: "calc(100% - 72px)", display: 'flex',flexDirection:'column', ...rest }}>
      {children}
    </Container>
  );
};
