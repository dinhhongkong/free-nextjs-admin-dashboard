
import apiClient from "@/api/apiClient";
import { Province } from "@/model/Province";
import { useEffect, useState } from "react";

export const useProvince = () => {
  const [provinces, setProvinces] = useState<Province[]>([]);

  const fetchProvinces = async () => {
    try {
      const response : Province[] = await apiClient.get('/booking/provinces');
      setProvinces(response);
    } catch (error) {
      console.error('Error fetching provinces:', error);
    }
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

  return { provinces, setProvinces };

}