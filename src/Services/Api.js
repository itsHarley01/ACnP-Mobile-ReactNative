import axios from 'axios';

const BASE_URL = 'https://a-cn-p-backend.vercel.app/';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const registerUser = async (userData) => {
  const response = await fetch(`${BASE_URL}signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Failed to register user'); 
  }

  return await response.json();
};


export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/login', credentials, {
      headers: {
        'Content-Type': 'application/json', 
      },
    });
    return response.data; 
  } catch (error) {
    console.error("Login error:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const updateUser = async (userId, firstName, lastName) => {
  try {
      const response = await fetch(`${BASE_URL}updateuser/${userId}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              firstName,
              lastName,
          }),
      });

      if (!response.ok) {
          throw new Error('Failed to update user');
      }

      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error updating user:', error);
      throw error;
  }
};


// Function to upload an image
export const uploadImage = async (imageData) => {
  const formData = new FormData();
  formData.append('image', {
    uri: imageData.uri,
    type: imageData.mimeType || 'image/jpeg',
    name: imageData.fileName || 'photo.jpg',
  });
  formData.append('featured', false);

  try {
    const response = await fetch(`${BASE_URL}images`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

export const getAllUserEmails = async () => {
  try {
      const response = await axios.get(`${BASE_URL}getuseremails`); 
      return response.data; // Return the list of emails
  } catch (error) {
      console.error('Error fetching users:', error);
      throw error; 
  }
};


export const fetchImages = async () => {
    try {
      const response = await api.get('/images');
      return response.data; 
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  };

  export const toggleFeaturedImage = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}tagimages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error("Error toggling featured:", error);
      throw error;
    }
  };

// Function to delete an image by ID
export const deleteImage = async (imageId) => {
    try {
      const response = await api.delete(`/images/${imageId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  };

  export const getContacts = async () => {
    try {
        const response = await fetch(`${BASE_URL}contacts`);
        if (!response.ok) {
            throw new Error('Failed to fetch contacts');
        }
        const data = await response.json();
        return data; // Returns the list of contacts
    } catch (error) {
        console.error('Error fetching contacts:', error);
        throw error;
    }
};


export const updateContact = async (contactId, contactData) => {
    try {
        const response = await fetch(`${BASE_URL}updatecontact/${contactId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contactData), // Contact data object
        });

        if (!response.ok) {
            throw new Error('Failed to update contact');
        }

        const data = await response.json();
        return data; // Returns the updated contact
    } catch (error) {
        console.error('Error updating contact:', error);
        throw error;
    }
};

