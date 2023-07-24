import React, { useState } from 'react';
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Img,
  Input,
  InputGroup,
  InputLeftElement,
  Square,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa';
import rtLogo from '../../assets/railtel_logo.jpg';
import { useForm } from 'react-hook-form';
import { postAuthApiData } from '../../Services/fetchApiFromBackend';

const NewUser = () => {
  const [alertText, setAlertText] = useState('');
  const [alertType, setAlertType] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const submitSignupForm = async data => {
    const url = '/api/new-user';
    const apiData = await postAuthApiData(url, data);
    if (apiData.data.type === 'success') {
      window.location = '/signup';
    } else {
      setAlertType(apiData.data.type);
      setAlertText(apiData.data.msg);
      setShowAlert(true);
    }
    reset();
  };

  return (
    <Box className="bg">
      <Container
        w={'full'}
        maxW={'container.xl'}
        display={'grid'}
        placeItems={'center'}
        p={'2rem'}
        h={'100vh'}
        textAlign={'center'}
      >
        <VStack
          alignItems={'stretch'}
          spacing={'.8rem'}
          w={['full', '24rem']}
          p={'1rem'}
          py={'1.5rem'}
          bgColor={'blackAlpha.600'}
          borderRadius={'2rem'}
        >
          <HStack alignSelf={'flex-start'}>
            <Square
              bg={'white'}
              size={'3.62rem'}
              m={'auto'}
              borderRadius={'full'}
            >
              <Img
                src={rtLogo}
                w={'2rem'}
                m={'auto'}
                h={'3rem'}
                borderRadius={'.3rem'}
              />
            </Square>
            <VStack>
              <Heading as="h4" size="md" alignSelf={'flex-start'}>
                Sign Up
              </Heading>
              <Text>It's quick and easy.</Text>
            </VStack>
          </HStack>
          {showAlert ? (
            <Alert
              status={alertType}
              fontSize={'.87rem'}
              color={'#333'}
              px={1}
              borderRadius={'.3rem'}
            >
              <AlertIcon />
              {alertText}
            </Alert>
          ) : (
            <span m={0} p={0}></span>
          )}
          <form onSubmit={handleSubmit(submitSignupForm)}>
            <InputGroup mt={'-.5rem'}>
              <InputLeftElement
                pointerEvents={'none'}
                fontSize={'1.3rem'}
                children={<FaEnvelope color={'#007AB8'} />}
              />
              <Input
                fontSize={'.87rem'}
                type={'email'}
                placeholder="your-email@railtelindia.com"
                _placeholder={{ color: 'gray.500' }}
                focusBorderColor={'#007AB8'}
                {...register('email', {
                  required: true,
                  maxLength: 80,
                  pattern:
                    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@railtelindia\.com$/,
                })}
              />
            </InputGroup>
            {errors.email?.type === 'required' && (
              <TextFeature text="Email is required" />
            )}
            {errors.email?.type === 'maxLength' && (
              <TextFeature text="Max Character should be 80" />
            )}
            {errors.email?.type === 'pattern' && (
              <TextFeature text="Please, enter @railtelindia.com email only!" />
            )}
            <Button
              w={'full'}
              mt={'.7rem'}
              colorScheme={'telegram'}
              type={'submit'}
              onClick={handleSubmit(submitSignupForm)}
            >
              Sign Up
            </Button>
          </form>
          <Text alignSelf={'flex-end'} pt={'.5rem'}>
            Already Signed Up?{' '}
            <Link to={'/login'}>
              <Button colorScheme={'telegram'} variant={'link'}>
                Log In
              </Button>
            </Link>
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default NewUser;

const TextFeature = ({ text }) => {
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
