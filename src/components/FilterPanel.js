import React from 'react';
import '../styles/FilterPanel.css';

const FilterPanel = ({ 
  specialties,
  selectedSpecialties,
  setSelectedSpecialties,
  consultationType,
  setConsultationType,
  sortBy,
  setSortBy
}) => {
  // Handle specialty filter change
  const handleSpecialtyChange = (specialty) => {
    // If specialty is an object with a name property, use that
    const specialtyValue = typeof specialty === 'object' && specialty.name ? 
      specialty.name : specialty;
      
    if (selectedSpecialties.includes(specialtyValue)) {
      setSelectedSpecialties(selectedSpecialties.filter(s => s !== specialtyValue));
    } else {
      setSelectedSpecialties([...selectedSpecialties, specialtyValue]);
    }
  };

  // Handle consultation type change
  const handleConsultationChange = (type) => {
    // If the same type is clicked again, clear the selection
    setConsultationType(type === consultationType ? '' : type);
  };

  // Handle sort change
  const handleSortChange = (sort) => {
    // If the same sort option is clicked again, clear the selection
    setSortBy(sort === sortBy ? '' : sort);
  };

  // Clear all filters
  const clearAllFilters = () => {
    console.log("Clearing all filters");
    setSelectedSpecialties([]);
    setConsultationType('');
    setSortBy('');
  };

  // Clear specialty filters
  const clearSpecialtyFilters = () => {
    console.log("Clearing specialty filters");
    setSelectedSpecialties([]);
  };

  // Clear consultation filter
  const clearConsultationFilter = () => {
    console.log("Clearing consultation filter");
    setConsultationType('');
  };

  // Clear sort filter
  const clearSortFilter = () => {
    console.log("Clearing sort filter");
    setSortBy('');
  };

  return (
    <div className="filter-panel" data-testid="filter-panel">
      <div className="filter-section">
        <h3 data-testid="filter-header-speciality">Speciality</h3>
        <div className="filter-options">
          {Array.isArray(specialties) && specialties.length > 0 ? (
            specialties.map((specialty, index) => {
              // Get specialty name if it's an object, otherwise use specialty as is
              const specialtyName = typeof specialty === 'object' && specialty.name ? 
                specialty.name : specialty;
                
              // Create a valid test ID by replacing non-alphanumeric characters
              const testId = typeof specialtyName === 'string' ? 
                `filter-specialty-${specialtyName.replace(/[^a-zA-Z0-9]/g, '-')}` :
                `filter-specialty-${index}`;
                
              return (
                <label key={`specialty-${index}`} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedSpecialties.includes(specialtyName)}
                    onChange={() => handleSpecialtyChange(specialty)}
                    data-testid={testId}
                  />
                  {specialtyName}
                </label>
              );
            })
          ) : (
            <div>No specialties available</div>
          )}
        </div>
        {selectedSpecialties.length > 0 && (
          <button 
            onClick={clearSpecialtyFilters} 
            className="clear-filter-btn"
            data-testid="clear-specialty-filters"
          >
            Clear specialty filters
          </button>
        )}
      </div>

      <div className="filter-section">
        <h3 data-testid="filter-header-moc">Consultation Mode</h3>
        <div className="filter-options">
          <label className="radio-label">
            <input
              type="radio"
              checked={consultationType === 'Video Consult'}
              onChange={() => handleConsultationChange('Video Consult')}
              data-testid="filter-video-consult"
            />
            Video Consult
          </label>
          <label className="radio-label">
            <input
              type="radio"
              checked={consultationType === 'In Clinic'}
              onChange={() => handleConsultationChange('In Clinic')}
              data-testid="filter-in-clinic"
            />
            In Clinic
          </label>
        </div>
        {consultationType && (
          <button 
            onClick={clearConsultationFilter} 
            className="clear-filter-btn"
            data-testid="clear-consultation-filter"
          >
            Clear consultation filter
          </button>
        )}
      </div>

      <div className="filter-section">
        <h3 data-testid="filter-header-sort">Sort</h3>
        <div className="filter-options">
          <label className="radio-label">
            <input
              type="radio"
              checked={sortBy === 'fees'}
              onChange={() => handleSortChange('fees')}
              data-testid="sort-fees"
            />
            Fees (Low to High)
          </label>
          <label className="radio-label">
            <input
              type="radio"
              checked={sortBy === 'experience'}
              onChange={() => handleSortChange('experience')}
              data-testid="sort-experience"
            />
            Experience (High to Low)
          </label>
        </div>
        {sortBy && (
          <button 
            onClick={clearSortFilter} 
            className="clear-filter-btn"
            data-testid="clear-sort-filter"
          >
            Clear sorting
          </button>
        )}
      </div>
      
      {/* Moved Clear all filters button to the end */}
      {(selectedSpecialties.length > 0 || consultationType || sortBy) && (
        <div className="filter-clear">
          <button 
            onClick={clearAllFilters} 
            className="clear-all-btn"
            data-testid="clear-all-filters"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;