import { Gem, Heart } from "@/components/icons";
import { Calendar } from "@/components/icons/archive";
import Layout, { LeftPanelProps } from "@/components/Layout";
import { useRouter } from "next/router";
import { Avatar } from "@/components/avatar/Avatar";
import { genAvatarFromAddress } from "@/components/avatar/avatars";
import { GameEntity, useGameEntity } from "@/dojo/entities/useGameEntity";
import { useDojo } from "@/dojo";
import BorderImage from "@/components/icons/BorderImage";
import { PlayerEntity, usePlayerEntity } from "@/dojo/entities/usePlayerEntity";
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

interface dojoEntitiesProps {
  playerEntity?: PlayerEntity;
  gameEntity?: GameEntity;
}

export default function Summary() {
  const router = useRouter();

  const gameId = router.query.gameId as string;
  const { account } = useDojo();
  const { player: playerEntity } = usePlayerEntity({
    gameId,
    address: account?.address,
  });
  const { game: gameEntity } = useGameEntity({
    gameId,
  });

  return (
    <Layout
      CustomLeftPanel={() => (
        <CustomLeftPanel
          title="Hustler Log"
          playerEntity={playerEntity}
          gameEntity={gameEntity}
        />
      )}
    >
      <PlayerRecap gameEntity={gameEntity} playerEntity={playerEntity} />
    </Layout>
  );
}

const CustomLeftPanel: React.FC<LeftPanelProps & dojoEntitiesProps> = ({
  title,
  prefixTitle,
  playerEntity,
  gameEntity,
  ...props
}) => {
  return (
    <VStack mt={[4, 50]} flex={["0", "1"]} {...props}>
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
      <PlayerStats playerEntity={playerEntity} gameEntity={gameEntity} />
    </VStack>
  );
};

const PlayerStats: React.FC<dojoEntitiesProps> = ({
  playerEntity,
  gameEntity,
}) => {
  if (!playerEntity || !gameEntity)
    return <Text my="auto">No account or game found.</Text>;

  const { account } = useDojo();
  const address: string = account?.address || "";

  return (
    <HStack my={["auto", "auto"]} mt={["10", "auto"]}>
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
        <GridItem p="2" colSpan={1} border="1px" borderColor="neon.700">
          <HStack>
            <Gem /> <Text>{formatCash(playerEntity.cash)}</Text>
          </HStack>
        </GridItem>
        <GridItem p="2" colSpan={1} border="1px" borderColor="neon.700">
          <HStack>
            <Calendar />{" "}
            <Text>
              Day {gameEntity.maxTurns - playerEntity.turnsRemaining + 1}
            </Text>
          </HStack>
        </GridItem>
        <GridItem p="2" colSpan={1} border="1px" borderColor="neon.700">
          <HStack>
            <Heart /> <Text>{playerEntity.health}</Text>
          </HStack>
        </GridItem>
      </Grid>
    </HStack>
  );
};

const PlayerRecap: React.FC<dojoEntitiesProps> = (playerEntity, gameEntity) => {
  if (!playerEntity || !gameEntity) return <></>;
  return (
    <>
      <VStack mt={[4, 20]} display={["none", "flex"]}>
        <VStack w="full" align="flex-start">
          <Text>Here we will have the recap for desktops!</Text>
        </VStack>
      </VStack>
      <VStack display={["flex", "none"]} p="10" paddingTop={"20"}>
        <Text>Here we will have the recap for mobiles!</Text>
      </VStack>
    </>
  );
};
