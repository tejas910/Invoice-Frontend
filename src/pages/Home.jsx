import React from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import DashboardCards from '../components/DashboardCards'
import { useState } from 'react'

const Home = () => {
    return (
    <>
            <div className="flex h-screen bg-gray-100">
                <div className="flex-1 flex flex-col overflow-hidden">

                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                        <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
                        <DashboardCards />
                    </main>
                </div>
            </div>
    </>
            )
}
 export default Home