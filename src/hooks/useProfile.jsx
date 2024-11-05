import axios from "axios";
import React, { useEffect, useState } from "react";

function useProfile() {
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState(false);
  const accesstoken = JSON.parse(localStorage.getItem("accesstoken"));
  const fetchDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/users`, {
        headers: {
          Authorization: `Bearer ${accesstoken}`,
        },
      });
      if (res.status == 200) {
        setProfileData(res.data.user || {});
        setIsLoading(false);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log(err.response?.data.message);
      }
    }
  };
  // console.log(profileData.companyName)
  useEffect(() => {
    fetchDetails();
  }, []);

  return { isLoading, profileData };
}

export default useProfile;
