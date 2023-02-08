import {
  Button,
  Container,
  Heading,
  VStack,
  Text,
  HStack,
  Image,
} from "@chakra-ui/react";
import {
  FC,
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { PublicKey } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Metaplex,
  walletAdapterIdentity,
  CandyMachineV2,
} from "@metaplex-foundation/js";
import { useRouter } from "next/router";

const Connected: FC = () => {
  const { connection } = useConnection();
  const walletAdapter = useWallet();
  const [candyMachine, setCandyMachine] = useState<CandyMachineV2>();
  const [isMinting, setIsMinting] = useState(false);

  const metaplex = useMemo(() => {
    return Metaplex.make(connection).use(walletAdapterIdentity(walletAdapter));
  }, [connection, walletAdapter]);

  useEffect(() => {
    if (!metaplex) return;

    metaplex
      .candyMachinesV2()
      .findByAddress({
        address: new PublicKey(
          process.env.NEXT_PUBLIC_CANDY_MACHINE_ADDRESS ||
            "AGXjs6J6UpjuBPx22pSaZuQA5q3pdFMyDL5zDiHWHLs6"
        ),
      })
      //.run()
      .then((candyMachine) => {
        console.log(candyMachine);
        setCandyMachine(candyMachine);
      })
      .catch((error) => {
        alert(error);
      });
  }, [metaplex]);

  const router = useRouter();
  const handleMintClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    async (event) => {
      if (event.defaultPrevented) return;
      if (!walletAdapter.connected || !candyMachine) return;

      try {
        setIsMinting(true);
        const nft = await metaplex.candyMachinesV2().mint({ candyMachine });

        console.log(nft);
        router.push(`/newMint?mint=${nft.nft.address.toBase58()}`);
      } catch (error) {
        alert(error);
      } finally {
        setIsMinting(false);
      }
    },
    [metaplex, walletAdapter, candyMachine]
  );

  return (
    <VStack spacing={20}>
      <Container>
        <VStack spacing={8}>
          {/* <Heading
            color="white"
            as="h1"
            size="2xl"
            noOfLines={1}
            textAlign="center"
          >
            Welcome.
          </Heading> */}

          <Text color="bodyText" fontSize="xl" textAlign="center">
            Purchase land and earn resources to build your own kingdom.
          </Text>
        </VStack>
      </Container>

      <Button
        bgColor="accent"
        color="white"
        maxW="380px"
        onClick={handleMintClick}
      >
        <HStack>
          <Text>Mint</Text>
        </HStack>
      </Button>
    </VStack>
  );
};

export default Connected;
