export interface Trip {
  id: number;
  departureDay: string;
  price: number;
  departureTime: string;
  travelTime: string;
  destinationTime: string;
  busType: string;
  emptySeat: number;
  departureProvince: string;
  destProvince: string;
}

export interface TripDetails {
  id:                number;
  departureDay:      string;
  price:             number;
  departureTime:     string;
  busType:           string;
  departureProvince: string;
  destProvince:      string;
  disableSeat:       string[];
  pickup:            Office[];
  dropOff:           Office[];
}

export interface Office {
  officeId:   number;
  deltaTime:  string;
  type:       number;
  officeName: string;
  address:    string;
}

