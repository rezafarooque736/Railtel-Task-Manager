import React, { useEffect } from 'react';
import { messaging } from './firebase';
import { getToken } from 'firebase/messaging';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

// components
import Login from './components/authPage/Login';
import Signup from './components/authPage/Signup';
import NewUser from './components/authPage/NewUser';
import ForgotPassword from './components/authPage/ForgotPassword';
import ResetPassword from './components/authPage/ResetPassword';
import Home from './components/homePage/Home';
import './styles/app.css';
import Tasks from './components/TasksComponents/MyTasks/Tasks.jsx';
import { useAuth } from './components/authPage/auth';
import Archives from './components/TasksComponents/ArchiveTasks/Archives';
import ActionableTasks from './components/TasksComponents/ActionableTasks/ActionableTasks';
import InformationalTasks from './components/TasksComponents/InformationalTasks/InformationalTasks';
import PersonalInfo from './components/headerDrawer/PersonalInfo.jsx';
import Members from './components/headerDrawer/Members/Members';
import Insights from './components/headerDrawer/Insights/Insights';
import DepartmentsRegions from './components/headerDrawer/DepartmentsRegions/DepartmentsRegions';
import AddtoGroupRequests from './components/headerDrawer/AddToGroupRequest/AddtoGroupRequests';
import { postApiData } from './Services/fetchApiFromBackend';

const App = () => {
  const [logged] = useAuth();

  async function requestPermission() {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      // Generate Token
      const token = await getToken(messaging, {
        vapidKey:
          'BHFnKXbYuc_ao0AybJjlosAYyjnwnERj3OPs9eofrJNTZWGkVcwGDm3qQso0DeCpDBZ-toK9Kd027L3XCMcIToY',
      });
      console.log('Token Gen', token);
      // Send this token  to server ( db)
      const data = { token };
      const url = '/api/store-tokens';
      await postApiData(url, data);
    } else if (permission === 'denied') {
      alert('You denied for the notification');
    }
  }

  useEffect(() => {
    // Req user for notification permission
    requestPermission();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {logged ? (
          <>
            <Route exact path={'/home'} element={<Home />} />
            <Route exact path={'/tasks'} element={<Tasks />} />
            <Route exact path={'/archives'} element={<Archives />} />
            <Route
              exact
              path={'/actionable-task'}
              element={<ActionableTasks />}
            />
            <Route
              exact
              path={'/informational-task'}
              element={<InformationalTasks />}
            />
            <Route exact path={'/personal-info'} element={<PersonalInfo />} />
            <Route
              exact
              path={'/admin-section/insights'}
              element={<Insights />}
            />
            <Route
              exact
              path={'/admin-section/members'}
              element={<Members />}
            />
            <Route
              exact
              path={'/admin-section/departments-regions'}
              element={<DepartmentsRegions />}
            />
            <Route
              exact
              path={'/admin-section/add-to-group'}
              element={<AddtoGroupRequests />}
            />
            <Route
              path={'*'}
              element={<Navigate to="/home" replace={true} />}
            />
          </>
        ) : (
          <>
            <Route path="/" element={<Navigate to="/login" replace={true} />} />
            <Route exact path={'/login'} element={<Login />} />
            <Route exact path={'/new-user'} element={<NewUser />} />
            <Route exact path={'/signup'} element={<Signup />} />
            <Route
              exact
              path={'/forgotpassword'}
              element={<ForgotPassword />}
            />
            <Route exact path={'/resetpassword'} element={<ResetPassword />} />
            <Route
              path={'*'}
              element={<Navigate to="/login" replace={true} />}
            />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
