import React, {useEffect, useRef, useState} from 'react';
import {Link} from "react-router-dom";
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg';
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg'
import {useAuthStatus} from "../hooks/useAuthStatus";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import Slider from '../components/Slider';
function Explore(props) {
    const {loggedIn} = useAuthStatus();
    const [name, setName] = useState('');
    const auth = getAuth();
    const isMounted = useRef(true);

    useEffect(() => {
        if (isMounted){
            onAuthStateChanged(auth,(user)=>{
                if (user){
                    setName(user.displayName);
                }
            })
        }
        return () => {
            isMounted.current=false;
        };
        // eslint-disable-next-line
    }, [isMounted]);

/*    useEffect(() => {
        if(loggedIn){
            setName(auth.currentUser.displayName);
        }else {
            setName(null);
        }
    }, [auth,loggedIn]);
    console.log(auth.currentUser);*/

    return (
        <div className='pageContainer'>
            <header>
                <p className='pageHeader'> {loggedIn ? `Welcome ${name}` : 'Explore'}</p>
            </header>

            <Slider/>

            <main>
                <p className="exploreCategoryHeading">Categories</p>
                <div className="exploreCategories">
                    <Link to='/category/rent'>
                        <img src={rentCategoryImage} alt="rent" className="exploreCategoryImg"/>
                        <p className="exploreCategoryName">Cars for rent</p>
                    </Link>
                    <Link to='/category/sale'>
                        <img src={sellCategoryImage} alt="sale" className="exploreCategoryImg"/>
                        <p className='exploreCategoryName'>Cars for sale</p>
                    </Link>
                </div>
            </main>
        </div>
    );
}

export default Explore;