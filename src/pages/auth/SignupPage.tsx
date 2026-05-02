import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import Button from '../../ui/buttons/Button';
import Input from '../../ui/Input';
import OAuth from './components/OAuth';
import ContinueAsGuest from './components/ContinueAsGuest';

interface SignupFormData {
    email: string;
    password: string;
    confirmPassword: string;
}

export default function SignupPage() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<SignupFormData>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/');
        }
    }, [navigate]);

    async function onSubmit(data: SignupFormData) {
        setIsLoading(true);
        setErrorMessage('');

        try {
            const response = await fetch('http://localhost:3001/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Signup failed');
            }

            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));

            navigate('/');
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'An error occurred during signup');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-8">
                <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
                    Create Account
                </h1>
                <p className="text-center text-gray-600 mb-8">
                    Sign up to get started with FreeCVMaker
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

                    <Input
                        label="Confirm Password"
                        type="password"
                        id="confirmPassword"
                        placeholder="••••••••"
                        {...register('confirmPassword', {
                            required: 'Required',
                            validate: (value) => value === watch('password') || 'Passwords do not match'
                        })}
                        error={errors.confirmPassword?.message}
                        disabled={isLoading}
                    />

                    <Button
                        variant="solid"
                        color="blue"
                        type="submit"
                        fullWidth
                        disabled={isLoading}
                        loading={isLoading}
                    >
                        Sign Up
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                            Sign In
                        </Link>
                    </p>
                </div>

                <ContinueAsGuest />

                <OAuth />
            </div>
        </div>
    );
}

