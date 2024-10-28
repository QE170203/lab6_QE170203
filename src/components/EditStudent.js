import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditStudent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        studentCode: '',
        isActive: true
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchStudent();
    }, [id]);

    const fetchStudent = async () => {
        setLoading(true);
        try {
            const response = await fetch(`https://student-api-nestjs.onrender.com/students/${id}`);
            const result = await response.json();

            console.log('Fetched student data:', result); // Debug log

            if (!response.ok) {
                throw new Error(result.message || 'Failed to fetch student');
            }

            if (result.success && result.data) {
                const studentData = result.data;
                const newFormData = {
                    name: studentData.name,
                    studentCode: studentData.studentCode,
                    isActive: studentData.isActive
                };
                console.log('Setting form data:', newFormData); // Debug log
                setFormData(newFormData);
            } else {
                throw new Error('Invalid data format received');
            }
        } catch (error) {
            setError(error.message);
            console.error('Error fetching student:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        console.log('Form field changed:', name, newValue); // Debug log
        setFormData(prev => {
            const newData = {
                ...prev,
                [name]: newValue
            };
            console.log('Updated form data:', newData); // Debug log
            return newData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Create the update payload
        const updatePayload = {
            name: formData.name,
            studentCode: formData.studentCode,
            isActive: formData.isActive
        };

        console.log('Sending update with payload:', updatePayload); // Debug log

        try {
            const response = await fetch(`https://student-api-nestjs.onrender.com/students/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(updatePayload)
            });

            const responseData = await response.json();
            console.log('Server response:', responseData); // Debug log

            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to update student');
            }

            // Check if the update was successful
            if (responseData.success) {
                console.log('Update successful:', responseData.data);
                navigate('/');
            } else {
                throw new Error('Update failed: ' + (responseData.message || 'Unknown error'));
            }
        } catch (err) {
            console.error('Update error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/');
    };

    if (loading && !formData.name) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 shadow-md rounded-lg">
            <h1 className="text-2xl font-semibold mb-6 text-pink-500">Edit Student</h1>

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

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-pink-700 text-sm font-bold mb-2">
                        Name
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-1"
                            required
                        />
                    </label>
                </div>

                <div>
                    <label className="block text-pink-700 text-sm font-bold mb-2">
                        Student Code
                        <input
                            type="text"
                            name="studentCode"
                            value={formData.studentCode}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-1"
                            required
                        />
                    </label>

                </div>

                <div>
                    <label className="block text-pink-700 text-sm font-bold mb-2">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        Active Status
                    </label>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Updating...' : 'Update Student'}
                    </button>

                    <button
                        type="button"
                        onClick={handleCancel}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditStudent;