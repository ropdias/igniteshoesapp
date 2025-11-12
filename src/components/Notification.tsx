import { HStack, Text, IconButton, CloseIcon, Icon, Pressable } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { OSNotification } from 'react-native-onesignal';
import * as Linking from 'expo-linking';

type Props = {
  data: OSNotification
  onClose: () => void
}

export function Notification({ data, onClose }: Props) {
  function handleOnPress(){
    let deepLinkUrl = data.launchURL;
    
    if (!deepLinkUrl && data.rawPayload) {
      try {
        const rawPayloadStr = typeof data.rawPayload === 'string' 
          ? data.rawPayload 
          : JSON.stringify(data.rawPayload);
        
        const rawPayloadObj = JSON.parse(rawPayloadStr);
        
        if (rawPayloadObj.custom) {
          const customObj = JSON.parse(rawPayloadObj.custom);
          
          if (customObj.u) {
            const urlPath = customObj.u.replace(/^[^:]+:\/\//, '/');
            deepLinkUrl = Linking.createURL(urlPath);
          }
        }
      } catch (error) {
        console.log('Error parsing notification payload:', error);
      }
    }
    
    if(deepLinkUrl){
      Linking.openURL(deepLinkUrl);
      onClose();
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