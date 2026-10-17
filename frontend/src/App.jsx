import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import EventDetails from './pages/EventDetails';
import Login from './pages/Login';
import ParticipantDashboard from './pages/ParticipantDashboard';
import OrganizerDashboard from './pages/OrganizerDashboard';
import FormBuilder from './pages/FormBuilder';
import QRScanner from './pages/QRScanner';
import Admin from './pages/Admin';
import Volunteers from './pages/Volunteers';
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
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('techspirit_user');
      return saved !== null ? JSON.parse(saved) : ROHAN_USER;
    } catch (e) {
      return ROHAN_USER;
    }
  });

  const handleLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem('techspirit_user');
      localStorage.removeItem('techspirit_token');
    } catch (e) {}
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Google OAuth redirect token
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      if (accessToken) {
        fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
          .then((res) => res.json())
          .then((profile) => {
            if (profile && profile.email) {
              const googleUser = {
                name: profile.name || 'Google Innovator',
                email: profile.email,
                avatar: profile.picture,
                role: 'Participant',
                college: 'Partner Institute',
                team: 'Tech Titans',
                stats: { registered: 3, ongoing: 1, completed: 2, certificates: 5 }
              };
              setUser(googleUser);
              try {
                localStorage.setItem('techspirit_user', JSON.stringify(googleUser));
              } catch (e) {}
              setCurrentView('participant');
              window.history.replaceState(null, '', window.location.pathname);
            }
          })
          .catch((err) => console.warn('OAuth redirect notice:', err));
      }
    }
  }, []);

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
          onLogout={handleLogout}
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
              try {
                localStorage.setItem('techspirit_user', JSON.stringify(loggedUser));
              } catch (e) {}
              const isAdmin = loggedUser.role === 'super_admin' || loggedUser.role === 'organizer' || loggedUser.role === 'event_admin';
              setCurrentView(isAdmin ? 'organizer' : 'participant');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* 5. Participant Dashboard */}
        {currentView === 'participant' && (
          <ParticipantDashboard 
            user={user}
            onOpenScanner={() => setCurrentView('scanner')}
            onSelectEvent={(eventId) => {
              const found = HACKVERSE_EVENTS.find(e => e.id === eventId);
              if (found) handleSelectHackathon(found);
            }}
            onLogout={handleLogout}
            onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
          />
        )}

        {/* 6. Organizer Dashboard */}
        {currentView === 'organizer' && (
          <OrganizerDashboard 
            user={user}
            onNavigateToFormBuilder={() => setCurrentView('form-builder')}
            onLogout={handleLogout}
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
            onBack={() => setCurrentView('volunteers')}
          />
        )}

        {/* 9. Admin Control Center */}
        {currentView === 'admin' && (
          <Admin 
            user={user}
            onNavigateToVolunteers={() => {
              setCurrentView('volunteers');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* 10. Volunteers & Operations Desk */}
        {currentView === 'volunteers' && (
          <Volunteers 
            user={user}
            onOpenScanner={() => {
              setCurrentView('scanner');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToAdmin={() => {
              setCurrentView('admin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
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
