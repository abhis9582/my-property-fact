"use client";
import { useEffect, useState } from "react";
import { Card, Row, Col, Button, ProgressBar, Badge } from "react-bootstrap";
import {
  cilHome,
  cilUser,
  cilChart,
  cilBell,
  cilCalendar,
  cilPlus,
  cilSettings,
  cilView,
  cilPencil,
  cilPhone,
  cilLocationPin,
  cilStar,
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";

export default function ModernDashboard() {
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    totalListings: 24,
    activeListings: 18,
    pendingListings: 4,
    soldListings: 2,
    totalViews: 1250,
    inquiries: 45,
    conversions: 12,
    revenue: 125000,
  });

  useEffect(() => {
    const cookieData = Cookies.get("userData");
    
    if (cookieData) {
      const parsedData = JSON.parse(cookieData);
      setUserData(parsedData);
    }
  }, []);

  const [recentActivities] = useState([
    {
      id: 1,
      type: "inquiry",
      message: "New inquiry for 3BHK Apartment in Sector 45",
      time: "2 hours ago",
      icon: cilPhone,
      color: "primary",
    },
    {
      id: 2,
      type: "viewing",
      message: "Site visit scheduled for Tomorrow at 10 AM",
      time: "4 hours ago",
      icon: cilCalendar,
      color: "success",
    },
    {
      id: 3,
      type: "listing",
      message: "New property listed: Villa in Golf Course Road",
      time: "1 day ago",
      icon: cilHome,
      color: "info",
    },
    {
      id: 4,
      type: "sale",
      message: "Property sold: 2BHK in DLF Phase 2",
      time: "2 days ago",
      icon: cilStar,
      color: "warning",
    },
  ]);

  const [topProperties] = useState([
    {
      id: 1,
      title: "Luxury 3BHK Apartment",
      location: "Sector 45, Gurgaon",
      price: "₹1.2 Cr",
      views: 245,
      inquiries: 12,
      status: "active",
      image: "/static/generic-floorplan.jpg",
    },
    {
      id: 2,
      title: "Modern Villa with Garden",
      location: "Golf Course Road",
      price: "₹2.5 Cr",
      views: 189,
      inquiries: 8,
      status: "active",
      image: "/static/generic-floorplan.jpg",
    },
    {
      id: 3,
      title: "2BHK Ready to Move",
      location: "DLF Phase 2",
      price: "₹85 L",
      views: 156,
      inquiries: 15,
      status: "sold",
      image: "/static/generic-floorplan.jpg",
    },
  ]);

  const [upcomingTasks] = useState([
    {
      id: 1,
      title: "Follow up with Mr. Sharma",
      type: "Call",
      time: "10:30 AM",
      priority: "high",
    },
    {
      id: 2,
      title: "Site visit at Sector 45",
      type: "Meeting",
      time: "2:00 PM",
      priority: "medium",
    },
    {
      id: 3,
      title: "Update property photos",
      type: "Task",
      time: "4:00 PM",
      priority: "low",
    },
  ]);

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
              {changeType === "success" ? "↗" : "↘"} {change}
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
            <CIcon icon={cilView} className="me-1" />
            {property.views} views
          </div>
          <div className="stat-item">
            <CIcon icon={cilPhone} className="me-1" />
            {property.inquiries} inquiries
          </div>
        </div>
        <div className="property-actions mt-3">
          <Button variant="outline-primary" size="sm" className="me-2">
            <CIcon icon={cilView} className="me-1" />
            View
          </Button>
          <Button variant="outline-secondary" size="sm">
            <CIcon icon={cilPencil} className="me-1" />
            Edit
          </Button>
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

  return (
    <div className="modern-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <h2>Welcome back, {userData != null ? userData.fullName : ''}</h2>
            <p>Here's what's happening with your properties today.</p>
          </div>
          <div className="header-actions">
            <Link href="/portal/dashboard/listings?action=add">
              <Button variant="primary" className="me-2">
                <CIcon icon={cilPlus} className="me-1" />
                Add Property
              </Button>
            </Link>
            <Button variant="outline-secondary">
              <CIcon icon={cilBell} className="me-1" />
              Notifications
            </Button>
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
            title="Total Views"
            value={stats.totalViews.toLocaleString()}
            icon={cilView}
            color="info"
            change="+25%"
            changeType="success"
          />
        </Col>
        <Col lg={3} md={6}>
          <StatCard
            title="Revenue"
            value={`₹${(stats.revenue / 100000).toFixed(1)}L`}
            icon={cilStar}
            color="warning"
            change="+15%"
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
              <div className="activities-list">
                {recentActivities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
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
              <Row className="g-3">
                {topProperties.map((property) => (
                  <Col md={4} key={property.id}>
                    <PropertyCard property={property} />
                  </Col>
                ))}
              </Row>
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
                      now={85}
                      variant="success"
                      className="flex-grow-1 me-2"
                      style={{ height: "6px" }}
                    />
                    <span className="stat-percentage">85%</span>
                  </div>
                </div>
                <div className="stat-row">
                  <span>Response Rate</span>
                  <div className="d-flex align-items-center">
                    <ProgressBar
                      now={92}
                      variant="info"
                      className="flex-grow-1 me-2"
                      style={{ height: "6px" }}
                    />
                    <span className="stat-percentage">92%</span>
                  </div>
                </div>
                <div className="stat-row">
                  <span>Listing Quality</span>
                  <div className="d-flex align-items-center">
                    <ProgressBar
                      now={78}
                      variant="warning"
                      className="flex-grow-1 me-2"
                      style={{ height: "6px" }}
                    />
                    <span className="stat-percentage">78%</span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Upcoming Tasks */}
          <Card className="dashboard-card mt-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Today's Tasks</h5>
              <Link href="/portal/dashboard/tasks">
                <Button variant="link" size="sm">
                  View All
                </Button>
              </Link>
            </Card.Header>
            <Card.Body>
              <div className="tasks-list">
                {upcomingTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
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
