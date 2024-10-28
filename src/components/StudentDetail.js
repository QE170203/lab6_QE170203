import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const StudentDetail = () => {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudentDetail = async () => {
            setLoading(true);
            try {
                const response = await fetch(`https://student-api-nestjs.onrender.com/students/${id}`);
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || 'Failed to fetch student details');
                }

                setStudent(result.data || result);
                setError(null);
            } catch (error) {
                setError(error.message);
                console.error('Error fetching student details:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchStudentDetail();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto mt-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                    Go Back
                </button>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="max-w-2xl mx-auto mt-8">
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Notice:</strong>
                    <span className="block sm:inline"> Student not found</span>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto mt-8 bg-white p-8 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-pink-500">Student Details</h1>
                <button
                    onClick={() => navigate(-1)}
                    className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                >
                    Back to List
                </button>
            </div>

            <div className="grid gap-4">
                <div className="border-b pb-4">
                    <h2 className="text-pink-600 text-sm">Student Name</h2>
                    <p className="text-lg font-medium">{student.name}</p>
                </div>

                <div className="border-b pb-4">
                    <h2 className="text-pink-600 text-sm">Student Code</h2>
                    <p className="text-lg font-medium">{student.studentCode}</p>
                </div>

                <div className="border-b pb-4">
                    <h2 className="text-pink-600 text-sm">Status</h2>
                    <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium
                            ${student.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                    >
                        {student.isActive ? 'Active' : ' Graduated'}
                    </span>
                </div>

                <div className="flex gap-4 mt-6">
                    <button
                        onClick={() => navigate(`/edit-student/${student._id}`)}
                        className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600 transition-colors"
                    >
                        Edit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentDetail;