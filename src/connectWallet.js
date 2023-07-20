import { useState } from "react";
import { initializeProvider, requestAccount } from "./web3service";
import { toast } from "react-toastify";

export const ConnectWallet = ({ setOwner, setAccount, account, isOwner }) => {
	const [contractOwner, setContractOwner] = useState(0);

	const handleConnectWallet = async () => {
		if (typeof window.ethereum !== "undefined") {
			const contract = await initializeProvider();
			try {
				console.log({ contract, methods: contract.methods });
				const owner = await contract.methods.owner().call();
				console.log({ owner });
				setContractOwner(owner);
				const currentAccount = await requestAccount();
				setAccount(currentAccount);
				setOwner(owner.toLowerCase() === currentAccount);
				toast.success("Wallet connected succesfully")
			} catch (e) {
				toast.error("Error connecting wallet")
				console.log("error fetching owner: ", e);
			}
		}
	};

	return account ? (
		<div
			style={{
				textAlign: "center",
				marginTop: "20px",
				paddingBottom: "10px",
				border: "1px solid black",
			}}
			className="form-container"
		>
			<p>Connected Account: {account}</p>
			<p>Contract Owner: {contractOwner}</p>
			<p>Is owner: {String(isOwner)}</p>
		</div>
	) : (
		<div
			style={{
				textAlign: "center",
				marginTop: "20px",
				paddingBottom: "10px",
				border: "1px solid black",
			}}
			className="form-container"
		>
			<button className="form-group-btn" onClick={handleConnectWallet}>
				Connect Wallet
			</button>
		</div>
	);
};
