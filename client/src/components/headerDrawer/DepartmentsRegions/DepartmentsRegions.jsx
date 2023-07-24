import React, { useEffect, useState } from 'react';
import '../adminStyles.css';
import { SideBar } from '../../../utils/SideBarUtils';
import { HeaderAdminPage } from '../../../utils/AdminPageUtils';
import departments from '../../../assets/departments.svg';
import { getApiData, postApiData } from '../../../Services/fetchApiFromBackend';
import {
  Button,
  Flex,
  Input,
  Select,
  Tab,
  TabList,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';

const DepartmentsRegions = () => {
  const [department_list, setDepartment_list] = useState([]);
  const [newDepart, setNewDepart] = useState('');
  const [newRegion, setNewRegion] = useState('');
  const [regionSelected, setRegionSelected] = useState('CO');
  const region_list = ['CO', 'ER', 'NR', 'SR', 'WR'];

  async function departmentFetchFunction() {
    const url = '/api/add-department';
    const apiData = await getApiData(url);
    // setDepartment_list(apiData.data.map(el => el.depart));
    setDepartment_list(apiData.data);
  }

  const onAddDepartment = async e => {
    e.preventDefault();
    const data = {
      depart: newDepart,
      region: newRegion,
    };
    const url = '/api/add-department';
    await postApiData(url, data);
    setNewDepart('');
    setNewRegion('');
    departmentFetchFunction();
  };

  useEffect(() => {
    departmentFetchFunction();
  }, []);

  return (
    <div className="AdminConsole">
      <SideBar />
      <div className="AdminConsoleBody">
        <div className="AdminConsolePageStructure">
          <HeaderAdminPage headerText="Departments and Regions" />
          <div className="AdminConsolePageStructure-scrollableContainer">
            <div className="Scrollable--vertical">
              <div className="AdminConsolePageStructure-bodyContainer">
                <div className="AdminConsolePageStructure-body">
                  <div className="AdminConsolePageStructure-bodyContainer-cover">
                    <img
                      src={departments}
                      alt="Add notes cover"
                      width={'170px'}
                      style={{ objectFit: 'contain' }}
                    />
                    <p className="AdminConsolePageStructure-bodyContainer-cover-text">
                      List of Departments & Regions
                    </p>
                  </div>
                  <div className="AdminConsoleInsightsPage">
                    <AddNewDepartment
                      department_list={department_list}
                      region_list={region_list}
                      onAddDepartment={onAddDepartment}
                      newDepart={newDepart}
                      setNewDepart={setNewDepart}
                      setNewRegion={setNewRegion}
                      newRegion={newRegion}
                      regionSelected={regionSelected}
                      setRegionSelected={setRegionSelected}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentsRegions;

const AddNewDepartment = ({
  department_list,
  region_list,
  onAddDepartment,
  newDepart,
  newRegion,
  setNewDepart,
  setNewRegion,
  regionSelected,
  setRegionSelected,
}) => {
  return (
    <Flex
      flexDirection={'column'}
      borderRadius={10}
      p={4}
      py={6}
      gap={5}
      my={5}
      w={'95%'}
      mx={'auto'}
      // bg={'blackAlpha.50'}
    >
      <Text
        fontWeight={'500'}
        fontSize={'1.1rem'}
        color={'#3d3f41'}
        textAlign={'center'}
        w="full"
      >
        Department List
      </Text>
      <Tabs>
        <TabList>
          {region_list.map((region, index) => (
            <Tab key={index} onClick={() => setRegionSelected(region)}>
              {region}
            </Tab>
          ))}
        </TabList>
        <TabPanels my={4}>
          {department_list
            .filter(ele => ele.region === regionSelected)
            .map((depart, index) => (
              <Button
                m={1}
                key={index}
                children={depart.depart}
                colorScheme="teal"
                size={'xs'}
              />
            ))}
        </TabPanels>
      </Tabs>

      <form onSubmit={onAddDepartment}>
        <Flex gap={3} my={3} justifyContent="center" alignItems={'center'}>
          <Text
            minWidth={'fit-content'}
            fontWeight={'500'}
            fontSize={'1.05rem'}
            color="#3d3f41"
          >
            Add new
          </Text>
          <Input
            required
            w={'200px'}
            p={3}
            size="sm"
            focusBorderColor="#666"
            borderColor={'#888'}
            borderRadius={'7px'}
            autoComplete={'off'}
            fontSize={'.87rem'}
            type={'text'}
            value={newDepart}
            color={'#111'}
            _placeholder={{ color: '#3a3b3c' }}
            _hover={{ color: '#444' }}
            placeholder={'New Department...'}
            onChange={e => setNewDepart(e.target.value)}
          />
          <Select
            required
            w={'200px'}
            size={'sm'}
            borderRadius={7}
            color={'#111'}
            placeholder="Select Region"
            focusBorderColor="#666"
            borderColor={'#888'}
            _placeholder={{ color: '#3a3b3c' }}
            _hover={{ color: '#444' }}
            value={newRegion}
            variant={'outline'}
            _focus={{ color: 'gray.500' }}
            onChange={e => setNewRegion(e.target.value)}
          >
            {region_list.map((regn, index) => (
              <option key={index} value={regn}>
                {regn}
              </option>
            ))}
          </Select>
          <Button
            type="submit"
            size={'sm'}
            colorScheme={'blue'}
            onClick={onAddDepartment}
          >
            Add Department
          </Button>
        </Flex>
      </form>
    </Flex>
  );
};
