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
  baseURL: () => window.env.BACKEND_URL,

  fetchOsdData: async (path) => {
    const baseUrl = apiService.baseURL();
    const url = `${baseUrl}/${path}`;
    try {
      // Fetching OSD data
      const response = await axios.get(`${url}`, {
        params: {
          cycle_id: 1,
          source: 'file',
          capabilities:'mid'
        },
        headers: {
          'accept': 'application/json'
        }
      });
      return { data: response.data, status: 200, error: null };
    } catch (error) {
      const errorResponse = handleAxiosError(error);
      return { data: null, status: errorResponse.status, error: errorResponse.error };
    }
},

 saveOsdData: async (path, data: Record<string, unknown>) => {
  const baseUrl = apiService.baseURL();
  const url = `${baseUrl}/${path}`;
  try {
    const response = await axios.post(`${url}`, data, {
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      }
    });
    return { data: response.data, status: 200, error: null };
  } catch (error) {
    // Let the error propagate to be handled by the caller
    throw error;
  }
}
};

export default apiService;