import React, { useEffect, useState } from 'react';
import '../adminStyles.css';
import { SideBar } from '../../../utils/SideBarUtils';
import { HeaderAdminPage } from '../../../utils/AdminPageUtils';
import { getApiData } from '../../../Services/fetchApiFromBackend';
import {
  Avatar,
  Box,
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import AdminMemberUpdateButton from './AdminMemberUpdateButton';

const Members = () => {
  let [total_members, setTotal_Members] = useState([]);
  const [department_list, setDepartment_list] = useState([]);

  async function apiFetchFunc() {
    const url = '/api/EmployeeList';
    const apiData = await getApiData(url);
    setTotal_Members(apiData.data);
  }

  async function departmentFetchFunction() {
    const url = '/api/add-department';
    const apiData = await getApiData(url);
    setDepartment_list(apiData.data.map(departObj => departObj.depart));
  }

  useEffect(() => {
    apiFetchFunc();
    departmentFetchFunction();
  }, []);

  return (
    <div className="AdminConsole">
      <SideBar />
      <div className="AdminConsoleBody" style={{ overflow: 'hidden' }}>
        <div className="AdminConsolePageStructure">
          <HeaderAdminPage headerText="Members" />
          <div className="AdminConsolePageStructure-scrollableContainer">
            <div
              className="Scrollable--vertical"
              style={{ overflowY: 'overlay' }}
            >
              <div className="AdminConsolePageStructure-bodyContainer">
                <Box>
                  <TableContainer my={'20px'}>
                    <Table
                      variant={'simple'}
                      size={'sm'}
                      style={{
                        color: '#1e1f21',
                        fontSize: '14px',
                        fontWeight: '400',
                      }}
                    >
                      <Thead>
                        <Tr>
                          <Th>Name</Th>
                          <Th>Admin</Th>
                          <Th>Department</Th>
                          <Th>Assign Group</Th>
                          <Th>Created At Group</Th>
                          <Th>Others</Th>
                          <Th>Action</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {total_members.map((user, index) => {
                          return (
                            <Tr key={index}>
                              <Td>
                                <Box
                                  display={'flex'}
                                  alignItems="center"
                                  gap={'5px'}
                                >
                                  <Avatar
                                    src={user.EmpPhoto}
                                    size={'sm'}
                                    name={user.EmpName}
                                  />
                                  <div>
                                    <span>{user.EmpName}</span>
                                    <Box color={'#6d6e6f'} fontSize="12px">
                                      {user.EmpEmailId}
                                    </Box>
                                  </div>
                                </Box>
                              </Td>
                              <Td>{user.isAdmin ? 'Yes' : 'No'}</Td>
                              <Td>{user.EmpDepart}</Td>
                              <Td>{user.AssignGroup}</Td>
                              <Td>
                                {new Date(
                                  user.created_at * 1000
                                ).toLocaleString()}
                              </Td>
                              <Td px={2} fontSize={'.6rem'}>
                                {/* popover starts from here */}
                                <Popover>
                                  <PopoverTrigger>
                                    <Button
                                      size="xs"
                                      p="auto"
                                      fontSize=".77rem"
                                      colorScheme="teal"
                                    >
                                      More...
                                    </Button>
                                  </PopoverTrigger>
                                  <Portal>
                                    <PopoverContent
                                      color="white"
                                      bg="blue.800"
                                      borderColor="blue.800"
                                    >
                                      <PopoverArrow />
                                      <PopoverHeader py={1}>
                                        <span style={{ color: '#aaa' }}>
                                          Other details of{' '}
                                        </span>
                                        {user.EmpName}
                                      </PopoverHeader>
                                      <PopoverCloseButton />
                                      <PopoverBody>
                                        <TableContainer>
                                          <Table
                                            variant={'unstyled'}
                                            size={'sm'}
                                          >
                                            <PopoverTableData
                                              ltext="Employee Id"
                                              rtext={user.EmpId}
                                            />
                                            <PopoverTableData
                                              ltext="Blood Group"
                                              rtext={user.BloodGroup}
                                            />
                                            <PopoverTableData
                                              ltext="Mobile No"
                                              rtext={user.MobileNo}
                                            />
                                            <PopoverTableData
                                              ltext="Designation"
                                              rtext={user.EmpDesg}
                                            />
                                            <PopoverTableData
                                              ltext="Location"
                                              rtext={user.EmpPlaceOfPosting}
                                            />
                                          </Table>
                                        </TableContainer>
                                      </PopoverBody>
                                    </PopoverContent>
                                  </Portal>
                                </Popover>
                              </Td>
                              <Td px={0}>
                                <AdminMemberUpdateButton
                                  user={user}
                                  apiFetchFunc={apiFetchFunc}
                                  department_list={department_list}
                                />
                              </Td>
                            </Tr>
                          );
                        })}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Box>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Members;

const PopoverTableData = ({ ltext, rtext, display }) => {
  return (
    <Tbody>
      <Tr>
        <Th textAlign={'right'} color={'#999'} pr={'10px'} display={display}>
          {ltext}
        </Th>
        <Td fontSize={'.77rem'} display={display}>
          {rtext}
        </Td>
      </Tr>
    </Tbody>
  );
};
