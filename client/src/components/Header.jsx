import {
  Avatar,
  Box,
  Button,
  HStack,
  Img,
  Square,
  Text,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Heading,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { FiLogOut, FiSettings } from 'react-icons/fi';
import { RiAdminFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import rtLogo from '../assets/railtel_logo.png';
import jwt_decode from 'jwt-decode';
import { getApiData } from '../Services/fetchApiFromBackend';

const Header = () => {
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

  const Links = [{ link: '/home', text: 'Home' }];

  return (
    <Box ps={4} pe={2}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <HStack spacing={2} alignItems={'center'}>
          <Box>
            <Link to={'/home'}>
              <Square
                bg={'#fff'}
                size={['2.7rem', '3rem']}
                borderRadius={'full'}
              >
                <Img
                  src={rtLogo}
                  w={['1.64rem', '1.81rem']}
                  h={['2.2rem', '2.6rem']}
                />
              </Square>
            </Link>
          </Box>
          <HStack as={'nav'} spacing={4} pl={4} display={['none', 'flex']}>
            {Links.map((elem, index) => (
              <HeaderTextLink key={index} link={elem.link} text={elem.text} />
            ))}
          </HStack>
        </HStack>
        <Heading size={['xs', 'md']}>RailTel Task Manager</Heading>
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
            <MenuList
              bgGradient={'linear(to-r, #0E2A47, #2264AB)'}
              color={'#d4d2d7'}
            >
              <Box w={'95%'} py={'.3rem'}>
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
              <MenuItem bgGradient={'linear(to-r, #0E2A47, #2264AB)'} pb={1}>
                <HeaderTextLink
                  link="/personal-info"
                  text="Profile Setting"
                  icon={<FiSettings fontSize={'1.2rem'} color={'#3FD82D'} />}
                />
              </MenuItem>

              {/* Admin Section */}
              {userPersonalInfos.isAdmin ? (
                <MenuItem bgGradient={'linear(to-r, #0E2A47, #2264AB)'} py={1}>
                  <HeaderTextLink
                    link="/admin-section/insights"
                    text="Admin Section"
                    icon={<RiAdminFill fontSize={'1.2rem'} color={'#FF5722'} />}
                  />
                </MenuItem>
              ) : null}

              <MenuItem bgGradient={'linear(to-r, #0E2A47, #2264AB)'} py={1}>
                <HStack
                  w={'full'}
                  p={'.4rem'}
                  _hover={{ color: 'gray' }}
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
      </Flex>
    </Box>
  );
};

export default Header;

const HeaderTextLink = ({ link, text, icon }) => {
  return (
    <Box w={'full'} my={'.5rem'} _hover={{ color: 'gray' }} cursor={'pointer'}>
      <Link to={link}>
        <HStack>
          {icon}
          <Heading size={'sm'}>{text}</Heading>
        </HStack>
      </Link>
    </Box>
  );
};
