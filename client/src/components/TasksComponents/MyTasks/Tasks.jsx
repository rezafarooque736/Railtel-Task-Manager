import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Container,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import Footer from '../../Footer';
import Header from '../../Header';
import ShowAddedTask from './ShowAddedTask';
import AddNewTaskButton from './AddNewTaskButton';
import { useEffect, useState } from 'react';
import { getApiData } from '../../../Services/fetchApiFromBackend';
import { GoToButton, HeadingWithSearch } from '../TaskUtils';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [searchText, setsearchText] = useState('');

  const apiFetchFunc = async () => {
    const url = '/api/tasks/myTasks';
    const apiData = await getApiData(url);
    setTasks(apiData.data);
  };

  useEffect(() => {
    apiFetchFunc();
  }, []);

  // console.log(tasks);

  return (
    <Box className={'bg'}>
      <Container
        minH={'100vh'}
        pb={'4rem'}
        mx="auto"
        maxW={'container.xl'}
        bg={'blackAlpha.300'}
        px={0}
      >
        <Header />
        <VStack spacing={'.1rem'}>
          <AddNewTaskButton apiFetchFuncFromTask={apiFetchFunc} />

          <Card w={['100%', '85%']} color={'#e3e3e3'} variant={'elevated'}>
            <CardHeader py={0}>
              <HeadingWithSearch
                textShow="My Tasks"
                searchText={searchText}
                setsearchText={setsearchText}
              />
            </CardHeader>
            <CardBody py={0}>
              {tasks.map(task =>
                task.title.toLowerCase().includes(searchText) ? (
                  <ShowAddedTask
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    description={task.description}
                    action_team={task.action_team}
                    info_team={task.info_team}
                    date_time_update={task.date_time_update}
                    created_by={task.created_by}
                    isArchived={task.isArchived}
                    apiFetchFuncFromTask={apiFetchFunc}
                  />
                ) : null
              )}
            </CardBody>
            <GoToButton
              btn2Text="Go to Actionable Tasks"
              btn2Link="/actionable-task"
            />
          </Card>
        </VStack>
        <Footer />
      </Container>
    </Box>
  );
};

export default Tasks;
