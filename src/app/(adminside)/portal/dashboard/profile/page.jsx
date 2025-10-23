"use client";
import { useState } from "react";
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
  cilEnvelope, 
  cilCalendar,
  cilShieldAlt,
  cilSettings,
  cilStar,
  cilCheck,
  cilEdit
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import Image from "next/image";

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "John Agent",
    email: "john.agent@example.com",
    phone: "+91 98765 43210",
    role: "Real Estate Agent",
    experience: "5 years",
    location: "Gurgaon, Haryana",
    bio: "Experienced real estate agent specializing in residential properties in Gurgaon. Committed to helping clients find their dream homes.",
    avatar: "/logo.png",
    verified: true,
    rating: 4.8,
    totalDeals: 127,
    joinDate: "2019-03-15"
  });

  const [stats, setStats] = useState({
    profileCompletion: 85,
    responseRate: 92,
    listingQuality: 78,
    clientSatisfaction: 4.8
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

  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Save profile logic here
    alert("Profile updated successfully!");
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h2>My Profile</h2>
        <p>Manage your account settings and preferences</p>
      </div>

      <Row className="g-4">
        {/* Profile Overview */}
        <Col lg={4}>
          <Card className="profile-card">
            <Card.Body className="text-center">
              <div className="profile-avatar">
                <Image
                  src={profile.avatar}
                  alt="Profile"
                  width={120}
                  height={120}
                  className="avatar-image"
                />
                <Badge bg="success" className="verified-badge">
                  <CIcon icon={cilCheck} className="me-1" />
                  Verified
                </Badge>
              </div>
              <h4 className="profile-name">{profile.name}</h4>
              <p className="profile-role">{profile.role}</p>
              <div className="profile-rating">
                <CIcon icon={cilStar} className="star-icon" />
                <span className="rating-text">{profile.rating}</span>
                <span className="rating-count">(127 reviews)</span>
              </div>
              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-value">{profile.totalDeals}</span>
                  <span className="stat-label">Total Deals</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{profile.experience}</span>
                  <span className="stat-label">Experience</span>
                </div>
              </div>
              <Button variant="primary" className="w-100 mt-3">
                <CIcon icon={cilEdit} className="me-1" />
                Edit Profile
              </Button>
            </Card.Body>
          </Card>

          {/* Profile Completion */}
          <Card className="profile-card mt-4">
            <Card.Header>
              <h6 className="mb-0">Profile Completion</h6>
            </Card.Header>
            <Card.Body>
              <div className="completion-stats">
                <div className="completion-item">
                  <div className="d-flex justify-content-between">
                    <span>Profile Info</span>
                    <span>{stats.profileCompletion}%</span>
                  </div>
                  <ProgressBar 
                    now={stats.profileCompletion} 
                    variant="success" 
                    className="mt-1"
                    style={{ height: '6px' }}
                  />
                </div>
                <div className="completion-item">
                  <div className="d-flex justify-content-between">
                    <span>Response Rate</span>
                    <span>{stats.responseRate}%</span>
                  </div>
                  <ProgressBar 
                    now={stats.responseRate} 
                    variant="info" 
                    className="mt-1"
                    style={{ height: '6px' }}
                  />
                </div>
                <div className="completion-item">
                  <div className="d-flex justify-content-between">
                    <span>Listing Quality</span>
                    <span>{stats.listingQuality}%</span>
                  </div>
                  <ProgressBar 
                    now={stats.listingQuality} 
                    variant="warning" 
                    className="mt-1"
                    style={{ height: '6px' }}
                  />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Profile Details */}
        <Col lg={8}>
          <Card className="profile-card">
            <Card.Header>
              <Tabs defaultActiveKey="personal" className="profile-tabs">
                <Tab eventKey="personal" title="Personal Info">
                  <CIcon icon={cilUser} className="me-1" />
                  Personal
                </Tab>
                <Tab eventKey="professional" title="Professional">
                  <CIcon icon={cilSettings} className="me-1" />
                  Professional
                </Tab>
                <Tab eventKey="security" title="Security">
                  <CIcon icon={cilShieldAlt} className="me-1" />
                  Security
                </Tab>
              </Tabs>
            </Card.Header>
            <Card.Body>
              <Tab.Content>
                <Tab.Pane eventKey="personal">
                  <Form>
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Full Name</Form.Label>
                          <Form.Control
                            type="text"
                            value={profile.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Email Address</Form.Label>
                          <Form.Control
                            type="email"
                            value={profile.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Phone Number</Form.Label>
                          <Form.Control
                            type="tel"
                            value={profile.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Location</Form.Label>
                          <Form.Control
                            type="text"
                            value={profile.location}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label>Bio</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={4}
                            value={profile.bio}
                            onChange={(e) => handleInputChange('bio', e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <div className="d-flex justify-content-end mt-3">
                      <Button variant="primary" onClick={handleSave}>
                        Save Changes
                      </Button>
                    </div>
                  </Form>
                </Tab.Pane>
                
                <Tab.Pane eventKey="professional">
                  <Form>
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Role/Designation</Form.Label>
                          <Form.Control
                            type="text"
                            value={profile.role}
                            onChange={(e) => handleInputChange('role', e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Experience</Form.Label>
                          <Form.Control
                            type="text"
                            value={profile.experience}
                            onChange={(e) => handleInputChange('experience', e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Join Date</Form.Label>
                          <Form.Control
                            type="date"
                            value={profile.joinDate}
                            onChange={(e) => handleInputChange('joinDate', e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>License Number</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter license number"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <div className="d-flex justify-content-end mt-3">
                      <Button variant="primary" onClick={handleSave}>
                        Update Professional Info
                      </Button>
                    </div>
                  </Form>
                </Tab.Pane>
                
                <Tab.Pane eventKey="security">
                  <Alert variant="info">
                    <CIcon icon={cilShieldAlt} className="me-2" />
                    Keep your account secure by regularly updating your password.
                  </Alert>
                  <Form>
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Current Password</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="Enter current password"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>New Password</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="Enter new password"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Confirm New Password</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="Confirm new password"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Two-Factor Authentication</Form.Label>
                          <Form.Select>
                            <option value="disabled">Disabled</option>
                            <option value="enabled">Enabled</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    <div className="d-flex justify-content-end mt-3">
                      <Button variant="primary" onClick={handleSave}>
                        Update Security Settings
                      </Button>
                    </div>
                  </Form>
                </Tab.Pane>
              </Tab.Content>
            </Card.Body>
          </Card>

          {/* Recent Achievements */}
          <Card className="profile-card mt-4">
            <Card.Header>
              <h6 className="mb-0">Recent Achievements</h6>
            </Card.Header>
            <Card.Body>
              <div className="achievements-list">
                {recentAchievements.map(achievement => (
                  <div key={achievement.id} className="achievement-item">
                    <div className="achievement-icon">
                      <CIcon icon={cilStar} className={`text-${achievement.type === 'performance' ? 'warning' : achievement.type === 'satisfaction' ? 'success' : 'info'}`} />
                    </div>
                    <div className="achievement-content">
                      <h6 className="achievement-title">{achievement.title}</h6>
                      <p className="achievement-description">{achievement.description}</p>
                      <small className="achievement-date">{achievement.date}</small>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <style jsx>{`
        .profile-page {
          padding: 2rem;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .profile-header {
          margin-bottom: 2rem;
        }

        .profile-header h2 {
          color: #212529;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .profile-header p {
          color: #6c757d;
          margin: 0;
        }

        .profile-card {
          border: none;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          background: white;
        }

        .profile-card .card-header {
          background: transparent;
          border-bottom: 1px solid #e9ecef;
          padding: 1.25rem;
        }

        .profile-avatar {
          position: relative;
          display: inline-block;
          margin-bottom: 1rem;
        }

        .avatar-image {
          border-radius: 50%;
          border: 4px solid #fff;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .verified-badge {
          position: absolute;
          bottom: 0;
          right: 0;
          font-size: 0.7rem;
          padding: 0.25rem 0.5rem;
        }

        .profile-name {
          color: #212529;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .profile-role {
          color: #6c757d;
          margin-bottom: 1rem;
        }

        .profile-rating {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.25rem;
          margin-bottom: 1.5rem;
        }

        .star-icon {
          color: #ffc107;
          font-size: 1.1rem;
        }

        .rating-text {
          font-weight: 600;
          color: #212529;
        }

        .rating-count {
          color: #6c757d;
          font-size: 0.875rem;
        }

        .profile-stats {
          display: flex;
          gap: 2rem;
          justify-content: center;
          margin-bottom: 1rem;
        }

        .stat-item {
          text-align: center;
        }

        .stat-value {
          display: block;
          font-weight: 700;
          font-size: 1.25rem;
          color: #212529;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #6c757d;
        }

        .completion-stats {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .completion-item {
          font-size: 0.875rem;
        }

        .profile-tabs :global(.nav-link) {
          border: none;
          color: #6c757d;
          font-weight: 500;
          padding: 0.75rem 1rem;
        }

        .profile-tabs :global(.nav-link.active) {
          color: #667eea;
          background: transparent;
          border-bottom: 2px solid #667eea;
        }

        .achievements-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .achievement-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .achievement-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(102, 126, 234, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .achievement-title {
          margin: 0 0 0.25rem;
          font-weight: 600;
          color: #212529;
        }

        .achievement-description {
          margin: 0 0 0.5rem;
          color: #6c757d;
          font-size: 0.875rem;
        }

        .achievement-date {
          color: #adb5bd;
          font-size: 0.8rem;
        }

        @media (max-width: 1200px) {
          .profile-page {
            padding: 1.5rem;
          }

          .profile-header h2 {
            font-size: 1.75rem;
          }

          .avatar-image {
            width: 100px;
            height: 100px;
          }

          .stat-value {
            font-size: 1.1rem;
          }
        }

        @media (max-width: 992px) {
          .profile-page {
            padding: 1rem;
          }

          .profile-header h2 {
            font-size: 1.5rem;
          }

          .avatar-image {
            width: 80px;
            height: 80px;
          }

          .profile-stats {
            gap: 1.5rem;
          }

          .stat-value {
            font-size: 1rem;
          }

          .profile-tabs :global(.nav-link) {
            padding: 0.5rem 0.75rem;
            font-size: 0.875rem;
          }
        }

        @media (max-width: 768px) {
          .profile-page {
            padding: 0.75rem;
          }

          .profile-header h2 {
            font-size: 1.25rem;
          }

          .avatar-image {
            width: 70px;
            height: 70px;
          }

          .profile-stats {
            gap: 1rem;
            flex-direction: column;
            align-items: center;
          }

          .stat-value {
            font-size: 0.9rem;
          }

          .stat-label {
            font-size: 0.8rem;
          }

          .profile-card .card-header {
            padding: 1rem;
          }

          .profile-card .card-body {
            padding: 1rem;
          }

          .profile-tabs :global(.nav-link) {
            padding: 0.5rem;
            font-size: 0.8rem;
          }

          .achievement-item {
            flex-direction: column;
            text-align: center;
            gap: 0.75rem;
          }

          .achievement-icon {
            align-self: center;
          }

          .completion-stats {
            gap: 0.75rem;
          }
        }

        @media (max-width: 576px) {
          .profile-page {
            padding: 0.5rem;
          }

          .profile-header h2 {
            font-size: 1.1rem;
          }

          .profile-header p {
            font-size: 0.9rem;
          }

          .avatar-image {
            width: 60px;
            height: 60px;
          }

          .profile-name {
            font-size: 1rem;
          }

          .profile-role {
            font-size: 0.875rem;
          }

          .stat-value {
            font-size: 0.85rem;
          }

          .stat-label {
            font-size: 0.75rem;
          }

          .profile-card .card-header {
            padding: 0.75rem;
          }

          .profile-card .card-body {
            padding: 0.75rem;
          }

          .profile-tabs :global(.nav-link) {
            padding: 0.4rem 0.5rem;
            font-size: 0.75rem;
          }

          .achievement-item {
            padding: 0.75rem;
          }

          .achievement-title {
            font-size: 0.9rem;
          }

          .achievement-description {
            font-size: 0.8rem;
          }

          .achievement-date {
            font-size: 0.75rem;
          }

          .completion-stats {
            gap: 0.5rem;
          }

          .completion-item {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
}