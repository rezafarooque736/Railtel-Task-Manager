import { Box, useDisclosure, Divider } from '@chakra-ui/react';
import jwt_decode from 'jwt-decode';
import { putApiData } from '../../../Services/fetchApiFromBackend';
import {
  TaskOneRowTitleDescription,
  ModalCommentWithTagTeam,
} from '../TaskUtils';

const ShowArchives = ({
  id,
  title,
  description,
  action_team,
  info_team,
  date_time_archive,
  created_by,
  apiFetchFuncFromTask,
}) => {
  const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');
  const jwt_decode_data = jwt_decode(token);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const addToTaskFromArchive = async id => {
    const data = {
      archive_by: jwt_decode_data.fullname,
    };
    const url = `/api/task/unarchive/${id}`;

    const apiData = await putApiData(url, data);
    if (apiData.data.msg === 'your task has been Unarchived') {
      apiFetchFuncFromTask();
    }
  };

  return (
    <Box>
      {/* Task one row starts here */}
      <TaskOneRowTitleDescription
        onOpen={onOpen}
        title={title}
        date_time={date_time_archive}
        description={description}
        addToTaskFromArchive={addToTaskFromArchive}
        id={id}
      />
      {/* Task one row ends here */}

      <Divider />
      <ModalCommentWithTagTeam
        isOpen={isOpen}
        onClose={onClose}
        TaskId={id}
        title={title}
        description={description}
        action_team={action_team}
        info_team={info_team}
        created_by={created_by}
        apiFetchFuncFromTask={apiFetchFuncFromTask}
        tagYourTeamText="Tagged Team"
      />
    </Box>
  );
};

export default ShowArchives;
