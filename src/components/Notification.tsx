import { HStack, Text, IconButton, CloseIcon, Icon, Pressable } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { OSNotification } from 'react-native-onesignal';
import { useNavigation } from '@react-navigation/native';

type AdditionalDataProps = {
  route?: string
  product_id?: string
}

type Props = {
  data: OSNotification & {
    additionalData?: AdditionalDataProps
  }
  onClose: () => void
}

export function Notification({ data, onClose }: Props) {
  const { navigate } = useNavigation()
  function handleOnPress(){
    const route = data.additionalData?.route
    const productId = data.additionalData?.product_id

    if (route === "details" && productId){
      navigate("details", { productId })
      onClose()
    }
  }
  return (
    <Pressable 
      w="full" 
      p={4} 
      pt={12}
      bgColor="gray.200" 
      top={0} 
      position="absolute"
      onPress={handleOnPress}
    >
      <HStack 
        justifyContent="space-between" 
        alignItems="center" 
      >
          <Icon as={Ionicons} name="notifications-outline" size={5} color="black" mr={2}/>

          <Text fontSize="md" color="black" flex={1}>
            {data.title}
          </Text>

        <IconButton 
          variant="unstyled" 
          _focus={{ borderWidth: 0 }} 
          icon={<CloseIcon size="3" />} 
          _icon={{ color: "coolGray.600"}} 
          color="black"
          onPress={onClose}
        />
      </HStack>
    </Pressable>
  );
}