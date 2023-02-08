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

interface VillageProps {
  owner: PublicKey;
}

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

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    async (event) => {},
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
                      onClick={handleClick}
                      data-mint={building.mintAddress.toString()}
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
