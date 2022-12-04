import React, { useState, useEffect } from 'react';
import './dash.css';
import Spinner from '../loading/loading';
import { CircularProgress } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Moment from 'react-moment';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
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
import styles from '../cycle/style.module.css';

function Dash() {
	const [wons, setWon] = useState([]);
	const [bids, setBids] = useState([]);
	const [posts, setPosts] = useState([]);
	const [fetched, setFetched] = useState(null);
	const [code, setCode] = useState();
	let history = useHistory();
	const [show, setShow] = useState(false);
	const { logout, user, getAccessTokenSilently } = useAuth0();
	const { name, picture } = user;

	useEffect(() => {
		const fetchWons = async () => {
			try {
				let token = await getAccessTokenSilently();
				const res = await axios.get(
					'http://localhost:8000/api/v1/dashboard/won_bids',
					{
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${token}`
						}
					}
				);
				const result = res.data;
				setWon(result);
			} catch (error) {
				console.error(error.message);
			}
		};

		const fetchBids = async () => {
			try {
				let token = await getAccessTokenSilently();
				const res = await axios.get(
					'http://localhost:8000/api/v1/dashboard/bids',
					{
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${token}`
						}
					}
				);
				const result = res.data;
				setBids(result);
			} catch (error) {
				console.error(error.message);
			}
		};

		const fetchPosts = async () => {
			try {
				let token = await getAccessTokenSilently();
				const res = await axios.get(
					'http://localhost:8000/api/v1/dashboard/posts',
					{
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${token}`
						}
					}
				);
				const result = res.data;
				setPosts(result);
			} catch (error) {
				console.error(error.message);
			}
		};

		fetchBids();
		fetchPosts();
		fetchWons();
	}, []);

	const onBidDelete = async id => {
		try {
			let token = await getAccessTokenSilently();
			const res = await axios.delete(
				`http://localhost:8000/api/v1/bid/${id}/`,
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`
					}
				}
			);
			Swal.fire('Bid deleted successfully', '', 'success').then(() =>
				history.push('/dashboard')
			);
		} catch (error) {
			console.error(error.message);
		}
	};

	const onAuctionDelete = async id => {
		try {
			let token = await getAccessTokenSilently();
			const res = await axios.delete(
				`http://localhost:8000/api/v1/auction/${id}/`,
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`
					}
				}
			);
			Swal.fire(
				'Cycle auction deleted successfully',
				'',
				'success'
			).then(() => history.push('/dashboard'));
		} catch (error) {
			console.error(error.message);
		}
	};

	const fetchAndVerify = async (code, verify) => {
		if (verify) {
			try {
				let token = await getAccessTokenSilently();
				const res = await axios.get(
					`http://localhost:8000/api/v1/verify/${code}`,
					{
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${token}`
						}
					}
				);
				setFetched(null);
				setShow(false);
				Swal.fire('Verified Successfully', '', 'success');
			} catch (error) {
				setFetched(null);
				setShow(false);
				console.error(error);
				Swal.fire('Invalid code', '', 'error');
			}
		} else {
			try {
				let token = await getAccessTokenSilently();
				const res = await axios.get(
					`http://localhost:8000/api/v1/fetch/${code}`,
					{
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${token}`
						}
					}
				);
				setFetched(res.data);
			} catch (error) {
				setFetched(null);
				setShow(false);
				console.error(error);
				Swal.fire('Invalid code', '', 'error');
			}
		}
	};

	return (
		<>
			<div className="main-content">
				<header className="header-wrapper">
					<h2>
						<label htmlFor="nav-toggle"></label>
						Dashboard
					</h2>

					<div className="user-wrapper">
						{' '}
						<img
							src={picture && picture}
							width="40px"
							height="40px"
							alt="profile-img"
							className="profile-img"
						/>
						<div className="google-user">
							<h4>{name && name}</h4>
						</div>
					</div>
				</header>

				{show && (
					<>
						<Modal
							open={open ? true : false}
							onClose={() => setShow(false)}
							aria-labelledby="modal-modal-title"
							aria-describedby="modal-modal-description"
						>
							<Box className={styles.modalContainer}>
								<Typography
									id="modal-modal-title"
									variant="h6"
									component="h2"
								>
									Verify buyer and cycle.
								</Typography>
								<Typography
									id="modal-modal-description"
									sx={{ mt: 2, mb: 2 }}
								>
									Enter the Verification code provided by buyer to
									verify before selling the bicycle.
								</Typography>
								{fetched && (
									<Typography
										id="modal-modal-description"
										sx={{ mt: 2, mb: 2 }}
									>
										Cycle name: {fetched.name}
										<br />
										Amount(to be paid) : {fetched.amount}
									</Typography>
								)}
								<TextField
									id="outlined-basic"
									label="Verification Code"
									variant="outlined"
									value={code}
									onChange={e => {
										setCode(e.target.value);
									}}
								/>
								<Box sx={{ mt: 2, mb: 2 }}>
									<Button
										variant="contained"
										color="primary"
										onClick={() => fetchAndVerify(code, false)}
									>
										Fetch
									</Button>
									<Button
										sx={{ ml: 2 }}
										variant="contained"
										color="secondary"
										disabled={!(fetched && fetched.name)}
										onClick={() => fetchAndVerify(code, true)}
									>
										Confirm
									</Button>
								</Box>
							</Box>
						</Modal>
					</>
				)}

				<main>
					<h1 style={{ color: 'rgb(66, 9, 115)' }}>Purchased/Won</h1>
					<div className="cards">
						{wons ? (
							wons.map((bid, i) => (
								<>
									<div className="card-single" key={i}>
										<div>
											<h3>{bid.name ? bid.name : 'Title'}</h3>
											<h4>Amount : ₹ {bid.purchased_amount}</h4>
											<h4>Verification code : {bid.code}</h4>
											<h4>Owner: {bid.owner_name}</h4>
											<h4>Owner Email: {bid.owner_email}</h4>
											{bid.owner_mobile && (
												<h4>Owner Mobile: {bid.owner_mobile}</h4>
											)}
											<span className="dashboardIcon">
												<Link
													style={{
														textDecoration: 'none',
														color: 'white'
													}}
													to={`/auctions/${bid.id}`}
												>
													{' '}
													<i className="fa-sharp fa-solid fa-eye"></i>
												</Link>
											</span>
										</div>
									</div>
								</>
							))
						) : (
							<div
								style={{
									position: 'absolute',
									display: 'flex',
									justifyContent: 'center',
									width: '90vw'
								}}
							>
								<CircularProgress />
							</div>
						)}
					</div>
				</main>

				{/* All Bids */}
				<main>
					<h1 style={{ color: 'rgb(66, 9, 115)' }}>Your Bids</h1>
					<div className="cards">
						{bids ? (
							bids.map((bid, i) => (
								<div className="card-single" key={i}>
									<div>
										<h3>{bid.name ? bid.name : 'Title'}</h3>
										<h4>Amount : ₹ {bid.amount}</h4>
										<h4>
											Bid Deadline :{' '}
											<Moment format="DD MMM YYYY">
												{bid.bidDeadline
													? bid.bidDeadline
													: '23-11-2022'}
											</Moment>
										</h4>
										<div className="dashboardIconContainer">
											<span className="dashboardIcon">
												<Link
													style={{
														textDecoration: 'none',
														color: 'white'
													}}
													to={`/auctions/${bid.id}`}
												>
													{' '}
													<i className="fa-sharp fa-solid fa-eye"></i>
												</Link>
											</span>
											{'  '}
											<span className="dashboardIcon">
												<div
													onClick={() => onBidDelete(bid.bidId)}
													style={{
														textDecoration: 'none',
														color: 'white'
													}}
													to={`#!`}
												>
													{' '}
													<i className="fa-solid fa-trash"></i>
												</div>
											</span>
										</div>
									</div>
								</div>
							))
						) : (
							<div
								style={{
									position: 'absolute',
									display: 'flex',
									justifyContent: 'center',
									width: '90vw'
								}}
							>
								<CircularProgress />
							</div>
						)}
					</div>
				</main>

				{/* POSTS */}
				<main>
					<h1 style={{ color: 'rgb(66, 9, 115)' }}>
						Your Posts{' '}
						<Button
							variant="contained"
							color="primary"
							onClick={() => setShow(true)}
						>
							Verify
						</Button>
					</h1>
					<div className="cards">
						{posts ? (
							posts.map((post, i) => (
								<div className="card-single" key={i}>
									<div>
										<h3>{post.name ? post.name : 'Title'}</h3>
										<h4>
											Post Deadline :{' '}
											<Moment format="DD MMM YYYY">
												{post.bidDeadline
													? post.bidDeadline
													: '23-11-2022'}
											</Moment>
										</h4>
										{post.buyer_name && (
											<h4>Buyer: {post.buyer_name}</h4>
										)}
										{post.buyer_email && (
											<h4>Buyer email: {post.buyer_email}</h4>
										)}
										{post.buyer_mobile && (
											<h4>Buyer mobile: {post.buyer_mobile}</h4>
										)}
										<div className="dashboardIconContainer">
											<span className="dashboardIcon">
												<Link
													style={{
														textDecoration: 'none',
														color: 'white'
													}}
													to={`/auctions/${post.id}`}
												>
													{' '}
													<i className="fa-sharp fa-solid fa-eye"></i>
												</Link>
											</span>
											{post.state < 1 && (
												<span className="dashboardIcon">
													<Link
														style={{
															textDecoration: 'none',
															color: 'white'
														}}
														to={`/edit/${post.id}`}
													>
														{' '}
														<i className="fa-sharp fa-solid fa-edit"></i>
													</Link>
												</span>
											)}
											{'  '}
											<span className="dashboardIcon">
												<Link
													onClick={() => onAuctionDelete(post.id)}
													style={{
														textDecoration: 'none',
														color: 'white'
													}}
												>
													{' '}
													<i className="fa-solid fa-trash"></i>
												</Link>
											</span>
										</div>
									</div>
								</div>
							))
						) : (
							<div
								style={{
									position: 'absolute',
									display: 'flex',
									justifyContent: 'center',
									width: '90vw'
								}}
							>
								<CircularProgress />
							</div>
						)}
					</div>
				</main>
			</div>
		</>
	);
}

export default Dash;
