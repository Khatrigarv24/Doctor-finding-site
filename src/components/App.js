import React, { useEffect, useState, useCallback } from 'react';
import { fetchDoctors } from '../services/api';
import { filterDoctors, getUniqueSpecialties, sortDoctors } from '../utils/helpers';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import DoctorList from './DoctorList';
import ThemeToggle from './ThemeToggle';
import '../styles/App.css'; // Change the path to point to /src/styles folder

const App = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialties, setSpecialties] = useState([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [consultationType, setConsultationType] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Check for user's preferred color scheme on initial load
  useEffect(() => {
    // Check local storage first
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      setDarkMode(savedTheme === 'true');
    } else {
      // Otherwise check system preference
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDarkMode);
    }
  }, []);

  // Apply theme class to document element for more comprehensive styling
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
      document.body.classList.remove('dark-mode');
    }
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Toggle theme function
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  // Fetch doctors data
  useEffect(() => {
    const getDoctors = async () => {
      try {
        setLoading(true);
        const data = await fetchDoctors();
        console.log("Fetched doctors:", data);
        
        setDoctors(data);
        setFilteredDoctors(data);
        
        // Extract and log specialties
        const extractedSpecialties = getUniqueSpecialties(data);
        console.log("Setting specialties:", extractedSpecialties);
        setSpecialties(extractedSpecialties);
        
        setLoading(false);
      } catch (error) {
        console.error("Error in App component:", error);
        setError(`Failed to fetch doctors data: ${error.message}`);
        setLoading(false);
      }
    };

    getDoctors();
  }, []);

  // Load filters from URL on initial load
  useEffect(() => {
    if (doctors.length > 0) {
      const params = parseQueryParams();
      setSearchTerm(params.search);
      setSelectedSpecialties(params.specialties);
      setConsultationType(params.consultation);
      setSortBy(params.sort);
    }
  }, [doctors]);

  // Apply filters when any filter changes
  useEffect(() => {
    if (doctors.length > 0) {
      console.log("Filtering with search term:", searchTerm);
      
      // Apply filtering with current search term
      let filtered = filterDoctors(doctors, searchTerm, selectedSpecialties, consultationType);
      
      // Apply sorting if needed
      if (sortBy) {
        filtered = sortDoctors(filtered, sortBy);
      }
      
      setFilteredDoctors(filtered);
      
      // Update URL
      updateQueryParams(searchTerm, selectedSpecialties, consultationType, sortBy);
    }
  }, [doctors, searchTerm, selectedSpecialties, consultationType, sortBy]);

  // Add these functions to your App component

  // Parse query parameters from URL
  const parseQueryParams = () => {
    const searchParams = new URLSearchParams(window.location.search);
    
    return {
      search: searchParams.get('search') || '',
      specialties: searchParams.get('specialties') ? 
        searchParams.get('specialties').split(',') : [],
      consultation: searchParams.get('consultation') || '',
      sort: searchParams.get('sort') || ''
    };
  };

  // Update URL with current filters
  const updateQueryParams = (search, specialties, consultation, sort) => {
    const searchParams = new URLSearchParams();
    
    if (search) searchParams.set('search', search);
    if (specialties && specialties.length > 0) searchParams.set('specialties', specialties.join(','));
    if (consultation) searchParams.set('consultation', consultation);
    if (sort) searchParams.set('sort', sort);
    
    // Update URL without reloading the page
    const newUrl = `${window.location.pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    window.history.replaceState(null, '', newUrl);
  };

  // Add useCallback and debounce for search term changes
  const handleSearchTermChange = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  return (
    <div className={`app ${darkMode ? 'dark-theme' : 'light-theme'}`}>
      <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <header className="app-header">
        <h1>Find the Best Doctors</h1>
        <p>Search for specialized healthcare professionals in your area</p>
      </header>
      
      <SearchBar 
        searchTerm={searchTerm} 
        setSearchTerm={handleSearchTermChange} 
        doctors={doctors} 
      />
      
      <main className="app-content">
        <aside className="filter-container">
          <FilterPanel 
            specialties={specialties}
            selectedSpecialties={selectedSpecialties}
            setSelectedSpecialties={setSelectedSpecialties}
            consultationType={consultationType}
            setConsultationType={setConsultationType}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </aside>
        
        <section className="doctors-container">
          {error ? (
            <div className="error" data-testid="error-message">{error}</div>
          ) : loading ? (
            <div className="loading" data-testid="loading-indicator">Loading...</div>
          ) : filteredDoctors.length > 0 ? (
            <DoctorList doctors={filteredDoctors} />
          ) : (
            <div className="no-doctors" data-testid="no-doctors-message">
              <h2>No doctors found</h2>
              <p>Try adjusting your search criteria or filters</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default App;