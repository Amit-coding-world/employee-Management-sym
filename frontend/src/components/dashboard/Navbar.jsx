// Navbar.jsx
import {useAuth} from "../../context/authContext";
import {FaSignOutAlt} from "react-icons/fa";

const Navbar = () => {
    const {user, logout} = useAuth();

    return (
        <div>
            <nav className="w-full bg-teal-600 text-white px-4 py-2 shadow">
                <div className="flex justify-between items-center">
                    {/* Left side */}
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold">
                        Employee MS
                    </h1>

                    {/* Right side: optional greeting + logout */}
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                            {
                            user ?. profileImage ? (
                                <img src={
                                        user.profileImage.startsWith('http') ? user.profileImage : `https://employee-management-system-sbvn.onrender.com/${
                                            user.profileImage
                                        }`
                                    }
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full border border-white"/>
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-teal-800 flex items-center justify-center border border-white">
                                    {
                                    user ?. name ?. charAt(0).toUpperCase()
                                } </div>
                            )
                        }
                            <span className="hidden sm:inline text-sm">
                                Welcome, {
                                user ?. name
                            } </span>
                        </div>
                        <button onClick={logout}
                            className="bg-red-600 hover:bg-red-500 text-white p-2 rounded-full"
                            title="Logout">
                            <FaSignOutAlt size={20}/>
                        </button>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
