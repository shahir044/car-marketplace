import React, {useState} from 'react';
import {toast} from "react-toastify";
import {Link} from "react-router-dom";
import {ReactComponent as ArrowRightIcon} from "../assets/svg/keyboardArrowRightIcon.svg";
import {getAuth,sendPasswordResetEmail} from "firebase/auth";


function ForgotPassword(props) {
    const [email, setEmail] = useState('');

    const onChange = (e) => {
        console.log(e.target.value)
        setEmail(e.target.value);
    }
    
    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const auth = getAuth();
            await sendPasswordResetEmail(auth,email);
            toast.success('Password Reset Link Sent')
        }catch (error){
            console.log(error);
        }
    }

    return (
        <div className="pageContainer">
            <header>
                <p className='pageHeader'>Forgot Password</p>
            </header>

            <main>
                <form onSubmit={onSubmit}>
                    <input className='emailInput' type="email" placeholder='Email' value={email} name="email" id="email" onChange={onChange}/>
                    <Link className="forgotPasswordLink" to='/sign-in'>Sign In</Link>

                    <div className="signInBar">
                        <div className="signInText">Send Reset Link</div>
                        <button className="signInButton">
                            <ArrowRightIcon fill='#ffffff' width='34px' height='34px'/>
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default ForgotPassword;