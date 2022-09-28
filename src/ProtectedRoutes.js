import LandingPage from "./components/landing-page/LandingPage";
import { Outlet } from "react-router-dom";

const ProtectedRoutes = props  => {
    return props.isLoggedIn ? <Outlet/> : <LandingPage/>
}

export default ProtectedRoutes;