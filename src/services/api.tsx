/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

export interface customAxiosResponse {
  data: object;
  status: number;
  error: string;
}

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

  fetchOsdCycleData: async (path): Promise<any> => {
    const baseUrl = apiService.baseURL();
    console.log('baseURL', baseUrl);
    const url = `${baseUrl}/${path}`;
    console.log('url', url);
    try {
      const response = await axios.get(`${url}`, {
        headers: {
          accept: 'application/json'
        }
      });
      return { data: response.data, status: 200, error: null };
    } catch (error) {
      const errorResponse = handleAxiosError(error);
      return { data: null, status: errorResponse.status, error: errorResponse.error };
    }
  },

  fetchOsdData: async (path, cycle_id?, osd_version?) => {
    const baseUrl = apiService.baseURL();
    const url = `${baseUrl}/${path}`;

    const source = osd_version === null ? 'file' : 'car';

    try {
      const response = await axios.get(`${url}`, {
        params: {
          cycle_id: cycle_id,
          source: source,
          capabilities: 'mid',
          osd_version: osd_version
        },
        headers: {
          accept: 'application/json'
        }
      });
      return { data: response.data, status: 200, error: null };
    } catch (error) {
      const errorResponse = handleAxiosError(error);
      return { data: null, status: errorResponse.status, error: errorResponse.error };
    }
  },

  saveOsdData: async (path, cycle_id, data: Record<string, unknown>, array_assembly) => {
    const baseUrl = apiService.baseURL();
    const url = `${baseUrl}/${path}`;
    try {
      const response = await axios.put(`${url}`, data, {
        params: {
          cycle_id: cycle_id,
          capabilities: 'mid',
          array_assembly: array_assembly
        },
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json'
        }
      });
      return { data: response.data, status: 200, error: null };
    } catch (error) {
      const errorResponse = handleAxiosError(error);
      return { data: null, status: errorResponse.status, error: errorResponse.error };
    }
  },

  releaseOsdData: async (path, cycleData): Promise<any> => {
    const baseUrl = apiService.baseURL();
    const url = `${baseUrl}/${path}cycle_id=${cycleData}`;

    try {
      const response = await axios.post(`${url}`, {
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json'
        }
      });
      return { data: response.data, status: 200, error: null };
    } catch (error) {
      const errorResponse = handleAxiosError(error);
      return { data: null, status: errorResponse.status, error: errorResponse.error };
    }
  }
};

export default apiService;
