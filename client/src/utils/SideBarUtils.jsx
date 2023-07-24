import { Link, useLocation } from 'react-router-dom';
import '../components/headerDrawer/adminStyles.css';
import rtLogo from '../assets/railtel_logo.png';

const SidebarRow = ({ to, name }) => {
  const location = useLocation();
  return (
    <div className="AdminConsoleSidebar-row">
      <Link
        to={to}
        className={
          location.pathname === to
            ? 'AdminConsoleSidebarRow-name-selected'
            : 'AdminConsoleSidebarRow-name'
        }
      >
        <span className="Typography">{name}</span>
      </Link>
    </div>
  );
};

export const SideBar = () => {
  return (
    <nav className="AdminConsoleSidebar">
      <Link className="AdminConsoleSidebarHeaderLogo" to="/">
        <img src={rtLogo} alt="RailTel Logo go to HomePage" width={'42px'} />
      </Link>
      <SidebarRow to={'/admin-section/insights'} name={'Insights'} />
      <SidebarRow to={'/admin-section/members'} name={'Members'} />
      <SidebarRow
        to={'/admin-section/departments-regions'}
        name={'Departments & Regions'}
      />
      <SidebarRow
        to={'/admin-section/add-to-group'}
        name={'Add to group Requests'}
      />
    </nav>
  );
};
