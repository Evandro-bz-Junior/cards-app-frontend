import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_URL } from '../api.js';

export default function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false); // novo estado para erro/sucesso

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/auth/register`, formData);

            setMessage(response.data.message);
            setIsError(false); // sucesso
        } catch (err) {
            setMessage(err.response?.data?.message || 'Erro ao registrar.');
            setIsError(true); // erro
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center   bg-gradient-to-br from-[#72C6EF] to-[#004E8F] bg-[length:400%_400%] animate-gradient-normal">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80 rounded-xl">
                <h2 className="text-2xl font-bold mb-4 text-center">Registrar</h2>
                <input
                    type="text"
                    name="username"
                    placeholder="Usuário"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mb-2"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mb-2"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Senha"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mb-4"
                />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    Registrar
                </button>
                <div className=' w-full text-center my-2'>
                    <span>Possui conta? <Link to="/"  className='text-blue-400'>Faça login</Link></span>
                </div>


                {message && (
                    <p
                        className={`mt-4 text-center   text-lg ${isError ? 'text-red-800' : 'text-green-800'
                            }`}
                    >
                        {message}
                    </p>
                )}
            </form>
        </div>
    );
}
