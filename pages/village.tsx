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
import { PublicKey, Keypair, Transaction } from "@solana/web3.js";
import { Metaplex, walletAdapterIdentity, Nft } from "@metaplex-foundation/js";
import { useRouter } from "next/router";
import {
  TOKEN_PROGRAM_ID,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import { PROGRAM_ID as METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import {
  createInitializeStakeAccountInstruction,
  createStakingInstruction,
} from "../utils/instructions";

interface VillageProps {
  owner: PublicKey;
}

const PROGRAM_ID = new PublicKey("pHX6S9LXRMzM2CLzWc4pNytHUNNSKzBqvZG5ZADgJ7K");

const Village: NextPage<VillageProps> = ({ owner }) => {
  const [buildings, setBuildings] = useState<any>();
  const { connection } = useConnection();
  const walletAdapter = useWallet();

  const metaplex = useMemo(() => {
    return Metaplex.make(connection).use(walletAdapterIdentity(walletAdapter));
  }, [connection, walletAdapter]);

  useEffect(() => {
    console.log("View village of", owner);
    if (!owner) {
      return;
    }
    // metaplex
    //   .nfts()
    //   .findByMint({ mintAddress: new PublicKey(owner) })
    //   .then((nft) => {
    //     fetch(nft.uri)
    //       .then((res) => res.json())
    //       .then((metadata) => {
    //         setMetadata(metadata);
    //       });
    //   });
    let buildings: any = [];
    let images = [];
    metaplex
      .nfts()
      .findAllByOwner({ owner })
      .then((nfts) => {
        buildings = nfts;
        return Promise.all(
          nfts.map((item) =>
            fetch(item.uri)
              .then((response) => response.json())
              .then((data) => data.image)
              .catch((err) => {
                console.log(err);
                return null;
              })
          )
        );
      })
      .then((images) => {
        console.log(images);
        for (let i = 0; i < images.length; i++) {
          buildings[i].image = images[i];
        }

        buildings = buildings.filter(
          (item: any) =>
            item.creators &&
            item.creators[0]?.address.toBase58() ===
              "53utD4iVctxgVcU2eoA3NfzvDbZ2bmg3cagZfjP8grAe"
        );
        setBuildings(buildings);
      });
  }, [owner, metaplex, walletAdapter]);

  const checkStakingStatus = useCallback(
    async (nftTokenAccount: PublicKey) => {
      if (!walletAdapter.publicKey || !nftTokenAccount) {
        return;
      }
    },
    [walletAdapter.publicKey]
  );

  const handleStake: MouseEventHandler<HTMLButtonElement> = useCallback(
    async (nftMint) => {
      if (!walletAdapter.connected || !walletAdapter.publicKey) {
        alert("Please connect your wallet");
        console.log(walletAdapter);
        return;
      }
      console.log("NFT mint:", nftMint);
      const nft = await metaplex.nfts().findByMint({
        mintAddress: new PublicKey(nftMint),
      });
      const nftTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        Keypair.generate(),
        nft.address,
        walletAdapter.publicKey
      );
      console.log(nftTokenAccount);

      const initializeStakeInstruction =
        createInitializeStakeAccountInstruction(
          walletAdapter.publicKey,
          nftTokenAccount.address,
          PROGRAM_ID
        );

      const stakeInstruction = createStakingInstruction(
        walletAdapter.publicKey,
        nftTokenAccount.address,
        PROGRAM_ID,
        new PublicKey(nftMint),
        nft.edition.address,
        TOKEN_PROGRAM_ID,
        METADATA_PROGRAM_ID
      );

      const transaction = new Transaction()
        .add(initializeStakeInstruction)
        .add(stakeInstruction);

      try {
        const signature = await walletAdapter.sendTransaction(
          transaction,
          connection
        );
        console.log(signature);

        const latestBlockhash = await connection.getLatestBlockhash();

        await connection.confirmTransaction(
          {
            blockhash: latestBlockhash.blockhash,
            lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
            signature: signature,
          },
          "finalized"
        );
        await checkStakingStatus(nftTokenAccount.address);
      } catch (error) {
        console.log(error);
      }
    },
    []
  );

  return (
    <MainLayout>
      <VStack spacing={20}>
        <Container>
          <VStack spacing={8}>
            <p style={{ color: "#fff", width: "100%", textAlign: "center" }}>
              <span>
                This is village of <b>{owner.toString()}</b>
              </span>
            </p>
          </VStack>
          <VStack spacing={8}>
            {buildings &&
              buildings.map((building: any) => (
                <Box
                  key={building.mintAddress.toString()}
                  width="100%"
                  height="100%"
                  padding={4}
                  style={{
                    background: "#FFF",
                    borderRadius: "10px",
                  }}
                >
                  <HStack>
                    <Image
                      src={building.image}
                      alt="building"
                      width="100px"
                      height="100px"
                      style={{
                        borderRadius: "10px",
                      }}
                    />
                    <VStack>
                      <Text>{building.name}</Text>
                      <Text>
                        <p>Creators:</p>
                        {building.creators.map((creator: any) => (
                          <p key={creator.address} style={{ fontSize: "12px" }}>
                            {creator.address + `(verified ${creator.verified})`}
                          </p>
                        ))}
                      </Text>
                    </VStack>
                  </HStack>
                  <HStack>
                    <p>📦 60 WOOD</p>
                    <p>💰 1 WOOD / second</p>
                    <Spacer />
                    <Button
                      colorScheme="blue"
                      rightIcon={<ArrowForwardIcon />}
                      onClick={() => {
                        handleStake(building.mintAddress.toString());
                      }}
                    >
                      Farm wood
                    </Button>
                  </HStack>
                </Box>
              ))}
          </VStack>
        </Container>
      </VStack>
    </MainLayout>
  );
};

Village.getInitialProps = async ({ query }) => {
  const { owner } = query;
  if (!owner) throw { error: "No owner" };

  try {
    const ownerPubkey = new PublicKey(owner);
    return { owner: ownerPubkey };
  } catch {
    throw { error: "Invalid owner" };
  }
};

export default Village;
