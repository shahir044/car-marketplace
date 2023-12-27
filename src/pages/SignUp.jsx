import React from 'react';
import {useState} from "react";
import {toast} from "react-toastify";
import {Link, useNavigate} from "react-router-dom";
import {getAuth, createUserWithEmailAndPassword,updateProfile} from 'firebase/auth';
import {db} from "../firebase.config";
import {doc, setDoc, serverTimestamp} from 'firebase/firestore';
import {ReactComponent as ArrowRightIcon} from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import OAuth from "../components/OAuth";

function SignUp(props) {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        emp_no: '',
        email: '',
        password: '',
    });
    const{name,emp_no, email,password} = formData;
    const onChange = (e) => {
        setFormData((prevState)=>({
            ...prevState,
            [e.target.id]:e.target.value,
        }))
    }

    const checkNull = () => {
      if(name===null || name==="" || email===null || email==="" || password===null || password==="" || emp_no==="" || emp_no===null){
          toast.warning('Please fill in all the fields');
          return false;
      }else{
          return true;
      }
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        if(checkNull()){
            try {
                const auth = getAuth();
                const userCredential = await createUserWithEmailAndPassword(auth,email,password);
                const user = userCredential.user;

                updateProfile(auth.currentUser,{
                    displayName: name,
                });

                const formDataCopy = {...formData};
                delete formDataCopy.password;
                formDataCopy.timestamp = serverTimestamp();

                await setDoc(doc(db,'users',user.uid),formDataCopy);

                navigate('/');
            }catch (error) {
                toast.error(error.toString())
            }
        }
    }

    return (
        <>
            <div className="pageContainer">
                <header>
                    <p className="pageHeader">Sign Up Right Away!</p>
                </header>

                <main>
                    <form onSubmit={onSubmit}>
                        <input
                            type="text"
                            className="nameInput"
                            placeholder="Full Name"
                            id='name'
                            value={name}
                            onChange={onChange}/>
                        <input
                            type="text"
                            className="nameInput"
                            placeholder="Employee Number"
                            id='emp_no'
                            value={emp_no}
                            onChange={onChange}/>
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

                        <div className="signUpBar">
                            <p className="signUpText">
                                Sign Up
                            </p>
                            <button className="signUpButton">
                                <ArrowRightIcon fill="#ffffff" width='34px' height='34px'/>
                            </button>
                        </div>
                    </form>

                    <Link to='/sign-in' className='registerLink'>
                        Already have an account? Sign in here
                    </Link>

                    <OAuth/>
                </main>
            </div>
        </>
    );
}

export default SignUp;