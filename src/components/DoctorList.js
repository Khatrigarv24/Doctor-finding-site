import React from 'react';
import DoctorCard from './DoctorCard';
import '../styles/DoctorList.css';

const DoctorList = ({ doctors }) => {
  if (doctors.length === 0) {
    return <div className="no-doctors">No doctors found matching your criteria</div>;
  }

  return (
    <div className="doctor-list">
      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
};

export default DoctorList;