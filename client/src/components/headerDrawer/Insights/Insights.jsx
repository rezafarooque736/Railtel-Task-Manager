import React, { useEffect, useState } from 'react';
import '../adminStyles.css';
import { SideBar } from '../../../utils/SideBarUtils';
import {
  AdminConsoleCard,
  HeaderAdminPage,
} from '../../../utils/AdminPageUtils';
import undraw_add_notes from '../../../assets/undraw_add_notes.svg';
import { getApiData } from '../../../Services/fetchApiFromBackend';

const Insights = () => {
  let [total_members, setTotal_Members] = useState(0);
  const [departments, setDepartments] = useState(0);
  let [newGroupRequest, setNewGroupRequest] = useState(0);

  async function apiFetchNewGroupRequest() {
    const url = '/api/add-to-group';
    const apiData = await getApiData(url);
    setNewGroupRequest(apiData.data.length);
  }

  async function apiFetchFunc() {
    const url = '/api/EmployeeList';
    const apiData = await getApiData(url);
    setTotal_Members(apiData.data.length);
  }

  async function departmentFetchFunction() {
    const url = '/api/add-department';
    const apiData = await getApiData(url);
    setDepartments(apiData.data.length);
  }

  useEffect(() => {
    apiFetchFunc();
    apiFetchNewGroupRequest();
    departmentFetchFunction();
  }, []);

  return (
    <div className="AdminConsole">
      <SideBar />
      <div className="AdminConsoleBody">
        <div className="AdminConsolePageStructure">
          <HeaderAdminPage headerText="Insights" />
          <div className="AdminConsolePageStructure-scrollableContainer">
            <div className="Scrollable--vertical">
              <div className="AdminConsolePageStructure-bodyContainer">
                <div className="AdminConsolePageStructure-body">
                  <div className="AdminConsolePageStructure-bodyContainer-cover">
                    <img
                      src={undraw_add_notes}
                      alt="Add notes cover"
                      width={'150px'}
                      style={{ objectFit: 'contain' }}
                    />
                    <p className="AdminConsolePageStructure-bodyContainer-cover-text">
                      Insights of RailTel TaskManager App
                    </p>
                  </div>
                  <div className="AdminConsoleInsightsPage">
                    <div className="AdminConsoleInsightsPage-infoBar">
                      <AdminConsoleCard
                        heading={total_members}
                        body="All Members"
                      />
                      <AdminConsoleCard
                        heading={departments}
                        body="Departments"
                      />
                      <AdminConsoleCard
                        heading={newGroupRequest}
                        body="Add to group Requests"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
