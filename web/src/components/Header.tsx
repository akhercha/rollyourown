import { Clock, Gem, Bag, Arrow, Heart, Siren } from "./icons";
import { Divider, Flex, HStack, Text } from "@chakra-ui/react";
import Button from "@/components/Button";
import { useEffect, useState } from "react";
import { IsMobile, generatePixelBorderPath } from "@/utils/ui";
import { useRouter } from "next/router";
import { initSoundStore } from "@/hooks/sound";
import MediaPlayer from "@/components/MediaPlayer";
import MobileMenu from "@/components/MobileMenu";
import { usePlayerEntity } from "@/dojo/entities/usePlayerEntity";
import { useGameEntity } from "@/dojo/entities/useGameEntity";
import { formatCash } from "@/utils/ui";
import { useDojo } from "@/dojo";
import { formatAddress } from "@/utils/contract";
import { headerButtonStyles, headerStyles } from "@/theme/styles";

// TODO: constrain this on contract side
const MAX_INVENTORY = 100;

export interface HeaderProps {
  back?: boolean;
}

const Header = ({ back }: HeaderProps) => {
  const isMobile = IsMobile();
  const router = useRouter();
  const isAtSummary = router.pathname === "/[gameId]/recap";
  const { gameId } = router.query as { gameId: string };
  const [inventory, setInventory] = useState(0);
  const { account, createBurner, isBurnerDeploying } = useDojo();

  const { player: playerEntity } = usePlayerEntity({
    gameId,
    address: account?.address,
  });
  const { game: gameEntity } = useGameEntity({
    gameId,
  });

  useEffect(() => {
    const init = async () => {
      await initSoundStore();
    };
    init();
  }, []);

  useEffect(() => {
    if (!playerEntity) return;

    const inventory = playerEntity.drugs.reduce((acc, drug) => {
      return acc + drug.quantity;
    }, 0);

    setInventory(inventory);
  }, [playerEntity]);

  return (
    <HStack
      w="full"
      px="10px"
      spacing="10px"
      zIndex="overlay"
      align="flex-start"
      py={["0", "20px"]}
    >
      <HStack flex="1" justify={["left", "right"]}></HStack>
      {playerEntity && gameEntity && (
        <HStack flex="1" justify="center">
          {isAtSummary && (
            <Button
              h="48px"
              w="12"
              sx={headerButtonStyles}
              onClick={router.back}
            >
              <Arrow size="lg" direction="left" />
            </Button>
          )}
          <HStack
            h="48px"
            w="auto"
            px="20px"
            spacing={["10px", "30px"]}
            bg="neon.700"
            onClick={() => {
              isAtSummary ? undefined : router.push(`/${gameId}/recap`);
            }}
            sx={isAtSummary ? { ...headerStyles } : { ...headerButtonStyles }}
            as={isAtSummary ? HStack : Button}
          >
            <Flex w="full" align="center" justify="center" gap="10px">
              <HStack>
                <Gem /> <Text>{formatCash(playerEntity.cash)}</Text>
              </HStack>
              <HStack>
                <Divider
                  orientation="vertical"
                  h="12px"
                  borderColor="neon.600"
                />
                <HStack>
                  <Heart /> <Text>{playerEntity.health}</Text>
                </HStack>
                {/* <Divider
                  orientation="vertical"
                  borderColor="neon.600"
                  h="12px"
                />
                  <HStack color="red" >
                  <Siren /> <Text>69%</Text>
                </HStack> */}
              </HStack>
            </Flex>
          </HStack>
        </HStack>
      )}

      <HStack flex="1" justify="right">
        {!isMobile && (
          <>
            <MediaPlayer />
          </>
        )}

        {(!isMobile || (!account && isMobile)) && (
          <Button
            h="48px"
            sx={headerButtonStyles}
            isLoading={isBurnerDeploying}
            onClick={() => {
              if (!account) {
                createBurner();
              }
            }}
          >
            {account
              ? formatAddress(account.address.toUpperCase())
              : "Create Burner"}
          </Button>
        )}
        {isMobile && <MobileMenu />}
      </HStack>
    </HStack>
  );
};

export default Header;