// Function to add a product
export const addProduct = async (productData) => {
  const formData = new FormData();

  // Handle image upload
  if (productData.image) {
    formData.append('image', {
      uri: productData.image, // Corrected to use productData.image
      type: 'image/jpeg', // Assuming it's a JPEG
      name: 'glass_image.jpg', // You can adjust the filename
    });
  }

  formData.append('name', productData.name);
  formData.append('description', productData.description);
  formData.append('type', productData.type);

  try {
    const response = await fetch(`${BASE_URL}products`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};



export const updateProduct = async (productId, productData) => {
  const formData = new FormData();
  
  if (productData.image) {
    formData.append('image', {
      uri: serviceData.image, 
      type: 'image/jpeg',
      name: 'product_image.jpg',
    });
  }
  
  formData.append('name', productData.name);
  formData.append('description', productData.description);

  try {
    const response = await fetch(`${BASE_URL}products/${productId}`, {
      method: 'PUT',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error.response ? error.response.data : error.message;
  }
};

// Function to delete a product
export const deleteProduct = async (productId) => {
  try {
    const response = await api.delete(`${BASE_URL}products/${productId}`);
    return response.data; 
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error.response ? error.response.data : error.message;
  }
};

// Function to fetch all products
export const fetchProducts = async () => {
  try {
    const response = await api.get(`${BASE_URL}products`);
    return response.data; 
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error.response ? error.response.data : error.message;
  }
};

// Function to fetch products by type
export const getProductsByType = async (productType) => {
  try {
      const response = await fetch(`${BASE_URL}products/${productType}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      });

      if (!response.ok) {
          throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      return data; 
  } catch (error) {
      console.error('Error fetching products by type:', error);
      throw error; 
  }
};

//about 
export const getAllAbout = async () => {
  try {
    const response = await fetch(`${BASE_URL}about`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching about entries:', error);
    throw error; 
  }
};


export const updateAbout = async (id, updatedData) => {
  try {
    const response = await fetch(`${BASE_URL}about/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating about entry:', error);
    throw error; 
  }
};

// Function to get all services
export const getServices = async () => {
  try {
    const response = await api.get('/services');
    return response.data; // Returns the list of services
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error.response ? error.response.data : error.message;
  }
};

// Function to add a new service (with image upload)
export const addService = async (serviceData) => {
  const formData = new FormData();
  
  if (serviceData.image) {
    formData.append('image', {
      uri: serviceData.image, 
      type: 'image/jpeg',
      name: 'service_image.jpg',
    });
  }

  formData.append('name', serviceData.name);
  formData.append('description', serviceData.description);
  formData.append('price', serviceData.price);  // Include price

  try {
    const response = await fetch(`${BASE_URL}services`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error adding service:', error);
    throw error.response ? error.response.data : error.message;
  }
};

// Function to update an existing service by ID (with image upload)
export const updateService = async (serviceId, serviceData) => {
  const formData = new FormData();

  if (serviceData.image) {
    formData.append('image', {
      uri: serviceData.image, 
      type: 'image/jpeg',
      name: 'service_image.jpg',
    });
  }

  formData.append('name', serviceData.name);
  formData.append('description', serviceData.description);
  formData.append('price', serviceData.price);  // Include price

  try {
    const response = await fetch(`${BASE_URL}services/${serviceId}`, {
      method: 'PUT',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error updating service:', error);
    throw error.response ? error.response.data : error.message;
  }
};


// Function to delete a service by ID
export const deleteService = async (serviceId) => {
  try {
    const response = await api.delete(`${BASE_URL}services/${serviceId}`);
    return response.data; 
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error.response ? error.response.data : error.message;
  }
};


// Function to fetch appointments from the server
export const getAppointments = async () => {
  try {
    const response = await fetch(`${BASE_URL}appointment`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const appointments = await response.json();
    return appointments;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error; 
  }
};

// Function to toggle 'contacted' field
export const toggleContacted = async (appointmentId) => {
  try {
    const response = await axios.put(`${BASE_URL}appointmentcontacted/${appointmentId}`);
    return response.data; // Returns updated appointment object
  } catch (error) {
    console.error("Error updating contacted status:", error);
    throw error; // Rethrow to handle in the frontend
  }
};

// Function to toggle 'finished' field
export const toggleFinished = async (appointmentId) => {
  try {
    const response = await axios.put(`${BASE_URL}appointmentfinished/${appointmentId}`);
    return response.data; // Returns updated appointment object
  } catch (error) {
    console.error("Error updating finished status:", error);
    throw error; // Rethrow to handle in the frontend
  }
};

export const getAppointmentsByStatus = async (status) => {
  try {
    const response = await fetch(`${BASE_URL}appointment/${status}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Ensure response status is OK
    if (!response.ok) {
      const errorMessage = await response.text();

      // Check if the error message indicates no appointments found
      if (errorMessage.includes('No appointments found')) {
        return []; // Return an empty array if no appointments found
      }

      throw new Error(`Error: ${response.statusText} - ${errorMessage}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : []; // Ensure data is an array
  } catch (error) {
    console.error("Failed to fetch appointments by status:", error);
    return []; // Return an empty array in case of an error
  }
};
export const getProjectsByStatus = async (status) => {
  try {
    const response = await fetch(`${BASE_URL}projects/${status}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Ensure response status is OK
    if (!response.ok) {
      const errorMessage = await response.text();

      // Check if the error message indicates no appointments found
      if (errorMessage.includes('No projects found')) {
        return []; // Return an empty array if no appointments found
      }

      throw new Error(`Error: ${response.statusText} - ${errorMessage}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : []; // Ensure data is an array
  } catch (error) {
    console.error("Failed to fetch projects by status:", error);
    return []; // Return an empty array in case of an error
  }
};

export const createProject = async (projectData) => {
  try {
    const response = await axios.post(`${BASE_URL}projects`, projectData);
    return response.data;
  } catch (error) {
    console.error('Error creating finished project:', error);
    throw error;
  }
};


export const updateAppointment = async (id, updatedData) => {
  try {
    const response = await fetch(`${BASE_URL}appointment/${id}`, {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData), 
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Failed to update appointment:', error);
    throw error; 
  }
};

export const createFinishedProject = async (projectData) => {
  try {
    const response = await fetch(`${BASE_URL}projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });
    if (!response.ok) {
      const errorText = await response.text(); // Get the error response body
      throw new Error(`Failed to create project: ${errorText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


// Get all finished projects
export const getAllFinishedProjects = async () => {
  try {
      const response = await fetch(`${BASE_URL}projects`);
      if (!response.ok) {
          throw new Error('Failed to fetch projects');
      }
      const data = await response.json();
      return data;
  } catch (error) {
      console.error(error);
      throw error;
  }
};

// Update a finished project by ID
export const updateFinishedProject = async (id, projectData) => {
  try {
      const response = await fetch(`${API_URL}projects/${id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(projectData),
      });
      if (!response.ok) {
          throw new Error('Failed to update project');
      }
      const data = await response.json();
      return data;
  } catch (error) {
      console.error(error);
      throw error;
  }
};

// Delete a finished project by ID
export const deleteFinishedProject = async (id) => {
  try {
      const response = await fetch(`${BASE_URL}projects/${id}`, {
          method: 'DELETE',
      });
      if (!response.ok) {
          throw new Error('Failed to delete project');
      }
      return { message: 'Project deleted successfully' }; // You can customize the return value
  } catch (error) {
      console.error(error);
      throw error;
  }
};

// Get all projects by status
export const getAllProjectsByStatus = async (status) => {
  try {
      const response = await fetch(`${BASE_URL}projects/${status}`);
      if (!response.ok) {
          throw new Error('Failed to fetch projects by status');
      }
      const data = await response.json();
      return data;
  } catch (error) {
      console.error(error);
      throw error;
  }
};


// Function to get all feedback
export const getAllFeedback = async () => {
  try {
    const response = await axios.get(`${BASE_URL}feedback`);
    return response.data;
  } catch (error) {
    console.error('Error fetching feedback:', error);
    throw error;
  }
};

// Function to send OTP to the user's email
export const sendOtpEmail = async (email, otps) => {
  try {
    const response = await axios.post(`${BASE_URL}emailotp`, {
      to_email: email,
      otp: otps, 
    });
    return response.data;
  } catch (error) {
    console.error("Failed to send OTP: ", error, email, otps, );
    throw error;
  }
};


export const updateUserPassword = async (email, newPassword) => {
  try {
      const response = await axios.put(`${BASE_URL}updateuserpass/${email}`, {
          newPassword, 
      });

      return response.data; 
  } catch (error) {
      console.error('Error updating password:', error.response?.data || error.message);
      throw error; 
  }
};

export default api;
