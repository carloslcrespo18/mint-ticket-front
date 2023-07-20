import axios from "axios";
import TicketContract from "./contracts/TicketContract.json";
import Web3 from "web3";
const web3 = new Web3(window.ethereum);
const contractAddress = "0x38cbd31cf2735eea185a9b6c20cf2cbb9898d797";
export const baseIPFSUrl = "https://gateway.pinata.cloud/ipfs/";
export const zeroAddress = "0x0000000000000000000000000000000000000000";
// Sets up a new Ethereum provider and returns an interface for interacting with the smart contract
export async function initializeProvider() {
	await window.ethereum.enable();
	return new web3.eth.Contract(TicketContract.abi, contractAddress);
}

// Displays a prompt for the user to select which accounts to connect
export async function requestAccount() {
	const account = await window.ethereum.request({
		method: "eth_requestAccounts",
	});
	return account[0];
}

export const getTokenInfoFromArray = async (ticketArray) => {
	const id = Number(ticketArray[0]);
	const date = new Date(Number(ticketArray[1])).toISOString();
	const tokenURI = ticketArray[2];
	const name = ticketArray[3];
	const minter = ticketArray[4];
	const onSale = Number(ticketArray[5]);
	const price = Number(ticketArray[6]);
	const ticketURI = await getTicketURI(tokenURI);
	return {
		id,
		name,
		minter,
		date,
		image: `${ticketURI.image}`,
		description: ticketURI.description,
		onSale,
		price,
	};
};

export const getTicketURI = async (tokenURI) => {
	try {
		const ticketURI = await axios.get(`${tokenURI}`, {
			headers: {
				Accept: "text/plain",
			},
		});

		return ticketURI.data;
	} catch (error) {
		console.log(error);
		return null;
	}
};

export const buyTicket = async ({
	seller,
	ticketId,
	ticketQuantities,
	account,
	value,
}) => {
	const contract = await initializeProvider();
	try {
		const onBuy = await contract.methods
			.buyTicket(seller, ticketQuantities, ticketId)
			.send({ from: account ? account : await requestAccount(), value });
		return onBuy;
	} catch (e) {
		console.log("error buying owner: ", e);
		return null;
	}
};

export const addOnSale = async ({ tokenId, price, amount, account }) => {
	const contract = await initializeProvider();
	try {
		const onSale = await contract.methods
			.addOnSale(tokenId, price, amount)
			.send({ from: account });
		return onSale;
	} catch (e) {
		console.log("error fetching owner: ", e);
		return null;
	}
};

export const mintTicket = async ({
	address,
	currentTokenUri,
	name,
	date,
	amount,
	commissions,
	account,
}) => {
	const contract = await initializeProvider();
	const mintedTicket = await contract.methods
		.mintTicket(address, currentTokenUri, name, date, amount, commissions)
		.send({ from: account });

	return mintedTicket;
};

export const getTicket = async ({ ticketId }) => {
	const contract = await initializeProvider();
	const ticket = await contract.methods.tickets(ticketId).call();
	return ticket;
};

export const pinJSONToIPFS = async ({ data }) => {
	const url = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

	try {
		const res = await axios.post(url, data, {
			headers: {
				pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
				pinata_secret_api_key: process.env.REACT_APP_PINATA_API_SECRET,
				pinata_jwt: process.env.REACT_APP_PINATA_JWT,
			},
		});
		return res.data.IpfsHash;
	} catch (error) {
		return null;
	}
};

export const pinFileToIPFS = async ({ file }) => {
	if(!file)return;
	const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";

	const formData = new FormData();
	formData.append("file", file);
	try {
		const res = await axios.post(url, formData, {
			headers: {
				pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
				pinata_secret_api_key: process.env.REACT_APP_PINATA_API_SECRET,
				pinata_jwt: process.env.REACT_APP_PINATA_JWT,
				"Content-Type": "multipart/form-data"
			},
		});
		return res.data.IpfsHash;
	} catch (error) {
		return null;
	}
};

export const getTicketsOnSaleByOwner = async ({ address }) => {
	try {
		const contract = await initializeProvider();
		const sellArray = await contract.methods
			.getTicketsOnSaleByOwner(address)
			.call();

		if (sellArray && sellArray.length > 0) {
			const tokens = await Promise.all(
				sellArray.map(async (ticketI) => {
					console.log({ ticketI });
					const ticket = await getTokenInfoFromArray(ticketI);
					ticket.seller = address;
					console.log({ ticket });
					return ticket;
				})
			);
			return tokens;
		}
		return [];
	} catch (error) {
		return [];
	}
};
