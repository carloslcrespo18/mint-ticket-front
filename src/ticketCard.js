import { useState } from "react";
import Web3 from "web3";
import { BuyTicket } from "./buyTicket";

export const TicketCard = ({ ticketInfo }) => {
	const [buyTicket, setBuyTicket] = useState(false);

	return (
		<div style={{ paddingBlock: "2rem" }}>
			<h2>{ticketInfo.name}</h2>
			<img
				src={ticketInfo.image}
				style={{ maxWidth: "100%" }}
				alt="ticket"
			/>
			<div style={{ textAlign: "start" }}>
				<p className="card-text">Ticket ID: {ticketInfo.id}</p>
				<p className="card-text">Ticket Date: {ticketInfo.date}</p>
				<p className="card-text">Ticket Minter: {ticketInfo.minter}</p>
				<p className="card-text">{ticketInfo.description}</p>
				{ticketInfo.onSale && (
					<p className="card-text">
						Tickets on sale: {ticketInfo.onSale}
					</p>
				)}
				{ticketInfo.price && (
					<p className="card-text">
						Price:{" "}
						{Web3.utils.fromWei(String(ticketInfo.price), "ether")}{" "}
						ETH
					</p>
				)}
				{ticketInfo.onSale &&
					ticketInfo.onSale > 0 &&
					(buyTicket ? (
						<button
							className="form-group-btn"
							onClick={() => {
								setBuyTicket(false);
							}}
						>
							Cancel
						</button>
					) : (
						<button
							className="form-group-btn"
							onClick={() => {
								setBuyTicket(true);
							}}
						>
							Buy tickets
						</button>
					))}
				{buyTicket && (
					<BuyTicket
						ticketInfo={{
							value: ticketInfo.price,
							seller: ticketInfo.seller,
							id: ticketInfo.id,
						}}
					/>
				)}
			</div>
		</div>
	);
};
