import React from "react";
import { User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/src/context/AuthContext";

const UserIcon: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    <Link to="/account/profile" className="text-gray-500 hover:text-pink-500" title="Profile">
      <User className="h-5 w-5" />
    </Link>
  ) : (
    <Link to="/" className="text-gray-500">
      not authenticated
    </Link>
  );
};

export default UserIcon;
