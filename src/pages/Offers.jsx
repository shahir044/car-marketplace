import React from 'react';
import {useEffect,useState} from "react";
import {useParams} from "react-router-dom";
import {collection, getDocs, query, where, orderBy, limit} from "firebase/firestore";
import {db} from '../firebase.config';
import {toast} from "react-toastify";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";

function Offers(props) {
    const [listings, setListings] = useState('');
    const [loading, setLoading] = useState(true);

    const params = useParams(); //params.categoryName

    useEffect(() => {

        const fetchListing = async () => {
            try {
                const listingsRef = collection(db,'listings');

                //create the query
                const q = query(listingsRef,where('offer','==',true),
                    orderBy('timestamp','desc'),
                    limit(10));

                //execute query get the data from firebase
                const querySnap = await getDocs(q);

                let listings = [];

                querySnap.forEach((doc)=>{
                    //console.log(doc.data()) // doc.data contains all listings array except their id. doc.id has that seperately
                    listings.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })
                setListings(listings);
                setLoading(false);
            }catch (error) {
                toast.error(error);
            }
        }

        fetchListing();

    }, []);


    return (
        <div className='category'>
            <p className='pageHeader'>
                Exclusive Offers
            </p>
            {
                loading ? (<Spinner/>) : listings && listings.length>0 ?
                    (
                        <>
                            <main>
                                <ul className="categoryListings">
                                    {listings.map((list)=>(
                                        <ListingItem id={list.id} listing={list.data} key={list.id}/>
                                    ))}
                                </ul>
                            </main>
                        </>
                    ) :
                    (
                        <p>No current offers at this moment</p>
                    )
            }
        </div>
    );
}

export default Offers;