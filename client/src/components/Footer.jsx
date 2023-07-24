import { HStack, Text } from '@chakra-ui/react';
import React from 'react';

const Footer = () => {
  return (
    <HStack
      w={'full'}
      maxW={'container.xl'}
      pos={'fixed'}
      zIndex={'overlay'}
      bgGradient={'linear(to-r, #0E2A47, #2264AB)'}
      bottom={0}
      p={'.5rem'}
      placeContent={'center'}
    >
      <Text fontWeight={'700'} fontSize={['.9rem', '1rem']}>
        Powered by RailTel SOC Team
      </Text>
    </HStack>
  );
};

export default Footer;
