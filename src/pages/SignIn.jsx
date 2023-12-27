import React from 'react';
import {useState} from "react";
import {toast} from "react-toastify";
import {Link, useNavigate} from "react-router-dom";
import {getAuth,signInWithEmailAndPassword} from "firebase/auth";
import {ReactComponent as ArrowRightIcon} from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import OAuth from "../components/OAuth";
import Spinner from "../components/Spinner";

function SignIn() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const{email,password} = formData;
    const navigate = useNavigate();
    const onChange = (e) => {
      setFormData((prevState)=>({
          ...prevState,
          [e.target.id]:e.target.value,
      }))
    }

    const onSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      try{
          const auth = getAuth();
          const userCredential = await signInWithEmailAndPassword(auth,email,password);
          if(userCredential.user){
              navigate('/');
          }
      }catch (error) {
          toast.error('Invalid-Credentials');
      }
      setLoading(false);
    }

    if (loading){
        return <Spinner/>
    }
    
    return (
        <>
            <div className="pageContainer">
                <header>
                    <p className="pageHeader">Welcome Back!</p>
                </header>
                <main>
                    <form onSubmit={onSubmit}>
                        <input
                            type="email"
                            className="emailInput"
                            placeholder="Email"
                            id='email'
                            value={email}
                            onChange={onChange}/>
                        <div className="passwordInputDiv">
                            <input type={showPassword ? 'text':'password'}
                                className='passwordInput'
                                   placeholder='Password'
                                   id='password'
                                   value={password}
                                   onChange={onChange}
                            />
                            <img src={visibilityIcon} alt="show"
                            className="showPassword"
                            onClick={()=>setShowPassword((prevState)=>!prevState)}/>
                        </div>

                        <Link to='/forgot-password'
                              className='forgotPasswordLink'>
                            Forgot Password
                        </Link>

                        <div className="signInBar">
                            <p className="signInText">
                                Sign In
                            </p>
                            <button className="signInButton">
                                <ArrowRightIcon fill="#ffffff" width='34px' height='34px'/>
                            </button>
                        </div>
                    </form>
                    <Link to='/sign-up' className='registerLink'>
                        Don't have an account? Sign up here.
                    </Link>

                    <OAuth/>
                </main>
            </div>
        </>
    );
}

export default SignIn;