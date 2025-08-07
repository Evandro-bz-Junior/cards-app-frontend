import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate  } from 'react-router-dom';
 


export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/auth/login', formData);
            setMessage(response.data.message);
            setIsError(false);

            // Armazena o token no localStorage para manter a sessão
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');

            // Aqui você pode redirecionar o usuário para a área logada ou atualizar o estado global
        } catch (err) {
            setMessage(err.response?.data?.message || 'Erro ao fazer login.');
            setIsError(true);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center  bg-gradient-to-br from-[#BF5AE0] to-[#A811DA] bg-[length:400%_400%] animate-gradient-normal">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
                <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
                <input
                    type="text"
                    name="username"
                    placeholder="Usuário"
                    value={formData.username}
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
                    Entrar
                </button>
                 <div className=' w-full text-center my-2'>
                    <span>Não possui conta? <Link to="/register"  className='text-blue-400'>registre-se</Link></span>
                </div>
                {message && (
                    <p className={`mt-4 text-center text-sm ${isError ? 'text-red-500' : 'text-green-500'}`}>
                        {message}
                    </p>
                )}
            </form>
        </div>
    );
}
