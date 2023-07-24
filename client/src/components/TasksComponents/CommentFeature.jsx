import { HStack, VStack } from '@chakra-ui/react';

const CommentFeature = ({
  CommentBy,
  CommentBody,
  comment_date_time,
  old_filename,
  new_filename,
  file_url,
}) => {
  return (
    <VStack w={'full'} alignItems={'flex-start'} p={1}>
      <HStack w={'full'} my={-1} justifyContent={'space-between'}>
        <p style={{ fontSize: '16px', fontWeight: '400', color: '#111b21' }}>
          {CommentBy}
        </p>
        <p
          style={{
            fontSize: '12px',
            fontWeight: '400',
            lineHeight: '14px',
            color: '#667781',
          }}
        >
          {new Date(comment_date_time * 1000).toLocaleString()}
        </p>
      </HStack>
      <p
        style={{
          fontSize: '14px',
          fontweight: '400',
          fontFamily: 'inherit',
          lineHeight: '21px',
          color: '#3b4a54',
        }}
      >
        {file_url ? (
          <a href={file_url} target="blank">
            {old_filename}
          </a>
        ) : (
          CommentBody
        )}
      </p>
    </VStack>
  );
};

export default CommentFeature;
