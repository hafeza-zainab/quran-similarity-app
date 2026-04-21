import React from 'react';
import DashboardCard from '../components/DashboardCard';
import { useAuthContext } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuthContext();
  return (
    <div className="home-dashboard-container">
      <div className="welcome-banner"><h1>Welcome to the Mutashabih Platform</h1><p>Master the similarities of the Quran and strengthen your Hifz.</p></div>
      <div className="dashboard-grid">
        <DashboardCard title="Similarity Engine" description="Search for any Ayah and find its structurally similar pairs." linkTo="/similarity" buttonText="Open Tool" color="#F2C94C" />
        <DashboardCard title="Mutashabih Flashcards" description="Master repetitive verses." linkTo={user ? "/flashcards" : "/login"} buttonText={user ? "Open Flashcards" : "Login to Access"} color={user ? "#10B981" : "#9CA3AF"} />
        <DashboardCard title="My Diary" description="Keep a personal Hifz diary, notes, and teacher feedback." linkTo={user ? "/diary" : "/login"} buttonText={user ? "Open Diary" : "Login to Access"} color={user ? "#3B82F6" : "#9CA3AF"} />
        <DashboardCard title="Feedback & Support" description="Found a wrong score? Have an idea? Suggest improvements." linkTo="https://forms.gle/yourGoogleFormLinkHere" buttonText="Go to Form" isExternal={true} color="#10B981" />
      </div>
    </div>
  );
};
export default Home;