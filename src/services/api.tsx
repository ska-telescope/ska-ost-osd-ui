import axios from 'axios';

function handleAxiosError(error: object) {
  let status = 200;
  let errorMessage = null;
  type AxiosErrorType = { message: string; statusCode: number };
  if (axios.isAxiosError(error)) {
    const typedError: AxiosErrorType = {
      message: error.message,
      statusCode: error.response?.status || 500
    };
    status = typedError.statusCode;
    errorMessage = typedError.message;
  } else {
    status = 500;
    errorMessage = 'Internal Server Error';
  }
  return { status, error: errorMessage };
}

const apiService = {
  baseURL: () => window.env?.BACKEND_URL,

  fetchOsdCycleData: async (path) => {
    const baseUrl = apiService.baseURL();
    const url = `${baseUrl}/${path}`;
    try {
      // Fetching OSD data
      const response = await axios.get(`${url}`, {
        headers: {
          accept: 'application/json',
        },
      });
      return { data: response.data, status: 200, error: null };
    } catch (error) {
      const errorResponse = handleAxiosError(error);
      return { data: null, status: errorResponse.status, error: errorResponse.error };
    }
  },

  fetchOsdData: async (path, cycle_id) => {
    const baseUrl = apiService.baseURL();
    const url = `${baseUrl}/${path}`;
    try {
      // Fetching OSD data
      const response = await axios.get(`${url}`, {
        params: {
          cycle_id: cycle_id,
          source: 'file',
          capabilities: 'mid',
        },
        headers: {
          accept: 'application/json',
        },
      });
      return { data: response.data, status: 200, error: null };
    } catch (error) {
      const errorResponse = handleAxiosError(error);
      return { data: null, status: errorResponse.status, error: errorResponse.error };
    }
  },

  saveOsdData: async (path, cycle_id, data: Record<string, unknown>) => {
    const baseUrl = apiService.baseURL();
    const url = `${baseUrl}/${path}`;
    try {
      const response = await axios.put(`${url}`, data, {
        params: {
          cycle_id: cycle_id,
          capabilities: 'mid',
          array_assembly: 'AA2',
        },
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
      });
      return { data: response.data, status: 200, error: null };
    } catch (error) {
      // Let the error propagate to be handled by the caller
      throw error;
    }
  },

  releaseOsdData: async (path, data) => {
    const baseUrl = apiService.baseURL();
    const newParam = data !== 'default' ? `&release_type=${data}` : '';
    const url = `${baseUrl}/${path}`;

    try {
      const response = await axios.post(`${url}`, {
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
      });
      return { data: response.data, status: 200, error: null };
    } catch (error) {
      // Let the error propagate to be handled by the caller
      throw error;
    }
  },
};

export default apiService;