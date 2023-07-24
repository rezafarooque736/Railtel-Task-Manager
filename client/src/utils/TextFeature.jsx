import { Text } from '@chakra-ui/react';

export const TextFeature = ({ text }) => {
  return (
    <Text
      color={'#FF5858'}
      fontSize={'.7rem'}
      textAlign={'left'}
      letterSpacing={'.05rem'}
    >
      {text}
    </Text>
  );
};
