import {useState} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CircularProgress from '../../components/CircularProgress';

export default function ChatHeader() {
    const {uuid} = useParams();
    const [name, setName] = useState('');
    const [to, setTo] = useState(uuid);
    const [profilePic, setProfilePic] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    async function fetchExtraData() {
        try{
            await fetch(import.meta.env.VITE_BACKEND_URL + '/chat/get_user_info', {
                method: 'POST',
                credentials: 'include',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ uuid }),
            })
            .then((response) => response.json())
            .then((data) => {
                setName(data.name);
                setProfilePic(data.profilePic);
                setTo(uuid);
            });
        } catch(e) {
            await fetchExtraData();
        }finally {
            setLoading(false);
        }
    }
    useState(async () =>{
        await fetchExtraData();
    })

    if (!uuid) return <Navigate to="/chat" replace={true} />
    if (loading) return (
        <div style={{
            background: '#2b0085ff', color: '#fff', padding: 12, fontWeight: 600, fontSize: 18, justifyContent: 'left', display: 'flex', position: 'sticky', top: -1, zIndex: 300, paddingBottom: 12
          }}>
            <CircularProgress />
          </div>
    );
  return (
    <div style={{
      borderRadius: 14,
            border: '4px solid #2b0085ff', color: 'black', padding: 4, fontWeight: 600, fontSize: 18, justifyContent: 'left', display: 'flex', position: 'sticky', marginTop: '1rem', zIndex: 300
          }}>
            <button onClick={() => navigate(-1)} style={{
              background: 'none', border: 'none', color: '#000', fontSize: 18, marginRight: 12, cursor: 'pointer'
            }}>&larr;</button>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8
            }}>
              <img
                src={profilePic || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name)}
                alt={name}
                style={{ width: 36, height: 36, borderRadius: '50%', marginRight: 8, verticalAlign: 'middle' }}
              />
              {name}
            </div>
          </div>
  )
}
