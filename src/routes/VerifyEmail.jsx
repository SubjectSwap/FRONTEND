import {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';

const VerifyEmail = () => {
  const uuid = useParams().uuid;
  const [verification, setVerification] = useState(null);
  useEffect(async () => {
    try{
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/verify-account/${uuid}`, {
      method: 'POST'
    });
    if (!res.ok) setVerification(false);
    else setVerification(true);
    }catch (err) {
      setVerification(false);
    }
  }, []);

  return (
    <div className='app-container'>
      {verification=== null? (
        <h1>Verifying...</h1>
      ) : verification ? (
        <h2>Verification Successful</h2>
      ) : (
        <h2>Verification Failed</h2>
      )}
    </div>
  );
};

export default VerifyEmail;