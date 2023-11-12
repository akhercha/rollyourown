import { useCallback, useEffect, useState } from "react";
import { Box, Text, VStack, HStack, Card, Button, Flex, Image, Divider } from "@chakra-ui/react";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { Alert, ArrowEnclosed, Cart, Bag, SliderThumb as CustomThumb } from "@/components/icons";
import { Footer } from "@/components/Footer";
import { Slider, SliderTrack, SliderFilledTrack, SliderThumb } from "@chakra-ui/react";
import { Sounds, playSound } from "@/hooks/sound";
import { TradeDirection, TradeType } from "@/hooks/state";
import AlertMessage from "@/components/AlertMessage";
import { useLocationEntity } from "@/dojo/queries/useLocationEntity";
import { PlayerEntity } from "@/dojo/queries/usePlayerEntity";
import { formatQuantity, formatCash } from "@/utils/ui";
import { useSystems } from "@/dojo/hooks/useSystems";
import { calculateMaxQuantity, calculateSlippage } from "@/utils/market";
import { useToast } from "@/hooks/toast";
import { getDrugBySlug, getLocationBySlug } from "@/dojo/helpers";
import { DrugInfo, DrugMarket } from "@/dojo/types";
import { useDojoContext } from "@/dojo/hooks/useDojoContext";

export default function Market() {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const location = getLocationBySlug(router.query.locationSlug as string);
  const drug = getDrugBySlug(router.query.drugSlug as string);

  const [market, setMarket] = useState<DrugMarket>();
  const [quantity, setQuantity] = useState(0);
  const [canSell, setCanSell] = useState(false);
  const [canBuy, setCanBuy] = useState(false);

  const { account, playerEntityStore } = useDojoContext();
  const { buy, sell, isPending } = useSystems();

  const { playerEntity } = playerEntityStore;

  const { location: locationEntity } = useLocationEntity({
    gameId,
    locationId: location?.id,
  });

  const { toast } = useToast();

  // market price and quantity can fluctuate as players trade
  useEffect(() => {
    if (!locationEntity || !playerEntity || isPending) return;

    const market = locationEntity.drugMarkets.find((d) => d.id === drug?.id);
    if (!market) return;

    const playerDrug = playerEntity.drugs.find((d) => d.id === drug?.id);
    if (playerDrug) {
      setCanSell(playerDrug.quantity > 0);
    }

    setCanBuy(playerEntity.cash > market.price);
    setMarket(market);
  }, [locationEntity, playerEntity, drug, isPending]);

  const onTrade = useCallback(async () => {
    playSound(Sounds.Trade);

    router.push(`/${gameId}/${location!.slug}`);

    let toastMessage = "",
      hash = "",
      quantity = 0,
      total,
      tradeDirection;

    try {
      if (quantity >= 0) {
        ({ hash } = await buy(gameId, location!.type, drug!.type, quantity));
        toastMessage = `You bought ${quantity} ${drug!.name}`;

        const slippage = calculateSlippage(market!.marketPool, quantity, TradeDirection.Buy);
        total = slippage.newPrice * quantity;
      } else if (quantity < 0) {
        ({ hash } = await sell(gameId, location!.type, drug!.type, quantity));
        quantity = -quantity;
        toastMessage = `You sold ${quantity} ${drug!.name}`;

        const slippage = calculateSlippage(market!.marketPool, quantity, TradeDirection.Sell);
        total = slippage.newPrice * quantity;
      }

      // toast({
      //   message: toastMessage,
      //   icon: Cart,
      //   link: `http://amazing_explorer/${hash}`,
      // });
    } catch (e) {
      console.log(e);
    }
  }, [quantity, gameId, location, drug, router, buy, sell, toast, market]);

  if (!router.isReady || !playerEntity || !drug || !market) return <></>;

  return (
    <Layout
      leftPanelProps={{
        title: drug.name,
        prefixTitle: "The market",
        imageSrc: "/images/dealer.png",
      }}
      footer={
        <Footer>
          <Button w={["full", "auto"]} px={["auto", "20px"]} onClick={() => router.back()}>
            Back
          </Button>

          <Button
            w={["full", "auto"]}
            px={["auto", "20px"]}
            isLoading={isPending /* && !txError*/}
            isDisabled={quantity === 0}
            onClick={onTrade}
          >
            {quantity >= 0 ? "Buy" : "Sell"} ({Math.round(Math.abs(quantity))})
          </Button>
        </Footer>
      }
    >
      <Box w="full" margin="auto">
        <Card variant="pixelated" p={6} mb={6} _hover={{}} align="center">
          <Image src={`/images/drugs/${drug.slug}.png`} alt={drug.name} h={[140, 300]} maxH="40vh" />
          <HStack w="100%" justifyContent="space-between" fontSize="16px">
            <HStack>
              <Text ml={3} fontSize="lg">
                {formatCash(market.price)}
              </Text>
            </HStack>
            <HStack>
              <Bag color="yellow.400" mr={1} size="md" />
              <Text color="yellow.400" size="lg">
                {formatQuantity(playerEntity.drugs.find((d) => d.id === drug?.id)?.quantity ?? 0)}
              </Text>
              <Divider orientation="vertical" borderColor="neon.600" h="12px" ml={2} />
              <Cart mr={1} size="md" />
              <Text size="lg">{formatQuantity(market.marketPool.quantity)}</Text>
            </HStack>
          </HStack>
        </Card>
        {(canBuy || canSell) && (
          <QuantitySelector
            drug={drug}
            player={playerEntity}
            market={market}
            onChange={(quantity, _) => {
              setQuantity(quantity);
            }}
          />
        )}
      </Box>
    </Layout>
  );
}

