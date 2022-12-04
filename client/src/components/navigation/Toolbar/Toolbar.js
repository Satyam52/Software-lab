import React from 'react';
import './Toolbar.css';
import Hamburger from '../Hamburger/Hamburger';
import { Link } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useAuth0 } from '@auth0/auth0-react';
import { CircularProgress } from '@mui/material';
import IITB from './iitb.png';

function Toolbar(props) {
	const { isAuthenticated, logout, isLoading, loginWithRedirect } =
		useAuth0();
	return (
		<header className="toolbar" id="toolbar-top">
			<nav className="toolbar_navigation">
				<div className="toggle_toolbar_button">
					<Hamburger click={props.SideToggle} />
				</div>
				<div className="toolbar_logo">
					<img
						className="toolbar_logo_image"
						src={IITB}
						alt="iitt_logo"
					/>
					<div>
						<Link style={{ textTransform: 'uppercase' }} to="/">
							Best Bids
						</Link>
					</div>
				</div>
				<div className="spacer" />
				<div className="toolbar_navigation_items">
					<ul>
						<li>
							<Link to="/auctions">Auctions</Link>
						</li>
						<li>
							<Link to="/post">Post</Link>
						</li>
						{!isLoading ? (
							isAuthenticated ? (
								<>
									<li>
										<Link to="/dashboard">Dashboard</Link>
									</li>
									<li>
										<Link to="#">
											<LogoutOutlinedIcon
												style={{ cursor: 'pointer' }}
												onClick={() => {
													logout({
														returnTo: window.location.origin
													});
												}}
											/>
										</Link>
									</li>
									{/* <li>
										<Link title="Profile" to="/profile">
											<AccountCircleIcon />
										</Link>
									</li> */}
								</>
							) : (
								<li onClick={() => loginWithRedirect()}>
									<Link to="#">Login</Link>
								</li>
							)
						) : (
							<li>
								<CircularProgress color="secondary" size={25} />
							</li>
						)}
					</ul>
				</div>
			</nav>
		</header>
	);
}

export default Toolbar;
