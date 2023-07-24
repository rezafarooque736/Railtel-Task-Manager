import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Divider,
  Heading,
  Img,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Square,
  VStack,
  Alert,
  AlertIcon,
  HStack,
  PinInput,
  PinInputField,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import rtLogo from '../../assets/railtel_logo.jpg';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash, FaUserLock } from 'react-icons/fa';
import { putAuthApiData } from '../../Services/fetchApiFromBackend';

const ResetPassword = () => {
  const [alertText, setAlertText] = useState('');
  const [alertType, setAlertType] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [showP, setShowP] = useState(false);
  const [showCP, setShowCP] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const submitResetForm = async d => {
    if (d.password === d.confirmPassword) {
      const data = {
        password: d.password,
        otp: otpValue,
      };
      const url = '/api/resetpassword';
      const apiData = await putAuthApiData(url, data);
      if (apiData.status === 200) {
        setAlertType(apiData.data.type);
        setAlertText(apiData.data.msg);
        setShowAlert(true);
      }
      reset();
    } else {
      setShowAlert(true);
      setAlertType('warning');
      setAlertText("Password & Confirm Password don't match.");
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
          <Heading as="h4" size="md">
            Reset Password
          </Heading>
          <Divider />
          <Text textAlign={'left'} color={'green.300'} fontSize={'.87rem'}>
            Please, enter OTP sent to your email and New Password
          </Text>
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
          <HStack justifyContent={'center'}>
            <PinInput
              otp
              placeholder={'*'}
              onComplete={e => {
                setOtpValue(e);
              }}
            >
              <PinInputField />
              <PinInputField />
              <PinInputField />
              <PinInputField />
              <PinInputField />
              <PinInputField />
            </PinInput>
          </HStack>
          <form onSubmit={handleSubmit(submitResetForm)}>
            <InputGroup>
              <InputLeftElement
                pointerEvents={'none'}
                fontSize={'1.3rem'}
                children={<FaUserLock color={'#007AB8'} />}
              />
              <Input
                fontSize={'.87rem'}
                type={showP ? 'text' : 'password'}
                placeholder={'Password'}
                focusBorderColor={'#007AB8'}
                onClick={() => setShowAlert(false)}
                {...register('password', {
                  required: true,
                  minLength: 8,
                  pattern:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9_])/,
                })}
              />
              <InputRightElement>
                <Button
                  bgColor={'blackAlpha.100'}
                  size={'1.3rem'}
                  onClick={() => setShowP(!showP)}
                  _hover={{ coloor: 'gray' }}
                >
                  {showP ? (
                    <FaEye color={'#fff'} fontSize={'1.3rem'} />
                  ) : (
                    <FaEyeSlash color={'#fff'} fontSize={'1.3rem'} />
                  )}
                </Button>
              </InputRightElement>
            </InputGroup>
            {errors.password?.type === 'required' && (
              <TextFeature text="Password is required" />
            )}
            {errors.password?.type === 'minLength' && (
              <TextFeature text="Use 8 or more characters" />
            )}
            {errors.password?.type === 'pattern' && (
              <TextFeature
                text="Password should be mix of Uppercase letter, Lowercase letter,
                numbers & special characters"
              />
            )}
            <InputGroup my={4}>
              <InputLeftElement
                pointerEvents={'none'}
                fontSize={'1.3rem'}
                children={<FaUserLock color={'#007AB8'} />}
              />
              <Input
                fontSize={'.87rem'}
                type={showCP ? 'text' : 'password'}
                placeholder={'Confirm Password'}
                focusBorderColor={'#007AB8'}
                onClick={() => setShowAlert(false)}
                {...register('confirmPassword', {
                  required: true,
                  minLength: 8,
                  pattern:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9_])/,
                })}
              />
              <InputRightElement>
                <Button
                  bgColor={'blackAlpha.100'}
                  size={'1.3rem'}
                  onClick={() => setShowCP(!showCP)}
                  _hover={{ coloor: 'gray' }}
                >
                  {showCP ? (
                    <FaEye color={'#fff'} fontSize={'1.3rem'} />
                  ) : (
                    <FaEyeSlash color={'#fff'} fontSize={'1.3rem'} />
                  )}
                </Button>
              </InputRightElement>
            </InputGroup>
            {errors.confirmPassword?.type === 'required' && (
              <TextFeature text="Confirm Password is required" />
            )}
            {errors.confirmPassword?.type === 'minLength' && (
              <TextFeature text="Use 8 or more characters" />
            )}
            {errors.confirmPassword?.type === 'pattern' && (
              <TextFeature
                text="Confirm Password should be mix of Uppercase letter, Lowercase letter,
                numbers & special characters"
              />
            )}
            <Button
              w={'full'}
              mt={'.7rem'}
              colorScheme={'telegram'}
              type={'submit'}
              onClick={handleSubmit(submitResetForm)}
            >
              Reset Password
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

export default ResetPassword;

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
