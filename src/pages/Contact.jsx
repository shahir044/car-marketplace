import React from 'react'
import { useState, useEffect } from 'react'
import { useParams,useSearchParams } from 'react-router-dom'
import { doc,getDoc } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'

function Contact() {
    const [message, setMessage] = useState('');
    const [landlord, setLandlord] = useState(null);
    // eslint-disable-next-line
    const [searchParams, setSearchParams] = useSearchParams();

    const params = useParams(); //params.categoryName

    useEffect(() => {
        const getLandlord = async () => {
            const docRef = doc(db,'users',params.landlordId);
            const docSnap = await getDoc(docRef);

            if(docSnap.exists()) {
                setLandlord(docSnap.data());
            }else{
                toast.error('Landlord not found!');
            }
        };

        getLandlord();

    }, [params.landlordId]);

    const onChange = (e) => {
        console.log("🚀 ~ file: Contact.jsx:32 ~ onChange ~ e:", e.target.value);
        setMessage(e.target.value)
    }

    return (
        <div className='pageContainer'>
            <header>
                <p className="pageHeader">Contact Landlord</p>
            </header>

            {landlord !== null && (
                <main>
                    <div className="contactLandlord">
                        <p className="landlordName">
                            Contact {landlord?.name}
                        </p>
                    </div>
                    
                    <form action="" className="messageForm">
                        <div className="messageDiv">
                            <label htmlFor="message" className="messageLabel">
                                Message
                            </label>
                            <textarea name="message" id="message" cols="30" rows="10" className='textarea' onChange={onChange}>
                            </textarea>
                        </div>

                        <a href={`mailto:${landlord.email}?Subject=${searchParams.get('listingName')}&body=${message}`}>
                            <button type='button' className="primaryButton">Send Message</button>
                        </a>
                    </form>
                </main>
            )}
        </div>
    )
}

export default Contact