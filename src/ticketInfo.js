import { useState } from "react";
import { getTicket, getTicketURI, zeroAddress } from "./web3service";
import { TicketCard } from "./ticketCard";

export const TicketInfo = () => {
	const [ticketId, setTicketId] = useState("");

	const [ticketInfo, setTicketInfo] = useState(null);
	const [status,setStatus] = useState(true);

	async function handleTicketInfo({ ticketId }) {
		try {
			setStatus(true);
			const ticketI = await getTicket({ticketId});

			if (
				ticketI.minter === zeroAddress
			) {
				setTicketInfo(null);
				setStatus(false);
				return;
			}
			const ticketURI = await getTicketURI(ticketI.tokenURI);

			setTicketInfo({
				id: Number(ticketI.ticketId),
				name: ticketI.name,
				minter: ticketI.minter,
				date: new Date(Number(ticketI.date)).toISOString(),
				image: `${ticketURI.image}`,
				description: ticketURI.description,
			});
		} catch (e) {
			console.log("error ticket info: ", e);
		}
	}
	console.log()
	return (
		<div
			style={{
				textAlign: "center",
				marginTop: "20px",
				paddingBottom: "10px",
				border: "1px solid black",
			}}
			className="form-container"
		>
			<h2>Ticket Info</h2>
			<div>
				<div className="form-group">
					<label>Ticket ID</label>
					<input
						onChange={(e) => {
							setTicketId(e.target.value);
						}}
					/>
				</div>
				<button
					className="form-group-btn"
					onClick={() => {
						handleTicketInfo({ ticketId });
					}}
				>
					Search
				</button>
			</div>
			{ticketInfo && <TicketCard ticketInfo={ticketInfo} />}
			{!ticketInfo && !status && <p style={{color:"white"}}>Ticket not found</p>}
		</div>
	);
};
