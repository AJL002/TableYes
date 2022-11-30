import axios from "axios";

// var app = express();

// // ADD THIS
// var cors = require('cors');
// app.use(cors());

const URL =
  "https://travel-advisor.p.rapidapi.com/restaurants/list-in-boundary";
const backendUrl =
  "https://tjcc5pqmel.execute-api.us-east-1.amazonaws.com/dev/api";
const formUrl = "https://tjcc5pqmel.execute-api.us-east-1.amazonaws.com/dev";

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
  console.log('Sign-up - ' + data)
  return axios.post('https://tjcc5pqmel.execute-api.us-east-1.amazonaws.com/dev/api/signup', {
    ...data,
  },
  
  
  
  );
};

// Login a user
export const login = async (data) => {
  console.log('Login - ' + data)
  // console.log(localStorage.getItem('idToken'))
  // console.log(localStorage.getItem('accessToken'))
  return axios.post(backendUrl + "/login", {
    ...data,
  });
};

// Submit Restaurant
export const submitRestaurant = async (data) => {
  return axios.post(
    formUrl + "/restaurants",
    {
      ...data,
    },
    {
      headers: {
        authorization: localStorage.getItem("idToken"),
      },
    }
  );
};
