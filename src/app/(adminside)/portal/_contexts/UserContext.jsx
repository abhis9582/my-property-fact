"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user data from cookies
    const loadUserData = () => {
      try {
        const cookieData = Cookies.get("userData");
        
        if (cookieData) {
          const parsedData = JSON.parse(cookieData);
          setUserData(parsedData);
        } else {
          // Set default user data if no cookie exists
          setUserData({
            fullName: "John Agent",
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
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        // Set default user data on error
        setUserData({
          fullName: "John Agent",
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
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const updateUserData = (newData) => {
    const updatedData = { ...userData, ...newData };
    setUserData(updatedData);
    
    // Save to cookies
    try {
      Cookies.set("userData", JSON.stringify(updatedData), { expires: 7 }); // 7 days
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const logout = () => {
    setUserData(null);
    Cookies.remove("userData");
  };

  const value = {
    userData,
    loading,
    updateUserData,
    logout
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

