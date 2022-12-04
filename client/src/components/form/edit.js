import React, { useEffect, useState } from 'react';
import {
	TextField,
	InputAdornment,
	TextareaAutosize,
	Button
} from '@mui/material';
import './form.css';
import { CurrencyRupeeSharp } from '@mui/icons-material';
import BackupRoundedIcon from '@mui/icons-material/BackupRounded';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { useParams, useHistory } from 'react-router-dom';

const PostForm = () => {
	const { id } = useParams();
	let history = useHistory();

	const { getAccessTokenSilently } = useAuth0();
	const [formState, setFormState] = useState({
		id: 0,
		name: '',
		buyOutPrice: 0,
		basePrice: 0,
		maxPrice: 0,
		bidDeadline: dayjs(new Date()) + 86400,
		bidStartTime: dayjs(new Date()) + 1,
		desc: ''
	});

	const onChangeHandler = e => {
		setFormState(prevState => ({
			...prevState,
			[e.target.name]: e.target.value
		}));
	};

	const verifyHandler = () => {
		let now = new Date();
		if (formState.name.length < 10) {
			Swal.fire(
				'Title should be more than 10 characters',
				'',
				'error'
			);
			return false;
		} else if (parseInt(formState.buyOutPrice) <= 0) {
			Swal.fire(
				'Buyout price should be greater than 0',
				'',
				'error'
			);
			return false;
		} else if (parseInt(formState.basePrice) <= 0) {
			Swal.fire(
				'Base bid price should be greater than 0',
				'',
				'error'
			);
			return false;
		} else if (
			parseInt(formState.maxPrice) <= 0 ||
			parseInt(formState.maxPrice) < parseInt(formState.basePrice)
		) {
			Swal.fire(
				'Max bid price should be greater than 0 and base price',
				'',
				'error'
			);
			return false;
		} else if (formState.desc.length < 50) {
			Swal.fire(
				'Description should be greater than 50 character',
				'',
				'error'
			);
			return false;
		} else if (now > formState.bidDeadline) {
			Swal.fire(
				'Bid deadline should be greater than current time',
				'',
				'error'
			);
			return false;
		} else {
			return true;
		}
	};

	const onSubmit = async () => {
		if (verifyHandler()) {
			const {
				name,
				buyOutPrice,
				basePrice,
				bidDeadline,
				desc,
				maxPrice,
				bidStartTime
			} = formState;

			const data = {
				id: id,
				name: name,
				basePrice: parseInt(basePrice),
				buyOutPrice: parseInt(buyOutPrice),
				bidDeadline: new Date(bidDeadline),
				desc: desc,
				maxPrice: maxPrice,
				bidStart: new Date(bidStartTime)
			};

			try {
				let token = await getAccessTokenSilently();
				await axios.put(
					'http://localhost:8000/api/v1/auction/post/',
					data,
					{
						headers: {
							Authorization: `Bearer ${token}`,
							'Content-Type': 'application/json'
						}
					}
				);
				Swal.fire('Details modified successfully', '', 'success');
				history.push('/dashboard');
			} catch (error) {
				console.error(error);
			}
		}
	};

	useEffect(() => {
		const fetchAndPopulate = async () => {
			try {
				const res = await axios.get(
					`http://localhost:8000/api/v1/auction/${id}/`
				);
				setFormState(res.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAndPopulate();
	}, []);
	return (
		<div>
			<h2 style={{ textAlign: 'center' }}>Edit Cycle Details</h2>
			<div className="cycleForm">
				<div style={{ width: '80%', maxWidth: '900px' }}>
					<>
						<TextField
							fullWidth
							label="name"
							placeholder="Give a clicky title including brand and bicyle name"
							name="name"
							onChange={onChangeHandler}
							value={formState.name}
						/>
						<div
							style={{
								marginTop: '20px',
								display: 'flex',
								justifyContent: 'space-between'
							}}
						>
							<TextField
								label="Buyout Price"
								id="outlined-start-adornment"
								name="buyOutPrice"
								onChange={onChangeHandler}
								value={formState.buyOutPrice}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<CurrencyRupeeSharp />
										</InputAdornment>
									)
								}}
							/>
							<TextField
								label="Starting bid price"
								id="outlined-start-adornment"
								name="basePrice"
								value={formState.basePrice}
								onChange={onChangeHandler}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<CurrencyRupeeSharp />
										</InputAdornment>
									)
								}}
							/>

							<TextField
								label="Maximum bid price"
								id="outlined-start-adornment"
								name="maxPrice"
								value={formState.maxPrice}
								onChange={onChangeHandler}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<CurrencyRupeeSharp />
										</InputAdornment>
									)
								}}
							/>
						</div>{' '}
						<div
							style={{
								marginTop: '20px',
								display: 'flex',
								justifyContent: 'space-between'
							}}
						>
							<LocalizationProvider dateAdapter={AdapterDayjs}>
								<DateTimePicker
									renderInput={props => <TextField {...props} />}
									label="Auction start time"
									minDateTime={dayjs(new Date())}
									value={formState.bidStartTime}
									onChange={newValue => {
										setFormState(prevState => ({
											...prevState,
											bidStartTime: newValue
										}));
									}}
								/>

								<DateTimePicker
									renderInput={props => <TextField {...props} />}
									label="Auction end time"
									minDateTime={dayjs(new Date())}
									value={formState.bidDeadline}
									onChange={newValue => {
										setFormState(prevState => ({
											...prevState,
											bidDeadline: newValue
										}));
									}}
								/>
							</LocalizationProvider>
						</div>
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								marginTop: '20px'
							}}
						>
							<TextareaAutosize
								aria-label="Description"
								minRows={10}
								placeholder="Give a brief description about your bicycle"
								style={{ width: '100%' }}
								name="desc"
								onChange={onChangeHandler}
								value={formState.desc}
							/>
						</div>
					</>

					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							marginTop: '20px'
						}}
					>
						<>
							<Button
								variant="contained"
								onClick={onSubmit}
								endIcon={<BackupRoundedIcon />}
							>
								Submit
							</Button>
						</>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PostForm;
