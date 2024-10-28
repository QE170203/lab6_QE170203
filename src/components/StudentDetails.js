import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

function StudentDetails() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Fetch student details by ID
    fetch(`https://student-api-nestjs.onrender.com/students/${id}`)
      .then((res) => res.json())
      .then((data) => setStudent(data));
  }, [id]);

  function handleAddStudent(newStudent) {
    fetch('https://student-api-nestjs.onrender.com/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStudent),
    })
      .then((res) => res.json())
      .then((student) => setStudents((prev) => [...prev, student]));
  }

  function handleUpdateStudent(updatedStudent) {
    fetch(`https://student-api-nestjs.onrender.com/students/${updatedStudent.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedStudent),
    })
      .then((res) => res.json())
      .then((student) => {
        setStudent(student);
        setStudents((prev) =>
          prev.map((s) => (s.id === student.id ? student : s))
        );
      });
  }

  function handleDeleteStudent(id) {
    fetch(`https://student-api-nestjs.onrender.com/students/${id}`, { method: 'DELETE' })
      .then(() => setStudents((prev) => prev.filter((s) => s.id !== id)));
  }

  return student ? (
    <div>
      <h2>{student.name}</h2>
      <p>Student Code: {student.studentCode}</p>
      <p>Active: {student.isActive ? 'Yes' : 'No'}</p>

      {/* Button to add a new student for demonstration purposes */}
      <button
        onClick={() =>
          handleAddStudent({
            name: 'New Student',
            studentCode: 'NEW123',
            isActive: true,
          })
        }
      >
        Add New Student
      </button>

      {/* Button to update student information */}
      <button
        onClick={() =>
          handleUpdateStudent({
            id: student.id,
            name: 'Updated Student',
            studentCode: student.studentCode,
            isActive: !student.isActive, // Toggle active status for example
          })
        }
      >
        Update Student
      </button>

      {/* Button to delete this student */}
      <button onClick={() => handleDeleteStudent(student.id)}>
        Delete Student
      </button>

      {/* Displaying added students for verification */}
      <div>
        <h3>Added Students:</h3>
        {students.map((s) => (
          <p key={s.id}>{s.name}</p>
        ))}
      </div>
    </div>
  ) : (
    <p>Loading...</p>
  );
}

export default StudentDetails;
