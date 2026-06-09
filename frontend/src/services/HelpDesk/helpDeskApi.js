import axios from 'axios';

const API =
  'http://localhost:8080/api/helpdesk';

const token =
  localStorage.getItem(
    'nexora_access_token'
  );

const authHeaders = () => ({

  headers: {

    Authorization:
      `Bearer ${
        localStorage.getItem(
          'nexora_access_token'
        )
      }`
  }
});

export const helpDeskApi = {

  dashboard: async () => {

    const res = await axios.get(
      `${API}/dashboard`,
      authHeaders()
    );

    return res.data;
  },

  createSOS: async (data) => {

    const res = await axios.post(
      `${API}/sos`,
      data,
      authHeaders()
    );

    return res.data;
  },

  recentSOS: async () => {

    const res = await axios.get(
      `${API}/sos/recent`,
      authHeaders()
    );

    return res.data;
  },

  sosNatures: async () => {

    const res = await axios.get(
      `${API}/sos/natures`,
      authHeaders()
    );

    return res.data;
  }
};