import React from 'react';
import Header from '../Header';
import Footer from '../Footer';
import CounterUpPage from './CounterUpPage';
import { Stack, Box, VStack, Heading, Img, Container } from '@chakra-ui/react';
import tasks from '../../assets/tasks.png';
import tag_info from '../../assets/tag_info.png';
import tag_action from '../../assets/tag_action.png';
import archive from '../../assets/archive.png';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Box className="bg">
      <Container
        minH={'100vh'}
        pb={'4rem'}
        mx="auto"
        maxW={'container.xl'}
        textAlign={'center'}
        bg={'blackAlpha.300'}
        px={0}
      >
        <Header />
        <CounterUpPage />
        <Stack minH={'60%'} justifyContent={'center'}>
          <VStack
            flexWrap={'wrap'}
            gap={'.3rem'}
            justifyContent={['center', 'space-around']}
            placeItems={'center'}
            mt={'1rem'}
          >
            <Link to={'/tasks'}>
              <CardFeature card_text="My Tasks" card_img={tasks} ml={'-4rem'} />
            </Link>
            <Link to={'/actionable-task'}>
              <CardFeature
                card_text="Actionable Tasks"
                card_img={tag_action}
                ml={'-1rem'}
              />
            </Link>
            <Link to={'/informational-task'}>
              <CardFeature
                card_text="Informational Tasks"
                card_img={tag_info}
              />
            </Link>
            <Link to={'/archives'}>
              <CardFeature
                card_text="Archives"
                card_img={archive}
                ml={'-4rem'}
              />
            </Link>
          </VStack>
        </Stack>
        <Footer />
      </Container>
    </Box>
  );
};

export default Home;

const CardFeature = ({ card_text, card_img, ml }) => {
  return (
    <Box
      w={['16rem', '25rem']}
      borderRadius="2xl"
      boxShadow="xxl"
      bgGradient="linear(to-b, yellow.200, yellow.400)"
      py={['.4rem', '.6rem']}
      cursor="pointer"
      _hover={{
        shadow: 'xl',
        transform: 'translateY(-1px)',
        transitionDuration: '0.3s',
      }}
    >
      <Stack
        direction={['column', 'row']}
        justifyContent={'center'}
        alignItems={'center'}
        h="full"
      >
        <Img src={card_img} w={['40px', '55px']} ml={['0', ml]} />
        <Heading as={'h5'} size={'sm'} color={'#131313'}>
          {card_text}
        </Heading>
      </Stack>
    </Box>
  );
};
