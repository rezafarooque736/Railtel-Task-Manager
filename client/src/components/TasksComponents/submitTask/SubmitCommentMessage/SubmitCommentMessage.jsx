import { Box, FormControl, HStack, IconButton, Input } from '@chakra-ui/react';
import React, { useState } from 'react';
import { postApiData } from '../../../../Services/fetchApiFromBackend';

const SubmitCommentMessage = ({
  TaskId,
  title,
  apiFetchFuncFromTask,
  getAllCommentsAPI,
  action_team,
}) => {
  const [CommentBody, setCommentBody] = useState('');

  // SubmitComment
  const SubmitComment = async e => {
    e.preventDefault();
    e.stopPropagation();
    if (CommentBody !== '') {
      const data = {
        TaskId: TaskId,
        CommentBody: CommentBody,
      };
      const url = '/api/comments';
      await postApiData(url, data);

      getAllCommentsAPI();
      setCommentBody('');
      apiFetchFuncFromTask();

      // sending push notification
      const notificationApiData = {
        emails: action_team.split(','),
        header: 'New Comment',
        body: CommentBody,
        type: 'new_comment',
        title: title,
      };

      const notificationApiUrl = '/api/send-notification-to-multiple';

      await postApiData(notificationApiUrl, notificationApiData);
    }
  };

  return (
    <>
      <Box width={'100%'}>
        <form onSubmit={SubmitComment}>
          <HStack width="100%">
            {/* Input a message box */}
            <Box
              style={{
                margin: '6px 3px',
                backgroundColor: '#fff',
                border: '1px solid #fff',
                borderRadius: '8px',
                boxSizing: 'border-box',
                minWidth: '0',
                minHeight: '20px',
                fontSize: '15px',
                fontWeight: '400',
                outline: 'none',
                display: 'flex',
              }}
              w="100%"
            >
              <FormControl isRequired>
                <Input
                  spellCheck="true"
                  title="Type a message"
                  height={'2.2em'}
                  maxHeight={'2.5em'}
                  minHeight={'1.47em'}
                  userSelect={'text'}
                  whiteSpace={'pre-wrap'}
                  wordBreak={'break-word'}
                  lineHeight={'1.47em'}
                  overflowX={'hidden'}
                  overflowY={'auto'}
                  fontSize={'0.9375rem'}
                  type={'text'}
                  w={'100%'}
                  backgroundColor="#fff"
                  autoComplete={'off'}
                  value={CommentBody}
                  color={'#54656f'}
                  placeholder={'Type a message'}
                  onChange={e => setCommentBody(e.target.value)}
                  style={{ border: '1px solid #fff' }}
                  _focusVisible={{ border: '1px solid #fff' }}
                  pl={[2, 3]}
                />
              </FormControl>
            </Box>

            {/* submit button */}
            <IconButton
              type="submit"
              onClick={SubmitComment}
              bg="none"
              size={'sm'}
              children={
                <svg
                  width={'24'}
                  height={'24'}
                  enableBackground="new 0 0 32 32"
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                  id="submit"
                >
                  <path
                    fill="#54656f"
                    d="M3.0005,27c-0.3125,0-0.6147-0.1465-0.8076-0.4092c-0.2666-0.3652-0.2559-0.8633,0.0264-1.2158l7.5-9.375l-7.5-9.375C1.937,6.2725,1.9263,5.7744,2.1929,5.4092C2.459,5.0459,2.937,4.9043,3.3589,5.0664l26,10C29.7451,15.2148,30,15.5859,30,16s-0.2549,0.7852-0.6411,0.9336l-26,10C3.2417,26.9785,3.1201,27,3.0005,27z M6.0879,8.2588l5.6929,7.1162c0.2925,0.3652,0.2925,0.8848,0,1.25l-5.6929,7.1162L26.2144,16L6.0879,8.2588z"
                  ></path>
                </svg>
              }
              _hover={{ background: 'none' }}
            />
          </HStack>
        </form>
      </Box>
    </>
  );
};

export default SubmitCommentMessage;
