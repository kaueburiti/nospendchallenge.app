import { BadgeCheck } from "lucide-react-native";
import { VStack, HStack, ButtonText, Text, Button, Box } from "../ui";
import {Icon} from "@/components/ui/icon";

interface ProfilePlanProps {
  onPress: () => void;
  isPro: boolean;
}

const CurrentPlan = () => (
  <HStack className="gap-2">
    <Icon as={BadgeCheck} />
    <Text>Current Plan</Text>
  </HStack>
)


export const PaymentPlan: React.FC<ProfilePlanProps> = ({ onPress, isPro }) => (
  <VStack className="gap-4">
    <HStack className="justify-between">
      <CurrentPlan />
      <Box className="flex items-center justify-center border border-gray-600 rounded-md p-1">
        <Text>{isPro ? 'Full Access' : 'Basic Access'}</Text>
      </Box>
    </HStack>
    {!isPro && (
      <VStack className="gap-2">
        <Text>Unlock exclusive features and ehance your experience</Text>
        <Button onPress={onPress}>
          <ButtonText>Upgrade Now</ButtonText>
        </Button>
      </VStack>
    )}
  </VStack>
)