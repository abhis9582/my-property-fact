"use client";
import { useEffect, useState } from "react";
import { Card, Row, Col, Button, ProgressBar, Badge, Spinner, Alert } from "react-bootstrap";
import {
  cilHome,
  cilUser,
  cilChart,
  cilBell,
  cilCalendar,
  cilPlus,
  cilSettings,
  cilViewModule,
  cilPencil,
  cilPhone,
  cilLocationPin,
  cilStar,
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "../_contexts/UserContext";
import { setDemoUserData } from "../_utils/setUserData";
import axios from "axios";
import Cookies from "js-cookie";

export default function ModernDashboard() {
  const { userData, loading: userLoading } = useUser();
  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    pendingListings: 0,
    soldListings: 0,
    totalViews: 0,
    inquiries: 0,
    conversions: 0,
    revenue: 0,
  });
  const [properties, setProperties] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [topProperties, setTopProperties] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Format time ago
  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  // Fetch user properties
  const fetchProperties = async () => {
    try {
      const token = Cookies.get("token") || Cookies.get("authToken");
      if (!token) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}api/user/properties`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success && response.data.data) {
        const propertiesData = response.data.data;
        setProperties(propertiesData);

        // Calculate statistics
        const totalListings = propertiesData.length;
        const activeListings = propertiesData.filter(
          (p) => p.approvalStatus === "APPROVED"
        ).length;
        const pendingListings = propertiesData.filter(
          (p) => p.approvalStatus === "PENDING"
        ).length;
        const draftListings = propertiesData.filter(
          (p) => p.approvalStatus === "DRAFT"
        ).length;
        const rejectedListings = propertiesData.filter(
          (p) => p.approvalStatus === "REJECTED"
        ).length;

        // Calculate revenue (sum of all property prices - simplified)
        const revenue = propertiesData.reduce((sum, p) => {
          if (p.projectPrice) {
            const priceStr = p.projectPrice.replace(/[^0-9.]/g, "");
            const price = parseFloat(priceStr) || 0;
            return sum + price;
          }
          return sum;
        }, 0);

        setStats({
          totalListings,
          activeListings,
          pendingListings,
          soldListings: 0, // This would need to come from a separate field
          totalViews: 0, // This would need to come from analytics
          inquiries: 0, // This would need to come from enquiries
          conversions: 0, // This would need to come from analytics
          revenue: revenue,
        });

        // Generate recent activities from properties
        const activities = propertiesData
          .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
          .slice(0, 4)
          .map((property, index) => {
            let message = "";
            let icon = cilHome;
            let color = "info";

            if (property.approvalStatus === "APPROVED") {
              message = `Property approved: ${property.projectName || "Untitled Property"}`;
              icon = cilStar;
              color = "success";
            } else if (property.approvalStatus === "PENDING") {
              message = `Property submitted for approval: ${property.projectName || "Untitled Property"}`;
              icon = cilCalendar;
              color = "warning";
            } else if (property.approvalStatus === "DRAFT") {
              message = `Draft saved: ${property.projectName || "Untitled Property"}`;
              icon = cilPencil;
              color = "secondary";
            } else {
              message = `Property updated: ${property.projectName || "Untitled Property"}`;
              icon = cilHome;
              color = "info";
            }

            return {
              id: property.id || index,
              type: property.approvalStatus?.toLowerCase() || "update",
              message,
              time: formatTimeAgo(property.updatedAt || property.createdAt),
              icon,
              color,
            };
          });
        setRecentActivities(activities);

        // Get top properties (approved properties, sorted by most recent)
        const topProps = propertiesData
          .filter((p) => p.approvalStatus === "APPROVED")
          .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
          .slice(0, 3)
          .map((property) => ({
            id: property.id,
            title: property.projectName || "Untitled Property",
            location: property.projectLocality || "Location not specified",
            price: property.projectPrice || "Price not available",
            views: 0, // Would need analytics data
            inquiries: 0, // Would need enquiry data
            status: "active",
            image: property.projectThumbnail || property.projectLogo || "/static/generic-floorplan.jpg",
          }));
        setTopProperties(topProps);

        // Generate tasks from pending properties
        const tasks = propertiesData
          .filter((p) => p.approvalStatus === "PENDING" || p.approvalStatus === "REQUIRES_CHANGES")
          .slice(0, 3)
          .map((property, index) => {
            const taskType = property.approvalStatus === "PENDING" ? "Review" : "Update";
            const priority = property.approvalStatus === "REQUIRES_CHANGES" ? "high" : "medium";
            
            return {
              id: property.id || index,
              title: `${taskType} property: ${property.projectName || "Untitled"}`,
              type: taskType,
              time: new Date(property.updatedAt || property.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              priority,
            };
          });
        setUpcomingTasks(tasks.length > 0 ? tasks : []);
      }
    } catch (err) {
      console.error("Error fetching properties:", err);
      setError("Failed to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      const token = Cookies.get("token") || Cookies.get("authToken");
      if (!token) {
        // If no token, use userData from context as fallback
        if (userData) {
          setUserProfile(userData);
        }
        return;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}users/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        setUserProfile(response.data);
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
      // Fallback to userData from context if API fails
      if (userData) {
        setUserProfile(userData);
      }
    }
  };

  useEffect(() => {
    if (!userLoading) {
      fetchProperties();
      fetchUserProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLoading]);

  const handleSetDemoData = () => {
    setDemoUserData();
    // Reload the page to refresh user data
    window.location.reload();
  };

  const StatCard = ({ title, value, icon, color, change, changeType }) => (
    <Card className="stat-card h-100">
      <Card.Body className="d-flex align-items-center">
        <div className="stat-icon-wrapper">
          <CIcon icon={icon} className={`stat-icon text-${color}`} />
        </div>
        <div className="stat-content">
          <h6 className="stat-title">{title}</h6>
          <h3 className="stat-value">{value}</h3>
          {change && (
            <small className={`stat-change text-${changeType}`}>
              {changeType === "success" ? "↗" : changeType === "warning" ? "⚠" : "↘"} {change}
            </small>
          )}
        </div>
      </Card.Body>
    </Card>
  );

  const ActivityItem = ({ activity }) => (
    <div className="activity-item">
      <div className="activity-icon">
        <CIcon icon={activity.icon} className={`text-${activity.color}`} />
      </div>
      <div className="activity-content">
        <p className="activity-message">{activity.message}</p>
        <small className="activity-time">{activity.time}</small>
      </div>
    </div>
  );

  const PropertyCard = ({ property }) => (
    <Card className="property-card h-100">
      <div className="property-image-container">
        <Image
          src={property.image}
          alt={property.title}
          width={300}
          height={200}
          className="property-image img-fluid"
        />
        <Badge
          bg={
            property.status === "active"
              ? "success"
              : property.status === "sold"
              ? "warning"
              : "secondary"
          }
          className="property-status"
        >
          {property.status}
        </Badge>
      </div>
      <Card.Body>
        <h6 className="property-title">{property.title}</h6>
        <p className="property-location">
          <CIcon icon={cilLocationPin} className="me-1" />
          {property.location}
        </p>
        <div className="property-price">{property.price}</div>
        <div className="property-stats">
          <div className="stat-item">
            <CIcon icon={cilViewModule} className="me-1" />
            {property.views} views
          </div>
          <div className="stat-item">
            <CIcon icon={cilPhone} className="me-1" />
            {property.inquiries} inquiries
          </div>
        </div>
        <div className="property-actions mt-3">
          <Link href={`/portal/dashboard/listings/${property.id}`}>
            <Button variant="outline-primary" size="sm" className="me-2">
              <CIcon icon={cilViewModule} className="me-1" />
              View
            </Button>
          </Link>
          <Link href={`/portal/dashboard/listings/${property.id}?edit=true`}>
            <Button variant="outline-secondary" size="sm">
              <CIcon icon={cilPencil} className="me-1" />
              Edit
            </Button>
          </Link>
        </div>
      </Card.Body>
    </Card>
  );

  const TaskItem = ({ task }) => (
    <div className="task-item">
      <div className="task-content">
        <h6 className="task-title">{task.title}</h6>
        <small className="task-type">{task.type}</small>
      </div>
      <div className="task-meta">
        <Badge
          bg={
            task.priority === "high"
              ? "danger"
              : task.priority === "medium"
              ? "warning"
              : "info"
          }
        >
          {task.priority}
        </Badge>
        <small className="task-time">{task.time}</small>
      </div>
    </div>
  );

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    if (!userProfile) return 0;
    let completed = 0;
    let total = 7;

    if (userProfile.fullName) completed++;
    if (userProfile.email) completed++;
    if (userProfile.phone) completed++;
    if (userProfile.location) completed++;
    if (userProfile.bio) completed++;
    if (userProfile.avatar) completed++;
    if (userProfile.experience) completed++;

    return Math.round((completed / total) * 100);
  };

  // Calculate response rate (mock for now)
  const calculateResponseRate = () => {
    // This would need to come from enquiry/communication data
    return 92;
  };

  // Calculate listing quality (based on approved vs total)
  const calculateListingQuality = () => {
    if (stats.totalListings === 0) return 0;
    return Math.round((stats.activeListings / stats.totalListings) * 100);
  };

  if (loading || userLoading) {
    return (
      <div className="modern-dashboard d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="modern-dashboard p-4">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="modern-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <h2>Welcome back, {userProfile?.fullName || userData?.fullName || 'User'}</h2>
            <p>Here&apos;s what&apos;s happening with your properties today.</p>
          </div>
          <div className="header-actions">
            <Link href="/portal/dashboard/listings?action=add">
              <Button variant="primary" className="me-2">
                <CIcon icon={cilPlus} className="me-1" />
                Add Property
              </Button>
            </Link>
            <Button variant="outline-secondary" className="me-2">
              <CIcon icon={cilBell} className="me-1" />
              Notifications
            </Button>
            {!userData && (
              <Button variant="outline-info" onClick={handleSetDemoData}>
                <CIcon icon={cilUser} className="me-1" />
                Set Demo User
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col lg={3} md={6}>
          <StatCard
            title="Total Listings"
            value={stats.totalListings}
            icon={cilHome}
            color="primary"
            change="+12%"
            changeType="success"
          />
        </Col>
        <Col lg={3} md={6}>
          <StatCard
            title="Active Listings"
            value={stats.activeListings}
            icon={cilChart}
            color="success"
            change="+8%"
            changeType="success"
          />
        </Col>
        <Col lg={3} md={6}>
          <StatCard
            title="Pending Listings"
            value={stats.pendingListings}
            icon={cilViewModule}
            color="info"
            change={stats.pendingListings > 0 ? `${stats.pendingListings} pending` : null}
            changeType="warning"
          />
        </Col>
        <Col lg={3} md={6}>
          <StatCard
            title="Total Properties"
            value={stats.totalListings}
            icon={cilStar}
            color="warning"
            change={stats.totalListings > 0 ? `${stats.activeListings} active` : null}
            changeType="success"
          />
        </Col>
      </Row>

      {/* Main Content */}
      <Row className="g-4">
        {/* Left Column */}
        <Col lg={8}>
          {/* Recent Activities */}
          <Card className="dashboard-card">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Activities</h5>
              <Link href="/portal/dashboard/activities">
                <Button variant="link" size="sm">
                  View All
                </Button>
              </Link>
            </Card.Header>
            <Card.Body>
              {recentActivities.length > 0 ? (
                <div className="activities-list">
                  {recentActivities.map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center py-4">No recent activities</p>
              )}
            </Card.Body>
          </Card>

          {/* Top Properties */}
          <Card className="dashboard-card mt-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Top Performing Properties</h5>
              <Link href="/portal/dashboard/listings">
                <Button variant="link" size="sm">
                  Manage All
                </Button>
              </Link>
            </Card.Header>
            <Card.Body>
              {topProperties.length > 0 ? (
                <Row className="g-3">
                  {topProperties.map((property) => (
                    <Col md={4} key={property.id}>
                      <PropertyCard property={property} />
                    </Col>
                  ))}
                </Row>
              ) : (
                <p className="text-muted text-center py-4">No approved properties yet</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Right Column */}
        <Col lg={4}>
          {/* Quick Stats */}
          <Card className="dashboard-card">
            <Card.Header>
              <h5 className="mb-0">Account Overview</h5>
            </Card.Header>
            <Card.Body>
              <div className="quick-stats">
                <div className="stat-row">
                  <span>Profile Completion</span>
                  <div className="d-flex align-items-center">
                    <ProgressBar
                      now={calculateProfileCompletion()}
                      variant="success"
                      className="flex-grow-1 me-2"
                      style={{ height: "6px" }}
                    />
                    <span className="stat-percentage">{calculateProfileCompletion()}%</span>
                  </div>
                </div>
                <div className="stat-row">
                  <span>Response Rate</span>
                  <div className="d-flex align-items-center">
                    <ProgressBar
                      now={calculateResponseRate()}
                      variant="info"
                      className="flex-grow-1 me-2"
                      style={{ height: "6px" }}
                    />
                    <span className="stat-percentage">{calculateResponseRate()}%</span>
                  </div>
                </div>
                <div className="stat-row">
                  <span>Listing Quality</span>
                  <div className="d-flex align-items-center">
                    <ProgressBar
                      now={calculateListingQuality()}
                      variant="warning"
                      className="flex-grow-1 me-2"
                      style={{ height: "6px" }}
                    />
                    <span className="stat-percentage">{calculateListingQuality()}%</span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Upcoming Tasks */}
          <Card className="dashboard-card mt-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Today&apos;s Tasks</h5>
              <Link href="/portal/dashboard/tasks">
                <Button variant="link" size="sm">
                  View All
                </Button>
              </Link>
            </Card.Header>
            <Card.Body>
              {upcomingTasks.length > 0 ? (
                <div className="tasks-list">
                  {upcomingTasks.map((task) => (
                    <TaskItem key={task.id} task={task} />
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center py-4">No pending tasks</p>
              )}
            </Card.Body>
          </Card>

          {/* Quick Actions */}
          <Card className="dashboard-card mt-4">
            <Card.Header>
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <div className="quick-actions">
                <Link href="/portal/dashboard/listings?action=add">
                  <Button variant="primary" className="w-100 mb-2">
                    <CIcon icon={cilPlus} className="me-1" />
                    Add New Property
                  </Button>
                </Link>
                <Link href="/portal/dashboard/leads">
                  <Button variant="outline-primary" className="w-100 mb-2">
                    <CIcon icon={cilUser} className="me-1" />
                    View Leads
                  </Button>
                </Link>
                <Link href="/portal/dashboard/analytics">
                  <Button variant="outline-success" className="w-100 mb-2">
                    <CIcon icon={cilChart} className="me-1" />
                    View Analytics
                  </Button>
                </Link>
                <Link href="/portal/dashboard/profile">
                  <Button variant="outline-secondary" className="w-100">
                    <CIcon icon={cilSettings} className="me-1" />
                    Update Profile
                  </Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <style jsx>{`
        .modern-dashboard {
          padding: 2rem;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .dashboard-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .header-title h2 {
          margin: 0;
          font-weight: 700;
          font-size: 2rem;
        }

        .header-title p {
          margin: 0.5rem 0 0;
          opacity: 0.9;
          font-size: 1.1rem;
        }

        .header-actions {
          display: flex;
          gap: 0.5rem;
        }

        .stat-card {
          border: none;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          background: white;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
        }

        .stat-icon-wrapper {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          background: rgba(102, 126, 234, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1rem;
        }

        .stat-icon {
          font-size: 1.5rem;
        }

        .stat-title {
          color: #6c757d;
          font-size: 0.875rem;
          font-weight: 500;
          margin: 0;
        }

        .stat-value {
          color: #212529;
          font-weight: 700;
          font-size: 1.75rem;
          margin: 0.25rem 0;
        }

        .stat-change {
          font-size: 0.75rem;
          font-weight: 600;
        }

        .dashboard-card {
          border: none;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          background: white;
        }

        .dashboard-card .card-header {
          background: transparent;
          border-bottom: 1px solid #e9ecef;
          padding: 1.25rem;
        }

        .activity-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem 0;
          border-bottom: 1px solid #f1f3f4;
        }

        .activity-item:last-child {
          border-bottom: none;
        }

        .activity-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(102, 126, 234, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .activity-message {
          margin: 0 0 0.25rem;
          font-size: 0.9rem;
          color: #495057;
        }

        .activity-time {
          color: #6c757d;
          font-size: 0.8rem;
        }

        .property-card {
          border: none;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
        }

        .property-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
        }

        .property-image-container {
          position: relative;
          height: 150px;
          overflow: hidden;
        }

        .property-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .property-status {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
        }

        .property-title {
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #212529;
        }

        .property-location {
          color: #6c757d;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }

        .property-price {
          font-weight: 700;
          color: #28a745;
          font-size: 1.1rem;
          margin-bottom: 1rem;
        }

        .property-stats {
          display: flex;
          gap: 1rem;
          font-size: 0.8rem;
          color: #6c757d;
        }

        .property-actions {
          display: flex;
          gap: 0.5rem;
        }

        .quick-stats .stat-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          font-size: 0.875rem;
        }

        .stat-percentage {
          font-weight: 600;
          color: #495057;
          min-width: 35px;
          text-align: right;
        }

        .task-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid #f1f3f4;
        }

        .task-item:last-child {
          border-bottom: none;
        }

        .task-title {
          margin: 0 0 0.25rem;
          font-size: 0.9rem;
          color: #495057;
        }

        .task-type {
          color: #6c757d;
          font-size: 0.8rem;
        }

        .task-meta {
          text-align: right;
        }

        .task-time {
          display: block;
          color: #6c757d;
          font-size: 0.8rem;
          margin-top: 0.25rem;
        }

        .quick-actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        @media (max-width: 1200px) {
          .modern-dashboard {
            padding: 1.5rem;
          }

          .header-title h2 {
            font-size: 1.75rem;
          }

          .stat-value {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 992px) {
          .modern-dashboard {
            padding: 1rem;
          }

          .header-content {
            flex-direction: column;
            align-items: flex-start;
            gap: 1.5rem;
          }

          .header-actions {
            width: 100%;
            justify-content: stretch;
          }

          .header-actions .btn {
            flex: 1;
          }

          .header-title h2 {
            font-size: 1.5rem;
          }

          .stat-value {
            font-size: 1.25rem;
          }

          .stat-icon-wrapper {
            width: 50px;
            height: 50px;
            margin-right: 0.75rem;
          }

          .stat-icon {
            font-size: 1.25rem;
          }

          .property-stats {
            gap: 0.5rem;
            flex-direction: column;
            align-items: flex-start;
          }

          .property-actions {
            flex-direction: column;
            gap: 0.5rem;
          }

          .property-actions .btn {
            width: 100%;
          }
        }

        @media (max-width: 768px) {
          .modern-dashboard {
            padding: 0.75rem;
          }

          .header-title h2 {
            font-size: 1.25rem;
          }

          .header-title p {
            font-size: 1rem;
          }

          .stat-card {
            margin-bottom: 1rem;
          }

          .stat-value {
            font-size: 1.1rem;
          }

          .stat-title {
            font-size: 0.8rem;
          }

          .dashboard-card .card-header {
            padding: 1rem;
          }

          .dashboard-card .card-body {
            padding: 1rem;
          }

          .activity-item {
            padding: 0.75rem 0;
          }

          .activity-icon {
            width: 35px;
            height: 35px;
          }

          .property-image-container {
            height: 120px;
          }

          .quick-stats .stat-row {
            margin-bottom: 0.75rem;
          }

          .task-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .task-meta {
            text-align: left;
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
          }
        }

        @media (max-width: 576px) {
          .modern-dashboard {
            padding: 0.5rem;
          }

          .header-title h2 {
            font-size: 1.1rem;
          }

          .header-title p {
            font-size: 0.9rem;
          }

          .stat-value {
            font-size: 1rem;
          }

          .stat-title {
            font-size: 0.75rem;
          }

          .activity-item {
            padding: 0.5rem 0;
            gap: 0.75rem;
          }

          .activity-icon {
            width: 30px;
            height: 30px;
          }

          .activity-message {
            font-size: 0.85rem;
          }

          .activity-time {
            font-size: 0.75rem;
          }

          .property-title {
            font-size: 0.9rem;
          }

          .property-location {
            font-size: 0.8rem;
          }

          .property-price {
            font-size: 1rem;
          }

          .dashboard-card .card-header {
            padding: 0.75rem;
          }

          .dashboard-card .card-body {
            padding: 0.75rem;
          }

          .quick-actions .btn {
            font-size: 0.875rem;
            padding: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}
