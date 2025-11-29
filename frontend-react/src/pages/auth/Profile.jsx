import React from "react";
import PrimaryButton from "../../components/PrimaryButton";
const Profile = () => {
  const handleEdit = () => {
    alert("Edit Profile clicked!");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      <div className="mb-4">
        <p><strong>Name:</strong> Paulo Jay Christian P. De Guzman</p>
        <p><strong>Email:</strong> paulo@example.com</p>
      </div>

      <PrimaryButton label="Edit Profile" onClick={handleEdit} />
    </div>
  );
};

export default Profile;
