import {
  Avatar,
  AvatarGroup,
  Box,
  HStack,
  IconButton,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import Multiselect from 'multiselect-react-dropdown';
import { useState, useEffect } from 'react';
import {
  getApiData,
  postApiData,
  putApiData,
} from '../Services/fetchApiFromBackend';
import './TagMyTeamSnippets.css';
import jwt_decode from 'jwt-decode';
import { selectedEmployeeForTask } from '../Services/controller';
import { useLocation } from 'react-router-dom';
import addMember from '../assets/addMember.svg';

export const TagMyTeamSnippetsForAction = ({
  title,
  newText,
  action_team,
  TaskId,
  apiFetchFuncFromTask,
}) => {
  const location = useLocation();
  const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');
  const jwt_decode_data = jwt_decode(token);
  const [allPersonalInfosForAddTeam, setAllPersonalInfosForAddTeam] = useState(
    []
  );
  const [actionTeamList, setActionTeamList] = useState([]);
  const [allPersonalInfos, setAllPersonalInfos] = useState([]);
  const [taskListAction, setTaskListAction] = useState([]);

  const selectedValueDecorator = name => {
    return (
      <Tooltip
        hasArrow
        label={name}
        bg="gray.300"
        color="black"
        placement="top"
      >
        <Avatar
          name={name}
          size={'sm'}
          // m={'-15px'}
          mb={'7px'}
          // ml={"5px"}
        />
      </Tooltip>
    );
  };

  // allPersonalInfosForAddTeam
  async function apiFetchFunc() {
    const url = '/api/EmployeeList';
    const apiData = await getApiData(url);
    const AssignGroups = jwt_decode_data.AssignGroup.split(',');
    setAllPersonalInfos(apiData.data);
    setAllPersonalInfosForAddTeam(
      apiData.data.filter(
        user =>
          user.EmpEmailId !== jwt_decode_data.email &&
          AssignGroups.includes(user.EmpDepart)
      )
      // .filter(user => AssignGroups.includes(user.EmpDepart))
    );
  }

  /** addNewActionTeam */
  const addNewActionTeam = async title => {
    let actionTaskListt = taskListAction.map(ele => ele[0]).join(); // .join convert array to string
    // if (actionTaskListt !== '' || null || undefined) {
    const data = {
      action_team: actionTaskListt,
      created_by: jwt_decode_data.fullname,
    };

    const url = `/api/tasks/addNewActionTeam/${TaskId}`;
    await putApiData(url, data);
    alert('Action Team Added Successfully');
    apiFetchFuncFromTask();

    const notificationApiData = {
      emails: taskListAction.map(ele => ele[2]),
      header: 'New Member Added',
      title: title,
      type: 'add_new_team',
    };

    const notificationApiUrl = '/api/send-notification-to-multiple';

    await postApiData(notificationApiUrl, notificationApiData);
  };

  /** function for select employee Action task */
  let onSelectActionTasks = task => {
    setTaskListAction(selectedEmployeeForTask(task));
  };

  // execute automatically only once at page reload time
  useEffect(() => {
    apiFetchFunc(); //fetch api function for allPersonalInfosForAddTeam and userPersonal Info

    setActionTeamList(action_team.split(','));
  }, [action_team]);

  return (
    <HStack mb={['1em', '2em']} spacing={0} w="full">
      <Box width="100%">
        {location.pathname === '/tasks' ? (
          <Multiselect
            displayValue="EmpName"
            groupBy="EmpDepart"
            onSelect={onSelectActionTasks} // Function will trigger on select event
            onRemove={onSelectActionTasks} // Function will trigger on remove event
            options={allPersonalInfosForAddTeam}
            showCheckbox
            // hideSelectedList
            customCloseIcon={<></>}
            selectedValueDecorator={selectedValueDecorator}
            selectedValues={allPersonalInfos.filter(user =>
              actionTeamList.includes(user.EmpName)
            )}
            placeholder="Add team for Action - ➕"
            style={{
              multiselectContainer: {
                fontSize: '.87rem',
              },
              searchBox: {
                border: 'none',
                padding: '.1rem',
                fontSize: '.9rem',
              },
              chips: {
                background: 'none',
                padding: 0,
                margin: '-2px',
              },
            }}
          />
        ) : (
          <AvatarGroup flexWrap={'wrap'} p={'4px'}>
            {allPersonalInfos
              .filter(elem => actionTeamList.includes(elem.EmpName))
              .map((emp, index) => {
                return (
                  <Tooltip
                    key={index}
                    hasArrow
                    label={emp.EmpName}
                    bg="gray.300"
                    color="black"
                    placement="top"
                  >
                    <Avatar
                      name={emp.EmpName}
                      src={emp.EmpPhoto}
                      size={'sm'}
                      mx={'-3px'}
                    />
                  </Tooltip>
                );
              })}
          </AvatarGroup>
        )}
      </Box>

      <IconButton
        colorScheme={'green'}
        alignSelf={'flex-start'}
        size={'xs'}
        onClick={() => addNewActionTeam(title)}
        display={location.pathname === '/tasks' ? 'inline-flex' : 'none'}
      >
        <img src={addMember} alt="add team for action submit button" />
      </IconButton>
    </HStack>
  );
};

export const TagMyTeamSnippetsForInfo = ({
  newText,
  info_team,
  TaskId,
  apiFetchFuncFromTask,
}) => {
  const location = useLocation();
  const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');
  const jwt_decode_data = jwt_decode(token);
  const [allPersonalInfosForAddTeam, setAllPersonalInfosForAddTeam] = useState(
    []
  );
  const [infoTeamList, setInfoTeamList] = useState([]);
  const [allPersonalInfos, setAllPersonalInfos] = useState([]);
  const [taskListInfo, setTaskListInfo] = useState([]);

  const selectedValueDecorator = name => {
    return (
      <Tooltip
        hasArrow
        label={name}
        bg="gray.300"
        color="black"
        placement="top"
      >
        <Avatar
          name={name}
          size={'sm'}
          // m={'-15px'}
          mb={'7px'}
          // ml={"5px"}
        />
      </Tooltip>
    );
  };

  // allPersonalInfosForAddTeam
  async function apiFetchFunc() {
    const url = '/api/EmployeeList';
    const apiData = await getApiData(url);
    const AssignGroups = jwt_decode_data.AssignGroup.split(',');
    setAllPersonalInfos(apiData.data);
    setAllPersonalInfosForAddTeam(
      apiData.data.filter(
        user =>
          user.EmpEmailId !== jwt_decode_data.email &&
          AssignGroups.includes(user.EmpDepart)
      )
      // .filter(user => AssignGroups.includes(user.EmpDepart))
    );
  }

  /** addNewInfoTeam */
  const addNewInfoTeam = async () => {
    let infoTaskListt = taskListInfo.map(ele => ele[0]).join(); // .join convert array to string

    // if (infoTaskListt !== '' || null || undefined) {
    const data = {
      info_team: infoTaskListt,
      created_by: jwt_decode_data.fullname,
    };

    const url = `/api/tasks/addNewInfoTeam/${TaskId}`;
    await putApiData(url, data);
    alert('Info Team Added Successfully');
    apiFetchFuncFromTask();
    // } else {
    //   alert('Plaese,select team for Info');
    // }
  };

  /** function for select employee Info task */
  let onSelectInfoTasks = task => {
    setTaskListInfo(selectedEmployeeForTask(task));
  };

  // execute automatically only once at page reload time
  useEffect(() => {
    apiFetchFunc(); //fetch api function for allPersonalInfosForAddTeam and userPersonal Info

    setInfoTeamList(info_team.split(','));
  }, [info_team]);

  return (
    <HStack mb={['1em', '2em']} spacing={0} w="full">
      <Box w="100%">
        {location.pathname === '/tasks' ? (
          <Multiselect
            displayValue="EmpName"
            groupBy="EmpDepart"
            onSelect={onSelectInfoTasks} // Function will trigger on select event
            onRemove={onSelectInfoTasks} // Function will trigger on remove event
            options={allPersonalInfosForAddTeam}
            showCheckbox
            // hideSelectedList
            customCloseIcon={<></>}
            selectedValueDecorator={selectedValueDecorator}
            selectedValues={allPersonalInfos.filter(user =>
              infoTeamList.includes(user.EmpName)
            )}
            placeholder="Add Team for Info - ➕"
            style={{
              multiselectContainer: {
                fontSize: '.87rem',
              },
              searchBox: {
                border: 'none',
                padding: '.1rem',
                fontSize: '.9rem',
              },
              chips: {
                background: 'none',
                padding: 0,
                margin: '-2px',
              },
            }}
          />
        ) : (
          <AvatarGroup flexWrap={'wrap'} p={'4px'}>
            {allPersonalInfos
              .filter(user => infoTeamList.includes(user.EmpName))
              .map((emp, index) => {
                return (
                  <Tooltip
                    key={index}
                    hasArrow
                    label={emp.EmpName}
                    bg="gray.300"
                    color="black"
                    placement="top"
                  >
                    <Avatar
                      name={emp.EmpName}
                      src={emp.EmpPhoto}
                      size={'sm'}
                      mx={'-3px'}
                    />
                  </Tooltip>
                );
              })}
          </AvatarGroup>
        )}
      </Box>

      <IconButton
        colorScheme={'orange'}
        alignSelf={'flex-start'}
        size={'xs'}
        onClick={addNewInfoTeam}
        display={location.pathname === '/tasks' ? 'inline-flex' : 'none'}
      >
        <img
          src={addMember}
          alt="add team for Information submit button"
          title="add team for Information submit button"
        />
      </IconButton>
    </HStack>
  );
};

export const TagMyTeamSnippetsForActionAddNewTeam = ({
  selectedValues,
  onSelectTask,
  onRemoveTask,
  options,
}) => {
  const selectedValueDecorator = name => {
    return (
      <Tooltip
        hasArrow
        label={name}
        bg="gray.300"
        color="black"
        placement="top"
      >
        <Avatar
          name={name}
          size={'sm'}
          // m={'-15px'}
          mb={'7px'}
          // ml={"5px"}
        />
      </Tooltip>
    );
  };

  return (
    <VStack mb={['1em', '2em']} spacing={0} w="full">
      <Box w="100%">
        <Multiselect
          displayValue="EmpName"
          groupBy="EmpDepart"
          onSelect={onSelectTask} // Function will trigger on select event
          onRemove={onRemoveTask} // Function will trigger on remove event
          options={options}
          showCheckbox
          // hideSelectedList
          customCloseIcon={<></>}
          selectedValueDecorator={selectedValueDecorator}
          selectedValues={selectedValues}
          // disablePreSelectedValues
          placeholder="Add team for Action - ➕"
          style={{
            multiselectContainer: {
              fontSize: '.87rem',
            },
            searchBox: {
              border: 'none',
              padding: '.1rem',
              fontSize: '.9rem',
            },
            chips: {
              background: 'none',
              padding: 0,
              margin: '-2px',
            },
          }}
        />
      </Box>
    </VStack>
  );
};

export const TagMyTeamSnippetsForInfoAddNewTeam = ({
  addNewInfoTeam,
  selectedValues,
  onSelectTask,
  onRemoveTask,
  options,
}) => {
  const selectedValueDecorator = name => {
    return (
      <Tooltip
        hasArrow
        label={name}
        bg="gray.300"
        color="black"
        placement="top"
      >
        <Avatar
          name={name}
          size={'sm'}
          // m={'-15px'}
          mb={'7px'}
          // ml={"5px"}
        />
      </Tooltip>
    );
  };

  return (
    <VStack mb={['1em', '2em']} spacing={0} w="full">
      <Box w="100%">
        <Multiselect
          displayValue="EmpName"
          groupBy="EmpDepart"
          onSelect={onSelectTask} // Function will trigger on select event
          onRemove={onRemoveTask} // Function will trigger on remove event
          options={options}
          showCheckbox
          // hideSelectedList
          customCloseIcon={<></>}
          selectedValueDecorator={selectedValueDecorator}
          selectedValues={selectedValues}
          // disablePreSelectedValues
          placeholder="Add Team for Info - ➕"
          style={{
            multiselectContainer: {
              fontSize: '.87rem',
            },
            searchBox: {
              border: 'none',
              padding: '.1rem',
              fontSize: '.9rem',
            },
            chips: {
              background: 'none',
              padding: 0,
              margin: '-2px',
            },
          }}
        />
      </Box>
    </VStack>
  );
};
