import { Gem, Heart, Event } from "@/components/icons";
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
import { TradeDirection, usePlayerStore } from "@/hooks/state";
import colors from "@/theme/colors";
import { DayHistory } from "@/hooks/state";
import { getDrugByType, getLocationById, getOutcomeInfo } from "@/dojo/helpers";
import { Product } from "@/pages/[gameId]/turn";
import React from "react";
import {
  Box,
  Heading,
  Grid,
  GridItem,
  HStack,
  VStack,
  Card,
  Text,
  UnorderedList,
  Spacer,
  ListItem,
} from "@chakra-ui/react";

interface entitiesProps {
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
          title="Hustler Logs"
          playerEntity={playerEntity}
          gameEntity={gameEntity}
        />
      )}
    >
      <PlayerRecap gameEntity={gameEntity} playerEntity={playerEntity} />
    </Layout>
  );
}

const CustomLeftPanel: React.FC<LeftPanelProps & entitiesProps> = ({
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

const PlayerStats: React.FC<entitiesProps> = ({ playerEntity, gameEntity }) => {
  if (!playerEntity || !gameEntity)
    return (
      <Text my="auto" mt="300">
        No account/game found.
      </Text>
    );

  const { account } = useDojo();
  const address: string = account?.address || "";

  return (
    <HStack my={["auto", "auto"]} mt={["10", "100"]}>
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

const PlayerRecap: React.FC<entitiesProps> = ({ playerEntity, gameEntity }) => {
  if (!playerEntity || !gameEntity) return <></>;
  const { history } = usePlayerStore();

  return (
    <>
      <VStack
        w="full"
        mt={[4, 30]}
        display={["none", "flex"]}
        paddingRight={10}
      >
        {history.length > 0 ? (
          history.map((dayHistory, index) => (
            <React.Fragment key={index}>
              <PlayerDayRecap
                dayNb={index + 1}
                dayHistory={dayHistory}
                mt={10}
              />
            </React.Fragment>
          ))
        ) : (
          <Text>Who are you?</Text>
        )}
      </VStack>
      <VStack
        display={["flex", "none"]}
        paddingTop={"20"}
        w="full"
        paddingLeft={5}
        paddingRight={5}
      >
        {history.length > 0 ? (
          history.map((dayHistory, index) => (
            <React.Fragment key={index}>
              <PlayerDayRecap dayNb={index + 1} dayHistory={dayHistory} />
            </React.Fragment>
          ))
        ) : (
          <Text>Who are you?</Text>
        )}
      </VStack>
    </>
  );
};

const PlayerDayRecap = ({
  dayNb,
  dayHistory,
  ...props
}: {
  dayNb: number;
  dayHistory: DayHistory;
  [key: string]: any;
}) => {
  return (
    <VStack w="full" mb={["5", "0"]} align="left" {...props}>
      <Text
        textStyle="subheading"
        fontSize="12px"
        display="inline-block"
        color="neon.500"
        mb={-5}
      >
        {`Day ${dayNb} - ${getLocationById(dayHistory.locationId)?.slug}`}
      </Text>
      <Spacer />

      {dayHistory.items.length === 0 ? (
        <VStack align={"left"} paddingTop={5}>
          <Text>Nothing happened...!</Text>
        </VStack>
      ) : null}

      <UnorderedList w="full" fontSize={"md"} variant="underline">
        {dayHistory.items.map((item, index) => {
          if (item.type === "trade") {
            const drugInfo = getDrugByType(item.data.drug)!;
            const change =
              item.data.direction === TradeDirection.Buy ? "+" : "-";
            return (
              <ListItem key={`${item.data.drug}-${index}`}>
                <Product
                  icon={drugInfo.icon}
                  product={`${item.data.direction === 0 ? "Bought" : "Sold"} ${
                    drugInfo.name
                  }`}
                  quantity={item.data.quantity}
                  cost={`${change} ${formatCash(item.data.price)}`}
                />
              </ListItem>
            );
          } else if (item.type === "encounter") {
            const encounterInfo = getOutcomeInfo(
              item.data.status,
              item.data.outcome,
            );

            const event_name =
              item.data.status == 0
                ? encounterInfo.name
                : item.data.status == 1
                ? "Mugged"
                : "Arrested";

            return (
              <ListItem key={`encounter-${index}`}>
                <HStack>
                  <HStack flex="1">
                    <Event />
                    <Text>{event_name}</Text>
                  </HStack>
                  <Text flex="2" color="yellow" textAlign="right">
                    * {encounterInfo.description} *
                  </Text>
                </HStack>
              </ListItem>
            );
          }
          return null;
        })}
      </UnorderedList>
    </VStack>
  );
};
