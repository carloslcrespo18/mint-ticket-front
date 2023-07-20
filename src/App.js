import "./App.css";
import { useState } from "react";
// import { ethers } from 'ethers';
// import {
// parseEther,
//  formatEther } from '@ethersproject/units';
import { Mint } from "./mint";
import { TicketInfo } from "./ticketInfo";
import { TicketsBySeller } from "./ticketsBySeller";
import { AddOnSale } from "./addOnSale";
import { BuyTicket } from "./buyTicket";
import { initializeProvider } from "./web3service";
import { ConnectWallet } from "./connectWallet";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
	// Use hooks to manage component state
	const [account, setAccount] = useState("");
	const [isOwner, setIsOwner] = useState(false);

	return (
		<div
			style={{
				textAlign: "center",
				margin: "0 auto",
				padding: "1rem 2rem 2rem 2rem",
			}}
		>
			<ToastContainer />
			<ConnectWallet
				account={account}
				isOwner={isOwner}
				setAccount={setAccount}
				setOwner={setIsOwner}
			/>

			{isOwner && (
				<div>
					<Mint account={account} />
				</div>
			)}
			{account && (
				<>
					<div>
						<TicketInfo
							initializeProvider={initializeProvider}
							account={account}
						/>
					</div>
					<div>
						<TicketsBySeller />
					</div>
					<div>
						<AddOnSale account={account} />
					</div>
					<div>
						<BuyTicket account={account} />
					</div>
				</>
			)}
		</div>
	);
}

export default App;
