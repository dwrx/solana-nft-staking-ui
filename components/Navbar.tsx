import { HStack, Spacer, Text, Button } from "@chakra-ui/react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { FC } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import styles from "../styles/Home.module.css";

const NavBar: FC = () => {
  const walletAdapter = useWallet();

  return (
    <HStack width="full" padding={4} style={{ position: "fixed", top: 0 }}>
      <Spacer />
      {walletAdapter.publicKey && (
        <a
          href={`village?owner=` + walletAdapter.publicKey.toBase58()}
          style={{
            background: "transparent",
            border: "2px solid #fff",
            color: "#fff",
            padding: "8px 20px",
            borderRadius: "7px",
          }}
        >
          Village
        </a>
      )}
      <WalletMultiButton className={styles["wallet-adapter-button-trigger"]} />
    </HStack>
  );
};

export default NavBar;
