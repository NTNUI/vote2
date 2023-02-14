import axios from "axios";

export const login = (phone_number: string, password: string) => {
  return axios.post(
    "/auth/login",
    {
      phone_number: phone_number,
      password: password,
    },
    { withCredentials: true }
  );
};

// QR

// Admin CRUD

// Vote

// Fetch group

// see results
