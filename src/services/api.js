const API_URL = "https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json";

// Sample data as fallback if API fails
const SAMPLE_DOCTORS = [
  {
    id: 1,
    name: "Dr. John Smith",
    speciality: ["Cardiology", "Internal Medicine"],
    experience: 15,
    fee: 1500,
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    isVideoConsultAvailable: true,
    isInClinicAvailable: true
  },
  {
    id: 2,
    name: "Dr. Sarah Johnson", 
    speciality: ["Dermatology"],
    experience: 8,
    fee: 1200,
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    isVideoConsultAvailable: true,
    isInClinicAvailable: false
  },
  {
    id: 3,
    name: "Dr. Michael Williams",
    speciality: ["Neurology"],
    experience: 12,
    fee: 1800,
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    isVideoConsultAvailable: false,
    isInClinicAvailable: true
  }
];

export const fetchDoctors = async () => {
  try {
    console.log("Attempting fetch from:", API_URL, "Origin:", window.location.origin);
    
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("API response data:", data);
    
    if (Array.isArray(data)) {
      return data;
    } else if (data && typeof data === 'object') {
      // Check if data has a property that's an array of doctors
      for (const key of ['doctors', 'data', 'items', 'results']) {
        if (Array.isArray(data[key])) {
          return data[key];
        }
      }
      
      // If we can't find an expected array structure, log the data structure
      console.warn("Unexpected API response structure:", data);
      
      // Return an array with a single object if that's what the API returned
      if (data.name && data.speciality) {
        return [data];
      }
    }
    
    console.error("Invalid API response format:", data);
    return SAMPLE_DOCTORS; // Fallback to sample data
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return SAMPLE_DOCTORS; // Fallback to sample data
  }
};