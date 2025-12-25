const API_BASE_URL = 'https://verdex-render.onrender.com/api';

export const identifyPlant = async (image) => {
  const formData = new FormData();
  formData.append('image', image);
  
  const response = await fetch(`${API_BASE_URL}/plantnet`, {
    method: 'POST',
    body: formData
  });
  
  return response.json();
};

export const healthCheck = async () => {
  const response = await fetch(`${API_BASE_URL}/health`);
  return response.json();
};
