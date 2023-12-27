import {useLocation, useNavigate} from "react-router-dom";
import {getAuth,signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import {doc, setDoc, getDoc, serverTimestamp} from "firebase/firestore";
import {db} from "../firebase.config";
import {toast} from "react-toastify";
import googleIcon from '../assets/svg/googleIcon.svg';
const OAuth = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const onGoogleClick = async () => {
        try {
            const auth = getAuth();
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth,provider);
            console.log(result);
            const user = result.user;

            const docRef = doc(db,'users',user.uid);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()){
                await setDoc(doc(db,'users',user.uid),{
                    name: user.displayName,
                    email: user.email,
                    emp_no:'',
                    timestamp: serverTimestamp()
                });
            }
            // If user exists in db then log him in
            navigate('/');
        }catch (error){
            toast.error('Could not authorize! Already have an account with this Gmail');
        }
    }
    
      return(
          <div className="socialLogin">
              <button className='socialIconDiv' onClick={onGoogleClick}>
                  <img className='socialIconImg' src={googleIcon} alt='google...'/>
              </button>
              <p>Sign {location.pathname === 'sign-in' ? 'up' : 'in'} with Google</p>
          </div>
      )
}

export default OAuth;