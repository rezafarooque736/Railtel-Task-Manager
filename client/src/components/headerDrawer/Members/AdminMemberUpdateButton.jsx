import {
  Button,
  ButtonGroup,
  Checkbox,
  CheckboxGroup,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { putApiData } from '../../../Services/fetchApiFromBackend';

const AdminMemberUpdateButton = ({ user, apiFetchFunc, department_list }) => {
  const [adminValue, setAdminValue] = useState(0);
  const [assignGroup, setAssignGroup] = useState([]);
  const [updateEmail, setUpdateEmail] = useState('');

  const submitUpdates = async e => {
    e.preventDefault();
    const data = {
      isAdmin: parseInt(adminValue),
      AssignGroup: assignGroup.join(','),
    };
    const url = `/api/employee/updateByAdmin/${updateEmail}`;
    const apiData = await putApiData(url, data);
    if (apiData.status === 200) {
      apiFetchFunc();
    }
    setAssignGroup([]);
    setAdminValue(0);
  };

  console.log(adminValue);
  console.log(assignGroup);
  console.log(updateEmail);
  console.log(department_list);

  return (
    <div>
      <Popover>
        <PopoverTrigger>
          <Button
            colorScheme={'telegram'}
            size="xs"
            p="auto"
            fontSize=".77rem"
            // onClick={e => updateClickedEmail(e, user.EmpEmailId)}
            onClick={() => setUpdateEmail(user.EmpEmailId)}
          >
            Update
          </Button>
        </PopoverTrigger>
        <PopoverContent
          px={4}
          color="white"
          bg="blue.700"
          borderColor="blue.800"
          overflowY={'auto'}
          h={'350px'}
        >
          <PopoverHeader py={2}>
            <span style={{ color: '#aaa' }}>Updates of </span>
            {user.EmpName}
          </PopoverHeader>
          <PopoverCloseButton />
          <PopoverBody>
            <RadioGroup
            // defaultValue={user.isAdmin ? '1' : '0'}
            >
              <Stack direction="row">
                <Text color={'#aaa'} fontWeight={'500'}>
                  Admin :
                </Text>
                <Radio
                  colorScheme={'green'}
                  value="1"
                  // onChange={onAdminChange}
                  onChange={e => setAdminValue(Number(e.target.value))}
                >
                  Yes
                </Radio>
                <Radio
                  colorScheme={'red'}
                  value="0"
                  onChange={e => setAdminValue(Number(e.target.value))}
                >
                  No
                </Radio>
              </Stack>
            </RadioGroup>
            <Stack spacing={5} my={2} direction={'row'} flexWrap={'wrap'}>
              <CheckboxGroup
                colorScheme={'green'}
                // defaultValue={user.AssignGroup}
              >
                <Text color={'#aaa'} fontWeight={'500'} mb={4}>
                  Assign Group :
                </Text>
                <AssignGroupByAdmin
                  department_list={department_list}
                  assignGroup={assignGroup}
                  setAssignGroup={setAssignGroup}
                />
              </CheckboxGroup>
            </Stack>
            <ButtonGroup display={'flex'} justifyContent={'flex-end'} pt={4}>
              <Button
                type="submit"
                colorScheme={'telegram'}
                size={'sm'}
                onClick={submitUpdates}
              >
                Save
              </Button>
            </ButtonGroup>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AdminMemberUpdateButton;

const AssignGroupByAdmin = ({
  department_list,
  assignGroup,
  setAssignGroup,
}) => {
  const onAssignGroupChange = e => {
    e.preventDefault();
    if (e.target.checked) {
      setAssignGroup([...assignGroup, e.target.value]);
    } else {
      assignGroup = assignGroup.filter(item => item !== e.target.value);
    }
  };

  return (
    <Stack spacing={[1, 5]} direction={'column'}>
      {department_list.map((empl, index) => (
        <Checkbox
          size={'sm'}
          lineHeight={'2px'}
          value={empl}
          key={index}
          onChange={onAssignGroupChange}
        >
          {empl}
        </Checkbox>
      ))}
    </Stack>
  );
};
