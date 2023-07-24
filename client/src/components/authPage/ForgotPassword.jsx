import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Img,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Square,
  VStack,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa';
import rtLogo from '../../assets/railtel_logo.jpg';
import { useForm } from 'react-hook-form';
import { putAuthApiData } from '../../Services/fetchApiFromBackend';

const ForgotPassword = () => {
  const [alertText, setAlertText] = useState('');
  const [alertType, setAlertType] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const submitForgotPasswordForm = async data => {
    const url = '/api/forgotpassword';
    const apiData = await putAuthApiData(url, data);
    // console.log(apiData);
    if (apiData.data.type === 'success') {
      window.location = '/resetPassword';
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
        maxW={'container.xl'}
        display={'grid'}
        placeItems={'center'}
        p={'2rem'}
        h={'100vh'}
        colorScheme={'telegram'}
        textAlign={'center'}
      >
        <VStack
          alignItems={'stretch'}
          spacing={'1rem'}
          w={['full', '24rem']}
          my={'1rem'}
          p={'1rem'}
          bgColor={'blackAlpha.600'}
          borderRadius={'2rem'}
        >
          <Square
            bg={'white'}
            size={'4.62rem'}
            m={'auto'}
            borderRadius={'full'}
          >
            <Img src={rtLogo} w={'2.41rem'} m={'auto'} h={'3.62rem'} />
          </Square>
          <span style={{ fontSize: '1rem', fontWeight: '500' }}>
            Task Manager{' '}
          </span>
          <span
            style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              lineHeight: '0',
              marginBottom: '.5rem',
            }}
          >
            Forgot Your Password ?
          </span>
          {showAlert ? (
            <Alert
              status={alertType}
              fontSize={'.87rem'}
              color={'#333'}
              px={1}
              borderRadius={'.3rem'}
            >
              <AlertIcon />
              <Text>{alertText}</Text>
            </Alert>
          ) : (
            <span m={0} p={0}></span>
          )}
          <form onSubmit={handleSubmit(submitForgotPasswordForm)}>
            <InputGroup mt={'-.7rem'}>
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
              mt={4}
              colorScheme={'telegram'}
              type={'submit'}
              w={'full'}
              onClick={handleSubmit(submitForgotPasswordForm)}
            >
              Request Reset
            </Button>
          </form>
          <Text alignSelf={'flex-end'}>
            Already a member?{' '}
            <Link to={'/login'}>
              <Button colorScheme={'telegram'} variant={'link'}>
                Log in
              </Button>
            </Link>
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default ForgotPassword;

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
