import { FC } from "react";
import {
  Button,
  Container,
  Heading,
  HStack,
  Text,
  VStack,
  Image,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";

const Connected: FC = () => {
  return (
    <VStack spacing={20}>
      <Container>
        <VStack spacing={8}>
          <Heading
            color="white"
            as="h1"
            size="2xl"
            noOfLines={1}
            textAlign="center"
          >
            Welcome Viking.
          </Heading>

          <Text color="bodyText" fontSize="xl" textAlign="center">
            Each viking is randomly generated and can be staked to receive
            <Text as="b"> resources</Text>. Use your{" "}
            <Text as="b">resources</Text> to upgrade your viking and receive
            additional perks!
          </Text>
        </VStack>
      </Container>

      <HStack className="img-previews" spacing={10}>
        <Image src="preview.gif" alt="" />
      </HStack>

      <Button bgColor="accent" color="white" maxW="380px">
        <HStack>
          <Text>mint viking</Text>
          <ArrowForwardIcon />
        </HStack>
      </Button>
    </VStack>
  );
};

export default Connected;
