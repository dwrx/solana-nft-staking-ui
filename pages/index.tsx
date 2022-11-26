import { Box, Center, Spacer, Stack } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import NavBar from "../components/Navbar";
import Disconnected from "../components/Disconnected";
import Connected from "../components/Connected";
import { useWallet } from "@solana/wallet-adapter-react";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const { connected } = useWallet();

  return (
    <div className={styles.container}>
      <Head>
        <title>Vikings</title>
        <meta name="The NFT Collection for Vikings" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box w="full" h="calc(100vh)" backgroundPosition="center">
        <Stack w="full" h="calc(100vh)" justify="center">
          <NavBar />
          <Spacer />
          <Center>{connected ? <Connected /> : <Disconnected />}</Center>
          <Spacer />
          <Center>
            <Box marginBottom={4} color="white">
              <p>Farm, upgrade, win.</p>
            </Box>
          </Center>
        </Stack>
      </Box>
    </div>
  );
};

export default Home;
