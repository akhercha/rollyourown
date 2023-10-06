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
    <Layout CustomLeftPanel={() => <CustomLeftPanel title="Huster Log" />}>
      <VStack my="auto" display={["none", "flex"]} gap="20px">
        <VStack w="full" align="flex-start">
          <Text>Here will be the recap ;)</Text>
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
    <HStack h="500">
      <Card
        p={4}
        paddingBottom={2}
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
      <Grid
        templateRows="repeat(3, 1fr)"
        position="relative"
        fontSize="lg"
        ml="5"
        p="6px"
        gap={5}
      >
        <GridItem>
          <HStack>
            <Gem /> <Text>{formatCash(playerEntity.cash)}</Text>
          </HStack>
        </GridItem>
        <GridItem>
          <HStack>
            <Calendar />{" "}
            <Text>
              Day {gameEntity.maxTurns - playerEntity.turnsRemaining + 1}
            </Text>
          </HStack>
        </GridItem>
        <GridItem>
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
