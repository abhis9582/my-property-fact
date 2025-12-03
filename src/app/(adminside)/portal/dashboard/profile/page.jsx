"use client";
import { useState, useEffect } from "react";
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Form, 
  Tab, 
  Tabs,
  Badge,
  ProgressBar,
  Alert
} from "react-bootstrap";
import { 
  cilUser, 
  cilLocationPin, 
  cilPhone, 
  cilEnvelopeOpen, 
  cilCalendar,
  cilShieldAlt,
  cilSettings,
  cilStar,
  cilCheck,
  cilPencil,
  cilAccountLogout
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useUser } from "../../_contexts/UserContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8005/";

// Helper function to get initials from full name
const getInitials = (fullName) => {
  if (!fullName || !fullName.trim()) return "U";
  
  const names = fullName.trim().split(/\s+/);
  if (names.length >= 2) {
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  }
  return names[0][0].toUpperCase();
};

// Helper function to calculate profile completion percentage
const calculateProfileCompletion = (profile) => {
  let filledFields = 0;
  const totalFields = 7; // fullName, email, phone, location, bio, experience, avatar
  
  if (profile.name && profile.name.trim()) filledFields++;
  if (profile.email && profile.email.trim()) filledFields++;
  if (profile.phone && profile.phone.trim()) filledFields++;
  if (profile.location && profile.location.trim()) filledFields++;
  if (profile.bio && profile.bio.trim()) filledFields++;
  if (profile.experience && profile.experience.trim()) filledFields++;
  if (profile.avatar && profile.avatar.trim() && profile.avatar !== "/logo.png") filledFields++;
  
  return Math.round((filledFields / totalFields) * 100);
};

// Helper function to extract role from roles array
const getRoleFromRoles = (roles) => {
  if (!roles || roles.length === 0) return "Member";
  
  // Get the first active role
  const activeRole = Array.isArray(roles) 
    ? roles.find(role => role && role.isActive !== false)
    : null;
  
  if (activeRole) {
    return activeRole.roleName || "Member";
  }
  
  // Fallback: check if roles is an array of strings
  if (Array.isArray(roles) && roles.length > 0) {
    const firstRole = roles[0];
    if (typeof firstRole === 'string') {
      return firstRole.replace('ROLE_', '').replace(/_/g, ' ');
    }
  }
  
  return "Member";
};

