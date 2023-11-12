import { useEffect, useState } from "react";
import { Box, Text, VStack, HStack, Card, CardBody, CardHeader, CardFooter, SimpleGrid, Flex } from "@chakra-ui/react";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { Cart } from "@/components/icons";
import { Footer } from "@/components/Footer";
import { useLocationEntity } from "@/dojo/queries/useLocationEntity";
import { formatQuantity, formatCash } from "@/utils/ui";
import { Inventory } from "@/components/Inventory";
import { useDojoContext } from "@/dojo/hooks/useDojoContext";
import Button from "@/components/Button";
import { getDrugById, getLocationById, getLocationBySlug, sortDrugMarkets } from "@/dojo/helpers";

export default function Location() {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const locationId = getLocationBySlug(router.query.locationSlug as string)?.id;

  const { account, playerEntityStore } = useDojoContext();
  const { location: locationEntity } = useLocationEntity({
    gameId,
    locationId,
  });

  const { playerEntity } = playerEntityStore;

  const [isLastDay, setIsLastDay] = useState(false);

  useEffect(() => {
    if (playerEntity) {
      // check if player at right location
      if (locationId !== playerEntity.locationId) {
        router.replace(`/${gameId}/${getLocationById(playerEntity.locationId)?.slug}`);
        return;
      }

      setIsLastDay(playerEntity.maxTurns > 0 && playerEntity.turn >= playerEntity.maxTurns);
    }
  }, [locationId, playerEntity, playerEntity?.locationId, router, gameId]);

  if (!playerEntity || !locationEntity) {
    return <></>;
  }

  const prefixTitle = isLastDay
    ? "Final Day"
    : `Day ${playerEntity.turn} ${playerEntity.maxTurns === 0 ? "" : "/ " + playerEntity.maxTurns}`;

  return (
    <Layout
      leftPanelProps={{
        title: getLocationById(locationEntity.id)!.name,
        prefixTitle: prefixTitle,
        imageSrc: `/images/locations/${getLocationById(locationEntity.id)?.slug}.png`,
      }}
      footer={
        <Footer>
          <Button
            w={["full", "auto"]}
            px={["auto", "20px"]}
            onClick={() => {
              if (isLastDay) {
                router.push(`/${gameId}/end`);
              } else {
                router.push(`/${gameId}/travel`);
              }
            }}
          >
            {isLastDay ? "End Game" : "Continue"}
          </Button>
        </Footer>
      }
    >
      <Box w="full" zIndex="1" position="sticky" top="0" bg="neon.900" pb={"8px"}>
        <Inventory />
      </Box>

      <VStack w="full" align="flex-start" gap="10px" pl={0.5} pr={0.5}>
        <SimpleGrid columns={2} w="full" gap={["10px", "16px"]} fontSize={["16px", "20px"]}>
          {sortDrugMarkets(locationEntity.drugMarkets).map((drug, index) => {
            const drugInfo = getDrugById(drug.id)!;
            const canBuy = drug.price <= playerEntity.cash && playerEntity.drugCount < playerEntity.getTransport();
            const canSell = !!playerEntity.drugs.find((d) => d.id === drug.id && d.quantity > 0);
            return (
              <Button
                h={["auto", "180px"]}
                key={index}
                position="relative"
                p={0}
                isDisabled={!canBuy && !canSell}
                onClick={() => router.push(`${router.asPath}/${drugInfo.slug}`)}
              >
                <Card position="relative" border={0}>
                  <CardHeader
                    textTransform="uppercase"
                    fontSize={["16px", "20px"]}
                    textAlign="left"
                    padding={["6px 10px", "10px 20px"]}
                  >
                    {drugInfo.name}
                  </CardHeader>
                  <CardBody>
                    <HStack w="full" justify="center">
                      <Flex p="2px" align="center" boxSize="full" position="absolute"></Flex>
                      {drugInfo.icon({})}
                    </HStack>
                  </CardBody>

                  <CardFooter fontSize={["14px", "16px"]} flexDirection="column" padding={["0 10px", "10px 20px"]}>
                    <HStack justifyContent="space-between">
                      <Text>{formatCash(drug.price)}</Text>
                      <HStack>
                        <Cart mb="4px" />
                        <Text marginInlineStart="0 !important">{formatQuantity(drug.marketPool.quantity)}</Text>
                      </HStack>
                    </HStack>
                  </CardFooter>
                </Card>
              </Button>
            );
          })}
        </SimpleGrid>
      </VStack>
    </Layout>
  );
}
