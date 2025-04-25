import React from 'react';
import '../styles/DoctorCard.css';

const DoctorCard = ({ doctor }) => {
  // Get specialties from either speciality or specialities property
  const specialtyArray = doctor.speciality || doctor.specialities || [];
  
  // Format specialties for display
  let specialties = 'Specialty not specified';
  
  if (Array.isArray(specialtyArray)) {
    // Map any specialty objects to their names
    const formattedSpecialties = specialtyArray.map(spec => {
      if (typeof spec === 'object' && spec.name) {
        return spec.name;
      }
      return spec;
    });
    specialties = formattedSpecialties.join(', ');
  } else if (typeof specialtyArray === 'string') {
    specialties = specialtyArray;
  } else if (typeof specialtyArray === 'object' && specialtyArray.name) {
    specialties = specialtyArray.name;
  }
  
  // Check for video consultation availability
  const hasVideoConsult = 
    doctor.isVideoConsultAvailable === true || 
    (doctor.consultation_modes && doctor.consultation_modes.includes('VIDEO_CONSULT')) ||
    (doctor.consultationModes && doctor.consultationModes.includes('Video')) ||
    (doctor.video_consult === true) ||
    (doctor.video_consult_available === true) ||
    (doctor.clinic && doctor.clinic.online_consult === true);
  
  // Check for in-clinic availability
  const hasInClinic = 
    doctor.isInClinicAvailable === true || 
    (doctor.consultation_modes && doctor.consultation_modes.includes('CLINIC_VISIT')) ||
    (doctor.consultationModes && doctor.consultationModes.includes('In-Person')) ||
    (doctor.in_clinic === true) ||
    (doctor.in_clinic_available === true) ||
    (doctor.clinic && doctor.clinic.in_clinic === true);
    
  return (
    <div className="doctor-card" data-testid="doctor-card">
      <div className="doctor-image">
        <img src={doctor.image || doctor.photo || 'https://via.placeholder.com/100'} alt={doctor.name} />
      </div>
      <div className="doctor-info">
        <h2 data-testid="doctor-name">{doctor.name || 'Unknown Doctor'}</h2>
        <p data-testid="doctor-specialty">{specialties}</p>
        <p data-testid="doctor-experience">{doctor.experience || '0 years'}</p>
        <p data-testid="doctor-fee">{doctor.fees || doctor.fee || 'Fees not specified'}</p>
        <div className="doctor-consult-info">
          {hasVideoConsult && <span className="video-consult">Video Consult Available</span>}
          {hasInClinic && <span className="in-clinic">In Clinic Available</span>}
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;