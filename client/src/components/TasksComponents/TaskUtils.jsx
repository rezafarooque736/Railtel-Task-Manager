import {
  Box,
  Button,
  ButtonGroup,
  Editable,
  EditablePreview,
  EditableTextarea,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
  useEditableControls,
  VStack,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { BiArchiveIn, BiSearch } from 'react-icons/bi';
import {
  deleteApiData,
  getApiData,
  putApiData,
} from '../../Services/fetchApiFromBackend';
import CommentFeature from './CommentFeature';
import { FaStickyNote } from 'react-icons/fa';
import { AiOutlineCheck, AiOutlineClose, AiOutlineEdit } from 'react-icons/ai';
import './TaskStyles.css';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  TagMyTeamSnippetsForAction,
  TagMyTeamSnippetsForInfo,
} from '../TagMyTeamSnippets';
import { RiDeleteBinLine } from 'react-icons/ri';
import WorkProgressBar from './WorkProgressBar';
import SubmitFile from './submitTask/submitFiles/SubmitFile';
import SubmitCommentMessage from './submitTask/SubmitCommentMessage/SubmitCommentMessage';

const TaskTitleDescriptionEditable = ({
  TaskId,
  title,
  description,
  apiFetchFuncFromTask,
}) => {
  const location = useLocation();
  const [newDescription, setNewDescription] = useState(description);

  const handleNewDescriptionSubmit = async () => {
    const url = `/api/tasks/updateDescription/${TaskId}`;
    const data = { description: newDescription };

    await putApiData(url, data);
    apiFetchFuncFromTask();
  };

  function EditableControls() {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls();

    return isEditing ? (
      <ButtonGroup
        justifyContent="center"
        size="sm"
        position={'absolute'}
        top="0"
        right={'0'}
      >
        <IconButton
          size="xs"
          colorScheme={'green'}
          icon={<AiOutlineCheck fontSize={'1rem'} />}
          {...getSubmitButtonProps()}
        />
        <IconButton
          size={'xs'}
          colorScheme="red"
          icon={<AiOutlineClose fontSize={'1rem'} />}
          {...getCancelButtonProps()}
        />
      </ButtonGroup>
    ) : (
      <HStack
        justifyContent="center"
        position={'absolute'}
        top={[1, 0]}
        right={0}
      >
        <IconButton
          size="xs"
          display={location.pathname === '/tasks' ? 'inline-flex' : 'none'}
          colorScheme={'yellow'}
          icon={<AiOutlineEdit fontSize={'1rem'} />}
          {...getEditButtonProps()}
        />
      </HStack>
    );
  }

  return (
    <Box
      className="displayFlexColumn"
      backgroundColor="#f9f9f8"
      borderRadius={'7px'}
      px="10px"
      marginBottom="15px"
      position={'relative'}
    >
      <Text fontSize={'17px'} fontFamily={'inherit'} fontWeight={'500'} mb={1}>
        {title}
      </Text>
      <Editable
        defaultValue={description}
        fontSize={'14px'}
        fontWeight={'400'}
        onSubmit={
          location.pathname === '/tasks' ? handleNewDescriptionSubmit : null
        }
        onChange={value => setNewDescription(value)}
      >
        <HStack justifyContent={'space-between'}>
          <EditablePreview />
          <EditableTextarea rows={'4'} p={1} />
          <EditableControls />
        </HStack>
      </Editable>
    </Box>
  );
};

