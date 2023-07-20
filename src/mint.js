import { useState } from "react";
import { Plus, Trash2 } from "react-feather";
import {
	baseIPFSUrl,
	mintTicket,
	pinFileToIPFS,
	pinJSONToIPFS,
} from "./web3service";

export const Mint = ({ account }) => {
	const [address, setAddress] = useState("");
	const [date, setDate] = useState("");
	const [name, setName] = useState("");
	const [amount, setAmount] = useState(0);
	const [description, setDescription] = useState("");
	const [commissionsWallets, setCommissionsWallets] = useState([]);
	const [commissionsAmount, setCommissionsAmount] = useState([]);
	const [walletComm, setWalletComm] = useState("");
	const [amountComm, setAmountComm] = useState(0);
	const [isMinting, setIsMinting] = useState(false);
	const [image, setImage] = useState(null);

	const handleAddCommission = () => {
		if (!walletComm || !amountComm) {
			return;
		}
		const newCommWallets = [...commissionsWallets, walletComm];
		setCommissionsWallets(newCommWallets);
		const newcommAmounts = [
			...commissionsAmount,
			parseInt(amountComm) >>> 0,
		];
		setCommissionsAmount(newcommAmounts);
		setWalletComm("");
		setAmountComm(0);
	};

	const handleMint = async () => {
		setIsMinting(true);
		const commissions = commissionsWallets.map((comm, index) => {
			return [
				commissionsWallets[index],
				parseInt(Number(commissionsAmount[index]).toFixed(2)) * 100,
			];
		});
		const imageIpfsHash = await pinFileToIPFS({ file: image });

		const data = {
			name,
			description,
			image: `${baseIPFSUrl}${imageIpfsHash}`,
			attributes: null,
		};

		const IpfsHash = await pinJSONToIPFS({ data });

		if (IpfsHash) {
			const currentTokenUri = `${baseIPFSUrl}${IpfsHash}`;
			try {
				const mintedTicket = await mintTicket({
					address,
					currentTokenUri,
					name,
					date,
					amount,
					commissions,
					account,
				});
				console.log({ mintedTicket });
			} catch (e) {
				console.log("error minting: ", e);
			}
		}
		setIsMinting(false);
	};

	const handleDeleteCommission = (index) => {
		const newCommWallets = [...commissionsWallets];
		newCommWallets.splice(index, 1);
		setCommissionsWallets(newCommWallets);
		const newcommAmounts = [...commissionsAmount];
		newcommAmounts.splice(index, 1);
		setCommissionsAmount(newcommAmounts);
	};

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
			<style>
				{`.flexContainer{
					display:flex;
					flex-direction: column;
					justify-content: center;
					padding: 0.5rem;
					gap: 0.25rem;
					margin: 0.25rem;
					max-width: 200px;
				}`}
			</style>
			<h2>Mint</h2>
			<div
				style={{
					display: "grid",
					placeContent: "center",
					placeItems: "center",
					width: "100%",
				}}
			>
				<div className="form-group">
					<label>Image</label>
					<input
						type="file"
						accept=".png,.jpg,.jpeg"
						onBlur={(e) => {
							setImage(e.target.files[0]);
						}}
					/>
					{image && (
						<img
							style={{ display: "block", margin: "1rem auto" }}
							src={URL.createObjectURL(image)}
							width={100}
							height={100}
							alt="imag"
						/>
					)}
				</div>
				<div className="form-group">
					<label>Event date</label>
					<input
						type="date"
						onBlur={(e) => {
							setDate(new Date(e.target.value).getTime());
						}}
					/>
				</div>
				<div className="form-group">
					<label>Event name</label>
					<input
						value={name}
						onChange={(e) => {
							setName(e.target.value);
						}}
					/>
				</div>
				<div className="form-group">
					<label>Event description</label>
					<input
						value={description}
						onChange={(e) => {
							setDescription(e.target.value);
						}}
					/>
				</div>
				<div className="form-group">
					<label>Wallet reciever</label>
					<input
						value={address}
						onChange={(e) => {
							setAddress(e.target.value);
						}}
					/>
				</div>
				<div className="form-group">
					<label>Amount of tickets</label>
					<input
						value={amount}
						onChange={(e) => {
							setAmount(e.target.value);
						}}
					/>
				</div>
				<div
					className="form-group"
					style={{
						border: "1px solid rgba(255,255,255,0.15)",
						padding: "1rem",
						borderRadius: "8px",
					}}
				>
					<p>
						<strong>Add commissions</strong>
					</p>
					<div className="form-group">
						<label>Address</label>
						<input
							value={walletComm}
							onChange={(e) => {
								setWalletComm(e.target.value);
							}}
						/>
					</div>
					<div className="form-group">
						<label>Percentage</label>
						<input
							type="number"
							min={0}
							value={amountComm}
							onChange={(e) => {
								setAmountComm(e.target.value);
							}}
						/>
					</div>
					<button
						style={{ display: "block", margin: "1rem auto" }}
						onClick={() => {
							handleAddCommission();
						}}
					>
						<Plus />
					</button>
				</div>
				<div className="form-group" style={{ maxWidth: "100%" }}>
					{commissionsWallets &&
						commissionsWallets.length > 0 &&
						commissionsWallets.map((a, index) => {
							return (
								<div
									key={index}
									style={{
										display: "flex",
										flexDirection: "column",
										border: "1px solid rgba(0,0,0,0.15)",
									}}
								>
									<p>
										<strong>wallet:</strong>{" "}
										{commissionsWallets[index]}
									</p>
									<p>
										{" "}
										<strong>amount:</strong>{" "}
										{commissionsAmount[index]}%
									</p>
									<button
										onClick={() =>
											handleDeleteCommission(index)
										}
									>
										<Trash2 />
									</button>
								</div>
							);
						})}
				</div>
				<button
					className="form-group-btn"
					onClick={handleMint}
					disabled={isMinting}
				>
					Mint
				</button>
			</div>
		</div>
	);
};
