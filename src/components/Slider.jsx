import React from 'react'
import { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection,getDocs,query,orderBy,limit } from 'firebase/firestore'
import { db } from '../firebase.config'
import {Swiper, SwiperSlide} from 'swiper/react';
import {Autoplay,Navigation,Pagination, Scrollbar, A11y} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import Spinner from './Spinner'

function Slider() {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      const listingsRef = collection(db,'listings');
      const q = query(listingsRef, orderBy('timestamp','desc'),limit(5));
      const querySnap = await getDocs(q);
      
      let listings = [];

      querySnap.forEach((doc)=>{
        // console.log(doc.data() + doc.id);
        return listings.push({
          id: doc.id,
          data: doc.data()
        })
      })
      setListings(listings);
      setLoading(false);
    }
    fetchListing();
  },[]);

  if (loading) {
    return <Spinner/>;
  }

  if (listings.lenght === 0) {
    return <></>;
  }

  return (
    <>
      <p className="exploreHeading">Recommended</p>

      <Swiper 
      slidesPerView={1} p
      pagination={{clickable: true}}
      modules={[Autoplay, Navigation, Pagination, Scrollbar, A11y]}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      >
        {listings.map(({data,id}) => (
          <SwiperSlide key={id} onClick={() => navigate(`/category/${data.type}/${id}}`)}>
            <div style={{background: `url(${data.imgUrls[0]}) center no-repeat`, backgroundSize: 'cover', height: '200px'}} className='swiperSlideDiv'>
              <p className='swiperSlideText'>{data.name}</p>
              <p className='swiperSlidePrice'>${data.discountedPrice ?? data.regularPrice}
                {' '} 
                {data.type === 'rent' && '/month'}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}

export default Slider