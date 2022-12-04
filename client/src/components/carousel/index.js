import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper';
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './styles.css';

import { Navigation } from 'swiper';
import axios from 'axios';

function getWindowSize() {
	const { innerWidth, innerHeight } = window;
	return { innerWidth, innerHeight };
}

export default function App() {
	const [windowSize, setWindowSize] = useState(getWindowSize());
	const [trending, setTrend] = useState([]);
	function handleWindowResize() {
		setWindowSize(getWindowSize());
	}

	useEffect(() => {
		window.addEventListener('resize', handleWindowResize);
		const fetch = async () => {
			try {
				const res = await axios.get(
					'http://localhost:8000/api/v1/trending'
				);
				setTrend(res.data);
			} catch (error) {
				console.log(error);
			}
		};
		fetch();

		return () => {
			window.removeEventListener('resize', handleWindowResize);
		};
	}, []);

	return (
		<>
			<Typography
				// className={styles.title}
				style={{ marginTop: '20px' }}
				variant="h4"
			>
				Trending
			</Typography>
			{/* <Divider /> */}
			<Swiper
				slidesPerView={
					windowSize.innerWidth > 1100
						? 3
						: windowSize.innerWidth > 600
						? 2
						: 1
				}
				spaceBetween={30}
				pagination={{
					clickable: true
				}}
				navigation={true}
				modules={[Navigation, Autoplay]}
				className="mySwiper"
				autoplay={{
					delay: 3000,
					disableOnInteraction: false
				}}
			>
				{trending.map((item, idx) => (
					<SwiperSlide key={idx} className="carausel-img">
						<Link
							style={{
								textDecoration: 'none',
								color: 'white'
							}}
							to={`/auctions/${item.id}`}
						>
							<img src={'http://localhost:8000' + item.image} />
							<div
								style={{
									position: 'absolute',
									bottom: '40px',
									left: '20px',
									fontFamily: 'cursive',
									fontWeight: 'bold'
								}}
							>
								{item.name}
							</div>
						</Link>
					</SwiperSlide>
				))}
			</Swiper>
		</>
	);
}
