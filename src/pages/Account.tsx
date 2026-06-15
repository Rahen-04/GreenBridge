import React from "react";
import LoginForm from "@/components/auth/LoginForm";
import FarmerProfile from "./profile/FarmerProfile";
import ConsumerProfile from "./profile/ConsumerProfile";
import { useUser } from "@/contexts/UserContext";

export default function Account() {
  const { isLoggedIn, userType, logout, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {!isLoggedIn ? (
        <div className="flex items-center justify-center">
          <LoginForm />
        </div>
      ) : userType === "farmer" ? (
        <FarmerProfile onLogout={logout} />
      ) : (
        <ConsumerProfile onLogout={logout} />
      )}
    </div>
  );
}
