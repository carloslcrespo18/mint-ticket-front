import { useState } from "react";
import { buyTicket } from "./web3service";
import Web3 from "web3";
import { toast } from "react-toastify";

export const BuyTicket = ({ account, ticketInfo }) => {
	const [seller, setSeller] = useState(ticketInfo ? ticketInfo.seller : "");
	const [ticketQuantities, setTicketQuantities] = useState(1);
	const [ticketId, setTicketID] = useState(ticketInfo ? ticketInfo.id : "");

	async function onBuyTicket({ seller, ticketId, ticketQuantities }) {
		const buyTicketResponse = await buyTicket({
			seller,
			ticketId,
			ticketQuantities,
			account,
			value: ticketInfo
				? String(ticketInfo.value * ticketQuantities)
				: "300000000000000000",
		});
		console.log({buyTicketResponse})
		if(buyTicketResponse){
			toast.success("Tickets bought successfully");
		}else{
			toast.error("Error buying tickets");
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
			<h2>Buy ticket</h2>
			<div>
				<div className="form-group">
					<label>Ticket Id</label>
					<input
					value={ticketId}
					disabled={!!ticketInfo}
						onChange={(e) => {
							setTicketID(e.target.value);
						}}
					/>
				</div>
				<div className="form-group">
					<label>Quantities</label>
					<input
						value={ticketQuantities}
						onChange={(e) => {
							setTicketQuantities(e.target.value);
						}}
					/>
				</div>
				<div className="form-group">
					<label>Seller address</label>
					<input
						value={seller}
						disabled={!!ticketInfo}
						onChange={(e) => {
							setSeller(e.target.value);
						}}
					/>
				</div>
				<button
					className="form-group-btn"
					onClick={() => {
						onBuyTicket({ seller, ticketId, ticketQuantities });
					}}
				>
					Buy
				</button>
			</div>
			{ticketInfo && (
				<p style={{ color: "#ff8533" }}>
					Total Price:{" "}
					{Web3.utils.fromWei(
						String(ticketInfo.value * ticketQuantities),
						"ether"
					)} ETH
				</p>
			)}
		</div>
	);
};
