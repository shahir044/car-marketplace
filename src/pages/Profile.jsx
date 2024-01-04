import React, {useState} from 'react';
import {getAuth, updateProfile} from "firebase/auth";
import { 
    updateDoc,
    collection,
    getDocs,
    query,
    orderBy,
    where,
    deleteDoc,
} from 'firebase/firestore';
import {Link, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {doc, getDoc} from 'firebase/firestore';
import {db} from '../firebase.config';
import {toast} from "react-toastify";
import Spinner from "../components/Spinner";
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";
import ListingItem from '../components/ListingItem';
function Profile() {
    const auth = getAuth();
    const navigate = useNavigate();

    const [listings, setListings] = useState(null);
    const [changeDetails, setChangeDetails] = useState(false);
    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
    });
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const fetchUserData = async () => {
            try {
                const userRef = doc(db,'users',auth.currentUser.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()){
                    const userData = userSnap.data();
                    setFormData(userData);
                    setLoading(false);
                }else{
                    console.log("No user found");
                }
            }catch (e){
                console.log(e);
            }
        }
        fetchUserData();
        // console.log(formData);

        // eslint-disable-next-line
    },[])

    const {name,email,emp_no} = formData;

    useEffect(() => {
        const fetchUserListings = async () => {
            const listingsRef = collection(db,'listings');
            const q = query(listingsRef, where('userRef','==', auth.currentUser.uid), orderBy('timestamp','desc'));
            const querySnap = await getDocs(q);

            let listings = [];

            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data(),
                })
            });

            setListings(listings);
            setLoading(false);
        }
        
        fetchUserListings();
    }, [auth.currentUser.uid]);

    const onLogout = () => {
      auth.signOut();
      navigate('/sign-in');
    }

    const onSubmit = async () => {
      try {
          //update profile name in fbase
          setLoading(true);
          const currentUser = auth.currentUser;
          if (auth.currentUser.displayName !== name){
              await updateProfile(currentUser,{
                  displayName: name,
              })
          }
          //update in firestore
          const userRef = doc(db,"users",currentUser.uid);
          await updateDoc(userRef,{
              name: name,
              emp_no: emp_no
          });
          setLoading(false);
          toast.success("Profile Updated Successfully");
      }catch (error) {
          toast.error(error);
      }
    }

    const onChange = (e) => {
      setFormData((prevState)=>({
          ...prevState,
          [e.target.id]: e.target.value,
      }))
    }

    const onEditListing = async (listingId) => {
        navigate(`/edit-listing/${listingId}`);
    }

    const onDelete = async (listingId) => {
        if (window.confirm("Are yousure you want to delete?")) {
            await deleteDoc(doc(db,'listings',listingId));

            const updatedListings = listings.filter((list) => (
                list.id !== listingId
            ))
            setListings(updatedListings);
            toast.success('Successfully deleted');
        }
    }

    return (
        <div className="profile">
            <header className="profileHeader">
                <p className="pageHeader">
                    My Profile
                </p>
                <button type="button" className="logOut" onClick={onLogout}>
                    Logout
                </button>
            </header>
            <main>
                <div className='profileDetailsHeader'>
                    <p className="profileDetailsText">Personal Details</p>
                    <p className='changePersonalDetails' onClick={()=>{
                        changeDetails && onSubmit();
                        setChangeDetails((prevState)=>!prevState)
                    }}>
                        {changeDetails ? 'Done':'Change'}
                    </p>
                </div>

                {loading ? <Spinner/> :
                    <div className="profileCard">
                        <form>
                            <label>Full Name:</label>
                            <input type="text" name="name" id="name"
                                   className={changeDetails ? 'profileNameActive':'profileName'}
                                   disabled={!changeDetails}
                                   value={name} onChange={onChange}
                            />

                            <label>Employee No:</label>
                            <input type="number" name="emp_no" id="emp_no"
                                   className={changeDetails ? 'profileNameActive':'profileName'}
                                   disabled={!changeDetails}
                                   value={emp_no} onChange={onChange}
                            />

                            <label>Email:</label>
                            <input type="email" name="email" id="email"
                                   className={changeDetails ? 'profileEmailActive':'profileEmail'}
                                   disabled={!changeDetails}
                                   value={email} onChange={onChange}
                            />
                        </form>
                    </div>
                }
                <Link to='/create-listing' className='createListing'>
                    <img src={homeIcon} alt="home"/>
                    <p>Sell or Rent your Car</p>
                    <img src={arrowRight} alt="right"/>
                </Link>

                {!loading && listings !== null && (
                    <>
                        <p className='listingText'>Your Listings</p>
                        <ul className='listingsList'>
                            {listings.map((list)=>(
                                <ListingItem key={list.id} listing={list.data} id={list.id} onDelete={() => onDelete(list.id)} onEdit={() => onEditListing(list.id)}/>
                            ))}
                        </ul>
                    </>
                )}

            </main>
        </div>
    );
}

export default Profile;