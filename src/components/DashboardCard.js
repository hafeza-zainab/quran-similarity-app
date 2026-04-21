import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/DashboardCard.css';

const DashboardCard = ({ title, description, linkTo, buttonText, isExternal, color }) => {
  const CardWrapper = ({ children }) => (
    isExternal 
      ? <a href={linkTo} target="_blank" rel="noreferrer" className="dashboard-card-wrapper">{children}</a>
      : <Link to={linkTo} className="dashboard-card-wrapper">{children}</Link>
  );
  return (
    <CardWrapper>
      <div className="dashboard-card" style={{ borderTop: `4px solid ${color || '#F2C94C'}` }}>
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="card-action-btn" style={{ backgroundColor: color || '#F2C94C', color: color === '#004D40' ? 'white' : '#004D40' }}>
          {buttonText}
        </div>
      </div>
    </CardWrapper>
  );
};
export default DashboardCard;