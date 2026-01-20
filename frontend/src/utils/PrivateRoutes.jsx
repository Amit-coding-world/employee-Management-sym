import {Navigate} from "react-router-dom";
import {useAuth} from "../context/authContext.jsx";
import Loading from "../components/Loading";

const PrivateRoutes = ({children}) => {
    const {user, loading} = useAuth()

    if (loading) {
        return <Loading/>;
    }

    return(user ? children : <Navigate to="/login"/>)
}

export default PrivateRoutes
