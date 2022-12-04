import React from 'react';
import { Chip, Button } from '@mui/material';
import { useHistory, Link } from 'react-router-dom';
import './styles.css';
import Swal from 'sweetalert2';
import ShareIcon from '@mui/icons-material/Share';
import Moment from 'react-moment';

var colorArray = [
	'#FF6633',
	'#FF33FF',
	'#00B3E6',
	'#E6B333',
	'#3366E6',
	'#999966',
	'#B34D4D',
	'#80B300',
	'#809900',
	'#6680B3',
	'#66991A',
	'#FF99E6',
	'#CCFF1A',
	'#FF1A66',
	'#E6331A',
	'#33FFCC',
	'#66994D',
	'#B366CC',
	'#4D8000',
	'#B33300',
	'#CC80CC',
	'#66664D',
	'#991AFF',
	'#E666FF',
	'#4DB3FF',
	'#1AB399',
	'#E666B3',
	'#33991A',
	'#CC9999',
	'#B3B31A',
	'#00E680',
	'#4D8066',
	'#809980',
	'#E6FF80',
	'#1AFF33',
	'#999933',
	'#FF3380',
	'#CCCC00',
	'#66E64D',
	'#4D80CC',
	'#9900B3',
	'#E64D66',
	'#4DB380',
	'#FF4D4D',
	'#99E6E6',
	'#6666FF'
];

const Card = ({
	item: { name, id, basePrice, bidDeadline, owner, image_1 }
}) => {
	const history = useHistory();
	return (
		<div className={'news-card'}>
			<div
				style={{
					position: 'absolute',
					cursor: 'pointer',
					zIndex: 2,
					right: 0
				}}
			>
				<Button
					onClick={() => {
						navigator.clipboard.writeText(
							`${window.location.origin}/auctions/${id}`
						);
						Swal.fire('Link copied succesfully', '', 'success');
					}}
					variant="contained"
					color="secondary"
				>
					{/* <i className="fas fa-share-alt"></i> */}
					<ShareIcon />
				</Button>
			</div>
			<div className="news-card__card-link"></div>
			<img
				src={'http://localhost:8000' + image_1}
				alt="image"
				className="news-card__image"
			/>
			<div className="news-card__text-wrapper">
				<div className="news-card__title_wrapper">
					<h2 className="news-card__title">{name}</h2>
				</div>
				<div className="news-card__post-date">
					<div
						style={{ position: 'relative', zIndex: 10, margin: 5 }}
					>
						Auction ends at :
						<a
							href={'http://localhost:3000/story/'}
							target="_blank"
							rel="noreferrer"
							style={{
								fontFamily: 'Mulish',
								textDecoration: 'none',
								color: 'white'
							}}
						>
							<Moment format="YYYY-MM-DD HH:mm">
								{bidDeadline}
							</Moment>
						</a>
					</div>
				</div>
				<div className="news-card__details-wrapper">
					<div className="news-card__excerpt">
						<Chip
							className="storyChip"
							label={'Base bid price: ' + '₹' + basePrice}
							style={{
								background: `${colorArray[4]}`,
								color: 'white',
								marginLeft: '5px'
							}}
						/>
					</div>

					<div
						onClick={() => {
							history.push(`/auctions/${id}`);
						}}
						className="news-card__read-more_container"
					>
						<span className="news-card__read-more">
							Details
							<i className="fas fa-long-arrow-alt-right"> </i>
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Card;
