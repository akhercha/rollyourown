import { formatAddress } from "@/utils";
import { Box, Flex, Spacer, Text } from "@chakra-ui/layout";

interface PlayersProps {
    addresses: string[];
}

const Players = (
    { addresses }: PlayersProps
) => {
    return <Box borderRadius={4} border="2px solid black">
        {addresses.map((address, index) => {
            return <Flex fontSize="14px" key={index} w="full" p="10px 12px" gap="8px" bg="#141011">
                <Text color="white" opacity="0.5">
                    {index + 1}
                </Text>
                <Text color="white">
                    {formatAddress(address)}
                </Text>
                <Spacer />
                <Text color="white" opacity="0.5">
                    --
                </Text>
            </Flex>
        })}
    </Box>
}

export default Players;