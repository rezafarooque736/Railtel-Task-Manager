import { HStack, VStack, Text, Heading, Box } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import CountUp from 'react-countup';
import jwt_decode from 'jwt-decode';
import { getApiData } from '../../Services/fetchApiFromBackend';
import { Link } from 'react-router-dom';

const CounterUpPage = () => {
  const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');
  const jwt_decode_data = jwt_decode(token);
  let [archiveCount, setArchiveCount] = useState(0);
  let [myTaskCount, setMyTaskCount] = useState(0);
  let [actionableCount, setactionableCount] = useState(0);
  let [informationalCount, setinformationalCount] = useState(0);

  const apiFetchFunc = async () => {
    const url = '/api/tasks';
    const apiData = await getApiData(url);

    setMyTaskCount(
      apiData.data.filter(
        task =>
          task.isArchived === 0 && task.created_by === jwt_decode_data.fullname
      ).length
    );
    setactionableCount(
      apiData.data.filter(
        task =>
          task.isArchived === 0 &&
          task.action_team.includes(jwt_decode_data.fullname)
      ).length
    );
    setinformationalCount(
      apiData.data.filter(
        task =>
          task.isArchived === 0 &&
          task.info_team.includes(jwt_decode_data.fullname)
      ).length
    );
    setArchiveCount(
      apiData.data.filter(
        task =>
          task.isArchived === 1 && task.created_by === jwt_decode_data.fullname
      ).length
    );
  };

  useEffect(() => {
    apiFetchFunc();
  }, []);

  return (
    <HStack p={'.5rem'} bg={'#333'} justifyContent={'space-around'} w={'100%'}>
      <CountUpBox end={myTaskCount} textShown={'My Tasks'} linkTo="/tasks" />
      <CountUpBox
        end={actionableCount}
        textShown={'Actionable Task'}
        linkTo="/actionable-task"
      />
      <CountUpBox
        end={informationalCount}
        textShown={'Informational Task'}
        linkTo="/informational-task"
      />
      <CountUpBox
        end={archiveCount}
        textShown={'Archives Task'}
        linkTo="/archives"
      />
    </HStack>
  );
};

export default CounterUpPage;

const CountUpBox = ({ end, textShown, linkTo }) => {
  let [counterText, setCounterText] = useState(true);

  return (
    <Link to={linkTo}>
      <VStack
        _hover={{
          color: '#fff',
        }}
        borderRadius={'5px'}
        cursor="pointer"
      >
        <Heading size={['sm', 'md']} color={'yellow.400'}>
          <CountUp
            start={0}
            end={end}
            duration={1}
            delay={0}
            onEnd={() => {
              setCounterText(false);
            }}
          />
        </Heading>
        <Text fontSize={['.9rem', '1rem']} p={'0 7px 5px 7px'}>
          <Box as={'span'}>{counterText ? 'Loading...' : textShown}</Box>
        </Text>
      </VStack>
    </Link>
  );
};
