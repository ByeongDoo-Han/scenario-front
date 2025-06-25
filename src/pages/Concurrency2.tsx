import {useState} from "react";
import axios from "axios";

import "./Concurrency.css";
import About from "./About";
import Title from "./Title";

interface Coupon {
  id: number;
  couponName: string;
  quantity: number;
}

type BoxStatus = "default" | "success" | "fail";
const BOX_COUNT_8080 = 500;
const BOX_COUNT_8081 = 500;
const DEV_URL_8080 = "http://localhost:8080";
const DEV_URL_8081 = "http://localhost:8081";

const generateShuffledIndices = () => {
	const indices = Array.from({length: BOX_COUNT_8080+BOX_COUNT_8081}, (_, i) => i);
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

const Concurrency2 = () => {
	const [id, setId] = useState<number | null>(null);
	const [coupon, setCoupon] = useState<Coupon | null>(null);
	const [success, setSuccess] = useState(0);
	const [shuffledIndices, setShuffledIndices] = useState<number[]>(
		generateShuffledIndices()
	);
	const [boxes, setBoxes] = useState<BoxStatus[]>(Array(BOX_COUNT_8080+BOX_COUNT_8081).fill("default"));

	const applyCoupon = async () => {
		const promises = [];

		for (let i = 0; i < BOX_COUNT_8080 + BOX_COUNT_8081; i++) {
			const studentId = i + 1;
			const targetUrl = studentId < 501
			? `${DEV_URL_8080}/api/v1/coupon/${id}?userId=${studentId}`
			: `${DEV_URL_8081}/api/v1/coupon/${id}?userId=${studentId}`;

			// 요청을 만들고 배열에 추가만
			promises.push(axios.post(targetUrl)
			.then((response) => {
				const result = response.data.result;
				if (result === "success") {
					updateBox(i, "success");
					setSuccess((prev) => prev + 1);
				} else {
					updateBox(i, "fail");
				}
			})
			.catch((err) => {
				updateBox(i, "fail");
				console.error(`Student ${studentId} 실패`, err.message);
			}));
		}
		await Promise.all(promises);
	};

	const applyCouponNotSync = async () => {
		const promises = Array.from({length: BOX_COUNT_8080+BOX_COUNT_8081}, (_, i) => {
			const studentId = i + 1;
			const targetUrl = studentId < 51
			? `${DEV_URL_8080}/api/v1/coupon/notsync/${id}?userId=${studentId}`
			: `${DEV_URL_8081}/api/v1/coupon/notsync/${id}?userId=${studentId}`;
			
			// ❗ 반드시 return
			return axios.post(targetUrl)
			.then((response) => {
			  const result = response.data.result;
			  if (result === "success") {
				updateBox(i, "success");
				setSuccess((prev) => prev + 1);
			  } else {
				updateBox(i, "fail");
			  }
			})
			.catch((error) => {
			  console.error(`Student ${i +1} 실패 : `, error.message);
			  updateBox(i, "fail");
			});
		});
		await Promise.all(promises);
	};

	const updateBox = (index: number, state: BoxStatus) => {
		setBoxes((prev) => prev.map((s, i) => (i === index ? state : s)));
		
	};

	// const updateQuantityList = (num: number) => {
	// 	setQuantityList(prev => {
	// 		const newList = [num, ...prev];
	// 		return newList.slice(0, 5); // 마지막 5개만 유지
	// 	  });
	// };

	const createCoupon = async () => {
		
		setSuccess(0);
		setBoxes(Array(BOX_COUNT_8080+BOX_COUNT_8081).fill("default"));
		setShuffledIndices(generateShuffledIndices());
		try{
			const response = await axios.post(`${DEV_URL_8080}/api/v1/coupon`)
			
			setCoupon(response.data);
			setId(response.data.id);
			console.log(response.data);
			// const r = await axios.get(`${DEV_URL}/api/v1/course/${id}`)
			// updateQuantityList(r.data.quantity);
			// setLecture(r.data);
		} catch (error) {
			console.error(error);
		}
		// list();
	};

	return (
		<div className="container">
			<About/>
			<div className="content-wrapper">
				<Title title="동시성 제어 시각화" color="antiquewhite" padding="1rem"/>

				<div className="controls">
					<div>
						<button onClick={createCoupon}>쿠폰 생성</button>
						<button onClick={applyCoupon}>정상 수강 신청</button>
						<button onClick={applyCouponNotSync}>동시성 충돌 수강 신청</button>
					</div>
				</div>
				<div className="table-wrapper">
					<table className="info-table">
						<thead>
							<tr>
								<th>번호</th>
								<th>쿠폰이름</th>
								<th>수량</th>
								<th>발급 인원</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>{coupon?.id || "-"}</td>
								<td>{coupon?.couponName || "-"}</td>
								<td>{coupon?.quantity || "-"}</td>
								<td>{success || "-"}</td>
							</tr>
							{/* <tr>
								<td>{lectureList?.[1].id || "-"}</td>
								<td>{lectureList?.[1].code || "-"}</td>
								<td>{lectureList?.[1].name || "-"}</td>
								<td>{lectureList?.[1].professor || "-"}</td>
								<td>{quantityList?.[1] || "-"}</td>
								<td>{successList?.[1] || "-"}</td>
							</tr>
							<tr>
								<td>{lectureList?.[2].id || "-"}</td>
								<td>{lectureList?.[2].code || "-"}</td>
								<td>{lectureList?.[2].name || "-"}</td>
								<td>{lectureList?.[2].professor || "-"}</td>
								<td>{quantityList?.[2] || "-"}</td>
								<td>{successList?.[2] || "-"}</td>
							</tr>
							<tr>
								<td>{lectureList?.[3].id || "-"}</td>
								<td>{lectureList?.[3].code || "-"}</td>
								<td>{lectureList?.[3].name || "-"}</td>
								<td>{lectureList?.[3].professor || "-"}</td>
								<td>{quantityList?.[3] || "-"}</td>
								<td>{successList?.[3] || "-"}</td>
							</tr>
							<tr>
								<td>{lectureList?.[4].id || "-"}</td>
								<td>{lectureList?.[4].code || "-"}</td>
								<td>{lectureList?.[4].name || "-"}</td>
								<td>{lectureList?.[4].professor || "-"}</td>
								<td>{quantityList?.[4] || "-"}</td>
								<td>{successList?.[4] || "-"}</td>
							</tr> */}
						</tbody>
					</table>
				</div>
				<div className="grid">
					{shuffledIndices.map((index) => (
						<div
							key={index}
							className={`box ${getBoxColor(boxes[index])}`}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default Concurrency2;
