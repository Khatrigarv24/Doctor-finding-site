# Doctor Listing App

## Overview
The Doctor Listing App is a web application that allows users to search for doctors, filter them based on consultation type and specialties, and sort the results by fees and experience. The application fetches doctor data from a provided API and implements client-side filtering and searching functionalities.

## Features
- Autocomplete search bar for doctor names.
- Dynamic filter panel with:
  - Consultation type (single select).
  - Specialties (multi-select).
  - Sort options (by fees and experience).
- Doctor list rendered based on the applied filters and search criteria.
- URL query parameters to retain applied filters when navigating back.

## Technologies Used
- React
- CSS
- Fetch API

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd doctor-listing-app
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the application:
   ```
   npm start
   ```
5. Open your browser and go to `http://localhost:3000` to view the application.

## Usage
- Use the autocomplete search bar at the top to find doctors by name.
- Apply filters from the filter panel to narrow down the search results.
- Sort the doctor list based on your preferences.
- The applied filters will be reflected in the URL, allowing for easy navigation and state retention.

## API
The application fetches doctor data from the following API:
```
https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json
```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.