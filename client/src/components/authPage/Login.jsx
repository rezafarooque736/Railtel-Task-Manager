import React, { useState } from 'react';
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Container,
  Divider,
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
import { useForm } from 'react-hook-form';
import { FaEnvelope, FaUserLock } from 'react-icons/fa';
import rtLogo from '../../assets/railtel_logo.jpg';
import { login } from './auth';
import { postAuthApiData } from '../../Services/fetchApiFromBackend';

const Login = () => {
  const [alertText, setAlertText] = useState('');
  const [alertType, setAlertType] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitLoginForm = async data => {
    const url = '/api/login';
    const apiData = await postAuthApiData(url, data);
    console.log(apiData);
    if (apiData.data.type === 'success') {
      login(apiData.data.access_token);
      window.location = '/home';
    } else {
      setAlertType(apiData.data.type);
      setAlertText(apiData.data.msg);
      setShowAlert(true);
    }
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
          p={'1rem'}
          py={'2rem'}
          bgColor={'blackAlpha.600'}
          borderRadius={'2rem'}
        >
          <Square
            bg={'white'}
            size={'4.62rem'}
            m={'auto'}
            borderRadius={'full'}
          >
            <Img
              src={rtLogo}
              w={'2.74rem'}
              m={'auto'}
              h={'4rem'}
              borderRadius={'.3rem'}
            />
          </Square>
          <span style={{ fontSize: '1rem', fontWeight: '500' }}>
            Task Manager{' '}
          </span>
          <span
            style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              lineHeight: '0',
            }}
          >
            Member Login
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
              {alertText}
            </Alert>
          ) : (
            <span m={0} p={0}></span>
          )}
          <form onSubmit={handleSubmit(submitLoginForm)}>
            <InputGroup>
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
                  pattern:
                    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@railtelindia\.com$/,
                })}
              />
            </InputGroup>
            {errors.email?.type === 'required' && (
              <TextFeature text="Email is required" />
            )}
            {errors.email?.type === 'pattern' && (
              <TextFeature text="Please, enter @railtelindia.com email only!" />
            )}
            <InputGroup my={'1rem'}>
              <InputLeftElement
                pointerEvents={'none'}
                fontSize={'1.3rem'}
                children={<FaUserLock color={'#007AB8'} />}
              />
              <Input
                fontSize={'.87rem'}
                type={'password'}
                placeholder={'Password'}
                focusBorderColor={'#007AB8'}
                onClick={() => setShowAlert(false)}
                {...register('password', {
                  required: true,
                })}
              />
            </InputGroup>
            {errors.password?.type === 'required' && (
              <TextFeature text="Password is required" />
            )}
            <Button
              colorScheme={'telegram'}
              type={'submit'}
              w={'full'}
              onClick={handleSubmit(submitLoginForm)}
            >
              Log In
            </Button>
          </form>
          <HStack justifyContent={'center'}>
            <Link to={'/forgotpassword'}>
              <Button variant={'link'} colorScheme={'telegram'}>
                Forgot password?
              </Button>
            </Link>
          </HStack>
          <Divider />
          <HStack justifyContent={'center'}>
            <Link to={'/new-user'}>
              <Button colorScheme={'green'} size={'sm'}>
                Create New Account
              </Button>
            </Link>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default Login;

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
