import { FaUser } from "react-icons/fa";
import { useAuth } from "../../context/authContext";

const Summary = () => {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <div className="flex items-center bg-white rounded-md shadow-md overflow-hidden">
        {/* Icon */}
        <div className="flex justify-center items-center bg-teal-600 text-white px-6 py-4 text-3xl">
          <FaUser />
        </div>

        {/* Text */}
        <div className="pl-4 py-2">
          <p className="text-lg font-semibold text-gray-600">Welcome Back</p>
          <p className="text-xl font-bold text-gray-800">{user?.name}</p>
          {user?.role && (
            <p className="text-sm text-gray-500 mt-1">Role: {user.role}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Summary;
