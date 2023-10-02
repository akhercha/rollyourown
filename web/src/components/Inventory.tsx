import {
  Divider,
  HStack,
  StyleProps,
  Text,
  VStack,
  Card,
  Spacer,
} from "@chakra-ui/react";

import BorderImage from "@/components/icons/BorderImage";
import colors from "@/theme/colors";

import React from "react";
import { usePlayerEntity } from "@/dojo/entities/usePlayerEntity";
import { useRouter } from "next/router";
import { useDojo } from "@/dojo";
import { getDrugById } from "@/dojo/helpers";
import { Bag } from "./icons";

export const Inventory = ({ ...props }: StyleProps) => {
  const router = useRouter();
  const { gameId } = router.query as { gameId: string };
  const { account } = useDojo();
  const { player: playerEntity, isFetched: isFetchedPlayer } = usePlayerEntity({
    gameId,
    address: account?.address,
  });

  return (
    <VStack {...props} w="full" align="flex-start" pb="5px">
      <HStack w="full" justify="space-between">
        <Text
          textStyle="subheading"
          fontSize="10px"
          display={["none", "flex"]}
          color="neon.500"
        >
          Your Inventory
        </Text>
        <Spacer />
        <HStack display={["none", "flex"]} color="yellow.400">
          <Bag />
          <Text>
            {playerEntity?.drugCount}/{playerEntity?.bagLimit}
          </Text>
        </HStack>
      </HStack>
      <Card
        w="full"
        h="40px"
        px="20px"
        justify="center"
        sx={{
          borderImageSource: `url("data:image/svg+xml,${BorderImage({
            color: colors.neon["700"].toString(),
          })}")`,
          overflowY: "scroll",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <HStack gap="5px" justify="center">
          {playerEntity?.drugCount === 0 ? (
            <Text color="neon.500">Your bag is empty</Text>
          ) : (
            playerEntity?.drugs.map((drug) => {
              return (
                drug.quantity > 0 && (
                  <>
                    <HStack gap="10px">
                      <HStack color="yellow.400">
                        {getDrugById(drug.id)?.icon({ boxSize: "26" })}
                        <Text>{drug.quantity}</Text>
                      </HStack>
                    </HStack>
                    <Divider
                      _last={{ display: "none" }}
                      h="10px"
                      orientation="vertical"
                      borderWidth="1px"
                      borderColor="neon.600"
                    />
                  </>
                )
              );
            })
          )}
        </HStack>
      </Card>
    </VStack>
  );
};
