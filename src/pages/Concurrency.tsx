import {useState} from "react";
import axios from "axios";

import "./Concurrency.css";

type BoxStatus = "default" | "success" | "fail";
const BOX_COUNT = 100;
const DEV_URL = "http://localhost:8080";
const generateShuffledIndices = () => {
	const indices = Array.from({length: BOX_COUNT}, (_, i) => i);
	for (let i = indices.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[indices[i], indices[j]] = [indices[j], indices[i]];
	}
	return indices;
};

const getBoxColor = (status: BoxStatus) => {
	switch (status) {
		case "success":
			return "success";
		case "fail":
			return "fail";
		default:
			return "default";
	}
};

const Concurrency = () => {
	const [statuses, setStatuses] = useState<BoxStatus[]>(
		Array(100).fill("default")
	);
	const [shuffledIndices, setShuffledIndices] = useState<number[]>(
		generateShuffledIndices()
	);

	const [check, setCheck] = useState("");
	const [id, setId] = useState(null);
	const [name, setName] = useState("쿠폰 없음");
	const [quantity, setQuantity] = useState(0);

	const getCheck = async () => {
		try {
			const response = await axios.get(
				`${DEV_URL}/api/v1/check`
			);
			setCheck(response.data);
		} catch (error) {
			console.error(error);
		}
	};
	const issueAllCoupons = async () => {
		if (id === null) return;
		const promises = Array.from({length: BOX_COUNT}, (_, i) => {
			const userId = i + 1;

			axios
				.post(
					`${DEV_URL}/api/v1/coupon/${id}?userId=${userId}`
				)
				.then((response) => {
					const result = response.data.result;
					if (result === "success") {
						updateBox(i, "success");
					} else {
						updateBox(i, "fail");
					}
				})
				.catch((error) => {
					console.error(`User ${i + 1} 실패 : `, error.message);
				});
		});

		await Promise.all(promises); // 진짜 동시에 날림
	};

	const updateBox = (index: number, state: BoxStatus) => {
		setStatuses((prev) => prev.map((s, i) => (i === index ? state : s)));
	};

	const createCoupon = async () => {
		const n = "쿠폰 없음";
		const q = 0;
		setName(n);
		setQuantity(q);
		setStatuses(Array(BOX_COUNT).fill("default"));
		setShuffledIndices(generateShuffledIndices());

		try {
			const response = await axios.post(
				`${DEV_URL}/api/v1/coupons`
			);
			setName(response.data.couponName);
			setQuantity(response.data.quantity);
			setId(response.data.id);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div>
			<h1>🧾 쿠폰 발급 시뮬레이터</h1>
			<div>
				<button onClick={getCheck}>서버 check</button>
				<p>서버 : {check}</p>
				<button onClick={createCoupon}>쿠폰 생성</button>
				<p>쿠폰 아이디 : {id}</p>
				<p>쿠폰 이름 : {name}</p>
				<p>쿠폰 갯수 : {quantity}</p>
				<button onClick={issueAllCoupons}>쿠폰 발급</button>
			</div>

			<div className="grid">
				{shuffledIndices.map((index) => (
					<div
						key={index}
						className={`box ${getBoxColor(statuses[index])}`}
					/>
				))}
			</div>
		</div>
	);
};

export default Concurrency;
