import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

function StudentList() {
    const [students, setStudents] = useState([]); // Initialize as an empty array

    useEffect(() => {
        fetch('https://student-api-nestjs.onrender.com/students')
            .then((res) => res.json())
            .then((data) => setStudents(data))
            .catch((error) => console.error("Error fetching students:", error));
    }, []);

    return (
        <div>
            {Array.isArray(students) && students.length > 0 ? (
                students.map((student) => (
                    <div key={student.id}>
                        <Link to={`/student/${student.id}`}>{student.name}</Link>
                    </div>
                ))
            ) : (
                <p>No students available.</p>
            )}
        </div>
    );
}

export default StudentList;
