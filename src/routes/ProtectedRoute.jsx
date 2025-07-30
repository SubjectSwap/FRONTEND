import React, { useContext } from 'react';
import { Navigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';

const ProtectedRoute = ({ component: Component }) => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      {/* Navigation Bar */}
      <nav style={{
        backgroundColor: 'white',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        padding: '0.75rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo/Brand */}
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#2563eb'
          }}>
            SubjectSwap
          </div>

          {/* Navigation Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <Link 
              to="/match" 
              style={{
                textDecoration: 'none',
                color: location.pathname === '/match' ? '#2563eb' : '#374151',
                fontWeight: location.pathname === '/match' ? '600' : '500',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                backgroundColor: location.pathname === '/match' ? '#dbeafe' : 'transparent',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== '/match') {
                  e.target.style.backgroundColor = '#f3f4f6';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== '/match') {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              Match Now
            </Link>

            <Link 
              to="/match" 
              style={{
                textDecoration: 'none',
                color: location.pathname === '/match' ? '#2563eb' : '#374151',
                fontWeight: location.pathname === '/match' ? '600' : '500',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                backgroundColor: location.pathname === '/match' ? '#dbeafe' : 'transparent',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== '/match') {
                  e.target.style.backgroundColor = '#f3f4f6';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== '/match') {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              Edit Profile
            </Link>

            <Link 
              to="/chat" 
              style={{
                textDecoration: 'none',
                color: location.pathname === '/chat' ? '#2563eb' : '#374151',
                fontWeight: location.pathname === '/chat' ? '600' : '500',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                backgroundColor: location.pathname === '/chat' ? '#dbeafe' : 'transparent',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== '/chat') {
                  e.target.style.backgroundColor = '#f3f4f6';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== '/chat') {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              Previous Chats
            </Link>

            {/* User Profile Section */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              paddingLeft: '1rem',
              borderLeft: '1px solid #e5e7eb'
            }}>
              {/* User Avatar & Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <img
                  src={user?.user?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.user?.username || 'User')}`}
                  alt={user?.user?.username || 'User'}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #e5e7eb'
                  }}
                />
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  {user?.user?.username || 'User'}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                style={{
                  backgroundColor: '#fee2e2',
                  color: '#b91c1c',
                  border: '1px solid #fecaca',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#fecaca';
                  e.target.style.borderColor = '#fca5a5';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#fee2e2';
                  e.target.style.borderColor = '#fecaca';
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div>
        <Component />
      </div>
    </div>
  );
};

export default ProtectedRoute;

