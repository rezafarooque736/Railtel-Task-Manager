import {
  Button,
  HStack,
  Text,
  Circle,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Input,
  Textarea,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { FaPlusCircle } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import jwt_decode from 'jwt-decode';
import {
  TagMyTeamSnippetsForActionAddNewTeam,
  TagMyTeamSnippetsForInfoAddNewTeam,
} from '../../TagMyTeamSnippets';
import { postApiData, getApiData } from '../../../Services/fetchApiFromBackend';
import { selectedEmployeeForTask } from '../../../Services/controller';
import { TextFeature } from '../../../utils/TextFeature';

const AddNewTaskButton = ({ apiFetchFuncFromTask }) => {
  const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');
  const jwt_decode_data = jwt_decode(token);
  const [taskListAction, setTaskListAction] = useState([]);
  const [taskListInfo, setTaskListInfo] = useState([]);
  const [allPersonalInfosForAddTeam, setAllPersonalInfosForAddTeam] = useState(
    []
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const apiFetchFunc = async () => {
    const url = '/api/EmployeeList';
    const apiData = await getApiData(url);
    const AssignGroups = jwt_decode_data.AssignGroup.split(',');

    setAllPersonalInfosForAddTeam(
      apiData.data.filter(
        user =>
          user.EmpEmailId !== jwt_decode_data.email &&
          AssignGroups.includes(user.EmpDepart)
      )
    );
  };

  useEffect(() => {
    apiFetchFunc(); //call function
  }, []);

  /** function for select employee Action task */
  let onSelectActionTasks = task => {
    setTaskListAction(selectedEmployeeForTask(task));
  };

  /** function for select employee Info task */
  let onSelectInfoTasks = task => {
    setTaskListInfo(selectedEmployeeForTask(task));
  };

  const addNewTaskSubmit = async d => {
    let actionTaskListt = taskListAction.map(ele => ele[0]).join(); // .join convert array to string
    let infoTaskListt = taskListInfo.map(ele => ele[0]).join(); // .join convert array to string
    const data = {
      title: d.title,
      description: d.description,
      action_team: actionTaskListt,
      info_team: infoTaskListt,
    };

    const url = '/api/tasks';
    await postApiData(url, data);
    apiFetchFuncFromTask();
    reset();
    onClose();
    setTaskListAction([]);
    setTaskListInfo([]);

    // sending push notification
    const notificationApiData = {
      emails: taskListAction.map(ele => ele[2]),
      header: 'New Task Created',
      body: d.title,
      type: 'new_task',
    };

    const notificationApiUrl = '/api/send-notification-to-multiple';

    await postApiData(notificationApiUrl, notificationApiData);
  };

  return (
    <HStack>
      <Button
        borderRadius={'full'}
        onClick={onOpen}
        colorScheme={'yellow'}
        alignSelf={'center'}
        w={['11rem', '16rem']}
        h={'2rem'}
        my={'.5rem'}
      >
        <Text
          pe={'.75rem'}
          letterSpacing={['.03rem', '.07rem']}
          color={'blackAlpha.800'}
        >
          Add New Task
        </Text>
        <Circle pos={'absolute'} right={'.2rem'}>
          <FaPlusCircle size={23} color={'blackAlpha'} />
        </Circle>
      </Button>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody pb={'1rem'} mt={'1rem'} py={0} fontSize={'.9rem'}>
            <Text fontWeight={'500'} fontSize={'1rem'}>
              Create new Task
            </Text>
            <Input
              my={1}
              p={3}
              size="sm"
              _focus={{ background: '#fff' }}
              focusBorderColor="#eee"
              autoComplete={'off'}
              borderRadius={7}
              fontSize={'.87rem'}
              autoFocus
              type={'text'}
              placeholder={'Task name'}
              {...register('title', { required: true, maxLength: 65 })}
            />
            {errors.title?.type === 'required' && (
              <TextFeature text="Title is required" />
            )}
            {errors.title?.type === 'maxLength' && (
              <TextFeature text="Max Character should be 65" />
            )}
            <Textarea
              size="sm"
              _focus={{ background: '#fff' }}
              focusBorderColor="#eee"
              autoComplete={'off'}
              borderRadius={7}
              p={2}
              my={1}
              placeholder={'Task Description [optional]'}
              {...register('description')}
            />
            <HStack alignSelf={'flex-start'} my={2}>
              <Text fontWeight={'500'} fontSize={'1rem'}>
                Tag my Team
              </Text>
            </HStack>

            {/* Tag my Teamm For action */}
            <TagMyTeamSnippetsForActionAddNewTeam
              onSelectTask={onSelectActionTasks}
              onRemoveTask={onSelectActionTasks}
              options={allPersonalInfosForAddTeam}
            />

            {/* Tag my Teamm For Info */}
            <TagMyTeamSnippetsForInfoAddNewTeam
              onSelectTask={onSelectInfoTasks}
              onRemoveTask={onSelectInfoTasks}
              options={allPersonalInfosForAddTeam}
            />

            <HStack justifyContent={'flex-end'} pt={'1.7rem'}>
              <Button
                type={'reset'}
                size={'sm'}
                variant={'outline'}
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type={'submit'}
                size={'sm'}
                colorScheme={'telegram'}
                onClick={handleSubmit(addNewTaskSubmit)}
              >
                Add task
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </HStack>
  );
};

export default AddNewTaskButton;
