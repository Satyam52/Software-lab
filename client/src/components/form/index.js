import React, { useState } from 'react';
import {
	Dropzone,
	FileItem,
	FullScreenPreview
} from '@dropzone-ui/react';
import {
	Stepper,
	Step,
	StepLabel,
	TextField,
	InputAdornment,
	TextareaAutosize,
	Button
} from '@mui/material';
import './form.css';
import {
	CurrencyRupeeSharp,
	SkipNext,
	SkipPrevious
} from '@mui/icons-material';
import BackupRoundedIcon from '@mui/icons-material/BackupRounded';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { useParams, useHistory } from 'react-router-dom';

const formStep = [
	'Fill the cycle details',
	'Upload images',
	'Submit the form'
];

const PostForm = () => {
	let history = useHistory();
	const [files, setFiles] = useState([]);
	const [step, setStep] = useState(0);
	const [imageSrc, setImageSrc] = useState(undefined);
	const { getAccessTokenSilently } = useAuth0();
	const [formState, setFormState] = useState({
		title: '',
		buyOutPrice: 0,
		basePrice: 0,
		maxPrice: 0,
		bidDeadline: dayjs(new Date()) + 86400,
		bidStart: dayjs(new Date()) + 1,
		desc: ''
	});

	const updateFiles = incommingFiles => {
		setFiles(incommingFiles);
	};
	const onDelete = id => {
		setFiles(files.filter(x => x.id !== id));
	};
	const handleSee = imageSource => {
		setImageSrc(imageSource);
	};

	const onNext1Handler = () => {
		let now = new Date();
		if (formState.title.length < 10) {
			Swal.fire(
				'Title should be more than 10 characters',
				'',
				'error'
			);
		} else if (parseInt(formState.buyOutPrice) <= 0) {
			Swal.fire(
				'Buyout price should be greater than 0',
				'',
				'error'
			);
		} else if (parseInt(formState.basePrice) <= 0) {
			Swal.fire(
				'Base bid price should be greater than 0',
				'',
				'error'
			);
		} else if (formState.desc.length < 50) {
			Swal.fire(
				'Description should be greater than 50 character',
				'',
				'error'
			);
		} else if (now > formState.bidDeadline) {
			Swal.fire(
				'Bid deadline should be greater than current time',
				'',
				'error'
			);
		} else {
			setStep(step + 1);
		}
	};

	const onChangeHandler = e => {
		setFormState(prevState => ({
			...prevState,
			[e.target.name]: e.target.value
		}));
	};

	const onSubmit = async () => {
		const {
			title,
			buyOutPrice,
			basePrice,
			bidDeadline,
			desc,
			maxPrice,
			bidStart
		} = formState;

		const images = {
			image_1: null,
			image_2: null,
			image_3: null,
			image_4: null,
			image_5: null
		};
		files.map((file, idx) => {
			images[`image_${idx + 1}`] = file.file;
		});

		const data = {
			name: title,
			basePrice: parseInt(basePrice),
			buyOutPrice: parseInt(buyOutPrice),
			bidDeadline: new Date(bidDeadline),
			desc: desc,
			maxPrice: maxPrice,
			bidStart: new Date(bidStart),
			image_1: images['image_1'],
			image_2: images['image_2'],
			image_3: images['image_3'],
			image_4: images['image_4'],
			image_5: images['image_5']
		};

		try {
			let token = await getAccessTokenSilently();
			await axios.post(
				'http://localhost:8000/api/v1/auction/post/',
				data,
				{
					headers: {
						// 'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
						'Content-Type': 'multipart/form-data'
					}
				}
			);
			Swal.fire('Auction added successfully', '', 'success');
			history.push('/auctions');
		} catch (error) {
			console.error(error);
		}
	};
	return (
		<div>
			<div>
				<Stepper activeStep={step} alternativeLabel>
					{formStep.map(label => (
						<Step key={label}>
							<StepLabel>{label}</StepLabel>
						</Step>
					))}
				</Stepper>
			</div>
			<div className="cycleForm">
				<div style={{ width: '80%', maxWidth: '900px' }}>
					{step === 0 ? (
						<>
							<TextField
								fullWidth
								label="Title"
								placeholder="Give a clicky title including brand and bicyle name"
								name="title"
								onChange={onChangeHandler}
								value={formState.title}
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
										value={formState.bidStart}
										onChange={newValue => {
											setFormState(prevState => ({
												...prevState,
												bidStart: newValue
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
					) : step === 1 ? (
						<>
							<Dropzone
								onChange={updateFiles}
								value={files}
								onClean
								clickable={'true'}
								accept={'image/*,.png'}
								label={'Drop Files here or click to browse'}
								minHeight={'250px'}
								maxHeight={'500px'}
								disableScroll
								maxFiles={5}
								fakeUploading
							>
								{files.length > 0 &&
									files.map(file => (
										<FileItem
											{...file}
											key={file.id}
											onDelete={onDelete}
											preview
											info
											hd
											resultOnTooltip
											onSee={handleSee}
										/>
									))}
							</Dropzone>
							<FullScreenPreview
								imgSource={imageSrc}
								openImage={imageSrc}
								onClose={e => handleSee(undefined)}
							/>
						</>
					) : (
						<>You are about to Submit</>
					)}
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							marginTop: '20px'
						}}
					>
						{step === 0 ? (
							<>
								<Button
									onClick={onNext1Handler}
									variant="contained"
									endIcon={<SkipNext />}
								>
									Next
								</Button>
							</>
						) : step === 1 ? (
							<>
								{' '}
								<Button
									variant="contained"
									endIcon={<SkipPrevious />}
									onClick={() => setStep(step - 1)}
								>
									Back
								</Button>
								<Button
									onClick={() => {
										if (files.length < 1) {
											Swal.fire(
												'Please upload atleast one image',
												'',
												'error'
											);
										} else {
											setStep(step + 1);
										}
									}}
									variant="contained"
									endIcon={<SkipNext />}
								>
									Next
								</Button>
							</>
						) : (
							<>
								<Button
									variant="contained"
									endIcon={<SkipPrevious />}
									onClick={() => setStep(step - 1)}
								>
									Back
								</Button>
								<Button
									variant="contained"
									onClick={onSubmit}
									endIcon={<BackupRoundedIcon />}
								>
									Submit
								</Button>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default PostForm;
