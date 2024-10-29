import React from "react";
import { Outlet, Navigate } from 'react-router-dom'
import { userAuth } from "./userAuth";
function UserPrivateRoute() {
    const token = userAuth()
    return  token ? <Outlet/> : <Navigate to={'/login'}/>
}

export default UserPrivateRoute