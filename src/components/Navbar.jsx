import React, { useState } from 'react'
import { Bell, ChevronDown, Users, Settings, LogOut, Menu } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import useProfile from '../hooks/useProfile'
import { toast } from 'react-toastify'

const Navbar = ({ toggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const navigate = useNavigate()
  const handleLogout = () =>{
      toast.success("Logout Successfully",{position:"top-right"})
      localStorage.clear();
      navigate("/login")
  }
  const { profileData } = useProfile();

  return (
    <header className="bg-white border-b flex items-center justify-between p-1.5    ">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="md:hidden mr-2 p-2 rounded-md hover:bg-gray-100">
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-semibold">{profileData.companyName ? profileData.companyName : "" }</h1>
      </div>
      <div className="flex items-center space-x-4">
        
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100"
          >
            <img
              src={profileData.companyLogo ? profileData.companyLogo : `https://ui-avatars.com/api/?name=${profileData.companyName}&background=random`}
              alt="User"
              className="w-16 h-8 rounded object-contain"
            />
            <ChevronDown className="h-4 w-4" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-10">
              <div className="px-4 py-2 border-b">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-gray-500">john@example.com</p>
              </div>
              <Link to={"/profile"} className="bloc cursor-pointerk px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <Users className="inline-block mr-2 h-4 w-4" /> Profile
              </Link>
              <Link to={"/setting"} className="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <Settings className="inline-block mr-2 h-4 w-4" /> Settings
              </Link>
              <a onClick={handleLogout} className="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <LogOut className="inline-block mr-2 h-4 w-4" /> Log out
              </a>
            </div>
          )}
        </div>
        
      </div>
    </header>
  )
}

export default Navbar