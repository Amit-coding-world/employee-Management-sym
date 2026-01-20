import {useState} from "react";
import {useAuth} from '../context/authContext.jsx';
import {useNavigate, Link} from 'react-router-dom';
import {FaUserShield, FaUserTie, FaUsers} from 'react-icons/fa';
import api from '../utils/api';
import Loading from "../components/Loading";


const Login = () => {
    const [loading, setLoading] = useState(false);
    const {login} = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);
    const [showLoginForm, setShowLoginForm] = useState(false);


    const roles = [
        {
            id: 'admin',
            name: 'Admin',
            icon: FaUserShield,
            color: 'from-purple-500 to-indigo-600',
            hoverColor: 'hover:from-purple-600 hover:to-indigo-700',
            description: 'Full system access'
        }, {
            id: 'manager',
            name: 'Manager',
            icon: FaUserTie,
            color: 'from-blue-500 to-cyan-600',
            hoverColor: 'hover:from-blue-600 hover:to-cyan-700',
            description: 'Team management'
        }, {
            id: 'employee',
            name: 'Employee',
            icon: FaUsers,
            color: 'from-teal-500 to-green-600',
            hoverColor: 'hover:from-teal-600 hover:to-green-700',
            description: 'Personal dashboard'
        }
    ];

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        setShowLoginForm(true);
        setError(null);
    };

    const handleBack = () => {
        setShowLoginForm(false);
        setSelectedRole(null);
        setEmail("");
        setPassword("");
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await api.post(`/auth/login`, {email, password});
            if (response.data.success) {
                const userRole = response.data.user.role;

                // Validate if the logged-in user's role matches the selected role
                if (userRole !== selectedRole.id) {
                    setError(`Invalid credentials for ${
                        selectedRole.name
                    } login. Please check your role.`);
                    setLoading(false);
                    return;
                }

                localStorage.setItem("token", response.data.token);
                login(response.data.user);

                if (userRole === 'admin') {
                    navigate('/admin-dashboard');
                } else {
                    navigate("/employee-dashboard");
                }
            }
        } catch (error) {
            if (error.response && error.response.data && !error.response.data.success) {
                setError(error.response.data.message);
            } else {
                setError("Server Error");
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading/>;
    }


    return (<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-6xl px-4">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
                    Employee Management System
                </h1>
                <p className="text-gray-300 text-lg md:text-xl">
                    {
                    showLoginForm ? `Sign in as ${
                        selectedRole ?. name
                    }` : 'Select your role to continue'
                } </p>
            </div>

            {/* Role Selection or Login Form */}
            {!showLoginForm ? (
                                                                                                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                                                                                                                                        {roles.map((role) => {
                                                                                                                                            const IconComponent = role.icon;
                                                                                                                                            return (
                                                                                                                                                <div
                                                                                                                                                    key={role.id}
                                                                                                                                                    onClick={() => handleRoleSelect(role)}
                                                                                                                                                    className={`group relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-white/20 ${role.hoverColor}`}
                                                                                                                                                >
                                                                                                                                                    <div className="flex flex-col items-center text-center space-y-4">
                                                                                                                                                        <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${role.color} flex items-center justify-center transform transition-transform group-hover:rotate-12 group-hover:scale-110 shadow-lg`}>
                                                                                                                                                            <IconComponent className="text-white text-3xl" />
                                                                                                                                                        </div>
                                                                                                                                                        <h3 className="text-2xl font-bold text-white">{role.name}</h3>
                                                                                                                                                        <p className="text-gray-300 text-sm">{role.description}</p>
                                                                                                                                                        <div className="mt-4 px-6 py-2 bg-white/20 rounded-full text-white text-sm font-medium group-hover:bg-white/30 transition-colors">
                                                                                                                                                            Login as {role.name}
                                                                                                                                                        </div>
                                                                                                                                                    </div>
                                                                                                                                                    
                                                                                                                                                    {/* Decorative corner */}
                                                                                                                                                    <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${role.color} opacity-20 rounded-bl-full rounded-tr-2xl`}></div>
                                                                                                                                                </div>
                                                                                                                                            );
                                                                                                                                        })}
                                                                                                                                    </div>
                                                                                                                                ) : (
                                                                                                                                    <div className="max-w-md mx-auto">
                                                                                                                                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
                                                                                                                                            {/* Role Badge */}
                                                                                                                                            <div className="flex items-center justify-center mb-6">
                                                                                                                                                <div className={`flex items-center space-x-3 px-6 py-3 rounded-full bg-gradient-to-r ${selectedRole.color} shadow-lg`}>
                                                                                                                                                    {selectedRole && <selectedRole.icon className="text-white text-2xl" />}
                                                                                                                                                    <span className="text-white font-bold text-lg">{selectedRole?.name} Login</span>
                                                                                                                                                </div>
                                                                                                                                            </div>
                                                                                                                
                                                                                                                                            {/* Error Message */}
                                                                                                                                            {error && (
                                                                                                                                                <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg backdrop-blur-sm">
                                                                                                                                                    <p className="text-red-200 text-sm text-center">{error}</p>
                                                                                                                                                </div>
                                                                                                                                            )}
                                                                                                                
                                                                                                                                            {/* Login Form */}
                                                                                                                                            <form onSubmit={handleSubmit} className="space-y-6">
                                                                                                                                                <div>
                                                                                                                                                    <label htmlFor="email" className="block text-white font-medium mb-2">
                                                                                                                                                        Email Address
                                                                                                                                                    </label>
                                                                                                                                                    <input
                                                                                                                                                        type="email"
                                                                                                                                                        id="email"
                                                                                                                                                        name="email"
                                                                                                                                                        placeholder="Enter your email"
                                                                                                                                                        required
                                                                                                                                                        value={email}
                                                                                                                                                        onChange={(e) => setEmail(e.target.value)}
                                                                                                                                                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all backdrop-blur-sm"
                                                                                                                                                    />
                                                                                                                                                </div>
                                                                                                                
                                                                                                                                                <div>
                                                                                                                                                    <label htmlFor="password" className="block text-white font-medium mb-2">
                                                                                                                                                        Password
                                                                                                                                                    </label>
                                                                                                                                                    <input
                                                                                                                                                        type="password"
                                                                                                                                                        id="password"
                                                                                                                                                        name="password"
                                                                                                                                                        placeholder="Enter your password"
                                                                                                                                                        required
                                                                                                                                                        value={password}
                                                                                                                                                        onChange={(e) => setPassword(e.target.value)}
                                                                                                                                                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all backdrop-blur-sm"
                                                                                                                                                    />
                                                                                                                                                </div>
                                                                                                                
                                                                                                                                                <div className="flex items-center justify-between text-sm">
                                                                                                                                                    <label className="flex items-center text-gray-300 cursor-pointer group">
                                                                                                                                                        <input
                                                                                                                                                            type="checkbox"
                                                                                                                                                            className="w-4 h-4 rounded border-gray-400 text-purple-600 focus:ring-purple-500 focus:ring-offset-0 bg-white/10 cursor-pointer"
                                                                                                                                                        />
                                                                                                                                                        <span className="ml-2 group-hover:text-white transition-colors">Remember me</span>
                                                                                                                                                    </label>
                                                                                                                                                    <Link
                                                                                                                                                        to="/forgot-password"
                                                                                                                                                        className="text-purple-300 hover:text-purple-200 transition-colors font-medium"
                                                                                                                                                    >
                                                                                                                                                        Forgot Password?
                                                                                                                                                    </Link>
                                                                                                                                                </div>
                                                                                                                
                                                                                                                                                <button
                                                                                                                                                    type="submit"
                                                                                                                                                    className={`w-full py-3 px-4 bg-gradient-to-r ${selectedRole.color} text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900`}
                                                                                                                                                >
                                                                                                                                                    Sign In
                                                                                                                                                </button>
                                                                                                                
                                                                                                                                                <button
                                                                                                                                                    type="button"
                                                                                                                                                    onClick={handleBack}
                                                                                                                                                    className="w-full py-3 px-4 bg-white/10 text-white font-medium rounded-lg border border-white/30 hover:bg-white/20 transition-all duration-200"
                                                                                                                                                >
                                                                                                                                                    ← Back to Role Selection
                                                                                                                                                </button>
                                                                                                                                            </form>
                                                                                                                
                                                                                                                                            {/* Sign Up Link - ONLY for Admin */}
                                                                                                                                            {selectedRole?.id === 'admin' && (
                                                                                                                                                <div className="mt-6 text-center">
                                                                                                                                                    <p className="text-gray-300">
                                                                                                                                                        Don't have an account?{' '}
                                                                                                                                                        <Link to="/signup" className="text-purple-300 hover:text-purple-200 font-medium transition-colors">
                                                                                                                                                            Sign Up
                                                                                                                                                        </Link>
                                                                                                                                                    </p>
                                                                                                                                                </div>
                                                                                                                                            )}
                                                                                                                                        </div>
                                                                                                                                    </div>
                                                                                                                                )}
                                                                                                                            </div>
                                                                                                                
                                                                                                                            {/* Footer */}
                                                                                                                            <div className="relative z-10 mt-12 text-center text-gray-400 text-sm">
                                                                                                                                <p>© 2026 Employee Management System. All rights reserved.</p>
                                                                                                                            </div>
                                                                                                                
                                                                            <style jsx>{`
                                                                                @keyframes blob {
                                                                                    0%, 100% {
                                                                                        transform: translate(0, 0) scale(1);
                                                                                    }
                                                                                    33% {
                                                                                        transform: translate(30px, -50px) scale(1.1);
                                                                                    }
                                                                                    66% {
                                                                                        transform: translate(-20px, 20px) scale(0.9);
                                                                                    }
                                                                                }
                                                                                .animate-blob {
                                                                                    animation: blob 7s infinite;
                                                                                }
                                                                                .animation-delay-2000 {
                                                                                    animation-delay: 2s;
                                                                                }
                                                                                .animation-delay-4000 {
                                                                                    animation-delay: 4s;
                                                                                }
                                                                            `}</style>
                                                                        </div>
        );
        };

        export default Login;