export const TaskComments = ({ TaskId,title, apiFetchFuncFromTask, action_team }) => {
  const location = useLocation();
  const [Comments, setComments] = useState([]);

  const memoizedGetAllCommentsAPI = useCallback(async () => {
    const url = `/api/comments/${TaskId}`;
    const apiData = await getApiData(url);
    setComments(apiData.data);
  }, [TaskId]);

  // execute automatically only once at page reload time
  useEffect(() => {
    memoizedGetAllCommentsAPI(); //function for api fetch function get all comments.
  }, []);

  return (
    <VStack my={'.5rem'}>
      {/* Comments body Starts here */}
      <Box
        borderRadius={'.3rem'}
        // h={['40vh', '60vh']}
        width={'100%'}
        wordBreak={'break-word'}
      >
        <VStack w={'full'} pb={'2rem'}>
          {Comments.map((comments, index) => (
            <CommentFeature
              key={index}
              CommentBy={comments.CommentBy}
              CommentBody={comments.CommentBody}
              comment_date_time={comments.comment_date_time}
              old_filename={comments.old_filename}
              new_filename={comments.new_filename}
              file_url={comments.file_url}
            />
          ))}
          <Box display={location.pathname === '/archives' && 'none'}>
            <HStack
              position={'absolute'}
              w={'100%'}
              bottom={0}
              left={0}
              right={0}
              bg="#f9f9f8"
              alignItems={'center'}
              px={[1, 2]}
            >
              {/* Attach Files Button */}
              <SubmitFile
                TaskId={TaskId}
                apiFetchFuncFromTask={apiFetchFuncFromTask}
                getAllCommentsAPI={memoizedGetAllCommentsAPI}
              ></SubmitFile>

              {/* submit Comment Message */}
              <SubmitCommentMessage
                TaskId={TaskId}
                title={title}
                apiFetchFuncFromTask={apiFetchFuncFromTask}
                getAllCommentsAPI={memoizedGetAllCommentsAPI}
                action_team={action_team}
              ></SubmitCommentMessage>
            </HStack>
          </Box>
        </VStack>
      </Box>
    </VStack>
  );
};

export const HeadingWithSearch = ({ textShow, searchText, setsearchText }) => (
  <HStack my={3}>
    <Text
      fontSize={'18px'}
      fontWeight="700"
      lineHeight={'25px'}
      minW={'fit-content'}
      me={2}
    >
      {textShow}
    </Text>
    <InputGroup size={'sm'}>
      <InputLeftElement
        pointerEvents={'none'}
        children={<BiSearch color="#aaa" fontSize={'1.2rem'} />}
      />
      <Input
        required
        bg="blackAlpha.200"
        w={['100%', '16rem']}
        borderColor={'#aaa'}
        autoComplete={'off'}
        type={'search'}
        value={searchText}
        alignSelf={'center'}
        placeholder="Search"
        borderRadius={'7px'}
        _focus={{ border: '.5px solid #aaa', outline: 'none', width: '100%' }}
        onChange={e => setsearchText(e.target.value.toLowerCase())}
      />
    </InputGroup>
  </HStack>
);

