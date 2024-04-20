// AppRouter.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SearchPreRegisteredStudents from './SearchPreRegisteredStudents';
import ViewStudentDetails from './ViewStudentDetails';
import SearchFinalRegisteredStudents from './SearchFinalRegisteredStudents';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' exact element={<SearchPreRegisteredStudents/>} />
        <Route path='/view/:id/:sessionYear/:session' element={<ViewStudentDetails/>} />
        <Route path='/search-final' element={<SearchFinalRegisteredStudents/>} />
        {/* Add more routes for other pages if needed */}
      </Routes>
    </Router>
  );
};

export default AppRouter;
