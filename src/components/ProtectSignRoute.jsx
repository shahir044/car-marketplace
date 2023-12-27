import {useAuthStatus} from "../hooks/useAuthStatus";
import {Navigate, Outlet} from "react-router-dom";
import Spinner from "./Spinner";

const ProtectSignRoute = (props) => {
    const {loggedIn,checkingStatus} = useAuthStatus();

    if (checkingStatus) return <Spinner/>

    return loggedIn ? <Navigate to='/' /> : <Outlet/>;
}

export default ProtectSignRoute;