export const TaskOneRowTitleDescription = ({
  onOpen,
  title,
  date_time,
  created_by,
  description,
  addToTaskFromArchive,
  id,
}) => {
  const location = useLocation();
  return (
    <HStack
      ps={'.2rem'}
      onClick={onOpen}
      fontSize={'.87rem'}
      py={['.3rem', '.5rem']}
      cursor="pointer"
      _hover={{ color: '#adadad' }}
    >
      <FaStickyNote size={18} color={'#D69E2E'} />
      <VStack alignItems={'flex-start'} w={'full'} spacing={1}>
        {/* row one */}
        <HStack w="full" spacing={0}>
          <Text
            flex={'1'}
            children={title}
            fontSize="15px"
            fontWeight={'400'}
            lineHeight="18px"
          />
          {/* will display for laptop only */}
          <Text
            display={['none', 'inline-flex']}
            px={2}
            w="fit-content"
            color={'#bbb'}
            fontSize={'12px'}
            lineHeight="15px"
            children={new Date(date_time * 1000).toLocaleString()}
          />

          <Button
            display={location.pathname === '/archives' ? 'inline-flex' : 'none'}
            size={'xs'}
            colorScheme={'green'}
            variant={['solid', 'outline']}
            onClick={() => addToTaskFromArchive(id)}
          >
            move to Task
          </Button>
        </HStack>

        {/* row two */}
        <Stack
          direction={['column', 'row']}
          justifyContent="space-between"
          w="full"
          spacing={0}
        >
          <Text
            flex={'1'}
            display={['inline-flex', 'none']}
            // display={
            //   description === ('' && `` && '' && undefined && null) && 'none'
            // }
            fontSize="12px"
            fontWeight={'400'}
            lineHeight="16px"
            color={'#bbb'}
          >
            {location.pathname === '/archives'
              ? `${description.slice(0, 92)} ${
                  description.length > 92 ? '...' : ''
                }`
              : `${description.slice(0, 46)} ${
                  description.length > 46 ? '...' : ''
                }`}
          </Text>
          <Text
            flex={'1'}
            display={['none', 'inline-flex']}
            // display={
            //   description === ('' && `` && '' && undefined && null) && 'none'
            // }
            fontSize="12px"
            fontWeight={'400'}
            lineHeight="16px"
            color={'#bbb'}
          >
            {location.pathname === '/archives'
              ? `${description.slice(0, 300)} ${
                  description.length > 300 ? '...' : ''
                }`
              : `${description.slice(0, 140)} ${
                  description.length > 140 ? '...' : ''
                }`}
          </Text>
          <HStack justifyContent={'space-between'} py={'4px'} color={'#adadad'}>
            <Text
              display={['inline-flex', 'none']}
              // px={2}
              w="fit-content"
              fontSize={'12px'}
              lineHeight="15px"
              children={new Date(date_time * 1000).toLocaleString()}
            />
            <Text
              w="fit-content"
              fontSize={'12px'}
              lineHeight="15px"
              display={
                location.pathname === '/actionable-task'
                  ? 'inline-flex'
                  : 'none'
              }
            >
              -by {created_by}
            </Text>
            <Text
              w="fit-content"
              fontSize={'12px'}
              lineHeight="15px"
              display={
                location.pathname === '/informational-task'
                  ? 'inline-flex'
                  : 'none'
              }
            >
              -by {created_by}
            </Text>
          </HStack>
        </Stack>
      </VStack>
    </HStack>
  );
};

export const GoToButton = ({ btn2Text, btn2Link }) => {
  const navigate = useNavigate();

  const goToActionableTasks = () => {
    navigate(btn2Link, { replace: true });
  };

  return (
    <HStack w="full" justifyContent={'space-between'} my={5} px={3}>
      <Button
        colorScheme={'yellow'}
        borderRadius="full"
        size={'sm'}
        onClick={() => navigate(-1)}
      >
        Go back
      </Button>
      <Button
        colorScheme={'yellow'}
        borderRadius="full"
        size={'sm'}
        onClick={goToActionableTasks}
      >
        {btn2Text}
      </Button>
    </HStack>
  );
};

