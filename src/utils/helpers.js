// Get unique specialties from all doctors
export const getUniqueSpecialties = (doctors) => {
  console.log("Getting specialties from doctors:", doctors);
  
  const specialties = new Set();
  
  if (!doctors || !Array.isArray(doctors)) {
    console.warn("Invalid doctors data for extracting specialties:", doctors);
    return [];
  }
  
  doctors.forEach(doctor => {
    // Check both property names (speciality and specialities)
    const specialtyArray = doctor.speciality || doctor.specialities || [];
    
    if (Array.isArray(specialtyArray)) {
      specialtyArray.forEach(spec => {
        if (spec) {
          // Don't modify the original object, extract the name if needed
          if (typeof spec === 'object' && spec.name) {
            console.log("Adding specialty name:", spec.name);
            specialties.add(spec.name);
          } else {
            console.log("Adding specialty:", spec);
            specialties.add(spec);
          }
        }
      });
    } else if (typeof specialtyArray === 'string') {
      // Handle case where specialty might be a string
      specialties.add(specialtyArray);
    } else if (typeof specialtyArray === 'object' && specialtyArray.name) {
      // Handle case where specialty is a single object
      specialties.add(specialtyArray.name);
    }
  });
  
  const result = Array.from(specialties);
  console.log("Extracted specialties:", result);
  return result;
};

// Filter doctors based on search term, specialties, and consultation type
export const filterDoctors = (doctors, searchTerm, selectedSpecialties, consultationType) => {
  // Log filter criteria for debugging
  console.log("Filtering with criteria:", {
    searchTerm,
    selectedSpecialties,
    consultationType,
    doctorsCount: doctors.length
  });

  return doctors.filter(doctor => {
    // Ensure doctor has all necessary properties
    if (!doctor) {
      console.warn("Found undefined doctor in array");
      return false;
    }

    if (!doctor.name) {
      console.warn("Doctor without name:", doctor);
      return false;
    }

    // Filter by search term
    const nameMatch = !searchTerm || searchTerm === '' || 
      (doctor.name && doctor.name.toLowerCase().includes(searchTerm.toLowerCase()));

    // Filter by specialties - check both property names
    let specialtyMatch = selectedSpecialties.length === 0;
    
    if (!specialtyMatch) {
      const doctorSpecialties = doctor.speciality || doctor.specialities || [];
      
      if (Array.isArray(doctorSpecialties)) {
        specialtyMatch = doctorSpecialties.some(spec => {
          // If the spec is an object with a name property, compare that name
          if (typeof spec === 'object' && spec.name) {
            return selectedSpecialties.includes(spec.name);
          }
          // Otherwise, compare the spec itself
          return selectedSpecialties.includes(spec);
        });
      } else if (typeof doctorSpecialties === 'string') {
        specialtyMatch = selectedSpecialties.includes(doctorSpecialties);
      } else if (typeof doctorSpecialties === 'object' && doctorSpecialties.name) {
        specialtyMatch = selectedSpecialties.includes(doctorSpecialties.name);
      }
    }

    // Filter by consultation type
    let consultMatch = consultationType === '';
    
    if (!consultMatch) {
      if (consultationType === 'Video Consult') {
        // Check different possible properties for video consultation availability
        consultMatch = 
          doctor.isVideoConsultAvailable === true || 
          (doctor.consultation_modes && doctor.consultation_modes.includes('VIDEO_CONSULT')) ||
          (doctor.consultationModes && doctor.consultationModes.includes('Video')) ||
          (doctor.video_consult === true) ||
          (doctor.video_consult_available === true) ||
          (doctor.clinic && doctor.clinic.online_consult === true);
      } else if (consultationType === 'In Clinic') {
        // Check different possible properties for in-clinic availability
        consultMatch = 
          doctor.isInClinicAvailable === true || 
          (doctor.consultation_modes && doctor.consultation_modes.includes('CLINIC_VISIT')) ||
          (doctor.consultationModes && doctor.consultationModes.includes('In-Person')) ||
          (doctor.in_clinic === true) ||
          (doctor.in_clinic_available === true) ||
          (doctor.clinic && doctor.clinic.in_clinic === true);
      }
    }

    // Log detailed debugging information for doctors that are filtered out
    if (!nameMatch || !specialtyMatch || !consultMatch) {
      if (!consultMatch && consultationType) {
        console.debug(`Doctor ${doctor.name} consultation filter: ${consultationType}`);
        console.debug("Doctor consultation data:", {
          isVideoConsult: doctor.isVideoConsultAvailable,
          isInClinic: doctor.isInClinicAvailable,
          consultationModes: doctor.consultation_modes || doctor.consultationModes,
          clinic: doctor.clinic
        });
      }
    }

    return nameMatch && specialtyMatch && consultMatch;
  });
};

// Sort doctors by fees (ascending) or experience (descending)
export const sortDoctors = (doctors, sortBy) => {
  if (!doctors || doctors.length === 0) {
    console.warn("No doctors to sort");
    return [];
  }

  console.log(`Sorting ${doctors.length} doctors by ${sortBy}`);
  
  const sortedDoctors = [...doctors];
  
  if (sortBy === 'fees') {
    return sortedDoctors.sort((a, b) => {
      // Parse fee from string (e.g., "₹ 500") or use numeric fee value
      const getFeeValue = (doc) => {
        if (typeof doc.fee === 'number') return doc.fee;
        if (typeof doc.fees === 'string') {
          // Extract numeric value from string like "₹ 500"
          const matches = doc.fees.match(/\d+/);
          return matches ? parseInt(matches[0], 10) : 0;
        }
        return 0;
      };
      
      const feeA = getFeeValue(a);
      const feeB = getFeeValue(b);
      
      console.log(`Comparing fees: ${a.name} (${feeA}) vs ${b.name} (${feeB})`);
      return feeA - feeB;
    });
  } else if (sortBy === 'experience') {
    return sortedDoctors.sort((a, b) => {
      // Parse experience from string (e.g., "15 Years of experience") or use numeric experience value
      const getExpValue = (doc) => {
        if (typeof doc.experience === 'number') return doc.experience;
        if (typeof doc.experience === 'string') {
          // Extract numeric value from string like "15 Years of experience"
          const matches = doc.experience.match(/\d+/);
          return matches ? parseInt(matches[0], 10) : 0;
        }
        return 0;
      };
      
      const expA = getExpValue(a);
      const expB = getExpValue(b);
      
      console.log(`Comparing experience: ${a.name} (${expA}) vs ${b.name} (${expB})`);
      return expB - expA; // Descending order for experience
    });
  }
  
  return sortedDoctors;
};

// Update URL query params based on filters
export const updateQueryParams = (searchTerm, selectedSpecialties, consultationType, sortBy) => {
  const params = new URLSearchParams();
  
  if (searchTerm) params.set('search', searchTerm);
  if (selectedSpecialties.length > 0) params.set('specialties', selectedSpecialties.join(','));
  if (consultationType) params.set('consultation', consultationType);
  if (sortBy) params.set('sort', sortBy);
  
  window.history.pushState({}, '', `?${params.toString()}`);
};

// Parse URL query params
export const parseQueryParams = () => {
  const params = new URLSearchParams(window.location.search);
  
  return {
    search: params.get('search') || '',
    specialties: params.get('specialties') ? params.get('specialties').split(',') : [],
    consultation: params.get('consultation') || '',
    sort: params.get('sort') || ''
  };
};