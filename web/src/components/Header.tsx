import { Button, Divider, Flex, HStack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { IsMobile, generatePixelBorderPath } from "@/utils/ui";
import { useRouter } from "next/router";
import { initSoundStore } from "@/hooks/sound";
import HeaderButton from "@/components/HeaderButton";
import MediaPlayer from "@/components/MediaPlayer";
import MobileMenu from "@/components/MobileMenu";
import { useDojoContext } from "@/dojo/hooks/useDojoContext";
import { formatCash } from "@/utils/ui";
import { formatAddress } from "@/utils/contract";
import PixelatedBorderImage from "./icons/PixelatedBorderImage";
import colors from "@/theme/colors";
import { headerStyles, headerButtonStyles } from "@/theme/styles";
import { ProfileLink } from "./ProfileButton";
import CashIndicator from "./player/CashIndicator";
import HealthIndicator from "./player/HealthIndicator";
import WantedIndicator from "./player/WantedIndicator";

export interface HeaderProps {
  back?: boolean;
}

const Header = ({ back }: HeaderProps) => {
  const router = useRouter();
  const { gameId } = router.query as { gameId: string };
  const [inventory, setInventory] = useState(0);
  const {
    playerEntityStore,
    account,
    burner: { create: createBurner, isDeploying: isBurnerDeploying },
  } = useDojoContext();

  const { playerEntity } = playerEntityStore;

  const isMobile = IsMobile();

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
    <HStack w="full" px="10px" spacing="10px" zIndex="overlay" align="flex-start" py={["0", "20px"]}>
      <HStack flex="1" justify={["left", "right"]}></HStack>
      {playerEntity && playerEntity.health > 0 && (
        <HStack flex="1" justify="center">
          <HStack h="48px" w="auto" px="20px" spacing={["10px", "30px"]} bg="neon.700" sx={{ ...headerStyles }}>
            <Flex w="full" align="center" justify="center" gap="10px">
              <HStack>
                <CashIndicator cash={playerEntity.cash} />
                <Divider orientation="vertical" borderColor="neon.600" h="12px" />
                <HealthIndicator health={playerEntity.health} maxHealth={100} />
                <Divider orientation="vertical" borderColor="neon.600" h="12px" />
                <WantedIndicator wanted={playerEntity.wanted} />
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

        {/* {!account && (
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
            Create Burner
          </Button>
        )} */}

        {!isMobile && account && playerEntity && <ProfileLink />}
        {isMobile && <MobileMenu />}
      </HStack>
    </HStack>
  );
};

export default Header;
