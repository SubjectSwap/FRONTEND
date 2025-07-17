import {useState} from 'react';
import { useParams } from 'react-router-dom';

const VerifyEmail = ({params}) => {
  const uuid = useParams().uuid;
  const [verification, setVerification] = useState(null);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/verify-account/${uuid}`, {
      method: 'POST'
    })
      .then((res) => {
        if (!res.ok) setVerification(false);
        return res.json();
      })
      .then((data) => {
        setVerification(true);
      })
      .catch((err) => {
        console.error(err);
        setVerification(false);
      });
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