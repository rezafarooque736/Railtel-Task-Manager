import { Box, useDisclosure, Divider } from '@chakra-ui/react';

import {
  TaskOneRowTitleDescription,
  ModalCommentWithTagTeam,
} from '../TaskUtils';

const ShowAddedTask = ({
  id,
  title,
  description,
  action_team,
  info_team,
  date_time_update,
  created_by,
  apiFetchFuncFromTask,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      {/* Task one row starts here */}
      <TaskOneRowTitleDescription
        onOpen={onOpen}
        title={title}
        date_time={date_time_update}
        description={description}
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
        tagYourTeamText="Tag your Team"
      />
    </Box>
  );
};

export default ShowAddedTask;
