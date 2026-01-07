import {FaUser} from "react-icons/fa";
import {useAuth} from "../../context/authContext";

const Summary = () => {
    const {user} = useAuth();

    return (
        <div className="p-6">
            <div className="flex items-center bg-white rounded-md shadow-md overflow-hidden">
                {/* Profile Image or Fallback Icon */}
                <div className="flex justify-center items-center bg-teal-600 text-white px-6 py-4 text-3xl">
                    {
                    user ?. profileImage ? (
                        <img src={
                                user.profileImage.startsWith('http') ? user.profileImage : `https://employee-management-system-sbvn.onrender.com/${
                                    user.profileImage
                                }`
                            }
                            alt="Profile"
                            className="w-20 h-20 rounded-full border-2 border-white object-cover shadow-sm"
                            onError={
                                (e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = '<svg class="w-12 h-12" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>';
                                }
                            }/>
                    ) : (
                        <FaUser/>)
                } </div>

                {/* Text */}
                <div className="pl-4 py-2">
                    <p className="text-lg font-semibold text-gray-600">Welcome Back</p>
                    <p className="text-xl font-bold text-gray-800">
                        {
                        user ?. name
                    }</p>
                    {
                    user ?. role && (
                        <p className="text-sm text-gray-500 mt-1">Role: {
                            user.role
                        }</p>
                    )
                } </div>
            </div>
        </div>
    );
};

export default Summary;
