import React, { useEffect, useState } from 'react';
import Card from '../card';
import axios from 'axios';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
const PERPAGE = 9;

const Cycles = () => {
	const [params, setParams] = useState({
		sort: 'NEW', // OLD, POPULAR
		search: ''
	});
	const [page, setPage] = useState(0);
	const [cycles, setCycles] = useState([]);
	const [currPage, setCurrPage] = useState(1);

	const handlePage = (event, value) => {
		setCurrPage(value);
	};
	useEffect(() => {
		const allBids = async () => {
			try {
				const res = await axios.get(
					'http://localhost:8000/api/v1/paginate'
				);
				if (res.data % 9 == 0) {
					setPage(parseInt(res.data / PERPAGE));
				} else {
					setPage(parseInt(res.data / PERPAGE) + 1);
				}
			} catch (error) {
				console.error(error);
			}
		};

		const fetchAll = async () => {
			try {
				const res = await axios.get(
					`http://localhost:8000/api/v1/auctions/${currPage}`
				);
				setCycles(res.data);
			} catch (error) {
				console.error(error);
			}
		};
		allBids();
		fetchAll();
	}, [currPage]);

	return (
		<>
			<div className="cardContent-wrapper">
				{cycles.map((item, idx) => (
					<Card key={idx} item={item} />
				))}
			</div>
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					marginBottom: '20px'
				}}
			>
				<Pagination
					onChange={handlePage}
					count={page}
					page={currPage}
					shape="rounded"
				/>
			</div>
		</>
	);
};

export default Cycles;
