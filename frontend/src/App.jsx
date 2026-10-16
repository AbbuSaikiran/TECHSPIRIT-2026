import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import EventDetails from './pages/EventDetails';
import Login from './pages/Login';
import ParticipantDashboard from './pages/ParticipantDashboard';
import OrganizerDashboard from './pages/OrganizerDashboard';
import FormBuilder from './pages/FormBuilder';
import QRScanner from './pages/QRScanner';
import RegistrationModal from './components/RegistrationModal';
import { 
  HACKVERSE_EVENTS, 
  DEFAULT_FORM_BUILDER_FIELDS, 
  ROHAN_USER 
} from './mockData';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedHackathon, setSelectedHackathon] = useState(HACKVERSE_EVENTS[0]);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [formFields, setFormFields] = useState(DEFAULT_FORM_BUILDER_FIELDS);
  const [user, setUser] = useState(ROHAN_USER);

  const handleSelectHackathon = (hackathon) => {
    setSelectedHackathon(hackathon);
    setCurrentView('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSuccessfulRegistration = (newRegistration) => {
    // Add to user stats and navigate to participant dashboard
    setCurrentView('participant');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#E0E0E0] flex flex-col font-sans selection:bg-[#6366F1] selection:text-white">
      
      {/* Top Navbar with quick switcher across all 8 screens */}
      {currentView !== 'login' && (
        <Navbar 
          currentView={currentView}
          setCurrentView={(view) => {
            setCurrentView(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          user={user}
          onOpenLogin={() => setCurrentView('login')}
        />
      )}

      {/* Pages Router */}
      <main className="flex-1">
        
        {/* 1. Home Page (Landing) */}
        {currentView === 'home' && (
          <Home 
            onSelectHackathon={handleSelectHackathon}
            onNavigateToExplore={() => {
              setCurrentView('explore');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToOrganizer={() => {
              setCurrentView('organizer');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* 2. Explore Hackathons */}
        {currentView === 'explore' && (
          <Explore 
            onSelectHackathon={handleSelectHackathon}
          />
        )}

        {/* 3. Event Details Page */}
        {currentView === 'details' && (
          <EventDetails 
            hackathon={selectedHackathon}
            onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
          />
        )}

        {/* 4. Login / Signup Page */}
        {currentView === 'login' && (
          <Login 
            onBackToHome={() => setCurrentView('home')}
            onLoginSuccess={(loggedUser) => {
              setUser(loggedUser);
              setCurrentView('participant');
            }}
          />
        )}

        {/* 5. Participant Dashboard */}
        {currentView === 'participant' && (
          <ParticipantDashboard 
            onOpenScanner={() => setCurrentView('scanner')}
            onSelectEvent={(eventId) => {
              const found = HACKVERSE_EVENTS.find(e => e.id === eventId);
              if (found) handleSelectHackathon(found);
            }}
            onLogout={() => setCurrentView('home')}
          />
        )}

        {/* 6. Organizer Dashboard */}
        {currentView === 'organizer' && (
          <OrganizerDashboard 
            onNavigateToFormBuilder={() => setCurrentView('form-builder')}
            onLogout={() => setCurrentView('home')}
          />
        )}

        {/* 7. Create Event / Form Builder */}
        {currentView === 'form-builder' && (
          <FormBuilder 
            formFields={formFields}
            setFormFields={setFormFields}
            onBackToOrganizer={() => setCurrentView('organizer')}
          />
        )}

        {/* 8. QR Scanner Page */}
        {currentView === 'scanner' && (
          <QRScanner 
            onBack={() => setCurrentView('participant')}
          />
        )}

      </main>

      {/* Dynamic Registration Modal */}
      <RegistrationModal 
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        hackathon={selectedHackathon}
        formFields={formFields}
        onSuccessfulRegistration={handleSuccessfulRegistration}
      />

    </div>
  );
}