// Modal comment with tag team Components
export const ModalCommentWithTagTeam = ({
  isOpen,
  onClose,
  TaskId,
  title,
  description,
  action_team,
  info_team,
  created_by,
  apiFetchFuncFromTask,
  tagYourTeamText,
}) => {
  const location = useLocation();

  /** delete task by taskId */
  const deleteTaskById = async taskId => {
    const url1 = `/api/comments/${taskId}`;
    const url2 = `/api/task/${taskId}`;
    await deleteApiData(url1);
    await deleteApiData(url2);
    apiFetchFuncFromTask();
  };

  // archive task function
  const archiveTask = async TaskId => {
    const url = `/api/task/${TaskId}`;
    const data = {
      isArchived: 1,
      archive_by: `${created_by}`,
    };

    await putApiData(url, data);
  };

  const [sliderValue, setSliderValue] = useState(0);

  useEffect(() => {
    async function getWorkerProgressBarValue() {
      const url = `/api/task/progress/${TaskId}`;
      const apiData = await getApiData(url);
      // console.log(apiData.data[0].taskProgress);
      setSliderValue(apiData.data[0].taskProgress);
    }
    getWorkerProgressBarValue();
  }, [TaskId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        borderRadius={'12px'}
        width={['93%', '880px']}
        maxWidth={['93%', '880px']}
        height={'93%'}
        maxHeight={'93%'}
        mt={7}
        mx={2}
      >
        <ModalCloseButton
          me={[-3, -2]}
          mt={[-2, -1]}
          size={'sm'}
          bg="#C53030"
          color={'white'}
          zIndex={1}
          _hover={{ background: '#f10808', color: 'white' }}
        />
        <ModalBody
          mt={'1.5rem'}
          mb={'1rem'}
          py={0}
          fontSize={'.9rem'}
          display="grid"
          gridTemplateColumns={['100%', '600px 260px']}
          overflowY={['scroll', 'hidden']}
          px={2}
        >
          <Box me={[0, 3]} position={'relative'} height={['80vh', '88vh']}>
            <Box overflowY={'auto'} height={'100%'}>
              {/* Task title , descriptionStarts here */}
              <TaskTitleDescriptionEditable
                TaskId={TaskId}
                title={title}
                description={description}
                apiFetchFuncFromTask={apiFetchFuncFromTask}
              />

              {/* Comments body starts here */}
              <TaskComments
                TaskId={TaskId}
                title={title}
                apiFetchFuncFromTask={apiFetchFuncFromTask}
                action_team={action_team}
              />
              {/* Comments body ends here */}
            </Box>
          </Box>

          <Box
            bg="#f9f9f8"
            p={2}
            borderRadius="7px"
            py={['auto', '3']}
            height={'100%'}
          >
            {/* Tagged Team starts here */}

            <Text
              fontWeight={'500'}
              lineHeight="27px"
              color="#202020"
              mb={2}
              fontSize="16px"
            >
              {tagYourTeamText}
            </Text>

            {/* Tag my Teamm For action */}
            <Box
              border={'1px solid #299617'}
              borderRadius={5}
              p={1}
              w="100%"
              bg="green.50"
              mb={2}
            >
              <Text mb={1} fontWeight={'500'} fontSize="14px" color={'#444'}>
                For Action
              </Text>
              <TagMyTeamSnippetsForAction
                title={title}
                action_team={action_team}
                TaskId={TaskId}
                apiFetchFuncFromTask={apiFetchFuncFromTask}
              />
            </Box>

            {/* Tag my Teamm For Info */}
            <Box
              border={'1px solid #FA8128'}
              borderRadius={5}
              p={1}
              w="100%"
              bg="orange.50"
              mb={2}
            >
              <Text mb={1} fontWeight={'500'} fontSize="14px" color={'#444'}>
                For Info
              </Text>
              <TagMyTeamSnippetsForInfo
                info_team={info_team}
                TaskId={TaskId}
                apiFetchFuncFromTask={apiFetchFuncFromTask}
              />
            </Box>

            {/* Progress Bar */}
            {
              <Box w="100%">
                <WorkProgressBar
                  TaskId={TaskId}
                  sliderValue={sliderValue}
                  setSliderValue={setSliderValue}
                ></WorkProgressBar>
              </Box>
            }

            <HStack pt={'1rem'} justifyContent={'space-around'}>
              <Button
                size={'sm'}
                display={
                  location.pathname === '/tasks' ? 'inline-flex' : 'none'
                }
                colorScheme={'red'}
                borderRadius={'full'}
                onClick={() => {
                  window.confirm(
                    `${title}\nAre you sure you want to Delete this task ?`
                  ) && deleteTaskById(TaskId);
                }}
              >
                <Text pe={'.5rem'}>Delete</Text> <RiDeleteBinLine size={16} />
              </Button>
              <Button
                display={
                  location.pathname === '/tasks' ? 'inline-flex' : 'none'
                }
                size={'sm'}
                colorScheme={'telegram'}
                borderRadius={'full'}
                onClick={() => {
                  window.confirm(
                    `${title}\nAre you sure you want to archive task ?`
                  ) && archiveTask(TaskId);
                }}
              >
                <Text pe={'.5rem'}>Archive</Text> <BiArchiveIn size={16} />
              </Button>
            </HStack>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
