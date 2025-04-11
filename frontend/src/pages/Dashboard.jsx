import { useContext } from "react";
import AuthContext from '../context/AuthContext'
import { logout } from '../services/api'

const Dashboard = () => {
    const { user } = useContext(AuthContext)

    return(
        <div>
            <h2>Welcome, {user?.email || "User"}</h2>
            <button onClick={logout}>Logout</button>
        </div>
    )
}

export default Dashboard