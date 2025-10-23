"use client";
import { useState } from "react";
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Badge, 
  Form,
  InputGroup,
  ListGroup,
  Modal,
  Alert,
  Dropdown,
  ToggleButton,
  ToggleButtonGroup
} from "react-bootstrap";
import { 
  cilBell, 
  cilSettings, 
  cilCheck, 
  cilX,
  cilTrash,
  cilEye,
  cilStar,
  cilMail,
  cilPhone,
  cilCalendar,
  cilWarning,
  cilInfo,
  cilCheckCircle,
  cilFilter,
  cilSearch
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "email",
      title: "New Property Inquiry",
      message: "You have a new inquiry for 3BHK Villa in Gurgaon from Rajesh Kumar",
      timestamp: "2024-01-20T10:30:00",
      isRead: false,
      priority: "high",
      category: "leads",
      actionUrl: "/portal/dashboard/leads"
    },
    {
      id: 2,
      type: "system",
      title: "Site Visit Scheduled",
      message: "Site visit scheduled for 2BHK Apartment in Delhi with Priya Sharma",
      timestamp: "2024-01-20T09:15:00",
      isRead: true,
      priority: "medium",
      category: "calendar",
      actionUrl: "/portal/dashboard/calendar"
    },
    {
      id: 3,
      type: "payment",
      title: "Payment Received",
      message: "Payment of ₹50,000 received for Property ID: PROP-001",
      timestamp: "2024-01-19T16:45:00",
      isRead: false,
      priority: "high",
      category: "billing",
      actionUrl: "/portal/dashboard/billing"
    },
    {
      id: 4,
      type: "system",
      title: "Document Upload Required",
      message: "Please upload RERA documents for property verification",
      timestamp: "2024-01-19T14:20:00",
      isRead: true,
      priority: "medium",
      category: "compliance",
      actionUrl: "/portal/dashboard/compliance"
    },
    {
      id: 5,
      type: "alert",
      title: "Low Inventory Alert",
      message: "You have only 2 active listings remaining in your plan",
      timestamp: "2024-01-19T12:00:00",
      isRead: false,
      priority: "low",
      category: "system",
      actionUrl: "/portal/dashboard/billing/plan"
    }
  ]);

  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const notificationSettings = {
    email: {
      leads: true,
      calendar: true,
      billing: true,
      compliance: false,
      system: true
    },
    sms: {
      leads: false,
      calendar: true,
      billing: false,
      compliance: false,
      system: false
    },
    push: {
      leads: true,
      calendar: true,
      billing: true,
      compliance: true,
      system: true
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      "email": cilMail,
      "system": cilBell,
      "payment": cilCheckCircle,
      "alert": cilWarning,
      "info": cilInfo
    };
    return icons[type] || cilBell;
  };

  const getNotificationColor = (type, priority) => {
    if (priority === "high") return "danger";
    if (priority === "medium") return "warning";
    if (priority === "low") return "info";
    
    const colors = {
      "email": "primary",
      "system": "secondary",
      "payment": "success",
      "alert": "warning",
      "info": "info"
    };
    return colors[type] || "secondary";
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      "high": "danger",
      "medium": "warning",
      "low": "info"
    };
    return variants[priority] || "secondary";
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === "all" || 
                         (filter === "unread" && !notification.isRead) ||
                         (filter === "read" && notification.isRead) ||
                         notification.category === filter ||
                         notification.type === filter;
    
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const highPriorityCount = notifications.filter(n => n.priority === "high" && !n.isRead).length;

  const handleMarkAsRead = (id) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })));
  };

  const handleDeleteNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const handleViewNotification = (notification) => {
    setSelectedNotification(notification);
    setShowNotificationModal(true);
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
  };

  const handleNotificationAction = (notification) => {
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  return (
    <div className="notifications-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-title">
            <h2>Notifications</h2>
            <p>Stay updated with your property activities and system alerts</p>
          </div>
          <div className="header-actions">
            <Button 
              variant="outline-light" 
              className="me-2"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              <CIcon icon={cilCheck} className="me-1" />
              Mark All Read
            </Button>
            <Button variant="light" onClick={() => setShowSettings(true)}>
              <CIcon icon={cilSettings} className="me-1" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col lg={3} md={6}>
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-content">
                <div className="stat-icon">
                  <CIcon icon={cilBell} />
                </div>
                <div className="stat-info">
                  <h6 className="stat-title">Total Notifications</h6>
                  <h3 className="stat-value">{notifications.length}</h3>
                  <small className="stat-change text-info">+5 today</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6}>
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-content">
                <div className="stat-icon unread">
                  <CIcon icon={cilEye} />
                </div>
                <div className="stat-info">
                  <h6 className="stat-title">Unread</h6>
                  <h3 className="stat-value">{unreadCount}</h3>
                  <small className="stat-change text-warning">Needs attention</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6}>
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-content">
                <div className="stat-icon high-priority">
                  <CIcon icon={cilWarning} />
                </div>
                <div className="stat-info">
                  <h6 className="stat-title">High Priority</h6>
                  <h3 className="stat-value">{highPriorityCount}</h3>
                  <small className="stat-change text-danger">Urgent</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6}>
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-content">
                <div className="stat-icon">
                  <CIcon icon={cilCheck} />
                </div>
                <div className="stat-info">
                  <h6 className="stat-title">Read Rate</h6>
                  <h3 className="stat-value">{Math.round(((notifications.length - unreadCount) / notifications.length) * 100)}%</h3>
                  <small className="stat-change text-success">Good</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={4}>
              <InputGroup>
                <InputGroup.Text>
                  <CIcon icon={cilSearch} />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={4}>
              <ToggleButtonGroup
                type="radio"
                name="filter"
                value={filter}
                onChange={(value) => setFilter(value)}
                className="w-100"
              >
                <ToggleButton value="all" variant="outline-primary">
                  All
                </ToggleButton>
                <ToggleButton value="unread" variant="outline-warning">
                  Unread
                </ToggleButton>
                <ToggleButton value="leads" variant="outline-success">
                  Leads
                </ToggleButton>
                <ToggleButton value="system" variant="outline-secondary">
                  System
                </ToggleButton>
              </ToggleButtonGroup>
            </Col>
            <Col md={4}>
              <Button variant="outline-secondary" className="w-100">
                <CIcon icon={cilFilter} className="me-1" />
                More Filters
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Notifications List */}
      <Card className="notifications-card">
        <Card.Header>
          <h5 className="mb-0">
            Notifications ({filteredNotifications.length})
            {unreadCount > 0 && (
              <Badge bg="warning" className="ms-2">
                {unreadCount} unread
              </Badge>
            )}
          </h5>
        </Card.Header>
        <Card.Body className="p-0">
          <ListGroup variant="flush">
            {filteredNotifications.map(notification => (
              <ListGroup.Item 
                key={notification.id}
                className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
              >
                <div className="notification-content">
                  <div className="notification-icon">
                    <CIcon 
                      icon={getNotificationIcon(notification.type)} 
                      className={getNotificationColor(notification.type, notification.priority)}
                    />
                  </div>
                  
                  <div className="notification-details">
                    <div className="notification-header">
                      <h6 className="notification-title">{notification.title}</h6>
                      <div className="notification-meta">
                        {notification.priority === "high" && (
                          <Badge bg={getPriorityBadge(notification.priority)} className="me-2">
                            High
                          </Badge>
                        )}
                        <small className="text-muted">
                          {new Date(notification.timestamp).toLocaleString()}
                        </small>
                      </div>
                    </div>
                    
                    <p className="notification-message">{notification.message}</p>
                    
                    <div className="notification-actions">
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => handleViewNotification(notification)}
                      >
                        <CIcon icon={cilEye} className="me-1" />
                        View
                      </Button>
                      
                      {notification.actionUrl && (
                        <Button 
                          variant="outline-success" 
                          size="sm"
                          onClick={() => handleNotificationAction(notification)}
                        >
                          Take Action
                        </Button>
                      )}
                      
                      {!notification.isRead && (
                        <Button 
                          variant="outline-info" 
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <CIcon icon={cilCheck} className="me-1" />
                          Mark Read
                        </Button>
                      )}
                      
                      <Dropdown>
                        <Dropdown.Toggle variant="outline-secondary" size="sm">
                          <CIcon icon={cilSettings} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item>
                            <CIcon icon={cilStar} className="me-2" />
                            Star
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item 
                            className="text-danger"
                            onClick={() => handleDeleteNotification(notification.id)}
                          >
                            <CIcon icon={cilTrash} className="me-2" />
                            Delete
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
          
          {filteredNotifications.length === 0 && (
            <div className="empty-state">
              <CIcon icon={cilBell} size="3xl" className="text-muted mb-3" />
              <h6>No notifications found</h6>
              <p className="text-muted">No notifications match your current filters.</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Notification Detail Modal */}
      <Modal show={showNotificationModal} onHide={() => setShowNotificationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <CIcon 
              icon={getNotificationIcon(selectedNotification?.type)} 
              className={`me-2 ${getNotificationColor(selectedNotification?.type, selectedNotification?.priority)}`}
            />
            {selectedNotification?.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedNotification && (
            <div>
              <div className="notification-meta mb-3">
                <Badge bg={getPriorityBadge(selectedNotification.priority)} className="me-2">
                  {selectedNotification.priority} priority
                </Badge>
                <Badge bg="info" className="me-2">
                  {selectedNotification.category}
                </Badge>
                <small className="text-muted">
                  {new Date(selectedNotification.timestamp).toLocaleString()}
                </small>
              </div>
              
              <p className="notification-detail-message">
                {selectedNotification.message}
              </p>
              
              {selectedNotification.actionUrl && (
                <Alert variant="info">
                  <strong>Action Required:</strong> This notification has an associated action you can take.
                </Alert>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNotificationModal(false)}>
            Close
          </Button>
          {selectedNotification?.actionUrl && (
            <Button 
              variant="primary"
              onClick={() => handleNotificationAction(selectedNotification)}
            >
              Take Action
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Notification Settings Modal */}
      <Modal show={showSettings} onHide={() => setShowSettings(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Notification Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6>Notification Preferences</h6>
          <p className="text-muted">Choose how you want to receive notifications for different activities.</p>
          
          <div className="settings-sections">
            <div className="settings-section">
              <h6>Email Notifications</h6>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Check
                    type="checkbox"
                    label="New Leads"
                    defaultChecked={notificationSettings.email.leads}
                  />
                </Col>
                <Col md={6}>
                  <Form.Check
                    type="checkbox"
                    label="Calendar Events"
                    defaultChecked={notificationSettings.email.calendar}
                  />
                </Col>
                <Col md={6}>
                  <Form.Check
                    type="checkbox"
                    label="Billing Updates"
                    defaultChecked={notificationSettings.email.billing}
                  />
                </Col>
                <Col md={6}>
                  <Form.Check
                    type="checkbox"
                    label="Compliance Alerts"
                    defaultChecked={notificationSettings.email.compliance}
                  />
                </Col>
              </Row>
            </div>
            
            <hr />
            
            <div className="settings-section">
              <h6>SMS Notifications</h6>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Check
                    type="checkbox"
                    label="Calendar Events"
                    defaultChecked={notificationSettings.sms.calendar}
                  />
                </Col>
                <Col md={6}>
                  <Form.Check
                    type="checkbox"
                    label="System Alerts"
                    defaultChecked={notificationSettings.sms.system}
                  />
                </Col>
              </Row>
            </div>
            
            <hr />
            
            <div className="settings-section">
              <h6>Push Notifications</h6>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Check
                    type="checkbox"
                    label="All Categories"
                    defaultChecked={true}
                  />
                </Col>
              </Row>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSettings(false)}>
            Cancel
          </Button>
          <Button variant="primary">
            Save Settings
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .notifications-page {
          padding: 2rem;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .page-header {
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

        .stat-card {
          border: none;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          background: white;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
        }

        .stat-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: white;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .stat-icon.unread {
          background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
        }

        .stat-icon.high-priority {
          background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
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

        .notifications-card {
          border: none;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          background: white;
        }

        .notification-item {
          border: none;
          border-bottom: 1px solid #e9ecef;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }

        .notification-item:hover {
          background: #f8f9fa;
        }

        .notification-item.unread {
          background: #f0f2ff;
          border-left: 4px solid #667eea;
        }

        .notification-content {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .notification-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          background: #f8f9fa;
          flex-shrink: 0;
        }

        .notification-details {
          flex: 1;
        }

        .notification-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.5rem;
        }

        .notification-title {
          margin: 0;
          font-weight: 600;
          color: #495057;
        }

        .notification-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .notification-message {
          margin: 0 0 1rem;
          color: #6c757d;
          line-height: 1.5;
        }

        .notification-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .notification-actions .btn {
          font-size: 0.875rem;
        }

        .empty-state {
          text-align: center;
          padding: 3rem;
          color: #6c757d;
        }

        .notification-detail-message {
          font-size: 1.1rem;
          line-height: 1.6;
          color: #495057;
        }

        .settings-sections {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .settings-section h6 {
          margin-bottom: 1rem;
          color: #495057;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .notifications-page {
            padding: 1rem;
          }

          .header-content {
            flex-direction: column;
            align-items: flex-start;
          }

          .stat-content {
            flex-direction: column;
            text-align: center;
            gap: 0.5rem;
          }

          .notification-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .notification-actions {
            justify-content: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
