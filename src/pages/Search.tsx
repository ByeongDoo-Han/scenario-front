import { useState, useEffect, useRef, useCallback } from "react";
import "./Search.css";
import axios from "axios";
import About from "./About";
import Title from "./Title";

const DEV_URL = "http://localhost:8080";

const Search = () => {
	const [keyword, setKeyword] = useState("");
	const [saveKeyword, setSaveKeyword] = useState("");
	const [results, setResults] = useState<string[]>([]);
	const [showDropdown, setShowDropdown] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [debouncedKeyword, setDebouncedKeyword] = useState("");
	const dropdownRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	// Handle clicks outside dropdown to close it
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const dropdownEl = dropdownRef.current;
			const inputEl = inputRef.current;
	
			if (
				dropdownEl &&
				inputEl &&
				!dropdownEl.contains(event.target as Node) &&
				!inputEl.contains(event.target as Node)
			) {
				setShowDropdown(false);
			}
		};
	
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	// Debounce search input to prevent too many API calls
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedKeyword(keyword);
		}, 300);
		return () => clearTimeout(timer);
	}, [keyword]);

	// Fetch results when debounced keyword changes
	useEffect(() => {
		const fetchResults = async () => {
			if (!debouncedKeyword) {
				setResults([]);
				setShowDropdown(false);
				return;
			}
			
			setIsLoading(true);
			try {
				const encoded = encodeURIComponent(debouncedKeyword);
				const res = await axios.get(`${DEV_URL}/api/v1/search?q=${encoded}`);
				console.log(res.data);
				setResults(res.data.title);
				setShowDropdown(true);
			} catch (error) {
				console.error("Search error:", error);
				setResults([]);
			} finally {
				setIsLoading(false);
			}
		};

		fetchResults();
	}, [debouncedKeyword]);

	const save = async () => {
		const text = inputRef.current?.value;
		if (!text) return;
		try{
			const encoded = encodeURIComponent(text);
			const res = await axios.post(`${DEV_URL}/api/v1/save`, {title: encoded});
			console.log(res.data);
		}
		catch(error){
			console.error("Save keyword error:", error);
		}
	}

	// const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
	// 	const value = e.target.value;
	// 	setKeyword(value);
	// 	if (value.length > 0) {
	// 		setShowDropdown(true);
	// 	}
	// }, []);
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
		  if (
			dropdownRef.current &&
			!dropdownRef.current.contains(event.target as Node) &&
			inputRef.current &&
			!inputRef.current.contains(event.target as Node)
		  ) {
			setShowDropdown(false);
		  }
		};
	  
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
		  document.removeEventListener("mousedown", handleClickOutside);
		};
	  }, []);

	const handleResultClick = useCallback((title: string) => {
		setKeyword(title);
		setShowDropdown(false);
	}, []);
	const [titles, setTitles] = useState<string[]>([]);

	useEffect(() => {
		axios.get(`${DEV_URL}/api/v1/search/all`)
			.then(res => setTitles(res.data))
			.catch(err => console.error("타이틀 불러오기 실패!", err));
	}, []);

	return (
		
		<div className="search-container">
			<About/>
			<Title title="ElasticSearch 검색" color="antiquewhite" padding="1rem"/>
			<div className="search-wrapper">
				<div className="search-input-container">
					<input 
						ref={inputRef}
						type="text" 
						className="search-input" 
						placeholder="등록할 단어를 입력해주세요" 
						autoComplete="off"
						value={saveKeyword}
						onChange={(e)=>setSaveKeyword(e.target.value)}
					/>
					<button className="search-button" onClick={save}>등록</button>
				</div>	
				{showDropdown && (
					<div style={{ background: 'yellow', padding: '20px' }}>
						테스트 드롭다운입니다
					</div>
				)}
			</div>
			<div className="search-wrapper">
				<div className="search-input-container">
					<span className="search-icon">🔍</span>
					<input 
						ref={inputRef}
						type="text" 
						className="search-input" 
						value={keyword} 
						onChange={(e)=>{
							setKeyword(e.target.value);
							if (keyword.trim() === "") {
								setShowDropdown(false);
							}
							setShowDropdown(true);
						}} 
						placeholder="검색어를 입력해주세요" 
						autoComplete="off"
					/>
				</div>
				
				<div 
					ref={dropdownRef} 
					className={`search-dropdown ${showDropdown ? 'show' : ''}`}
				>
					{isLoading ? (
						<div className="search-loading">
							<div className="search-loading-dot"></div>
							<div className="search-loading-dot"></div>
							<div className="search-loading-dot"></div>
						</div>
					) : results.length > 0 ? (
						results.map((result, index) => (
							<div 
								key={index} 
								className="search-result-item"
								onClick={() => handleResultClick(result)}
							>
								<p className="search-result-item-title">{result}</p>
							</div>
						))
					) : debouncedKeyword ? (
						<div className="no-results">검색 결과가 없습니다</div>
					) : ""}
				</div>
				<div
					ref={dropdownRef}
					className="search-dropdown show" // 강제로 show 붙이기
				>
					<div className="search-result-item">🔥 테스트용 아이템</div>
				</div>
				<div className="p-4">
					<h1 className="text-sm font-bold mb-4 text-white">현재 상품 목록</h1>
					<ul className="space-y-2">
						{titles.map((title, idx) => (
						<li key={idx} className="p-2 bg-gray-100 rounded shadow text-white">
							{title}
						</li>
					))}
				</ul>
				</div>
			</div>
		</div>
	);
};

export default Search;
