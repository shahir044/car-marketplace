import React, {useEffect, useRef, useState} from 'react';
import {getAuth, onAuthStateChanged} from "firebase/auth";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {addDoc,collection,serverTimestamp} from "firebase/firestore";
import {db} from "../firebase.config";
import {v4 as uuidv4} from 'uuid';
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import Spinner from "../components/Spinner";

function CreateListing(props) {
    // eslint-disable-next-line
    const [geolocationEnabled, setGeolocationEnabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        type: 'rent',
        name: '',
        door: 4,
        displacement: 1500,
        fuel: '',
        weight: '',
        parking: false,
        furnished: false,
        address: '',
        offer: false,
        regularPrice: 0,
        discountedPrice: 0,
        images: {},
        latitude: 0,
        longitude: 0
    });

    const {
        type,
        name,
        door,
        displacement,
        fuel,
        weight,
        parking,
        furnished,
        address,
        offer,
        regularPrice,
        discountedPrice,
        images,
        latitude,
        longitude
    } = formData;

    const navigate = useNavigate();
    const auth = getAuth();
    const isMounted = useRef(true);

    useEffect(() => {
        if (isMounted) {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setFormData({...formData, userRef: user.uid});
                } else {
                    navigate('/sign-in');
                }
            })
        }
        return () => {
            isMounted.current = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMounted]);

    const onSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        setLoading(true);

        if (discountedPrice>regularPrice){
            setLoading(false);
            toast.warning('Discounted price needs to be less than regular price');
            return
        }

        if(images.length>6){
            setLoading(false);
            toast.warning('Max 6 Images');
            return
        }

        let geolocation = {};
        let location;

        if(geolocationEnabled){
            const response = await fetch('google geolocation api key + address');
            const data = response.json();
            console.log('Geo Enabled');

            // result[0]?- we have put this questing mark so that it will not throw any error
            geolocation.lat = data.result[0]?.geometry.location.lat ?? 0;
            geolocation.lng = data.result[0]?.geometry.location.lng ?? 0;

            location = data.status === 'ZERO_RESULTS' ? undefined : data.results[0]?.formatted_address;

            if (location === undefined || location.includes('undefined')) {
                setLoading('false');
                toast.error('Please enter a correct location');
                return
            }
        }else{
            geolocation.lat = latitude;
            geolocation.lng = longitude;
            location = address;
        }

        const storeImage = async(image) => {
          return new Promise((resolve,reject) => {
              const storage = getStorage();
              const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;

              const storageRef = ref(storage,'images/' + fileName);

              const uploadTask = uploadBytesResumable(storageRef, image);

              uploadTask.on('state_changed',
                  (snapshot) => {
                      // Observe state change events such as progress, pause, and resume
                      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                      console.log('Upload is ' + progress + '% done');
                      switch (snapshot.state) {
                          case 'paused':
                              console.log('Upload is paused');
                              break;
                          case 'running':
                              console.log('Upload is running');
                              break;
                          default:
                                break;
                      }
                  },
                  (error) => {
                      // Handle unsuccessful uploads
                      reject(error);
                  },
                  () => {
                      // Handle successful uploads on complete
                      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                          resolve(downloadURL);
                          console.log('File available at', downloadURL);
                      });
                  }
              );
          })
        }

        const imgUrls = await Promise.all(
            [...images].map((image)=>storeImage(image))
        ).catch(()=>{
            setLoading(false);
            toast.error('Image not uploaded')
            return
        })
        //console.log(imgUrls);

        const formDataCopy = {
            ...formData,
            imgUrls,
            geolocation,
            timestamp: serverTimestamp()
        }

        // as we are extracting locatoin no need to keep address. lets keep location
        formDataCopy.location = address;
        delete formDataCopy.images;
        delete formDataCopy.address;
        // if there is no offer we will not keep discounted price . !formDataCopy.offer
        !formDataCopy.offer && delete formDataCopy.discountedPrice;

        const docRef = await addDoc(collection(db,'listings'),formDataCopy);

        setLoading(false);

        toast.success('Listing Saved Successfully');
        //lets navigate to the newly added listing
        navigate(`/category/${formDataCopy.type}/${docRef.id}`);
    }

    const onMutate = (e) => {
        let boolean = null;
        if (e.target.value === 'true'){
            boolean = true;
        }else if(e.target.value === 'false'){
            boolean = false;
        }

        // images
        if(e.target.files){
            setFormData((prevState) => ({
                ...prevState,
                images: e.target.files
            }))
        }
        // text/number/boolean
        if (!e.target.files){
            setFormData((prevState) => ({
                ...prevState,
                [e.target.id]: boolean ?? e.target.value,
            }))
        }
    }

    if (loading){
        return <Spinner/>
    }

    return (
        <div className='profile'>
            <header>
                <p className='pageHeader'>Create Listing</p>
            </header>
            <main>
                <form onSubmit={onSubmit}>
                    <label className='formLabel'>Sell / Rent</label>
                    <div className='formButtons'>
                        <button type='button'
                        className={type==='sale' ? 'formButtonActive':'formButton'}
                            id='type' value='sale' onClick={onMutate}
                        >
                            Sale
                        </button>
                        <button type='button'
                                className={type==='rent' ? 'formButtonActive':'formButton'}
                                id='type' value='rent' onClick={onMutate}
                        >
                            Rent
                        </button>
                    </div>

                    <label className='formLabel'>Car Name</label>
                    <input
                        className='formInputName'
                        type='text'
                        id='name'
                        value={name}
                        onChange={onMutate}
                        maxLength='32'
                        minLength='10'
                        required
                    />

                    <div className='formRooms flex'>
                        <div>
                            <label className='formLabel'>Fuel</label>
                            <input
                                className='formInputSmall'
                                type='text'
                                placeholder='Octane/Diesel/Petrol'
                                id='fuel'
                                value={fuel}
                                onChange={onMutate}
                                min='1'
                                max='6'
                                required
                            />
                        </div>
                        <div>
                            <label className='formLabel'>Weight (kg)</label>
                            <input
                                className='formInputSmall'
                                type='number'
                                id='weight'
                                value={weight}
                                onChange={onMutate}
                                min='500'
                                max='10000'
                                required
                            />
                        </div>
                    </div>

                    <div className='formRooms flex'>
                        <div>
                            <label className='formLabel'>Door</label>
                            <input
                                className='formInputSmall'
                                type='number'
                                id='door'
                                value={door}
                                onChange={onMutate}
                                min='1'
                                max='6'
                                required
                            />
                        </div>
                        <div>
                            <label className='formLabel'>Displacement (cc)</label>
                            <input
                                className='formInputSmall'
                                type='number'
                                id='displacement'
                                value={displacement}
                                onChange={onMutate}
                                min='500'
                                max='10000'
                                required
                            />
                        </div>
                    </div>

                        <label className='formLabel'>Parking spot</label>
                        <div className='formButtons'>
                            <button
                                className={parking ? 'formButtonActive' : 'formButton'}
                                type='button'
                                id='parking'
                                value={true}
                                onClick={onMutate}
                                min='1'
                                max='50'
                            >
                                Yes
                            </button>
                            <button
                                className={
                                    !parking && parking !== null ? 'formButtonActive' : 'formButton'
                                }
                                type='button'
                                id='parking'
                                value={false}
                                onClick={onMutate}
                            >
                                No
                            </button>
                        </div>

                        <label className='formLabel'>Furnished</label>
                        <div className='formButtons'>
                            <button
                                className={furnished ? 'formButtonActive' : 'formButton'}
                                type='button'
                                id='furnished'
                                value={true}
                                onClick={onMutate}
                            >
                                Yes
                            </button>
                            <button
                                className={
                                    !furnished && furnished !== null
                                        ? 'formButtonActive'
                                        : 'formButton'
                                }
                                type='button'
                                id='furnished'
                                value={false}
                                onClick={onMutate}
                            >
                                No
                            </button>
                        </div>

                        <label className='formLabel'>Address</label>
                        <textarea
                            className='formInputAddress'
                            id='address'
                            value={address}
                            onChange={onMutate}
                            required
                        />

                    {!geolocationEnabled && (
                        <div className='formLatLng flex'>
                            <div>
                                <label className='formLabel'>Latitude</label>
                                <input
                                    className='formInputSmall'
                                    type='number'
                                    id='latitude'
                                    value={latitude}
                                    onChange={onMutate}
                                    required
                                />
                            </div>
                            <div>
                                <label className='formLabel'>Longitude</label>
                                <input
                                    className='formInputSmall'
                                    type='number'
                                    id='longitude'
                                    value={longitude}
                                    onChange={onMutate}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <label className='formLabel'>Offer</label>
                    <div className='formButtons'>
                        <button
                            className={offer ? 'formButtonActive' : 'formButton'}
                            type='button'
                            id='offer'
                            value={true}
                            onClick={onMutate}
                        >
                            Yes
                        </button>
                        <button
                            className={
                                !offer && offer !== null ? 'formButtonActive' : 'formButton'
                            }
                            type='button'
                            id='offer'
                            value={false}
                            onClick={onMutate}
                        >
                            No
                        </button>
                    </div>

                    <label className='formLabel'>Regular Price</label>
                    <div className='formPriceDiv'>
                        <input
                            className='formInputSmall'
                            type='number'
                            id='regularPrice'
                            value={regularPrice}
                            onChange={onMutate}
                            min='50'
                            max='750000000'
                            required
                        />
                        {type === 'rent' && <p className='formPriceText'>$ / Month</p>}
                    </div>

                    {offer && (
                        <>
                            <label className='formLabel'>Discounted Price</label>
                            <input
                                className='formInputSmall'
                                type='number'
                                id='discountedPrice'
                                value={discountedPrice}
                                onChange={onMutate}
                                min='50'
                                max='750000000'
                                required={offer}
                            />
                        </>
                    )}

                    <label className='formLabel'>Images</label>
                    <p className='imagesInfo'>
                        The first image will be the cover (max 6).
                    </p>
                    <input
                        className='formInputFile'
                        type='file'
                        id='images'
                        onChange={onMutate}
                        max='6'
                        accept='.jpg,.png,.jpeg'
                        multiple
                        required
                    />
                    <button type='submit' className='primaryButton createListingButton'>
                        Create Listing
                    </button>
                </form>
            </main>
        </div>
    );
}

export default CreateListing;