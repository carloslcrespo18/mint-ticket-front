import { useState } from "react";
import { addOnSale } from "./web3service";

export const AddOnSale = ({ account }) => {
	const [tokenId, setTokenId] = useState("");
	const [price, setPrice] = useState("");
	const [amount, setAmount] = useState("");

	async function onAddSale({ tokenId, price, amount }) {
		await addOnSale({ tokenId, price, amount, account })
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
			<h2>Add on sale</h2>
			<div>
				<div className="form-group">
					<label>Ticket Id</label>
					<input onChange={(e) => {setTokenId(e.target.value)}} />
				</div>
				<div className="form-group">
					<label>Price</label>
					<input onChange={(e) => {setPrice(e.target.value)}} />
				</div>
				<div className="form-group">
					<label>Amount of tickets</label>
					<input onChange={(e) => {setAmount(e.target.value)}} />
				</div>
                <button className="form-group-btn" onClick={()=>{
                    onAddSale({tokenId,price,amount})
                }}>Add</button>
			</div>
            <div>
                {/* {TicketInfo && <>{JSON.stringify(TicketInfo)}</>} */}
            </div>
		</div>
	);
};
