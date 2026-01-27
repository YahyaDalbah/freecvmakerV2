import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import Button from '../../ui/buttons/Button';
import Input from '../../ui/Input';
import OAuth from './components/OAuth';
import ContinueAsGuest from './components/ContinueAsGuest';

interface LoginFormData {
    email: string;
    password: string;
}

export default function LoginPage() {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/');
        }
    }, [navigate]);

    async function onSubmit(data: LoginFormData) {
        setIsLoading(true);
        setErrorMessage('');

        try {
            const response = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Login failed');
            }

            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));

            navigate('/');
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'An error occurred during login');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-8">
                <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
                    Welcome Back
                </h1>
                <p className="text-center text-gray-600 mb-8">
                    Sign in to continue to FreeCVMaker
                </p>

                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {errorMessage && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {errorMessage}
                        </div>
                    )}

                    <Input
                        label="Email Address"
                        type="email"
                        id="email"
                        placeholder="you@example.com"
                        {...register('email', {
                            required: 'Required',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address'
                            }
                        })}
                        error={errors.email?.message}
                        disabled={isLoading}
                    />

                    <Input
                        label="Password"
                        type="password"
                        id="password"
                        placeholder="••••••••"
                        {...register('password', {
                            required: 'Required'
                        })}
                        error={errors.password?.message}
                        disabled={isLoading}
                    />

                    <div className="flex items-center justify-end">
                        <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                            Forgot password?
                        </a>
                    </div>

                    <Button
                        variant="solid"
                        color="blue"
                        type="submit"
                        fullWidth
                        disabled={isLoading}
                        loading={isLoading}
                    >
                        Sign In
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-semibold">
                            Sign Up
                        </Link>
                    </p>
                </div>

                <ContinueAsGuest />

                <OAuth />
            </div>
        </div>
    );
}

