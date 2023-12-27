import React from 'react';
import {Link} from "react-router-dom";
import bedIcon from '../assets/svg/bedIcon.svg';
import mileage from '../assets/svg/mileage.svg';
import {ReactComponent as DeleteIcon} from "../assets/svg/deleteIcon.svg";

function ListingItem({listing, id, onDelete}) {
    return (
        <li className='categoryListing'>
            <Link to={`/category/${listing.type}/${id}`} className='categoryListingLink'>
                <img src={listing.imgUrls[0]} alt={listing.name} className='categoryListingImg'/>
                <div className="categoryListingDetails">
                    <p className="categoryListingLocation">{listing.location}</p>
                    <p className='categoryListingName'>{listing.name}</p>
                    <p className='categoryListingPrice'>${listing.offer ? listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} USD
                        {listing.type === 'rent' && ' / Month'}
                    </p>
                    <div className="categoryListingInfoDiv">
                        <img src={bedIcon} alt='bed'/>
                        <p className="categoryListingInfoText">
                            {listing.door > 1 ? `${listing.door} Doors` : '1 Door'}
                        </p>
                        <img src={mileage} alt="mileage"/>
                        <p className="categoryListingInfoText">
                            {listing.displacement && listing.displacement} cc
                        </p>
                    </div>
                </div>
            </Link>
            {onDelete && (
                <DeleteIcon className='removeIcon' fill='rgb(231, 76, 60)' onClick={()=>onDelete(listing.id, listing.name)}/>
            )}
        </li>
    );
}

export default ListingItem;