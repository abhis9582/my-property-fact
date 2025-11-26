import axios from "axios";
import ManageUsers from "./manageUsers";

export const dynamic = 'force-dynamic';

// Fetching all users
const fetchAllUsers = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}users`
    );
    return response.data || [];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export default async function ManageUsersPage() {
  const users = await fetchAllUsers();
  
  return <ManageUsers users={users} />;
}

