import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Container,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { useState, useEffect } from 'react';
import Header from '../../Header';
import Footer from '../../Footer';
import ShowActionableTask from './ShowActionableTask';
import { getApiData } from '../../../Services/fetchApiFromBackend';
import { GoToButton, HeadingWithSearch } from '../TaskUtils';

const ActionableTasks = () => {
  const [actionableTasks, setActionableTasks] = useState([]);
  const [searchText, setsearchText] = useState('');

  const apiFetchFunc = async () => {
    const url = '/api/tasks/actionable';
    const apiData = await getApiData(url);
    setActionableTasks(apiData.data);
  };

  useEffect(() => {
    apiFetchFunc();
  }, []);

  // console.log(actionableTasks);
  return (
    <Box className="bg">
      <Container
        minH={'100vh'}
        pb={'4rem'}
        mx={'auto'}
        maxW={'container.xl'}
        bg={'blackAlpha.300'}
        px={0}
      >
        <Header />
        <VStack spacing={'.1rem'}>
          <Card w={['100%', '85%']} color={'#e3e3e3'} variant={'elevated'}>
            <CardHeader py={0}>
              <HeadingWithSearch
                textShow="Actionable Tasks"
                searchText={searchText}
                setsearchText={setsearchText}
              />
            </CardHeader>
            <CardBody py={0}>
              {actionableTasks.map(task =>
                task.title.toLowerCase().includes(searchText) ||
                task.created_by.toLowerCase().includes(searchText) ? (
                  <ShowActionableTask
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
            <GoToButton btn2Text="Go to My Tasks" btn2Link="/tasks" />
          </Card>
        </VStack>
        <Footer />
      </Container>
    </Box>
  );
};

export default ActionableTasks;
