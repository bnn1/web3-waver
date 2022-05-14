import Typography from "@mui/material/Typography";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { Main } from "../Main";
import type { MetaMaskInpageProvider } from "@metamask/providers";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import { Maybe } from "@metamask/providers/dist/utils";

export { AuthProvider, useAuthContext };

const AuthContext = createContext<{
  account: string | undefined;
  connect: () => Promise<void | null>;
  isPending: boolean;
} | null>(null);

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [getMetamask, setGetMetamask] = useState(false);
  const [account, setAccount] = useState<string>();
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkMetamask = () => {
    const { ethereum } = window;
    if (ethereum) {
      setGetMetamask(false);
      return true;
    }
    setGetMetamask(true);
    return false;
  };
  const updateAccount = useCallback(
    (accounts: Maybe<string[]>) => {
      if (accounts && accounts[0] !== account) {
        setAccount(accounts[0]);
      }
    },
    [account]
  );
  const checkConnectedWallets = useCallback(async () => {
    setLoading(true);
    if (checkMetamask()) {
      const { ethereum } = window;

      try {
        const accounts = await ethereum.request<string[]>({ method: "eth_accounts" });
        updateAccount(accounts);
      } catch (error) {}
    }
  }, [updateAccount]);
  const connect = async () => {
    if (checkMetamask()) {
      setPending(true);
      const { ethereum } = window;

      try {
        const accounts = await ethereum.request<[string]>({ method: "eth_requestAccounts" });
        updateAccount(accounts);
      } catch (error) {}
    }
  };

  useEffect(() => {
    checkConnectedWallets().finally(() => {
      setLoading(false);
    });
  }, [checkConnectedWallets]);

  useEffect(() => {
    if (account) {
      setPending(false);
      const cb = (accounts: unknown) => {
        setAccount(undefined);
      };
      window.ethereum.on("accountsChanged", cb);

      return () => {
        window.ethereum.removeListener("accountsChanged", cb);
      };
    }
  }, [account]);

  if (getMetamask) {
    return (
      <Main alignItems={"center"} justifyContent={"center"}>
        <Stack alignItems={"center"} component={"header"}>
          <Typography fontSize={"6rem"} lineHeight={"normal"}>
            😰
          </Typography>
          <Typography variant={"h1"} textAlign={"center"}>
            Metamask not found!
          </Typography>
        </Stack>
        <Typography
          maxWidth={900}
          fontSize={{ xs: "1.25rem", sm: "1.5rem", md: "2rem", lg: "2.5rem", xl: "3rem" }}
          textAlign={"center"}
        >
          To use this App install{" "}
          <Typography fontSize={"inherit"} variant={"caption"}>
            Metamask 🦊
          </Typography>{" "}
          extension for your browser.
        </Typography>
      </Main>
    );
  }

  if (loading) {
    return <CircularProgress size={200} />;
  }

  return (
    <AuthContext.Provider
      value={{
        account,
        connect,
        isPending: pending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuthContext = () => {
  const state = useContext(AuthContext);

  if (state === null) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }

  return state;
};
