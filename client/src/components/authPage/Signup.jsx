import React, { useState, useEffect } from 'react';
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
  InputRightElement,
  PinInput,
  PinInputField,
  Select,
  Square,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import {
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaUser,
  FaUserLock,
} from 'react-icons/fa';
import rtLogo from '../../assets/railtel_logo.jpg';
import { useForm } from 'react-hook-form';
import {
  getAuthApiData,
  postAuthApiData,
} from '../../Services/fetchApiFromBackend';

const SignUp = () => {
  const [alertText, setAlertText] = useState('');
  const [alertType, setAlertType] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [showP, setShowP] = useState(false);
  const [showCP, setShowCP] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  let [department_list, setDepartment_list] = useState([]);
  const [depart_region_list, setDepart_region_list] = useState([]);
  const [selected, setSelected] = useState('');
  const region_list = ['CO', 'ER', 'NR', 'SR', 'WR'];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  async function departmentFetchFunction() {
    const url = '/api/add-department';
    const apiData = await getAuthApiData(url);
    setDepart_region_list(apiData.data);
    setDepartment_list(apiData.data.map(departObj => departObj.depart));
  }

  useEffect(() => {
    if (selected) {
      setDepartment_list(
        depart_region_list
          .filter(dpt_rgn => dpt_rgn.region === selected)
          .map(el => el.depart)
      );
    }
  }, [selected, depart_region_list]);

  useEffect(() => {
    departmentFetchFunction();
  }, []);

  const submitSignupForm = async d => {
    if (d.password === d.confirmPassword) {
      const data = {
        fullname: d.fullname,
        email: d.email,
        department: d.department,
        password: d.password,
        otp: otpValue,
      };
      const url = '/api/signup';
      const apiData = await postAuthApiData(url, data);
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
          <Text textAlign={'left'} color={'green.300'} fontSize={'.87rem'}>
            Please, enter OTP sent to email and fill Details
          </Text>
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
          <form onSubmit={handleSubmit(submitSignupForm)}>
            <InputGroup>
              <InputLeftElement
                pointerEvents={'none'}
                fontSize={'1.3rem'}
                children={<FaUser color={'#007AB8'} />}
              />
              <Input
                fontSize={'.87rem'}
                type={'text'}
                placeholder={'Name'}
                focusBorderColor={'#007AB8'}
                {...register('fullname', { required: true, maxLength: 50 })}
              />
            </InputGroup>
            {errors.fullname?.type === 'required' && (
              <p style={{ color: 'red' }}>
                <TextFeature text="Full Name is required" />
              </p>
            )}
            {errors.fullname?.type === 'maxLength' && (
              <p style={{ color: 'red' }}>
                <TextFeature text="max Character should be 50" />
              </p>
            )}
            <InputGroup my={'.5rem'}>
              <InputLeftElement
                pointerEvents={'none'}
                fontSize={'1.3rem'}
                children={<FaEnvelope color={'#007AB8'} />}
              />
              <Input
                id="email"
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
            <InputGroup mb={'.5rem'}>
              <Select
                onClick={e => setSelected(e.target.value)}
                color={'whiteAlpha.500'}
                placeholder="Select Region"
                _placeholder={{ color: 'gray.500' }}
                variant={'outline'}
                _focus={{ color: 'gray.500' }}
                {...register('region', {
                  required: true,
                })}
              >
                {region_list.map((regn, index) => (
                  <option key={index} value={regn}>
                    {regn}
                  </option>
                ))}
              </Select>
            </InputGroup>
            {errors.region?.type === 'required' && (
              <TextFeature text="Region field is Required" />
            )}
            <InputGroup>
              <Select
                color={'whiteAlpha.500'}
                placeholder="Select Department"
                _placeholder={{ color: 'gray.500' }}
                variant={'outline'}
                _focus={{ color: 'gray.500' }}
                {...register('department', {
                  required: true,
                })}
              >
                {department_list.map((depart, index) => (
                  <option key={index} value={depart}>
                    {depart}
                  </option>
                ))}
              </Select>
            </InputGroup>
            {errors.department?.type === 'required' && (
              <TextFeature text="Depatrment field is Required" />
            )}
            <InputGroup my={'.5rem'}>
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
            <InputGroup>
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
                  _hover={{ color: 'gray' }}
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

export default SignUp;

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
