import axios from 'axios';

const BASE_URL =
  'http://localhost:5000/priority-notifications';

export const fetchNotifications = async (
  page,
  limit,
  type
) => {

  try {

    const response = await axios.get(BASE_URL, {
      params: {
        page,
        limit,
        notification_type: type
      }
    });

    return response.data.notifications || [];

  } catch (error) {

    console.log(error);

    return [];
  }
};