import {
  Box,
  Button,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { RiDeleteBinLine } from 'react-icons/ri';
import { postApiFileUpload } from '../../../../Services/fetchApiFromBackend';

const SubmitFile = ({ TaskId, getAllCommentsAPI, apiFetchFuncFromTask }) => {
  // states
  const [open, setOpen] = useState(false);
  const [attachFileColor, setAttachFileColor] = useState('#54656f');
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // handleFileInputChange
  const handleFileInputChange = event => {
    event.preventDefault();
    const files = Array.from(event.target.files);
    const allowedFileTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ]; // specify allowed file types
    const selectedFilesWithValidation = files.filter(file =>
      allowedFileTypes.includes(file.type)
    );

    if (selectedFilesWithValidation.length === files.length) {
      setSelectedFiles(selectedFilesWithValidation);
      setAttachFileColor('#54656f');
      handleOpen();
    } else {
      setSelectedFiles([]);
      setAttachFileColor('#C53030');
      handleClose();
    }
  };

  // handle File Submit
  const handleFileSubmit = async e => {
    e.preventDefault();
    e.stopPropagation();

    // Create FormData object
    let formData = new FormData();
    formData.append('TaskId', TaskId);
    // Loop through the files and append each file to the FormData object
    selectedFiles.forEach(file => {
      console.log(file);
      formData.append('files', file);
    });

    // send file to backend
    const url = '/api/uploadFile';
    console.log(selectedFiles);
    console.log('pahle');
    await postApiFileUpload(url, formData);
    console.log('baad');

    getAllCommentsAPI();
    console.log(selectedFiles);
    setSelectedFiles([]);
    console.log(selectedFiles);
    apiFetchFuncFromTask();
    handleClose();
  };

  return (
    <>
      <Box
        role={'button'}
        borderRadius={'50%'}
        title="Attach"
        padding={'4px'}
        aria-label="Attach pdf excel word photo"
      >
        <Box
          as={'label'}
          cursor="pointer"
          htmlFor="attach_file"
          zIndex={'200'}
          fontSize={'100%'}
        >
          <svg
            width={'24'}
            height={'24'}
            xmlns="http://www.w3.org/2000/svg"
            enableBackground="new 0 0 24 24"
            viewBox="0 0 24 24"
            id="attach"
          >
            <path
              fill={attachFileColor}
              d="M18.1,12.4l-6.2,6.2c-1.7,1.7-4.4,1.7-6,0c-1.7-1.7-1.7-4.4,0-6l8-8c1-0.9,2.5-0.9,3.5,0c1,1,1,2.6,0,3.5l-6.9,6.9
	c-0.3,0.3-0.8,0.3-1.1,0c0,0,0,0,0,0c-0.3-0.3-0.3-0.8,0-1.1l5.1-5.1c0.4-0.4,0.4-1,0-1.4c-0.4-0.4-1-0.4-1.4,0L8,12.6
	c-1.1,1.1-1.1,2.8,0,3.9c1.1,1,2.8,1,3.9,0l6.9-6.9c1.8-1.8,1.8-4.6,0-6.4c-1.8-1.8-4.6-1.8-6.4,0l-8,8c-1.2,1.2-1.8,2.8-1.8,4.4
	c0,3.5,2.8,6.2,6.3,6.2c1.7,0,3.2-0.7,4.4-1.8l6.2-6.2c0.4-0.4,0.4-1,0-1.4S18.5,12,18.1,12.4z"
            ></path>
          </svg>
        </Box>
        <Input
          type="file"
          id={'attach_file'}
          accept="image/jpeg,image/png,image/gif,'application/pdf','application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', .xml, .xlsx, application/msword, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'"
          capture="user"
          multiple
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />
      </Box>
      <Modal isOpen={open} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Selected Files</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedFiles.map((file, index) => (
              <HStack
                key={index}
                mb={4}
                justifyContent={'space-between'}
                bg={'gray.50'}
              >
                <Box>{file.name}</Box>
                <IconButton
                  size={'xs'}
                  bg={'gray.200'}
                  onClick={() => {
                    console.log(`IconButton Clicked ${index}`);
                    setSelectedFiles(
                      selectedFiles.filter((file, i) => i !== index)
                    );
                  }}
                >
                  <RiDeleteBinLine fontSize={15} />
                </IconButton>
              </HStack>
            ))}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" size={'sm'} onClick={handleFileSubmit}>
              Upload File
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SubmitFile;
