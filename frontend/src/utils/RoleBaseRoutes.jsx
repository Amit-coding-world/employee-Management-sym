import {useAuth} from "../context/authContext"
import {Navigate} from "react-router-dom"
import Loading from "../components/Loading"

const RoleBaseRoutes = ({children, requiredRole}) => {
    const {user, loading} = useAuth()

    if (loading) {
        return <Loading/>
    }

    if (!requiredRole.includes(user.role)) {
        return <Navigate to="/unauthorized"/>
    }

    return(user ? children : <Navigate to="/login"/>)
}

export default RoleBaseRoutes