const QuantitySelector = ({
  player,
  drug,
  market,
  onChange,
}: {
  drug: DrugInfo;
  player: PlayerEntity;
  market: DrugMarket;
  onChange: (quantity: number, newPrice: number) => void;
}) => {
  const [totalPrice, setTotalPrice] = useState<number>(market.price);
  const [priceImpact, setPriceImpact] = useState<number>(0);
  const [alertColor, setAlertColor] = useState<string>("neon.500");
  const [quantity, setQuantity] = useState(0);
  const [max, setMax] = useState(0);
  const [min, setMin] = useState(0);

  useEffect(() => {
    const playerQuantity = player.drugs.find((d) => d.id === drug.id)?.quantity ?? 0;
    setMin(-playerQuantity || 0);
    let max_buyable = calculateMaxQuantity(market.marketPool, player.cash);
    let bag_space = player.getTransport() - player.drugCount;
    setMax(Math.min(max_buyable, bag_space));
    setQuantity(playerQuantity || 0);
  }, [drug, player, market]);

  useEffect(() => {
    const slippage = calculateSlippage(
      market.marketPool,
      quantity,
      quantity > 0 ? TradeDirection.Buy : TradeDirection.Sell,
    );

    if (slippage.priceImpact > 0.2) {
      // >20%
      setAlertColor("red");
    } else if (slippage.priceImpact > 0.05) {
      // >5%
      setAlertColor("neon.200");
    } else {
      setAlertColor("neon.500");
    }

    setPriceImpact(slippage.priceImpact);
    setTotalPrice(quantity * slippage.newPrice);
    onChange(quantity, slippage.newPrice);
  }, [quantity, market, onChange]);

  const onDown = useCallback(() => {
    if (quantity >= 1) {
      setQuantity(quantity - 1);
    }
  }, [quantity]);

  const onUp = useCallback(() => {
    if (quantity < max) {
      setQuantity(quantity + 1);
    }
  }, [quantity, max]);

  //const onSlider = useCallback((value: number) => {
  //  setQuantity(value);
  //}, []);

  const onSlider = useCallback(
    (value: number) => {
      // Translate the slider value to actual quantity
      // For example, if max buyable is 50, and slider is at 100, quantity should be 50
      // Similarly, if max sellable is 30, and slider is at -100, quantity should be -30

      let actualQuantity;
      if (value > 0) {
        // Calculate the proportional buyable quantity
        actualQuantity = (value / 100) * max;
      } else {
        // Calculate the proportional sellable quantity
        actualQuantity = (value / 100) * Math.abs(min);
      }

      setQuantity(actualQuantity);
      // You may also want to adjust the onChange callback to reflect the actual quantity
      // onChange(actualQuantity, ...);
    },
    [min, max],
  );

  return (
    <VStack w="full">
      <Flex w="100%" direction={["column", "row"]} justifyContent="space-between" align="center" gap={["10px", "20px"]}>
        <Text color={alertColor}>
          <Alert size="sm" /> {priceImpact ? (priceImpact * 100).toFixed(2) : "0"}% slippage ($
          {totalPrice ? (totalPrice / quantity).toFixed(0) : market.price.toFixed(0)} per)
        </Text>
        <HStack fontSize="13px">
          <Text textStyle="subheading" color="neon.500">
            Total:
          </Text>
          <Text textStyle="subheading">{totalPrice ? formatCash(totalPrice) : "$0"}</Text>
        </HStack>
      </Flex>

      <HStack w="100%" py={3} spacing={3}>
        <ArrowEnclosed
          direction="down"
          boxSize={["36px", "48px"]}
          cursor="pointer"
          onClick={onDown}
          color="neon.500"
          _hover={{
            color: "neon.300",
          }}
        />
        <Box />
        <Slider
          aria-label="slider-quantity"
          w="100%"
          min={0}
          max={max}
          step={1}
          defaultValue={1}
          value={quantity}
          onChange={onSlider}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
        </Slider>

        <Box />
        <ArrowEnclosed
          direction="up"
          boxSize={["36px", "48px"]}
          cursor="pointer"
          onClick={onUp}
          color="neon.500"
          _hover={{
            color: "neon.300",
          }}
        />
      </HStack>
      <VStack w="full">
        <Slider
          aria-label="slider-quantity"
          w="80%"
          min={-100}
          max={100}
          step={1}
          defaultValue={0}
          value={(quantity / Math.max(Math.abs(min), max)) * 100}
          onChange={onSlider}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb
            boxSize={10}
            background={"transparent"}
            _focus={{
              outline: "none",
              boxShadow: "none",
            }}
          >
            <CustomThumb />
          </SliderThumb>
        </Slider>
      </VStack>
    </VStack>
  );
};
