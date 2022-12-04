import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import {
	Typography,
	Chip,
	Paper,
	Divider,
	Button,
	Modal,
	Box,
	Input,
	TextField,
	InputAdornment
} from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import DoneIcon from '@mui/icons-material/Done';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TimelineIcon from '@mui/icons-material/Timeline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import ReactECharts from 'echarts-for-react';
import Moment from 'react-moment';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import styles from './style.module.css';
import Swal from 'sweetalert2';

const ImageCard = ({ images }) => {
	return (
		<Swiper
			slidesPerView={1}
			navigation={true}
			modules={[Navigation]}
			className="mySwiper"
		>
			{images.map(img => {
				if (img) {
					return (
						<SwiperSlide key={img}>
							<img
								className={styles.slideCard}
								src={'http://localhost:8000' + img}
							/>
						</SwiperSlide>
					);
				}
			})}
		</Swiper>
	);
};

const CycleDetails = () => {
	const {
		getAccessTokenSilently,
		isAuthenticated,
		loginWithRedirect
	} = useAuth0();
	const { id } = useParams();
	let history = useHistory();
	const [bidState, setBidState] = useState(-1);
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const [bid, setBid] = useState(0);
	const [cycle, setCycle] = useState({
		id: 1,
		name: 'Namae',
		basePrice: 0,
		bidDeadline: null,
		bidStartTime: null,
		buyOutPrice: 0,
		owner: 'Owner',
		viewCount: 0,
		desc: 'Description',
		image_1:
			'https://media.istockphoto.com/vectors/bicycle-parking-icon-bike-rack-vector-id1333015759?k=20&m=1333015759&s=612x612&w=0&h=6vj5_VofdguItEKfk-Nn1OsKSCotKWMCDYoEqDjiWcE=',
		image_2: null,
		image_3: null,
		image_4: null,
		image_5: null,
		bids: []
	});

	useEffect(() => {
		const fetch = async () => {
			try {
				const res = await axios.get(
					`http://localhost:8000/api/v1/auction/${id}/`
				);
				setCycle(res.data);
				let cyc = res.data;
				if (cyc.basePrice) {
					let now = new Date();
					if (now > new Date(cyc.bidStartTime)) {
						if (now < new Date(cyc.bidDeadline)) {
							// biddding phasee
							setBidState(1);
						}
					} else {
						// buyout
						setBidState(0);
					}
				}
			} catch (error) {
				console.error(error);
				history.push('/auctions');
			}
		};
		fetch();
	}, []);

	const handleOpen = param => {
		setOpen(param);
	};

	const onBidHandler = async () => {
		setOpen(false);
		if (!isAuthenticated) {
			loginWithRedirect();
			return;
		}
		if (bid > 0 && bid > cycle.basePrice && bid <= cycle.maxPrice) {
			try {
				let token = await getAccessTokenSilently();
				const data = { id: id, bid: bid };
				await axios.post('http://localhost:8000/api/v1/bid/', data, {
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`
					}
				});
				Swal.fire('Bid added successfully', '', 'success').then(() =>
					history.push('/')
				);
			} catch (error) {
				console.error(error.message);
				Swal.fire('Some error occured :(', '', 'error');
			}
		} else {
			if (bid > cycle.basePrice) {
				Swal.fire(
					`Max bid amount of ${cycle.maxPrice} exceeded! :(`,
					'',
					'error'
				);
			} else {
				Swal.fire(
					`Min bid amount is ${cycle.basePrice}! :(`,
					'',
					'error'
				);
			}
		}
	};

	const onBuyOutHandler = async () => {
		setOpen(false);
		if (!isAuthenticated) {
			loginWithRedirect();
			return;
		}
		try {
			let token = await getAccessTokenSilently();
			const data = { id: id };
			await axios.post('http://localhost:8000/api/v1/buyout', data, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			});
			Swal.fire('Purchased successfully', '', 'success').then(() =>
				history.push('/')
			);
		} catch (error) {
			console.error(error.message);
			Swal.fire('Some error occured :(', '', 'error');
		}
	};

	const { image_1, image_2, image_3, image_4, image_5 } = cycle;

	const options = {
		grid: { top: 20, right: 40, bottom: 20, left: 40 },
		xAxis: {
			data: cycle.bids.map((b, i) => i)
		},
		yAxis: {
			type: 'value',
			// name: 'Bids',
			// nameLocation: 'start',
			axisLine: {
				show: true
			},
			axisLabel: {
				formatter: '₹ {value}'
			}
		},
		series: [
			{
				data: cycle.bids.map(item => item.bid),
				type: 'line'
			}
		],
		tooltip: {
			trigger: 'axis'
		}
	};

	return (
		<div className={styles.container}>
			{open === 'buyout' ? (
				<>
					<Modal
						open={open ? true : false}
						onClose={() => handleOpen(false)}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Box className={styles.modalContainer}>
							<Typography
								id="modal-modal-title"
								variant="h6"
								component="h2"
							>
								Are you surely want to buy the entity ?
							</Typography>
							<Typography
								id="modal-modal-description"
								sx={{ mt: 2 }}
							>
								The auction for this product will end and you will
								purchase the bicycle.
							</Typography>
							<Button
								className={styles.button1}
								variant="contained"
								color="primary"
								onClick={onBuyOutHandler}
							>
								Confirm
							</Button>
						</Box>
					</Modal>
				</>
			) : open === 'bid' ? (
				<Modal
					open={open ? true : false}
					onClose={() => handleOpen(false)}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					<Box className={styles.modalContainer}>
						<Typography
							id="modal-modal-title"
							variant="h6"
							component="h2"
						>
							Enter the bid amount
						</Typography>
						<Typography id="modal-modal-description" sx={{ mt: 2 }}>
							The auction for this product will end and you will
							purchase the bicycle.
						</Typography>

						<div>
							<TextField
								id="input-with-icon-textfield-outlined"
								className={styles.button1}
								label="Bid"
								type="number"
								value={bid}
								onChange={e => setBid(e.target.value)}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<CurrencyRupeeIcon />
										</InputAdornment>
									)
								}}
								// variant="standard"
							/>
						</div>
						<Button
							className={styles.button1}
							variant="contained"
							color="primary"
							onClick={onBidHandler}
						>
							Bid
						</Button>
					</Box>
				</Modal>
			) : null}
			<div className={styles.imageCard}>
				<ImageCard
					images={[image_1, image_2, image_3, image_4, image_5]}
				/>
			</div>
			<div className={styles.bidCard}>
				{/* TODO: Add share button */}
				<Typography variant="h4" gutterBottom>
					{cycle.name}
				</Typography>
				<Typography
					variant="subtitle1"
					gutterBottom
					className="centerV"
				>
					&nbsp;
					<VisibilityIcon /> &nbsp; {cycle.viewCount} views
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					<StorefrontIcon /> &nbsp; Owned by &nbsp;
					<Chip label={`${cycle.owner} ☑️`} color="primary" />
				</Typography>

				{/* Price */}
				<Paper
					variant="outlined"
					// elevation={6}
					className={styles.priceCard}
				>
					<div className="centerV" style={{ marginBottom: '10px' }}>
						<AccessTimeIcon /> &nbsp; Bid starts at &nbsp;
						<Moment format="DD MMM YYYY HH:mm">
							{cycle.bidStartTime
								? cycle.bidStartTime
								: '23-11-2022'}
						</Moment>
					</div>
					<div className="centerV" style={{ marginBottom: '10px' }}>
						<AccessTimeIcon /> &nbsp; Bid ends at &nbsp;
						<Moment format="DD MMM YYYY HH:mm">
							{cycle.bidDeadline ? cycle.bidDeadline : '23-11-2022'}
						</Moment>
					</div>
					<Divider style={{ marginBottom: '10px' }} />
					<div>
						<Typography variant="subtitle1" gutterBottom>
							Highest Bid
						</Typography>
						<Typography className={styles.priceTag} gutterBottom>
							<CurrencyRupeeIcon />
							{cycle.highest_bid}
						</Typography>
					</div>
					<div className="centerH">
						<Button
							className={styles.button}
							variant="contained"
							color="primary"
							startIcon={<ShoppingCartIcon />}
							disabled={
								cycle.state >= 1 || bidState !== 0 || loading
							}
							// title="Buyout period ends at 23:59 IST"
							onClick={() => handleOpen('buyout')}
						>
							Buyout @ ₹{cycle.buyOutPrice}
						</Button>
						<Button
							className={styles.button}
							variant="outlined"
							color="primary"
							startIcon={<LocalOfferIcon />}
							disabled={
								cycle.state >= 1 || bidState !== 1 || loading
							}
							onClick={() => handleOpen('bid')}
						>
							Bid
						</Button>
					</div>
				</Paper>

				{/* Desc */}
				<Paper
					variant="outlined"
					// elevation={6}
					className={styles.priceCard}
				>
					<div className="centerV" style={{ marginBottom: '10px' }}>
						<InfoOutlinedIcon /> &nbsp; Description
					</div>
					<Divider style={{ marginBottom: '10px' }} />
					<div>
						<Typography
							variant="subtitle1"
							gutterBottom
							className="centerV"
						>
							{cycle.desc}
						</Typography>
					</div>
				</Paper>

				{/* Graph */}
				<Paper
					variant="outlined"
					// elevation={6}
					className={styles.priceCard}
				>
					<div className="centerV" style={{ marginBottom: '10px' }}>
						<TimelineIcon /> &nbsp; Bid History
					</div>
					<Divider style={{ marginBottom: '10px' }} />
					<div>
						<ReactECharts
							option={options}
							notMerge={true}
							lazyUpdate={true}
							theme={'theme_name'}
							// onChartReady={this.onChartReadyCallback}
							// onEvents={EventsDict}
							opts={{}}
						/>
					</div>
				</Paper>
			</div>
		</div>
	);
};

export default CycleDetails;
