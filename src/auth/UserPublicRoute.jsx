import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { userAuth } from './userAuth'

function UserPublicRoute() {
    const token = userAuth()
    return token ? <Navigate to='/' /> : <Outlet />
}

export default UserPublicRoute