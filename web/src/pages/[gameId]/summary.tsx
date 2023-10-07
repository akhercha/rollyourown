import { Gem, Heart } from "@/components/icons";
import { Calendar } from "@/components/icons/archive";
import Layout, { LeftPanelProps } from "@/components/Layout";
import { useRouter } from "next/router";
import { Avatar } from "@/components/avatar/Avatar";
import { genAvatarFromAddress } from "@/components/avatar/avatars";
import { useGameEntity } from "@/dojo/entities/useGameEntity";
import { useDojo } from "@/dojo";
import BorderImage from "@/components/icons/BorderImage";
import { usePlayerEntity } from "@/dojo/entities/usePlayerEntity";
import { formatCash } from "@/utils/ui";
import colors from "@/theme/colors";

import {
  Box,
  Heading,
  Grid,
  GridItem,
  HStack,
  VStack,
  Card,
  Text,
} from "@chakra-ui/react";

export default function Summary() {
  return (
    <Layout CustomLeftPanel={() => <CustomLeftPanel title="Hustler Log" />}>
      <VStack my="auto" display={["none", "flex"]} gap="20px">
        <VStack w="full" align="flex-start">
          <Text>Here we will have the recap!</Text>
        </VStack>
      </VStack>
    </Layout>
  );
}

const CustomLeftPanel: React.FC<LeftPanelProps> = ({
  title,
  prefixTitle,
  ...props
}) => {
  const router = useRouter();
  const { account } = useDojo();
  const gameId = router.query.gameId as string;

  const { player: playerEntity } = usePlayerEntity({
    gameId,
    address: account?.address,
  });
  return (
    <VStack flex={["0", "1"]} my={["none", "auto"]} {...props}>
      <VStack
        zIndex="1"
        position={playerEntity ? "relative" : "absolute"}
        pointerEvents="none"
        align="center"
      >
        <Text textStyle="subheading" fontSize="11px">
          {prefixTitle}
        </Text>
        <Heading fontSize={["40px", "48px"]} fontWeight="normal">
          {title}
        </Heading>
      </VStack>
      <PlayerStats />
    </VStack>
  );
};

const PlayerStats = () => {
  const router = useRouter();
  const { account } = useDojo();
  const gameId = router.query.gameId as string;
  const { game: gameEntity } = useGameEntity({
    gameId,
  });
  const { player: playerEntity } = usePlayerEntity({
    gameId,
    address: account?.address,
  });
  const address = account?.address || "";
  return playerEntity && gameEntity ? (
    <HStack h="lg">
      <Card
        p={4}
        paddingBottom={2}
        paddingRight={12}
        w="full"
        sx={{
          borderImageSource: `url("data:image/svg+xml,${BorderImage({
            color: colors.neon["700"].toString(),
          })}")`,
        }}
      >
        <Avatar
          w="150px"
          h="150px"
          name={genAvatarFromAddress(address)}
          color="green"
        />
      </Card>
      <Grid position="relative" fontSize="lg" ml="5" w="full">
        <Box
          position="absolute"
          boxSize="full"
          border="2px"
          borderColor="neon.900"
        />
        <GridItem p="6px" colSpan={1} border="1px" borderColor="neon.700">
          <HStack>
            <Gem /> <Text>{formatCash(playerEntity.cash)}</Text>
          </HStack>
        </GridItem>
        <GridItem p="6px" colSpan={1} border="1px" borderColor="neon.700">
          <HStack>
            <Calendar />{" "}
            <Text>
              Day {gameEntity.maxTurns - playerEntity.turnsRemaining + 1}
            </Text>
          </HStack>
        </GridItem>
        <GridItem p="6px" colSpan={1} border="1px" borderColor="neon.700">
          <HStack>
            <Heart /> <Text>{playerEntity.health}</Text>
          </HStack>
        </GridItem>
      </Grid>
    </HStack>
  ) : (
    <></>
  );
};
