import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import jwt_decode from 'jwt-decode';
import { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { FiLogOut, FiSettings } from 'react-icons/fi';
import { RiAdminFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { getApiData } from '../Services/fetchApiFromBackend';

export const HeaderAdminPage = ({ headerText }) => {
  const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');
  const jwt_decode_data = jwt_decode(token);
  const [userPersonalInfos, setUserPersonalInfos] = useState([]);

  async function getAllEmployeeListAPI() {
    const url = '/api/EmployeeList';
    const apiData = await getApiData(url);
    setUserPersonalInfos(
      apiData.data.filter(user => user.EmpEmailId === jwt_decode_data.email)[0]
    );
  }
  useEffect(() => {
    getAllEmployeeListAPI();
  }, []);

  return (
    <div className="AdminConsolePageStructure-header">
      <div className="AdminConsolePageStructureLeft">
        <h1>{headerText}</h1>
      </div>
      <div className="AdminConsolePageStructureRight">
        {/* <Avatar size={'sm'} name={jwt_decode_data.fullname} /> */}
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton
              mr={2}
              bg={'red.500'}
              as={Button}
              rounded={'full'}
              variant={'link'}
              cursor={'pointer'}
              minW={0}
            >
              {userPersonalInfos.EmpPhoto === (null || '') ? (
                <Avatar
                  name={userPersonalInfos.EmpName}
                  w="2.7rem"
                  h="2.7rem"
                />
              ) : (
                <Avatar
                  src={userPersonalInfos.EmpPhoto}
                  w="2.7rem"
                  h="2.7rem"
                />
              )}
            </MenuButton>
            <MenuList color={'#3d3f41'}>
              <Box w={'100%'} py={'.3rem'}>
                <HStack ms={1}>
                  {userPersonalInfos.EmpPhoto === (null || '') ? (
                    <Avatar
                      name={userPersonalInfos.EmpName}
                      w="2.7rem"
                      h="2.7rem"
                    />
                  ) : (
                    <Avatar
                      src={userPersonalInfos.EmpPhoto}
                      w="2.7rem"
                      h="2.7rem"
                    />
                  )}
                  <Text ps={'.5rem'} cursor={'context-menu'}>
                    {userPersonalInfos.EmpName} <br />{' '}
                    <span style={{ fontSize: '13px' }}>
                      {userPersonalInfos.EmpDesg}
                    </span>
                  </Text>
                </HStack>
              </Box>
              <MenuDivider />

              {/* profile settings */}
              <MenuItem pb={1}>
                <HeaderTextLink
                  link="/personal-info"
                  text="Profile Setting"
                  icon={<FiSettings fontSize={'1.2rem'} color={'#3FD82D'} />}
                />
              </MenuItem>

              {/* Admin Section */}
              {userPersonalInfos.isAdmin ? (
                <MenuItem py={1}>
                  <HeaderTextLink
                    link="/admin-section/insights"
                    text="Admin Section"
                    icon={<RiAdminFill fontSize={'1.2rem'} color={'#FF5722'} />}
                  />
                </MenuItem>
              ) : null}

              <MenuItem py={1} bg="transparent">
                <HStack
                  w={'full'}
                  p={'.4rem'}
                  _hover={{ color: 'white' }}
                  cursor={'pointer'}
                  onClick={() => {
                    localStorage.removeItem('REACT_TOKEN_AUTH_KEY');
                    window.location.reload();
                  }}
                  bg="#C53030"
                  justifyContent={'center'}
                  borderRadius={'8px'}
                  mt={2}
                >
                  <Heading size={'sm'}>Log out</Heading>
                  <FiLogOut size={16} />
                </HStack>
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </div>
    </div>
  );
};

export const AdminConsoleCard = ({ heading, body }) => {
  return (
    <Card
      size={'sm'}
      variant="elevated"
      width={'280px'}
      justify={'center'}
      align={'center'}
      shadow={'lg'}
    >
      <CardHeader>
        <Heading
          fontSize={'32px'}
          lineHeight={'40px'}
          fontWeight="400"
          color={'#1e1f21'}
          className="headingStyleAdminPageInsights"
        >
          <CountUp start={0} end={heading} duration={1} delay={0} />
        </Heading>
      </CardHeader>
      <CardBody>
        <p className="textStyleAdminPageInsights">{body}</p>
      </CardBody>
    </Card>
  );
};

const HeaderTextLink = ({ link, text, icon }) => {
  return (
    <Box w={'full'} my={'.5rem'} _hover={{ color: '#222' }} cursor={'pointer'}>
      <Link to={link}>
        <HStack>
          {icon}
          <Heading size={'sm'}>{text}</Heading>
        </HStack>
      </Link>
    </Box>
  );
};
