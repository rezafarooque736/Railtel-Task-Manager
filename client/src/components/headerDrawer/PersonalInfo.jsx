import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
  UnorderedList,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useEffect, useState, useRef } from 'react';
import Footer from '../Footer';
import Header from '../Header';
import '../../styles/app.css';
import jwt_decode from 'jwt-decode';
import { useForm } from 'react-hook-form';
import {
  getApiData,
  postApiData,
  putApiData,
} from '../../Services/fetchApiFromBackend';
import Multiselect from 'multiselect-react-dropdown';

const PersonalInfo = () => {
  const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');
  const jwt_decode_data = jwt_decode(token);
  const [allPersonalInfos, setAllPersonalInfos] = useState([]);
  const [EmpName] = useState(jwt_decode_data.fullname);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const [selectedGroup, setSelectedGroup] = useState([]);
  const [department_list, setDepartment_list] = useState([]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  let onSelectRemoveGroup = group => {
    setSelectedGroup(Object.entries(group));
  };

  /**department_list */
  async function departmentFetchFunction() {
    const url = '/api/add-department';
    const apiData = await getApiData(url);
    setDepartment_list(apiData.data.map(departObj => departObj.depart));
  }

  const sendRequestAddToGroup = async e => {
    e.preventDefault();
    if (selectedGroup.length > 0) {
      let addToGroup = selectedGroup.map(group => group[1]);
      const data = {
        addToGroup: addToGroup.join(','),
      };
      const url = `/api/add-to-group/${jwt_decode_data.email}`;
      const apiData = await postApiData(url, data);
      setSelectedGroup([]);
      alert(apiData.data.msg);
    } else {
      alert('please, Select atleast one group for request');
    }
  };

  const apiFetchFunc = async () => {
    const url = '/api/EmployeeList';
    const apiData = await getApiData(url);
    setAllPersonalInfos(apiData.data);
  };

  useEffect(() => {
    apiFetchFunc();
    departmentFetchFunction();
  }, []);

  console.log(selectedGroup); //FIXME: delete row

  const updateProfile = async d => {
    const file = d.EmpPhoto[0];
    let base64 = '';

    if (d.EmpPhoto[0] === 'd') {
      base64 = d.EmpPhoto;
    } else {
      file === undefined ? (base64 = '') : (base64 = await convertBase64(file));
    }
    const data = {
      EmpId: d.EmpId,
      MobileNo: d.MobileNo,
      BloodGroup: d.BloodGroup,
      EmpDesg: d.EmpDesg,
      EmpPlaceOfPosting: d.EmpPlaceOfPosting,
      EmpPhoto: base64,
      EmpDepart: d.EmpDepart,
    };

    const url = `/api/user/employee/${jwt_decode_data.email}`;
    await putApiData(url, data);
    apiFetchFunc();
  };

  // convert image to base64
  const convertBase64 = file => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = error => reject(error);
    });
  };

  const handlePhotoChange = e => {
    if (e.target.files.length > 0) {
      const fileSizeKiloBytes = e.target.files[0].size / 1024;
      if (fileSizeKiloBytes < 3) {
        alert('Photo size is less than 3 KB');
        document.getElementById('EmpPhotoID').value = null;
      }
      if (fileSizeKiloBytes > 90) {
        alert('Photo size is greater than 90 KB');
        document.getElementById('EmpPhotoID').value = null;
      }
    } else {
      alert('Please, select your photo');
    }
  };

  return (
    <Box className="bg">
      <Container
        minH={'100vh'}
        pb={'4rem'}
        mx={'auto'}
        maxW={'container.xl'}
        textAlign={'center'}
        bg={'blackAlpha.300'}
        px={0}
      >
        <Header />
        <Box>
          <Heading mb={2} fontSize={'1.2rem'} color={'#aaa'}>
            Profile Info
          </Heading>
          <Divider />
          {allPersonalInfos.map(personalInfo => {
            if (personalInfo.EmpEmailId === jwt_decode_data.email) {
              setValue('EmpName', personalInfo.EmpName);
              setValue('EmpPhoto', personalInfo.EmpPhoto);
              setValue('EmpEmailId', personalInfo.EmpEmailId);
              setValue('EmpDepart', personalInfo.EmpDepart);
              setValue('AssignGroup', personalInfo.AssignGroup);
              setValue('EmpId', personalInfo.EmpId);
              setValue('MobileNo', personalInfo.MobileNo);
              setValue('BloodGroup', personalInfo.BloodGroup);
              setValue('EmpDesg', personalInfo.EmpDesg);
              setValue('EmpPlaceOfPosting', personalInfo.EmpPlaceOfPosting);

              return (
                <Box key={personalInfo.EmpEmailId}>
                  <HStack
                    justifyContent={'center'}
                    mt={'.5rem'}
                    pos={'relative'}
                  >
                    <Button
                      variant={'unstyled'}
                      color={'#0094de'}
                      pos={'absolute'}
                      right={'2'}
                      top={'0'}
                      fontSize={'13px'}
                      onClick={onOpen}
                    >
                      Edit Profile
                    </Button>
                    {personalInfo.EmpPhoto === (null || '') ? (
                      <Avatar name={personalInfo.EmpName} size={'lg'} />
                    ) : (
                      <Avatar src={personalInfo.EmpPhoto} size={['lg']} />
                    )}
                  </HStack>
                  <HStack mb={'20px'} fontSize={'13px'} fontWeight={'600'}>
                    <UnorderedList
                      px={0}
                      pl={['0', '3rem']}
                      styleType={'none'}
                      className={'unOrderedListStyle'}
                    >
                      <Box>
                        <ProfileInfo
                          ltext="Name"
                          rtext={personalInfo.EmpName}
                        />
                        <ProfileInfo
                          ltext="Email ID"
                          rtext={personalInfo.EmpEmailId}
                        />
                        <ProfileInfo
                          ltext="Department"
                          rtext={personalInfo.EmpDepart}
                          style={{ textTransform: 'uppercase' }}
                        />
                        <ProfileInfo
                          ltext="Employee ID"
                          rtext={personalInfo.EmpId}
                        />
                        <ProfileInfo
                          ltext="Mobile No"
                          rtext={personalInfo.MobileNo}
                        />
                        <ProfileInfo
                          ltext="Blood Group"
                          rtext={personalInfo.BloodGroup}
                        />
                        <ProfileInfo
                          ltext="Designation"
                          rtext={personalInfo.EmpDesg}
                        />
                        <ProfileInfo
                          ltext="Place of Posting"
                          rtext={personalInfo.EmpPlaceOfPosting}
                        />
                        <ProfileInfo
                          ltext="Group Assigned"
                          rtext={personalInfo.AssignGroup}
                          style={{ textTransform: 'uppercase' }}
                        />
                      </Box>
                    </UnorderedList>
                  </HStack>

                  <HStack
                    maxW={'90%'}
                    m={'auto'}
                    p={3}
                    mt={'1rem'}
                    direction={['column', 'row']}
                    flexWrap={'wrap'}
                  >
                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="email-alerts" mb="0">
                        Enable Push Notification ?
                      </FormLabel>
                    </FormControl>
                  </HStack>

                  <Stack
                    maxW={'90%'}
                    m={'auto'}
                    p={3}
                    mt={'1rem'}
                    direction={['column', 'row']}
                    flexWrap={'wrap'}
                    justifyContent={'space-between'}
                    mb={'220px'}
                  >
                    <Text color={'#aaa'} fontWeight={'500'}>
                      Request for
                    </Text>
                    <Multiselect
                      isObject={false}
                      onSelect={onSelectRemoveGroup} // Function will trigger on select event
                      onRemove={onSelectRemoveGroup} // Function will trigger on remove event
                      options={department_list}
                      showCheckbox
                      placeholder="Add to Groups - ➕"
                      style={{
                        multiselectContainer: {
                          fontSize: '.87rem',
                          color: '#444',
                        },
                        searchBox: {
                          padding: '.1rem',
                          fontSize: '.9rem',
                          color: '#eee',
                        },
                      }}
                    />
                    <Button
                      colorScheme={'telegram'}
                      size={'sm'}
                      onClick={sendRequestAddToGroup}
                    >
                      Send Request
                    </Button>
                  </Stack>
                </Box>
              );
            }
          })}
          <Modal
            onClose={onClose}
            isOpen={isOpen}
            closeOnOverlayClick={'false'}
            initialFocusRef={initialRef}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalCloseButton />
              <ModalBody py={'1rem'} fontSize={'.9rem'}>
                <Text fontWeight={'600'} fontSize={'1rem'}>
                  Update Profile
                </Text>
                <form onSubmit={handleSubmit(updateProfile)}>
                  <FormControlUpdateProfile
                    id="EmpName"
                    label="Name :"
                    type="text"
                    variant="unstyled"
                    isReadOnly={true}
                    placeholder="Enter your name.."
                    reactHookFormComponent={register('EmpName')}
                  />

                  <FormControlUpdateProfile
                    id="EmpEmailId"
                    label="Email ID :"
                    type="text"
                    variant="unstyled"
                    isReadOnly={true}
                    placeholder="your Email ID.."
                    reactHookFormComponent={register('EmpEmailId')}
                  />

                  <FormControlUpdateProfile
                    id="AssignGroup"
                    label="Group Assigned :"
                    type="text"
                    variant="unstyled"
                    isReadOnly={true}
                    placeholder="Your group Assigned"
                    reactHookFormComponent={register('AssignGroup')}
                  />

                  <FormControlUpdateProfile
                    id="EmpDepart"
                    label="Department :"
                    type="text"
                    variant="filled"
                    isReadOnly={false}
                    placeholder="Enter Your Department.."
                    reactHookFormComponent={register('EmpDepart', {
                      required: true,
                    })}
                  />

                  <FormControlUpdateProfile
                    id="EmpId"
                    label="Employee ID :"
                    type="text"
                    variant="filled"
                    isReadOnly={false}
                    placeholder="Enter Your Employee ID [optional]"
                    reactHookFormComponent={register('EmpId')}
                  />

                  <FormControlUpdateProfile
                    id="MobileNo"
                    label="Mobile No :"
                    type="number"
                    variant="filled"
                    isReadOnly={false}
                    placeholder="Enter Your mobile no.."
                    reactHookFormComponent={register('MobileNo', {
                      required: true,
                    })}
                  />
                  {errors.MobileNo?.type === 'required' && (
                    <TextFeature text="Mobile No is required" />
                  )}

                  <FormControlUpdateProfile
                    id="BloodGroup"
                    label="Blood Group :"
                    type="text"
                    variant="filled"
                    isReadOnly={false}
                    placeholder="Enter your blood group.."
                    reactHookFormComponent={register('BloodGroup', {
                      required: true,
                    })}
                  />
                  {errors.BloodGroup?.type === 'required' && (
                    <TextFeature text="Blood Group is required" />
                  )}

                  <FormControlUpdateProfile
                    id="EmpDesg"
                    label="Designation :"
                    type="text"
                    variant="filled"
                    isReadOnly={false}
                    placeholder="Enter your designation.."
                    reactHookFormComponent={register('EmpDesg', {
                      required: true,
                    })}
                  />
                  {errors.EmpDesg?.type === 'required' && (
                    <TextFeature text="Designation is required" />
                  )}

                  <FormControlUpdateProfile
                    id="EmpPlaceOfPosting"
                    label="Place of Posting :"
                    type="text"
                    variant="filled"
                    isReadOnly={false}
                    placeholder="Enter your place of posting.."
                    reactHookFormComponent={register('EmpPlaceOfPosting', {
                      required: true,
                    })}
                  />
                  {errors.EmpPlaceOfPosting?.type === 'required' && (
                    <TextFeature text="Place of Posting is required" />
                  )}

                  <FormControl className={'listStyle'}>
                    <label htmlFor="EmpPhotoID">
                      <HStack w={['135px', '140px']}>
                        <span className={'labelFormStyle'}>your photo :</span>
                        <Avatar
                          name={EmpName}
                          size={'sm'}
                          alignSelf={'flex-start'}
                        />
                        <Input
                          style={{ display: 'none' }}
                          id="EmpPhotoID"
                          type={'file'}
                          variant={'filled'}
                          ms={1}
                          size={'xs'}
                          fontSize={'.87rem'}
                          accept={'image/*'}
                          autoComplete={'off'}
                          onInput={handlePhotoChange}
                          placeholder={'Enter your photo..'}
                          {...register('EmpPhoto')}
                        />
                      </HStack>
                    </label>
                  </FormControl>
                  <HStack fontSize={'.87em'}>
                    <span
                      style={{
                        color: '#111',
                        width: '100%',
                        textAlign: 'right',
                      }}
                    >
                      Min size: 3KB
                    </span>
                    <span
                      style={{
                        color: '#111',
                        width: '100%',
                        textAlign: 'right',
                      }}
                    >
                      Max size: 90KB
                    </span>
                  </HStack>
                  {/* <FormControl className={'listStyle'}>
                    <label htmlFor="EmpPhoto" className={'labelFormStyle'}>
                      Your Photo :
                    </label>
                    <Input
                      id="EmpPhoto"
                      type={'file'}
                      variant={'filled'}
                      ms={1}
                      size={'xs'}
                      fontSize={'.87rem'}
                      placeholder={'Upload your photo..'}
                      {...register('EmpPhoto', { required: true })}
                    />
                  </FormControl> */}
                  {errors.EmpPhoto?.type === 'required' && (
                    <TextFeature text="your photo is required" />
                  )}
                  <HStack justifyContent={'flex-end'} pt={'1.3rem'}>
                    <Button
                      type="reset"
                      size={'sm'}
                      variant={'outline'}
                      onClick={onClose}
                      borderColor={'#007ab8'}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size={'sm'}
                      colorScheme={'telegram'}
                      onClick={handleSubmit(updateProfile)}
                    >
                      Update Profile
                    </Button>
                  </HStack>
                </form>
              </ModalBody>
            </ModalContent>
          </Modal>
        </Box>
        <Footer />
      </Container>
    </Box>
  );
};

export default PersonalInfo;

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

const FormControlUpdateProfile = ({
  id,
  label,
  type,
  variant,
  isReadOnly,
  placeholder,
  reactHookFormComponent,
}) => {
  return (
    <FormControl className={'listStyle'}>
      <label htmlFor="EmpDesg" className={'labelFormStyle'}>
        {label}
      </label>
      <Input
        id={id}
        type={type}
        variant={variant}
        isReadOnly={isReadOnly}
        ms={1}
        size={'xs'}
        fontSize={'.87rem'}
        placeholder={placeholder}
        {...reactHookFormComponent}
      />
    </FormControl>
  );
};

const ProfileInfo = ({ ltext, rtext, style }) => {
  return (
    <ListItem className={'listStyle'}>
      <span className={'spanLeftStyle'}>{ltext}</span>
      <span className={'spanRightStyle'} style={style}>
        {rtext}
      </span>
    </ListItem>
  );
};
