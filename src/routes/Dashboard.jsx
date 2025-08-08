import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Users, MessageCircle, Star, TrendingUp, Calendar, Search } from 'lucide-react';
import CircularProgress from '../components/CircularProgress';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalMatches: 0,
    activeChats: 0,
    completedSessions: 0,
    averageRating: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // You can implement actual API calls here
      // For now, using mock data
      setStats({
        totalMatches: 15,
        activeChats: 3,
        completedSessions: 8,
        averageRating: 9
      });
      
      setRecentActivity([
        { type: 'match', message: 'New match found for Physics', time: '2 hours ago' },
        { type: 'chat', message: 'Message from John about Mathematics', time: '5 hours ago' },
        { type: 'session', message: 'Completed Chemistry session with Sarah', time: '1 day ago' }
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f3f4f6',
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '2rem 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        
        {/* Welcome Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img
                src={user?.user?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.user?.username || 'User')}&size=80`}
                alt={user?.user?.username}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #e5e7eb'
                }}
              />
              <div>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                  Welcome back, {user?.user?.username}!
                </h1>
                <p style={{ color: '#6b7280', marginTop: '0.5rem', fontSize: '1.125rem' }}>
                  Ready to learn and teach today?
                </p>
              </div>
            </div>
            <Link to="/match">
              <button style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '1rem',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Search size={20} />
                Find Matches
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            padding: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Total Matches</p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{stats.totalMatches}</p>
              </div>
              <Users size={32} color="#2563eb" />
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            padding: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Active Chats</p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{stats.activeChats}</p>
              </div>
              <MessageCircle size={32} color="#10b981" />
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            padding: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Completed Sessions</p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{stats.completedSessions}</p>
              </div>
              <TrendingUp size={32} color="#8b5cf6" />
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            padding: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Average Rating</p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{stats.averageRating}/10</p>
              </div>
              <Star size={32} color="#f59e0b" />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
          
          {/* Quick Actions */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            padding: '1.5rem'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginBottom: '1.5rem' }}>
              Quick Actions
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button
                onClick={() => navigate('/match')}
                style={{
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#e5e7eb';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#f3f4f6';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <Search size={20} color="#2563eb" />
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '500', color: '#374151', margin: 0 }}>Find New Matches</h3>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Discover learning partners</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/chat')}
                style={{
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#e5e7eb';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#f3f4f6';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <MessageCircle size={20} color="#10b981" />
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '500', color: '#374151', margin: 0 }}>View Chats</h3>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Continue conversations</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/edit-profile')}
                style={{
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#e5e7eb';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#f3f4f6';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <BookOpen size={20} color="#8b5cf6" />
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '500', color: '#374151', margin: 0 }}>Update Profile</h3>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Edit subjects and skills</p>
                </div>
              </button>
            </div>
          </div>

          {/* Your Subjects */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            padding: '1.5rem'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginBottom: '1.5rem' }}>
              Your Subjects
            </h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '500', color: '#10b981', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={16} />
                Teaching ({user?.user?.teachingSubjects?.length || 0})
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {user?.user?.teachingSubjects && user.user.teachingSubjects.length > 0 ? (
                  user.user.teachingSubjects.slice(0, 3).map((subject, index) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: '#d1fae5',
                        color: '#047857',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}
                    >
                      {subject.subjectName}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '0.875rem', color: '#6b7280', fontStyle: 'italic' }}>
                    No teaching subjects yet
                  </span>
                )}
                {user?.user?.teachingSubjects && user.user.teachingSubjects.length > 3 && (
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    +{user.user.teachingSubjects.length - 3} more
                  </span>
                )}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '500', color: '#8b5cf6', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={16} />
                Learning ({user?.user?.learningSubjects?.length || 0})
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {user?.user?.learningSubjects && user.user.learningSubjects.length > 0 ? (
                  user.user.learningSubjects.slice(0, 3).map((subject, index) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: '#ede9fe',
                        color: '#6d28d9',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}
                    >
                      {subject}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '0.875rem', color: '#6b7280', fontStyle: 'italic' }}>
                    No learning subjects yet
                  </span>
                )}
                {user?.user?.learningSubjects && user.user.learningSubjects.length > 3 && (
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    +{user.user.learningSubjects.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            padding: '1.5rem'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginBottom: '1.5rem' }}>
              Recent Activity
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'start',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      backgroundColor: '#f9fafb',
                      borderRadius: '0.5rem',
                      border: '1px solid #f3f4f6'
                    }}
                  >
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: activity.type === 'match' ? '#2563eb' : 
                                     activity.type === 'chat' ? '#10b981' : '#8b5cf6',
                      marginTop: '0.375rem'
                    }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.875rem', color: '#374151', margin: '0 0 0.25rem 0' }}>
                        {activity.message}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <Calendar size={48} color="#9ca3af" style={{ margin: '0 auto 1rem' }} />
                  <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>No recent activity</p>
                  <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Start matching to see your activity here</p>
                </div>
              )}
            </div>
          </div>

          {/* Learning Progress */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            padding: '1.5rem'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginBottom: '1.5rem' }}>
              Learning Progress
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ 
                padding: '1rem',
                backgroundColor: '#fef3c7',
                borderRadius: '0.5rem',
                border: '1px solid #fed7aa'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#92400e' }}>This Week</span>
                  <span style={{ fontSize: '0.75rem', color: '#92400e' }}>5 hours</span>
                </div>
                <div style={{ 
                  width: '100%', 
                  height: '8px', 
                  backgroundColor: '#fde68a',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: '60%', 
                    height: '100%', 
                    backgroundColor: '#f59e0b',
                    borderRadius: '4px'
                  }} />
                </div>
              </div>

              <div style={{ 
                padding: '1rem',
                backgroundColor: '#dbeafe',
                borderRadius: '0.5rem',
                border: '1px solid #bfdbfe'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1e40af' }}>This Month</span>
                  <span style={{ fontSize: '0.75rem', color: '#1e40af' }}>18 hours</span>
                </div>
                <div style={{ 
                  width: '100%', 
                  height: '8px', 
                  backgroundColor: '#93c5fd',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: '75%', 
                    height: '100%', 
                    backgroundColor: '#2563eb',
                    borderRadius: '4px'
                  }} />
                </div>
              </div>

              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Keep up the great work! 🎉
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;