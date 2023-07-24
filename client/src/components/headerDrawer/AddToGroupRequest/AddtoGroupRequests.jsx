import React, { useEffect, useState } from 'react';
import '../adminStyles.css';
import { SideBar } from '../../../utils/SideBarUtils';
import { HeaderAdminPage } from '../../../utils/AdminPageUtils';
import {
  Button,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import {
  deleteApiData,
  getApiData,
} from '../../../Services/fetchApiFromBackend';

const AddtoGroupRequests = () => {
  let [newGroupRequest, setNewGroupRequest] = useState([]);

  async function apiFetchNewGroupRequest() {
    const url = '/api/add-to-group';
    const apiData = await getApiData(url);
    setNewGroupRequest(apiData.data);
  }

  const deleteAddToGroup = async email => {
    const url = `/api/add-to-group/${email}`;
    await deleteApiData(url);
    apiFetchNewGroupRequest();
  };

  useEffect(() => {
    apiFetchNewGroupRequest();
  }, []);

  return (
    <div className="AdminConsole">
      <SideBar />
      <div className="AdminConsoleBody">
        <div className="AdminConsolePageStructure">
          <HeaderAdminPage headerText="Members" />
          <div className="AdminConsolePageStructure-scrollableContainer">
            <div className="Scrollable--vertical">
              <div className="AdminConsolePageStructure-bodyContainer">
                <TableContainer my={'20px'}>
                  <Table
                    variant={'simple'}
                    size={'sm'}
                    style={{
                      color: '#1e1f21',
                      fontSize: '14px',
                      fontWeight: '400',
                    }}
                  >
                    <Thead>
                      <Tr>
                        <Th>Email</Th>
                        <Th>Date</Th>
                        <Th>Add to Group</Th>
                        <Th>Action</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {newGroupRequest.map((user, index) => (
                        <Tr key={index} fontSize={'.77rem'}>
                          <Td>{user.email}</Td>
                          <Td>
                            {new Date(user.created_at * 1000).toLocaleString()}
                          </Td>
                          <Td>{user.addToGroup}</Td>
                          <Td>
                            <Button
                              colorScheme={'telegram'}
                              size={['.5rem', 'xs']}
                              p={['.2rem', 'auto']}
                              fontSize={['.6rem', '.77rem']}
                              onClick={() => deleteAddToGroup(user.email)}
                            >
                              Completed/Delete
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddtoGroupRequests;
