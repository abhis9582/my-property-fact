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
import "./PortalCommonStyles.css";
import "./DashboardStyles.css";

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
        `${process.env.NEXT_PUBLIC_API_URL}api/user/property-listings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success && response.data.properties) {
        const propertiesData = response.data.properties;
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
          .map((property) => {
            // Get the first image from imageUrls array if available
            let imageUrl = "/static/generic-floorplan.jpg";
            
            if (property.imageUrls && property.imageUrls.length > 0) {
              // imageUrls contains relative paths like "property-listings/{id}/{filename}"
              // Construct full URL using the API endpoint
              const relativePath = property.imageUrls[0];
              // Replace backslashes with forward slashes for URL
              const normalizedPath = relativePath.replace(/\\/g, '/');
              // Construct full URL: API_URL + get/images/ + normalized path
              imageUrl = `${process.env.NEXT_PUBLIC_API_URL || ''}get/images/${normalizedPath}`;
            } else if (property.projectThumbnail) {
              // Fallback to projectThumbnail if available (for legacy data)
              const slugURL = property.slugURL || property.projectName?.toLowerCase().replace(/\s+/g, '-');
              imageUrl = `${process.env.NEXT_PUBLIC_IMAGE_URL || ''}properties/${slugURL}/${property.projectThumbnail}`;
            } else if (property.projectLogo) {
              // Fallback to projectLogo if available
              const slugURL = property.slugURL || property.projectName?.toLowerCase().replace(/\s+/g, '-');
              imageUrl = `${process.env.NEXT_PUBLIC_IMAGE_URL || ''}properties/${slugURL}/${property.projectLogo}`;
            }
            
            return {
              id: property.id,
              title: property.projectName || property.title || "Untitled Property",
              location: property.projectLocality || property.locality || property.address || "Location not specified",
              price: property.projectPrice || (property.totalPrice ? `₹${property.totalPrice.toLocaleString()}` : "Price not available"),
              views: 0, // Would need analytics data
              inquiries: 0, // Would need enquiry data
              status: "active",
              image: imageUrl,
            };
          });
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
          fill
          className="property-image"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
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
            {/* <Button variant="outline-secondary" className="me-2">
              <CIcon icon={cilBell} className="me-1" />
              Notifications
            </Button> */}
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
              {/* <Link href="/portal/dashboard/activities">
                <Button variant="link" size="sm">
                  View All
                </Button>
              </Link> */}
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
          {/* <Card className="dashboard-card">
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
          </Card> */}

          {/* Upcoming Tasks */}
          {/* <Card className="dashboard-card mt-4">
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
          </Card> */}

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
                {/* <Link href="/portal/dashboard/analytics">
                  <Button variant="outline-success" className="w-100 mb-2">
                    <CIcon icon={cilChart} className="me-1" />
                    View Analytics
                  </Button>
                </Link> */}
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
    </div>
  );
}
