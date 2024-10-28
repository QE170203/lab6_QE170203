import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddStudent = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        studentCode: '',
        isActive: true
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('https://student-api-nestjs.onrender.com/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to add student');
            }

            navigate('/'); // Navigate back to student list
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 shadow-md rounded-lg">
            <h1 className="text-2xl font-semibold mb-6 text-pink-500">Add New Student</h1>

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
                        {loading ? 'Adding...' : 'Add Student'}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddStudent;