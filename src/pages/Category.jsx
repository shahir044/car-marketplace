import React from 'react';
import {useEffect,useState} from "react";
import {useParams} from "react-router-dom";
import {collection, getDocs, query, where, orderBy, limit, startAfter} from "firebase/firestore";
import {db} from '../firebase.config';
import {toast} from "react-toastify";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";
function Category(props) {
    const [listings, setListings] = useState('');
    const [loading, setLoading] = useState(true);
    const [lastFetchedListing, setLastFetchedListing] = useState(null);

    const params = useParams(); //params.categoryName

    useEffect(() => {

        const fetchListing = async () => {
          try {
              const listingsRef = collection(db,'listings');

              //create the query
              const q = query(listingsRef,where('type','==',params.categoryName),
                  orderBy('timestamp','desc'),
                  limit(3));

              //execute query get the data from firebase
              const querySnap = await getDocs(q);

              const lastVisible = querySnap.docs[querySnap.docs.length - 1];
              // this lastVisible will contain the last element in the list
              // console.log("🚀 ~ file: Category.jsx:31 ~ fetchListing ~ lastVisible:", lastVisible.data())
              setLastFetchedListing(lastVisible);

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
              setLoading(false);
          }
        }

        fetchListing();
    }, [params.categoryName]);

    // pagination / load more listings
    const onFetchMoreListing = async () => {
        try {
            const listingsRef = collection(db,'listings');

            //create the query
            const q = query(listingsRef,where('type','==',params.categoryName),
                orderBy('timestamp','desc'),
                startAfter(lastFetchedListing),
                limit(10));

            //execute query get the data from firebase
            const querySnap = await getDocs(q);

            const lastVisible = querySnap.docs[querySnap.docs.length - 1];
            // this lastVisible will contain the last element in the list
            // console.log("🚀 ~ file: Category.jsx:31 ~ fetchListing ~ lastVisible:", lastVisible.data())
            setLastFetchedListing(lastVisible);

            let listings = [];

            querySnap.forEach((doc)=>{
                //console.log(doc.data()) // doc.data contains all listings array except their id. doc.id has that seperately
                listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })
            // This will add the listings after the previous list
            setListings((prevState) => [...prevState, ...listings]);
            setLoading(false);
        }catch (error) {
            toast.error(error);
        }
      }

    return (
        <div className='category'>
            <p className='pageHeader'>
                {params.categoryName === 'sale' ? 'Cars for sell':'Cars for rent'}
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

                        <br/>
                        <br/>

                        {lastFetchedListing && (
                            <p className='loadMore' onClick={onFetchMoreListing}>Load more</p>
                        )}
                    </>
                ) :
                (
                    <p>No listings for {params.categoryName} at this moment</p>
                )
            }
        </div>
    );
}

export default Category;