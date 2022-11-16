import axios from "axios";

const URL =
  "https://travel-advisor.p.rapidapi.com/restaurants/list-in-boundary";
const backendUrl =
  "https://tjcc5pqmel.execute-api.us-east-1.amazonaws.com/dev/api";
const formUrl =
  "https://tjcc5pqmel.execute-api.us-east-1.amazonaws.com/dev";

export const getPlacesData = async (sw, ne) => {
  try {
    const {
      data: { data },
    } = await axios.get(URL, {
      params: {
        bl_latitude: sw.lat,
        tr_latitude: ne.lat,
        bl_longitude: sw.lng,
        tr_longitude: ne.lng,
      },
      headers: {
        "X-RapidAPI-Key": "KEY",
        "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
      },
    });

    return data;
  } catch (error) {
    console.log(error);
  }
};

// Signup a new user
export const signup = async (data) => {
  return axios.post(backendUrl + "/signup", {
    ...data,
  });
};

// Login a user
export const login = async (data) => {
  return axios.post(backendUrl + "/login", {
    ...data,
  });
};

// Submit Restaurant
export const restaurant = async (data) => {
  return axios.post(formUrl + "/restaurants", {
    ...data,
  },
  {
    headers: {
    "Authorization": `${localStorage.getItem('idToken')}`
  }});
};