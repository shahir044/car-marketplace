import React from 'react';
import { useEffect, useState } from 'react';
import { Link,useNavigate,useParams } from 'react-router-dom';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Autoplay,Navigation,Pagination, Scrollbar, A11y} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { doc,getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase.config';
import Spinner from '../components/Spinner';
import shareIcon from '../assets/svg/shareIcon.svg';
import {toast} from 'react-toastify';

function Listing() {
    const [listing , setListing ] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shareLinkCopied, setShareLinkCopied] = useState(false);

    const navigate = useNavigate();
    const auth = getAuth();
    const params = useParams();

    useEffect(() => {
        const fetchListing = async () => {
          try {
            const docRef = doc(db, 'listings', params.listingId)
            const docSnap = await getDoc(docRef)
      
            if (docSnap.exists()) {
              console.log("🚀 ~ file: Listing.jsx:25 ~ fetchListing ~ docSnap:", docSnap.data())
              setListing(docSnap.data())
              setLoading(false)
            }else{
              toast.error("no listing found");
              setLoading(false)
            }
          } catch (error) {
            
            toast.error(error);
          }
        }
    
        fetchListing()
      }, [navigate, params.listingId])
    
      if (loading) {
        return <Spinner />
      }

    return (
        <main>
          {/* {SLIDER} */}
          <Swiper
            // install Swiper modules
            modules={[Autoplay, Navigation, Pagination, Scrollbar, A11y]}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            slidesPerView={1}
            pagination={{ clickable: true }}
          >
            {listing.imgUrls.map((url, index)=>(
              <SwiperSlide key={index}>
              
                  <div style={{
                    background: `url(${listing.imgUrls[index]}) center no-repeat`, backgroundSize: 'cover', height: '300px'}} className='swiperSlideDiv'>
                  </div>
                {/* <img src={listing.imgUrls[index]} alt="..." /> */}
                
              </SwiperSlide>
            ))}
          </Swiper>

          {/* This is a Share Icon Mechanism */}
          <div className="shareIconDiv" onClick={()=>{
            navigator.clipboard.writeText(window.location.href);
            setShareLinkCopied(true);
            // wait for 2000 milisecond and then we will show link has been copied
            setTimeout(()=>{
              setShareLinkCopied(false);
            },2000)
          }}>
            <img src={shareIcon} alt="share" />
          </div>

          {shareLinkCopied && <p className='linkCopied'>Link Copied!</p>}

          <div className="listingDetails">
            <p className='listingName'>{listing.name} - ${listing.offer ? listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }</p>
          
            <p className='listingLocation'>{listing.location} </p>
            <p className='listingType'>For {listing.type === 'rent' ? 'Rent':'Sale'}</p>

            {listing.offer && (
              <p className="discountPrice">
                ${listing.regularPrice - listing.discountedPrice} discount
              </p>
            )}

            <ul className="listingDetailsList">
              <li>{listing.door > 2 ? `${listing.door} Doors` : '2 Doors'}</li>
              <li>{listing.displacement > 1500 ? `${listing.displacement} CC` : '1500 CC'}</li>
              <li>{ listing.parking > 1500 && `Parking Spot`}</li>
              <li>{ listing.furnished > 1500 && `Furnished`}</li>
            </ul>

            <p className='listingLocationTitle'>Location:</p>
            <p>{listing.location}</p>

            <div className='leafletContainer'>
              <MapContainer style={{height: '100%', width: '100%'}} center={[
                listing.latitude, listing.longitude
                // listing.geolocation.lat, 
                // listing.geolocation.lng
              ]}
              zoom={13}
              scrollWheelZoom={false}>
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker position={[listing.latitude, listing.longitude]}>
                  <Popup>{listing.location}</Popup>
                </Marker>
              </MapContainer>
            </div>

            {auth.currentUser?.uid !== listing.userRef && (
              <Link to={`/contact/${listing.userRef}?listingName=${listing.name}&listingLocation=${listing.location}`} className='primaryButton'>
                Contact Landlord
              </Link>
            )}

          </div>


        </main>
    )
}

export default Listing