import {
  Box,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Text,
} from '@chakra-ui/react';
import { putApiData } from '../../Services/fetchApiFromBackend';
import { useLocation } from 'react-router-dom';

const WorkProgressBar = ({ TaskId, sliderValue, setSliderValue }) => {
  const location = useLocation();
  const labelStyles = {
    mt: '2',
    ml: '-2.5',
    fontSize: 'sm',
  };

  console.log(sliderValue);
  const handleSliderChangeEnd = async val => {
    setSliderValue(val);
    const data = { taskProgress: val };
    const url = `/api/task/progress/${TaskId}`;
    await putApiData(url, data);
  };

  return (
    <Box
      border={'1px solid #6FCECB'}
      borderRadius={5}
      p={1}
      w="100%"
      bg="teal.50"
      mb={2}
    >
      <Text
        mb={1}
        children="Work in Progress"
        fontWeight={'500'}
        fontSize="14px"
        color={'#444'}
      />
      <Box my={7} px={3}>
        <Slider
          aria-label="Work in Progress-Bar"
          onChangeEnd={handleSliderChangeEnd}
          defaultValue={sliderValue}
          min={0}
          max={100}
          step={5}
          isReadOnly={
            location.pathname === '/archives' ||
            location.pathname === '/informational-task'
              ? true
              : false
          }
          colorScheme="teal"
        >
          <SliderMark value={20} {...labelStyles}>
            20%
          </SliderMark>
          <SliderMark value={40} {...labelStyles}>
            40%
          </SliderMark>
          <SliderMark value={60} {...labelStyles}>
            60%
          </SliderMark>
          <SliderMark value={80} {...labelStyles}>
            80%
          </SliderMark>
          <SliderMark
            value={sliderValue}
            textAlign="center"
            bg="teal.600"
            color="white"
            mt="-9"
            ml="-5"
            w="10"
          >
            {sliderValue}%
          </SliderMark>
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb bg="teal.600" />
        </Slider>
      </Box>
    </Box>
  );
};

export default WorkProgressBar;
