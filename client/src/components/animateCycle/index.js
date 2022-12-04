import React, { useEffect } from 'react';
import frameImg from './frame.png';
import Wheel from './wheel1.png';
import './style.css';

function angle(cx, cy, ex, ey) {
	const dy = ey - cy;
	const dx = ex - cx;

	const rad = Math.atan2(dy, dx);
	const deg = (rad * 180) / Math.PI;

	return deg;
}

const AnimatedCycle = () => {
	useEffect(() => {
		const anchor = document.getElementById('anchor');
		const rekt = anchor.getBoundingClientRect();
		const anchorX = rekt.left + rekt.width / 2;
		const anchorY = rekt.top + rekt.height / 2;
		const wheel = document.querySelectorAll('.wheel');

		document.addEventListener('mousemove', e => {
			const mouseX = e.clientX;
			const mouseY = e.clientY;
			const angleDeg = angle(mouseX, mouseY, anchorX, anchorY);
			wheel.forEach(wheel => {
				wheel.style.transform = `rotate(${90 + angleDeg}deg)`;
				anchor.style.filter = `hue-rotate(${angleDeg}deg)`;
			});
		});

		return () =>
			document.removeEventListener('mousemove', () =>
				console.log('Removed event listner')
			);
	}, []);

	return (
		<div className="mainCycle">
			<img alt="frame" id="anchor" src={frameImg} />
			<div id="wheels">
				<img
					alt="wheel1"
					className="wheel"
					src={Wheel}
					style={{ top: '-2.1rem', right: '2.1rem' }}
				/>
				<img
					alt="wheel2"
					className="wheel"
					src={Wheel}
					style={{ top: '-2.1rem', left: '2.1em' }}
				/>
				{/* <img classname="wheel" src="./wheel.png" style="top:-1rem; left:3.5rem;" /> */}
			</div>
		</div>
	);
};

export default AnimatedCycle;
