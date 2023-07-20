import { useState } from "react";
import { getTicketsOnSaleByOwner } from "./web3service";
import { TicketCard } from "./ticketCard";

export const TicketsBySeller = () => {
	const [address, setAddress] = useState("");
	const [ticketsInfo, setTicketsInfo] = useState([]);
	const [status,setStatus] = useState(true);

	async function fetchOnSell({ address }) {
			try {
				setStatus(true);
				const tokens = await getTicketsOnSaleByOwner({address})
				setTicketsInfo(tokens);
				if(!tokens || tokens.length === 0){
					setStatus(false);
				}
			} catch (e) {
				console.log("error fetching tokens: ", e);
			}
	}

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
			<h2>Tickets by seller</h2>
			<div>
				<div className="form-group">
					<label>wallet</label>
					<input
						onChange={(e) => {
							setAddress(e.target.value);
						}}
					/>
				</div>
				<button
					className="form-group-btn"
					onClick={() => {
						fetchOnSell({ address });
					}}
				>
					Search
				</button>
			</div>
			{
				ticketsInfo && ticketsInfo.length>0 && ticketsInfo.map((ticket,index)=>{
					return <TicketCard key={index} ticketInfo={ticket}/>
				})
			}
			{!status && <p>{`No tickets found under ${address}`}</p>}
		</div>
	);
};
