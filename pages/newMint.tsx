import type { NextPage } from "next";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import MainLayout from "../components/MainLayout";
import styles from "../styles/Home.module.css";
import {
  Container,
  Heading,
  VStack,
  Text,
  Image,
  Button,
  HStack,
  Spacer,
  Box,
} from "@chakra-ui/react";
import {
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { PublicKey } from "@solana/web3.js";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { useRouter } from "next/router";

interface NewMintProps {
  mint: PublicKey;
}

const NewMint: NextPage<NewMintProps> = ({ mint }) => {
  const [metadata, setMetadata] = useState<any>();
  const { connection } = useConnection();
  const walletAdapter = useWallet();
  const metaplex = useMemo(() => {
    return Metaplex.make(connection).use(walletAdapterIdentity(walletAdapter));
  }, [connection, walletAdapter]);

  useEffect(() => {
    console.log("mint", mint);
    if (!mint) {
      return;
    }
    metaplex
      .nfts()
      .findByMint({ mintAddress: new PublicKey(mint) })
      .then((nft) => {
        fetch(nft.uri)
          .then((res) => res.json())
          .then((metadata) => {
            setMetadata(metadata);
          });
      });
  }, [mint, metaplex, walletAdapter]);

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    async (event) => {},
    []
  );

  return (
    <MainLayout>
      <VStack spacing={20}>
        <Container>
          <VStack spacing={8}>
            <Heading color="white" as="h1" size="2xl" textAlign="center">
              Mint is successful!
            </Heading>

            <Text color="bodyText" fontSize="xl" textAlign="center">
              Congratulations, you minted a new building! <br />
              Time to stake it to earn resources and level up.
            </Text>
          </VStack>
        </Container>

        <Image
          src={metadata?.image ?? ""}
          className={styles.imagePreview}
          alt=""
          width="256"
        />

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
            Go to Village
          </a>
        )}
      </VStack>
    </MainLayout>
  );
};

NewMint.getInitialProps = async ({ query }) => {
  const { mint } = query;
  if (!mint) throw { error: "No mint" };

  try {
    const mintPubkey = new PublicKey(mint);
    return { mint: mintPubkey };
  } catch {
    throw { error: "Invalid mint" };
  }
};

export default NewMint;
