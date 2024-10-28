
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StudentManagement from './components/StudentManagement';
import StudentDetail from './components/StudentDetail';
import AddStudent from './components/AddStudent';
import EditStudent from './components/EditStudent';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StudentManagement />} />
        <Route path="/students/:id" element={<StudentDetail />} />
        <Route path="/add-student" element={<AddStudent />} />
        <Route path="/edit-student/:id" element={<EditStudent />} />
      </Routes>
    </Router>
  );
};

export default App;