export default function Profile() {
  const router = useRouter();
  const { logout } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    experience: "",
    location: "",
    bio: "",
    avatar: null,
    verified: false,
    rating: 0,
    totalDeals: 0,
    joinDate: ""
  });

  const [stats, setStats] = useState({
    profileCompletion: 0
  });

  const [recentAchievements] = useState([
    {
      id: 1,
      title: "Top Performer",
      description: "Achieved highest sales in Q3 2024",
      date: "2024-10-15",
      type: "performance"
    },
    {
      id: 2,
      title: "Client Satisfaction",
      description: "Maintained 95% satisfaction rate",
      date: "2024-10-10",
      type: "satisfaction"
    },
    {
      id: 3,
      title: "Quick Response",
      description: "Average response time under 2 minutes",
      date: "2024-10-05",
      type: "response"
    }
  ]);

  // Fetch user profile from API
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = Cookies.get("authToken") || Cookies.get("token");
        if (!token) {
          setError("No auth token found. Please login again.");
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}users/me`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          const userData = await response.json();
          const updatedProfile = {
            name: userData.fullName || "",
            email: userData.email || "",
            phone: userData.phone || "",
            role: getRoleFromRoles(userData.roles || userData.role),
            experience: userData.experience || "",
            location: userData.location || "",
            bio: userData.bio || "",
            avatar: userData.avatar || null,
            verified: userData.verified || false,
            rating: userData.rating || 0,
            totalDeals: userData.totalDeals || 0,
            joinDate: userData.createdAt ? new Date(userData.createdAt).toISOString().split('T')[0] : ""
          };
          
          setProfile(updatedProfile);
          
          // Calculate profile completion
          const completion = calculateProfileCompletion(updatedProfile);
          setStats({ profileCompletion: completion });
          
          setError(null);
        } else {
          if (response.status === 401) {
            setError("Session expired. Please login again.");
            logout();
            router.push("/");
          } else {
            setError("Failed to load profile. Please try again.");
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Network error. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router, logout]);

  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      const token = Cookies.get("authToken") || Cookies.get("token");
      if (!token) {
        setError("No auth token found. Please login again.");
        setSaving(false);
        return;
      }

      const updateData = {
        fullName: profile.name,
        phone: profile.phone || null,
        location: profile.location || null,
        bio: profile.bio || null,
        avatar: profile.avatar || null,
        experience: profile.experience || null
      };

      const response = await fetch(`${API_BASE_URL}users/me`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        const updatedProfile = {
          name: updatedUser.fullName || profile.name,
          email: updatedUser.email || profile.email,
          phone: updatedUser.phone || profile.phone,
          role: getRoleFromRoles(updatedUser.roles || updatedUser.role),
          experience: updatedUser.experience || profile.experience,
          location: updatedUser.location || profile.location,
          bio: updatedUser.bio || profile.bio,
          avatar: updatedUser.avatar || null,
          verified: updatedUser.verified !== undefined ? updatedUser.verified : profile.verified,
          rating: updatedUser.rating !== undefined ? updatedUser.rating : profile.rating,
          totalDeals: updatedUser.totalDeals !== undefined ? updatedUser.totalDeals : profile.totalDeals,
          joinDate: profile.joinDate
        };
        
        setProfile(updatedProfile);
        
        // Recalculate profile completion
        const completion = calculateProfileCompletion(updatedProfile);
        setStats({ profileCompletion: completion });
        
        setSuccess("Profile updated successfully!");
        setEditMode(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || "Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      router.push("/");
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h3>Loading Profile...</h3>
          <p>Please wait while we load your profile data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h2>My Profile</h2>
        <p>Welcome back, {profile.name || 'User'}! Manage your account settings and preferences</p>
      </div>

      <Row className="g-4">
        {/* Profile Overview */}
        <Col lg={4}>
          <Card className="profile-card">
            <Card.Body className="text-center">
              <div className="profile-avatar-wrapper">
                <div className="profile-avatar">
                  <div className="avatar-border">
                    {profile.avatar && profile.avatar.trim() ? (
                      <Image
                        src={profile.avatar}
                        alt="Profile"
                        width={140}
                        height={140}
                        className="avatar-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="avatar-initials"
                      style={{ display: profile.avatar && profile.avatar.trim() ? 'none' : 'flex' }}
                    >
                      {getInitials(profile.name)}
                    </div>
                  </div>
                  {profile.verified && (
                    <Badge bg="success" className="verified-badge">
                      <CIcon icon={cilCheck} className="me-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
              <h4 className="profile-name">{profile.name || 'User'}</h4>
              <p className="profile-role">{profile.role || 'Member'}</p>
              <div className="profile-rating">
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <CIcon 
                      key={star}
                      icon={cilStar} 
                      className={`star-icon ${star <= Math.round(profile.rating) ? 'star-filled' : 'star-empty'}`}
                    />
                  ))}
                </div>
                <div className="rating-info">
                  <span className="rating-text">{profile.rating || 0}</span>
                  <span className="rating-count">(127 reviews)</span>
                </div>
              </div>
              <div className="profile-stats-grid">
                <div className="stat-card">
                  <div className="stat-icon deals">
                    <CIcon icon={cilStar} />
                  </div>
                  <div className="stat-content">
                    <span className="stat-value">{profile.totalDeals || 0}</span>
                    <span className="stat-label">Total Deals</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon experience">
                    <CIcon icon={cilCalendar} />
                  </div>
                  <div className="stat-content">
                    <span className="stat-value">{profile.experience || '0'}</span>
                    <span className="stat-label">Experience</span>
                  </div>
                </div>
              </div>
              <Button 
                variant="primary" 
                className="btn-modern btn-primary-modern w-100 mt-3 mb-2"
                onClick={() => setEditMode(!editMode)}
              >
                <CIcon icon={cilPencil} className="me-2" />
                {editMode ? 'Cancel Edit' : 'Edit Profile'}
              </Button>
              <Button 
                variant="outline-danger" 
                className="btn-modern btn-outline-danger-modern w-100" 
                onClick={handleLogout}
              >
                <CIcon icon={cilAccountLogout} className="me-2" />
                Logout
              </Button>
            </Card.Body>
          </Card>

          {/* Profile Completion */}
          <Card className="profile-card completion-card mt-4">
            <Card.Header className="card-header-modern">
              <div className="d-flex align-items-center">
                <div className="header-icon-wrapper">
                  <CIcon icon={cilSettings} className="header-icon" />
                </div>
                <h6 className="mb-0 ms-2">Profile Completion</h6>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="completion-stats">
                <div className="completion-item">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="completion-label">
                      <CIcon icon={cilUser} className="me-2" />
                      Profile Info
                    </span>
                    <span className="completion-percentage">{stats.profileCompletion || 0}%</span>
                  </div>
                  <div className="progress-wrapper">
                    <ProgressBar 
                      now={stats.profileCompletion || 0} 
                      variant="success" 
                      className="progress-modern"
                    />
                  </div>
                </div>
              </div>
              <div className="completion-tip mt-3">
                <small className="text-muted">
                  Complete your profile to get better visibility and more opportunities.
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Profile Details */}
        <Col lg={8}>
          <Card className="profile-card details-card">
            <Card.Header className="card-header-modern">
              <div className="d-flex align-items-center">
                <div className="header-icon-wrapper">
                  <CIcon icon={cilUser} className="header-icon" />
                </div>
                <h6 className="mb-0 ms-2">Personal Information</h6>
              </div>
            </Card.Header>
            <Card.Body>
              {error && (
                <Alert variant="danger" dismissible onClose={() => setError(null)} className="mb-3">
                  {error}
                </Alert>
              )}
              {success && (
                <Alert variant="success" dismissible onClose={() => setSuccess(null)} className="mb-3">
                  {success}
                </Alert>
              )}
              
              {!editMode ? (
                // Read-only view
                <div className="profile-info-view">
                  <Row className="g-4">
                    <Col md={6}>
                      <div className="info-item">
                        <div className="info-label">
                          <CIcon icon={cilUser} className="me-2" />
                          Full Name
                        </div>
                        <div className="info-value">{profile.name || "Not provided"}</div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="info-item">
                        <div className="info-label">
                          <CIcon icon={cilEnvelopeOpen} className="me-2" />
                          Email Address
                        </div>
                        <div className="info-value">{profile.email || "Not provided"}</div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="info-item">
                        <div className="info-label">
                          <CIcon icon={cilPhone} className="me-2" />
                          Phone Number
                        </div>
                        <div className="info-value">{profile.phone || "Not provided"}</div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="info-item">
                        <div className="info-label">
                          <CIcon icon={cilLocationPin} className="me-2" />
                          Location
                        </div>
                        <div className="info-value">{profile.location || "Not provided"}</div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="info-item">
                        <div className="info-label">
                          <CIcon icon={cilSettings} className="me-2" />
                          Experience
                        </div>
                        <div className="info-value">{profile.experience || "Not provided"}</div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="info-item">
                        <div className="info-label">
                          <CIcon icon={cilCalendar} className="me-2" />
                          Member Since
                        </div>
                        <div className="info-value">
                          {profile.joinDate 
                            ? new Date(profile.joinDate).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })
                            : "Not available"}
                        </div>
                      </div>
                    </Col>
                    <Col md={12}>
                      <div className="info-item">
                        <div className="info-label">
                          <CIcon icon={cilUser} className="me-2" />
                          Bio
                        </div>
                        <div className="info-value bio-text">
                          {profile.bio || "No bio provided yet. Click 'Edit Profile' to add one."}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              ) : (
                // Editable form
                <Form className="profile-form">
                <Row className="g-4">
                  <Col md={6}>
                    <Form.Group className="form-group-modern">
                      <Form.Label className="form-label-modern">
                        <CIcon icon={cilUser} className="me-2" />
                        Full Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        className="form-control-modern"
                        value={profile.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="form-group-modern">
                      <Form.Label className="form-label-modern">
                        <CIcon icon={cilEnvelopeOpen} className="me-2" />
                        Email Address
                      </Form.Label>
                      <Form.Control
                        type="email"
                        className="form-control-modern"
                        value={profile.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your.email@example.com"
                        disabled
                      />
                      <Form.Text className="text-muted">
                        Email cannot be changed
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="form-group-modern">
                      <Form.Label className="form-label-modern">
                        <CIcon icon={cilPhone} className="me-2" />
                        Phone Number
                      </Form.Label>
                      <Form.Control
                        type="tel"
                        className="form-control-modern"
                        value={profile.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+1 234 567 8900"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="form-group-modern">
                      <Form.Label className="form-label-modern">
                        <CIcon icon={cilLocationPin} className="me-2" />
                        Location
                      </Form.Label>
                      <Form.Control
                        type="text"
                        className="form-control-modern"
                        value={profile.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="City, State, Country"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="form-group-modern">
                      <Form.Label className="form-label-modern">
                        <CIcon icon={cilSettings} className="me-2" />
                        Experience
                      </Form.Label>
                      <Form.Control
                        type="text"
                        className="form-control-modern"
                        value={profile.experience}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                        placeholder="e.g., 5 years, Senior Agent"
                      />
                      <Form.Text className="text-muted">
                        Your professional experience
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="form-group-modern">
                      <Form.Label className="form-label-modern">
                        <CIcon icon={cilCalendar} className="me-2" />
                        Member Since
                      </Form.Label>
                      <Form.Control
                        type="date"
                        className="form-control-modern"
                        value={profile.joinDate}
                        disabled
                      />
                      <Form.Text className="text-muted">
                        Account creation date
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group className="form-group-modern">
                      <Form.Label className="form-label-modern">
                        <CIcon icon={cilUser} className="me-2" />
                        Bio
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        className="form-control-modern"
                        value={profile.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        placeholder="Tell us about yourself..."
                      />
                      <Form.Text className="text-muted">
                        Write a short bio to help others know you better
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
                  <div className="form-actions mt-4">
                    <Button 
                      variant="outline-secondary" 
                      className="btn-modern px-4 me-2"
                      onClick={() => {
                        setEditMode(false);
                        setError(null);
                      }}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="primary" 
                      className="btn-modern btn-primary-modern px-4"
                      onClick={handleSave} 
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <CIcon icon={cilCheck} className="me-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>

          {/* Recent Achievements */}
          <Card className="profile-card achievements-card mt-4">
            <Card.Header className="card-header-modern">
              <div className="d-flex align-items-center">
                <div className="header-icon-wrapper">
                  <CIcon icon={cilStar} className="header-icon" />
                </div>
                <h6 className="mb-0 ms-2">Recent Achievements</h6>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="achievements-list">
                {recentAchievements.map(achievement => (
                  <div key={achievement.id} className="achievement-item-modern">
                    <div className={`achievement-icon-modern achievement-${achievement.type}`}>
                      <CIcon icon={cilStar} />
                    </div>
                    <div className="achievement-content-modern">
                      <h6 className="achievement-title-modern">{achievement.title}</h6>
                      <p className="achievement-description-modern">{achievement.description}</p>
                      <div className="achievement-date-modern">
                        <CIcon icon={cilCalendar} className="me-1" />
                        {new Date(achievement.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <style jsx>{`
        :global(.profile-page) {
          padding: 2rem;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          min-height: 100vh;
          position: relative;
        }

        :global(.profile-page::before) {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 200px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          z-index: 0;
        }

        /* Common loading styles are in PortalCommonStyles.css */
        /* Profile page uses custom spinner colors */
        .loading-spinner {
          border: 4px solid rgba(102, 126, 234, 0.2);
          border-top: 4px solid #667eea;
        }

        .profile-header {
          margin-bottom: 2rem;
          position: relative;
          z-index: 1;
        }

        .profile-header h2 {
          color: white;
          font-weight: 700;
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .profile-header p {
          color: rgba(255, 255, 255, 0.9);
          margin: 0;
          font-size: 1.1rem;
        }

        :global(.profile-card) {
          border: none;
          border-radius: 20px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
          background: white;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          z-index: 1;
        }

        :global(.profile-card:hover) {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        :global(.card-header-modern) {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          padding: 1.5rem;
          color: white;
        }

        .header-icon-wrapper {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
        }

        .header-icon {
          color: white;
          font-size: 1.2rem;
        }

        :global(.card-header-modern h6) {
          color: white;
          font-weight: 600;
          font-size: 1.1rem;
        }

        .profile-avatar-wrapper {
          margin-bottom: 1.5rem;
        }

        .profile-avatar {
          position: relative;
          display: inline-block;
          margin-bottom: 1rem;
        }

        .avatar-border {
          position: relative;
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 5px;
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        :global(.avatar-image) {
          border-radius: 50%;
          width: 100% !important;
          height: 100% !important;
          object-fit: cover;
          border: 4px solid white;
        }

        .avatar-initials {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          font-weight: 700;
          border: 4px solid white;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        :global(.verified-badge) {
          position: absolute;
          bottom: 5px;
          right: 5px;
          font-size: 0.75rem;
          padding: 0.4rem 0.7rem;
          border-radius: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          font-weight: 600;
        }

        :global(.profile-name) {
          color: #212529;
          font-weight: 700;
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        :global(.profile-role) {
          color: #6c757d;
          margin-bottom: 1.5rem;
          font-size: 1rem;
        }

        :global(.profile-rating) {
          margin-bottom: 2rem;
        }

        .rating-stars {
          display: flex;
          justify-content: center;
          gap: 0.25rem;
          margin-bottom: 0.5rem;
        }

        :global(.star-icon) {
          font-size: 1.2rem;
          transition: all 0.2s;
        }

        :global(.star-filled) {
          color: #ffc107;
        }

        :global(.star-empty) {
          color: #e0e0e0;
        }

        .rating-info {
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        :global(.rating-text) {
          font-weight: 700;
          font-size: 1.1rem;
          color: #212529;
        }

        :global(.rating-count) {
          color: #6c757d;
          font-size: 0.875rem;
        }

        :global(.profile-stats-grid) {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 15px;
          transition: all 0.3s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .stat-icon.deals {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .stat-icon.experience {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
        }

        .stat-content {
          display: flex;
          flex-direction: column;
        }

        :global(.stat-value) {
          font-weight: 700;
          font-size: 1.5rem;
          color: #212529;
          line-height: 1.2;
        }

        :global(.stat-label) {
          font-size: 0.875rem;
          color: #6c757d;
        }

        :global(.btn-modern) {
          border-radius: 12px;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          transition: all 0.3s;
          border: none;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        :global(.btn-primary-modern) {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        :global(.btn-primary-modern:hover) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        :global(.btn-outline-danger-modern) {
          border: 2px solid #dc3545;
          color: #dc3545;
          background: white;
        }

        :global(.btn-outline-danger-modern:hover) {
          background: #dc3545;
          color: white;
          transform: translateY(-2px);
        }

        :global(.btn-outline-secondary) {
          border: 2px solid #6c757d;
          color: #6c757d;
          background: white;
        }

        :global(.btn-outline-secondary:hover) {
          background: #6c757d;
          color: white;
          transform: translateY(-2px);
        }

        .completion-stats {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .completion-item {
          font-size: 0.9rem;
        }

        .completion-label {
          font-weight: 600;
          color: #212529;
          display: flex;
          align-items: center;
        }

        .completion-percentage {
          font-weight: 700;
          color: #667eea;
          font-size: 1rem;
        }

        .progress-wrapper {
          margin-top: 0.5rem;
        }

        :global(.progress-modern) {
          height: 10px !important;
          border-radius: 10px;
          background: #e9ecef;
          overflow: hidden;
        }

        :global(.progress-modern .progress-bar) {
          border-radius: 10px;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          transition: width 0.6s ease;
        }

        .completion-tip {
          padding: 1rem;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 10px;
          border-left: 4px solid #667eea;
        }

        .profile-info-view {
          padding: 0.5rem 0;
        }

        .info-item {
          margin-bottom: 1.5rem;
        }

        .info-label {
          font-weight: 600;
          color: #6c757d;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-value {
          color: #212529;
          font-size: 1rem;
          font-weight: 500;
          padding: 0.75rem 0;
          min-height: 2.5rem;
          display: flex;
          align-items: center;
        }

        .bio-text {
          white-space: pre-wrap;
          line-height: 1.6;
          color: #495057;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 8px;
          min-height: 100px;
          font-style: italic;
        }

        :global(.profile-form) {
          padding: 0.5rem 0;
        }

        :global(.form-group-modern) {
          margin-bottom: 1.5rem;
        }

        :global(.form-label-modern) {
          font-weight: 600;
          color: #212529;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          font-size: 0.95rem;
        }

        :global(.form-control-modern) {
          border: 2px solid #e9ecef;
          border-radius: 12px;
          padding: 0.75rem 1rem;
          font-size: 0.95rem;
          transition: all 0.3s;
        }

        :global(.form-control-modern:focus) {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
          outline: none;
        }

        :global(.form-control-modern:disabled) {
          background-color: #f8f9fa;
          opacity: 0.7;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          padding-top: 1rem;
          border-top: 1px solid #e9ecef;
        }

        .achievements-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .achievement-item-modern {
          display: flex;
          align-items: flex-start;
          gap: 1.25rem;
          padding: 1.5rem;
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          border-radius: 15px;
          border-left: 4px solid #667eea;
          transition: all 0.3s;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .achievement-item-modern:hover {
          transform: translateX(5px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .achievement-icon-modern {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .achievement-performance {
          background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
          color: white;
        }

        .achievement-satisfaction {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          color: white;
        }

        .achievement-response {
          background: linear-gradient(135deg, #17a2b8 0%, #667eea 100%);
          color: white;
        }

        .achievement-content-modern {
          flex: 1;
        }

        .achievement-title-modern {
          margin: 0 0 0.5rem;
          font-weight: 700;
          color: #212529;
          font-size: 1.1rem;
        }

        .achievement-description-modern {
          margin: 0 0 0.75rem;
          color: #6c757d;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .achievement-date-modern {
          color: #adb5bd;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
        }

        @media (max-width: 1200px) {
          :global(.profile-page) {
            padding: 1.5rem;
          }

          .profile-header h2 {
            font-size: 2rem;
          }

          .avatar-border {
            width: 120px;
            height: 120px;
          }
        }

        @media (max-width: 992px) {
          :global(.profile-page) {
            padding: 1rem;
          }

          .profile-header h2 {
            font-size: 1.75rem;
          }

          .avatar-border {
            width: 100px;
            height: 100px;
          }

          :global(.profile-stats-grid) {
            gap: 0.75rem;
          }

          .stat-card {
            padding: 0.75rem;
          }
        }

        @media (max-width: 768px) {
          :global(.profile-page) {
            padding: 0.75rem;
          }

          .profile-header h2 {
            font-size: 1.5rem;
          }

          .profile-header p {
            font-size: 0.95rem;
          }

          .avatar-border {
            width: 90px;
            height: 90px;
          }

          :global(.profile-stats-grid) {
            grid-template-columns: 1fr;
          }

          :global(.profile-card .card-body) {
            padding: 1rem;
          }

          .achievement-item-modern {
            padding: 1rem;
            gap: 1rem;
          }
        }

        @media (max-width: 576px) {
          :global(.profile-page) {
            padding: 0.5rem;
          }

          .profile-header h2 {
            font-size: 1.25rem;
          }

          .profile-header p {
            font-size: 0.85rem;
          }

          .avatar-border {
            width: 80px;
            height: 80px;
          }

          :global(.profile-name) {
            font-size: 1.25rem;
          }

          :global(.stat-value) {
            font-size: 1.25rem;
          }

          .achievement-item-modern {
            flex-direction: column;
            text-align: center;
            align-items: center;
          }

          .achievement-icon-modern {
            margin: 0 auto;
          }
        }
      `}</style>
    </div>
  );
}
