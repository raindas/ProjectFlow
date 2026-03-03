import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const Verify = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    useEffect(() => {
        if (token) {
            localStorage.setItem('pf_token', token);

            // We can't see the email inside the token easily on frontend 
            // without a library, but our /verify API returns it!
            fetch(`${import.meta.env.VITE_BASE_BACKEND_URL}/api/v1/auth/verify?token=${token}`)
                .then(res => res.json())
                .then(data => {
                    localStorage.setItem('pf_user_email', data.email);
                    navigate('/');
                });
        }
    }, [token, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-4"></div>
            <p className="text-gray-600 font-medium">Verifying your magic link...</p>
        </div>
    );
};

export default Verify;