import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const StudentManagement = () => {
    const [students, setStudents] = useState([]);
    const [stillActive, setStillActive] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editStudentId, setEditStudentId] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const API_BASE_URL = 'https://student-api-nestjs.onrender.com/students';

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const response = await fetch(API_BASE_URL);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to fetch students');
            }

            if (result.success && Array.isArray(result.data)) {
                setStudents(result.data);
            } else {
                throw new Error('Invalid data format received');
            }
        } catch (error) {
            setError(error.message);
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };
    const deleteStudent = async (id) => {
        if (!window.confirm('Are you sure you want to delete this student?')) {
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete student');
            }

            setStudents(prev => prev.filter(student => student._id !== id));
        } catch (error) {
            setError(error.message);
            console.error('Error deleting student:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleSelect = (index) => {
        setStudents(prev =>
            prev.map((student, idx) =>
                idx === index ? { ...student, selected: !student.selected } : student
            )
        );
    };

    const filteredStudents = stillActive
        ? students.filter(student => student.isActive)
        : students;

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }
    const totalSelected = students.filter(student => student.selected).length;
    return (
        <div className="max-w-4xl mx-auto bg-white p-8">
            <h1 className="text-2xl font-semibold mb-4 text-pink-700">Total Selected Student: {totalSelected}</h1>
            <h1 className="text-2xl font-semibold mb-4 text-pink-500">Student Management</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative">
                    <span className="block sm:inline">{error}</span>
                    <button
                        className="absolute top-0 right-0 px-4 py-3"
                        onClick={() => setError(null)}
                    >
                        <span className="text-2xl">&times;</span>
                    </button>
                </div>
            )}

            <div className="mb-4 flex justify-between items-center">
                <label className="inline-flex items-center">
                    <input
                        type="checkbox"
                        checked={stillActive}
                        onChange={() => setStillActive(prev => !prev)}
                        className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="ml-2 text-pink-500">Show Only Active Students</span>
                </label>

                <button
                    onClick={() => navigate('/add-student')}
                    className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition-colors"
                >
                    Add New Student
                </button>
            </div>

            {filteredStudents.length === 0 ? (
                <p className="text-center py-4">No students found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 border border-gray-300 text-pink-500">Select</th>
                                <th className="py-2 px-4 border border-gray-300 text-pink-500">Name</th>
                                <th className="py-2 px-4 border border-gray-300 text-pink-500">Code</th>
                                <th className="py-2 px-4 border border-gray-300 text-pink-500">Status</th>
                                <th className="py-2 px-4 border border-gray-300 text-pink-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((student, index) => (
                                <tr key={student._id} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border border-gray-300 text-center">
                                        <input
                                            type="checkbox"
                                            checked={student.selected || false}
                                            onChange={() => toggleSelect(index)}
                                            className="form-checkbox h-5 w-5 text-blue-600"
                                        />
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300">
                                        <button
                                            onClick={() => navigate(`/students/${student._id}`)}
                                            className="text-blue-600 hover:underline"
                                        >
                                            {student.name}
                                        </button>
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300 text-center">
                                        {student.studentCode}
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300 text-center">
                                        <button

                                            className={`px-3 py-1 rounded-full text-sm font-medium
                                                ${student.isActive
                                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                                                } transition-colors`}
                                        >
                                            {student.isActive ? 'Active' : ' Graduated'}
                                        </button>
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300 text-center">
                                        <button
                                            onClick={() => navigate(`/edit-student/${student._id}`)}
                                            className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600 transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteStudent(student._id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default StudentManagement;