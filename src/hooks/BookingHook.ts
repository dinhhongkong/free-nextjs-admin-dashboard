import apiClient from "@/api/apiClient";
import { TripDetails } from "@/model/Trip";
import {  useCallback, useEffect, useState } from "react";

export const useBooking = ( tripId: string| null, returnTripId: string | null, isRoundTrip: boolean) =>{
  const [selectedSeatsDepart, setSelectedSeatsDepart] = useState<string[]>([]);
  const [selectedSeatsReturn, setSelectedSeatsReturn] = useState<string[]>([]);
  const [departureTrip, setDepartureTrip] = useState<TripDetails>({
    id: 0,
    departureDay: '',
    price: 0,
    departureTime: '',
    busType: '',
    departureProvince: '',
    destProvince: '',
    disableSeat: [],
    pickup: [],
    dropOff: []
  });
  const [roundTrip, setRoundTrip] = useState<TripDetails>({
    id: 0,
    departureDay: '',
    price: 0,
    departureTime: '',
    busType: '',
    departureProvince: '',
    destProvince: '',
    disableSeat: [],
    pickup: [],
    dropOff: []
  });

  

  const fetchDepartureTrip = useCallback(async () => {
    try { 
      const response: TripDetails = await apiClient.get(`/booking/trip/${tripId}`);  
      setDepartureTrip(response); 
    } catch (error) {
      console.error('Error fetching departure trip:', error);
    }
  }, [tripId]);
  
  const fetchRoundTrip = useCallback(async () => {  
    try { 
      const response: TripDetails = await apiClient.get(`/booking/trip/${returnTripId}`);  
      setRoundTrip(response); 
    } catch (error) {
      console.error('Error fetching round trip:', error);
    }
  }, [returnTripId]);

  useEffect(() => {
    fetchDepartureTrip();
    if(isRoundTrip){
      fetchRoundTrip();
    }
  }, [fetchDepartureTrip, fetchRoundTrip]);  

  return { selectedSeatsDepart, setSelectedSeatsDepart, selectedSeatsReturn, setSelectedSeatsReturn, departureTrip, roundTrip }
  
}