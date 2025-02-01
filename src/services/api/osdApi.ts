import axios from 'axios';

const BASE_URL = 'http://localhost:5000/ska-ost-osd';

export const fetchOsdData = async (cycleId: string) => {
  try {
    console.log('Fetching OSD data for cycle:', cycleId);
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
    console.error('Error fetching OSD data:', error);
    throw error;
  }
};