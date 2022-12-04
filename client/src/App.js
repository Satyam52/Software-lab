import Navigation from './components/navigation';
import './App.css';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import Caraousel from './components/carousel';
import TopNew from './components/topNew';
import Cycles from './components/cycles';
import AnimatedCycle from './components/animateCycle';
import CycleDetails from './components/cycle';
import AuthWithHistory from './components/auth/auth';
import ProtectedRoute from './components/auth/protectedRoute';
import Dashboard from './components/dashboard';
import { useEffect } from 'react';
import Form from './components/form';
import Img from './curveNegative.svg';
import Footer from './components/footer';
import EditForm from './components/form/edit';

const HomePage = () => (
	<>
		<div
			style={{
				// position: 'absolute',
				zIndex: -1,
				// top: 0,
				left: 0,
				right: 0,
				height: '300px',
				background: `url(${Img})`
			}}
		>
			{/* <TopNew /> */}
			<h1 style={{ textAlign: 'center' }}>
				Now get your Cycle of choice
			</h1>
			<div
				style={{
					height: '300px',
					display: 'flex',
					justifyContent: 'space-evenly'
				}}
			>
				<div></div>
				<div>
					<AnimatedCycle />
				</div>
			</div>
		</div>
		<Caraousel />
	</>
);

function App() {
	useEffect(() => {
		window.addEventListener('scroll', () => {
			let distanceY =
				window.pageYOffset || document.documentElement.scrollTop;
			let shrinkOn = 200;
			const headerEl = document.getElementById('toolbar-top');

			if (distanceY > shrinkOn) {
				headerEl.classList.add('smaller');
			} else {
				headerEl.classList.remove('smaller');
			}
		});
	}, []);
	return (
		<Router>
			<AuthWithHistory>
				<Navigation />
				{/* <AnimatedCycle /> */}
				<div className="App">
					<Switch>
						<Route exact path="/">
							<HomePage />
						</Route>
						<Route exact path="/auctions">
							<Cycles />
						</Route>
						<Route exact path="/auctions/:id">
							<CycleDetails />
						</Route>

						<ProtectedRoute
							exact
							path="/dashboard"
							component={Dashboard}
						/>
						<ProtectedRoute exact path="/post" component={Form} />
						<ProtectedRoute
							exact
							path="/edit/:id"
							component={EditForm}
						/>
					</Switch>
					<Footer />
				</div>
			</AuthWithHistory>
		</Router>
	);
}

export default App;
