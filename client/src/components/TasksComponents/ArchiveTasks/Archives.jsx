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
import { getApiData } from '../../../Services/fetchApiFromBackend';
import ShowArchives from './ShowArchives';
import { GoToButton, HeadingWithSearch } from '../TaskUtils';

const Archives = () => {
  const [archiveTasks, setArchiveTasks] = useState([]);
  const [searchText, setsearchText] = useState('');

  const apiFetchFunc = async () => {
    const url = '/api/tasks/archives';
    const apiData = await getApiData(url);
    setArchiveTasks(apiData.data);
  };

  useEffect(() => {
    apiFetchFunc();
  }, []);

  // console.log(archiveTasks);

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
          <Card w={['100%', '85%']} color={'#d4d2d7'} variant={'elevated'}>
            <CardHeader py={0}>
              <HeadingWithSearch
                textShow="Archived Tasks"
                searchText={searchText}
                setsearchText={setsearchText}
              />
            </CardHeader>
            <CardBody py={0}>
              {archiveTasks.map(task =>
                task.title.toLowerCase().includes(searchText) ? (
                  <ShowArchives
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    description={task.description}
                    action_team={task.action_team}
                    info_team={task.info_team}
                    date_time_archive={task.date_time_archive}
                    created_by={task.created_by}
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

export default Archives;
