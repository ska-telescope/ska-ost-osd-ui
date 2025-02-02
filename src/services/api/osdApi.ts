import axios from 'axios';

const BASE_URL = 'http://localhost:5000/ska-ost-osd';

export const fetchOsdData = async (cycleId: number) => {
  try {
    // Fetching OSD data
    const response = await axios.get(`${BASE_URL}/osd/api/v2/osd`, {
      params: {
        cycle_id: cycleId,
        source: 'file',
        capabilities:'mid'
      },
      headers: {
        'accept': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    // Let the error propagate to be handled by the caller
    throw error;
  }
};

export const saveOsdData = async (data: Record<string, unknown>) => {
  try {
    const response = await axios.post(`${BASE_URL}/osd/api/v2/osd`, data, {
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    // Let the error propagate to be handled by the caller
    throw error;
  }
};