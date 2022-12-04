import React from 'react';
import './SideDrawer.css';
import { Link } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function SideDrawer(props) {
	let side = 'side-drawer';
	if (props.show) side = 'side-drawer open';

	return (
		<nav className={side}>
			<div className="toolbar_logo">
				<div>
					<Link to="/">Cycle Auction</Link>
				</div>
			</div>
			<ul>
				<li>
					<Link to="/auctions">Auctions</Link>
				</li>
				<li>
					<Link to="/post">Post</Link>
				</li>
				{true ? (
					<>
						<li>
							<Link to="/dashboard">Dashboard</Link>
						</li>
						<li>
							<Link title="Profile" to="/profile">
								<AccountCircleIcon />
							</Link>
						</li>
					</>
				) : (
					<li>
						<Link to="/login">Login</Link>
					</li>
				)}
			</ul>
		</nav>
	);
}

export default SideDrawer;
