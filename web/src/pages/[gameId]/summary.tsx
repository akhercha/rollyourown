import { Gem, Heart } from "@/components/icons";
import { Calendar } from "@/components/icons/archive";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { Avatar } from "@/components/avatar/Avatar";
import { genAvatarFromAddress } from "@/components/avatar/avatars";
import { useGameEntity } from "@/dojo/entities/useGameEntity";
import { useDojo } from "@/dojo";
import BorderImage from "@/components/icons/BorderImage";
import { usePlayerEntity } from "@/dojo/entities/usePlayerEntity";
import { formatCash } from "@/utils/ui";
import colors from "@/theme/colors";

import { Grid, GridItem, HStack, VStack, Card, Text } from "@chakra-ui/react";
import { ReactNode } from "react";

interface CustomLeftPanelProps {
  avatar: ReactNode;
}

const CustomLeftPanel: React.FC<CustomLeftPanelProps> = ({ avatar }) => {
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

  return (
    <>
      {playerEntity && gameEntity && (
        <VStack align="start">
          <HStack align="center" h="full" spacing={4}>
            <Card
              position="relative"
              p={4}
              paddingBottom={2}
              sx={{
                borderImageSource: `url("data:image/svg+xml,${BorderImage({
                  color: colors.neon["700"].toString(),
                })}")`,
              }}
            >
              {avatar}
            </Card>
            <Grid templateRows="repeat(3, 1fr)" position="relative">
              <GridItem p="6px" borderColor="neon.700">
                <HStack>
                  <Gem /> <Text>{formatCash(playerEntity.cash)}</Text>
                </HStack>
              </GridItem>
              <GridItem p="6px" borderColor="neon.700">
                <HStack>
                  <Calendar />{" "}
                  <Text>
                    Day {gameEntity.maxTurns - playerEntity.turnsRemaining + 1}
                  </Text>
                </HStack>
              </GridItem>
              <GridItem p="6px" borderColor="neon.700">
                <HStack>
                  <Heart /> <Text>{playerEntity.health}</Text>
                </HStack>
              </GridItem>
            </Grid>
          </HStack>
        </VStack>
      )}
    </>
  );
};

export default function Summary() {
  const router = useRouter();

  const gameId = router.query.gameId as string;
  const { account } = useDojo();
  const { player: playerEntity } = usePlayerEntity({
    gameId,
    address: account?.address,
  });

  const address = account?.address || "";

  const avatar = (
    <Avatar
      w="150px"
      h="150px"
      name={genAvatarFromAddress(address)}
      color="green"
    />
  );

  return (
    <Layout
      leftPanelProps={{
        title: "Hustler Log",
      }}
      CustomLeftPanel={() => <CustomLeftPanel avatar={avatar} />}
    >
      <VStack my="auto" display={["none", "flex"]} gap="20px">
        <VStack w="full" align="flex-start">
          <Text>Here will be the recap ;)</Text>
        </VStack>
      </VStack>
    </Layout>
  );
}
