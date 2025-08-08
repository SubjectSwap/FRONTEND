import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import CircularProgress from '../components/CircularProgress';
import { User, Mail, Lock, BookOpen, Languages, Plus, X, Save } from 'lucide-react';

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form states
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    languages: [],
    learningSubjects: [],
    teachingSubjects: []
  });
  
  // Input states for adding new items
  const [newLanguage, setNewLanguage] = useState('');
  const [newLearningSubject, setNewLearningSubject] = useState('');
  const [newTeachingSubject, setNewTeachingSubject] = useState('');
  const [newTeachingRating, setNewTeachingRating] = useState(5);

  // Available subjects
  const availableSubjects = [
    'Physics', 'Mathematics', 'Chemistry', 'English', 'History',
    'Hindi', 'SST', 'Geography', 'Electrochemistry', 'Biology', 
    'Astrophysics', 'Civics', 'Macroeconomics', 'Biochemistry'
  ];

  // Available languages
  const availableLanguages = [
    'English', 'Hindi', 'Spanish', 'French', 'German', 'Chinese',
    'Japanese', 'Korean', 'Arabic', 'Portuguese', 'Russian', 'Italian'
  ];

  useEffect(() => {
    if (user?.user) {
      setFormData({
        username: user.user.username || '',
        email: user.user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        languages: user.user.languages || [],
        learningSubjects: user.user.learningSubjects || [],
        teachingSubjects: user.user.teachingSubjects || []
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addLanguage = () => {
    if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()]
      }));
      setNewLanguage('');
    }
  };

  const removeLanguage = (language) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang !== language)
    }));
  };

  const addLearningSubject = () => {
    if (newLearningSubject && !formData.learningSubjects.includes(newLearningSubject)) {
      setFormData(prev => ({
        ...prev,
        learningSubjects: [...prev.learningSubjects, newLearningSubject]
      }));
      setNewLearningSubject('');
    }
  };

  const removeLearningSubject = (subject) => {
    setFormData(prev => ({
      ...prev,
      learningSubjects: prev.learningSubjects.filter(subj => subj !== subject)
    }));
  };

  const addTeachingSubject = () => {
    if (newTeachingSubject && !formData.teachingSubjects.some(ts => ts.subjectName === newTeachingSubject)) {
      const newSubject = {
        subjectName: newTeachingSubject,
        selfRating: parseFloat(newTeachingRating),
        totalReceivedRatings: 0,
        noOfRatings: 0
      };
      setFormData(prev => ({
        ...prev,
        teachingSubjects: [...prev.teachingSubjects, newSubject]
      }));
      setNewTeachingSubject('');
      setNewTeachingRating(5);
    }
  };

  const removeTeachingSubject = (subjectName) => {
    setFormData(prev => ({
      ...prev,
      teachingSubjects: prev.teachingSubjects.filter(ts => ts.subjectName !== subjectName)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate passwords if changing
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        setError('Current password is required to set a new password');
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setError('New passwords do not match');
        return;
      }
      if (formData.newPassword.length < 6) {
        setError('New password must be at least 6 characters long');
        return;
      }
    }

    setLoading(true);
    try {
      const updateData = {
        username: formData.username,
        email: formData.email,
        languages: formData.languages,
        learningSubjects: formData.learningSubjects,
        teachingSubjects: formData.teachingSubjects
      };

      // Only include password fields if changing password
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/update-profile`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const updatedUser = await response.json();
      
      // Update the auth context
      if (updateUser) {
        updateUser(updatedUser);
      }
      
      setSuccess('Profile updated successfully!');
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

    } catch (err) {
      setError(err.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '2rem 0' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
        
        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          padding: '2rem',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
            Edit Profile
          </h1>
          <p style={{ color: '#6b7280' }}>
            Update your information and preferences
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#b91c1c',
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
            border: '1px solid #fecaca'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            backgroundColor: '#d1fae5',
            color: '#047857',
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
            border: '1px solid #a7f3d0'
          }}>
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          
          {/* Basic Information */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
              <User size={24} color="#2563eb" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginLeft: '0.5rem' }}>
                Basic Information
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Password Change */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
              <Lock size={24} color="#dc2626" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginLeft: '0.5rem' }}>
                Change Password
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  placeholder="Leave blank to keep current password"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Enter new password"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm new password"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Languages */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
              <Languages size={24} color="#6366f1" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginLeft: '0.5rem' }}>
                Languages
              </h2>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <select
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem'
                }}
              >
                <option value="">Select a language</option>
                {availableLanguages.filter(lang => !formData.languages.includes(lang)).map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={addLanguage}
                style={{
                  backgroundColor: '#6366f1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                <Plus size={16} /> Add
              </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {formData.languages.map((language, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: '#e0e7ff',
                    color: '#4338ca',
                    padding: '0.5rem 1rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {language}
                  <button
                    type="button"
                    onClick={() => removeLanguage(language)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#4338ca',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Subjects */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
              <BookOpen size={24} color="#8b5cf6" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginLeft: '0.5rem' }}>
                Learning Subjects
              </h2>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <select
                value={newLearningSubject}
                onChange={(e) => setNewLearningSubject(e.target.value)}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem'
                }}
              >
                <option value="">Select a subject</option>
                {availableSubjects.filter(subject => !formData.learningSubjects.includes(subject)).map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={addLearningSubject}
                style={{
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                <Plus size={16} /> Add
              </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {formData.learningSubjects.map((subject, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: '#ede9fe',
                    color: '#6d28d9',
                    padding: '0.5rem 1rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {subject}
                  <button
                    type="button"
                    onClick={() => removeLearningSubject(subject)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#6d28d9',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Teaching Subjects */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
              <BookOpen size={24} color="#10b981" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginLeft: '0.5rem' }}>
                Teaching Subjects
              </h2>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                  Subject
                </label>
                <select
                  value={newTeachingSubject}
                  onChange={(e) => setNewTeachingSubject(e.target.value)}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="">Select a subject</option>
                  {availableSubjects.filter(subject => 
                    !formData.teachingSubjects.some(ts => ts.subjectName === subject)
                  ).map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                  Self Rating (1-10)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  step="0.1"
                  value={newTeachingRating}
                  onChange={(e) => setNewTeachingRating(e.target.value)}
                  style={{
                    width: '100px',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
              
              <button
                type="button"
                onClick={addTeachingSubject}
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                <Plus size={16} /> Add
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {formData.teachingSubjects.map((subject, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #d1fae5',
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#047857', margin: '0 0 0.25rem 0' }}>
                      {subject.subjectName}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                      Self Rating: {subject.selfRating}/10
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeTeachingSubject(subject.subjectName)}
                    style={{
                      backgroundColor: '#fee2e2',
                      color: '#b91c1c',
                      border: 'none',
                      borderRadius: '0.375rem',
                      padding: '0.5rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={{
                backgroundColor: '#6b7280',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: loading ? '#9ca3af' : '#2563eb',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {loading && <CircularProgress size={16} color="white" />}
              <Save size={16} />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;