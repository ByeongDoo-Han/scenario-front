import { useState, useEffect, useRef, useCallback } from "react";
import "./Search.css";
import axios from "axios";
import About from "./About";
import Title from "./Title";

// const DEV_URL = "http://localhost:8080";
const DEV_URL = "";

const Search = () => {
	const [keyword, setKeyword] = useState("");
	const [results, setResults] = useState<{id: string, title: string}[]>([]);
	const [showDropdown, setShowDropdown] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [debouncedKeyword, setDebouncedKeyword] = useState("");
	const [error, setError] = useState<string>("");
	const dropdownRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const [titles, setTitles] = useState<{id: string, title: string}[]>([]);
	const [saveKeyword, setSaveKeyword] = useState("");

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
				setResults(res.data);
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
		if (!saveKeyword.trim()) return;
		try {
			const res = await axios.post(`${DEV_URL}/api/v1/search/save`, { title: saveKeyword });
			console.log(res);
			setResults(res.data); 
			setSaveKeyword(""); 
			refresh();
		} catch (error) {
			console.error("Save keyword error:", error);
		}
	};

	const deleteTitle = useCallback(async (id: string, title: string) => {

		try {
			setIsLoading(true);
			await axios.delete(`${DEV_URL}/api/v1/search/delete?id=${id}`);
			setTitles(prevTitles => prevTitles.filter(t => t.id !== id));
			if (keyword === id) {
				setKeyword("");
			}
			console.log(title + " 삭제");
		} catch (error) {
			console.error("Delete title error:", error);
			setError('삭제 중 오류가 발생했습니다');
		} finally {
			setIsLoading(false);
		}
	}, [keyword]);

	const handleResultClick = useCallback((title: string) => {
		setKeyword(title);
		setShowDropdown(false);
	}, []);

	const refresh = useCallback(async () => {
		try {
			setIsLoading(true);
			const res = await axios.get(`${DEV_URL}/api/v1/search/all`);
			console.log(res.data);
			setTitles(res.data);
		} catch (error) {
			console.error("타이틀 불러오기 실패!", error);
			setError('상품 목록을 불러오는데 실패했습니다');
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		refresh();
	}, [refresh]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setKeyword(e.target.value);
		if (e.target.value.trim() === "") {
			setShowDropdown(false);
		}
		setShowDropdown(true);
	}

	return (
		<div className="search-container">
			<About/>
			<Title title="ElasticSearch 검색" color="antiquewhite" padding="1rem"/>
			<div className="search-wrapper">
				<div className="search-input-container">
					<input 
						type="text" 
						className="search-input" 
						placeholder="등록할 단어를 입력해주세요" 
						autoComplete="off"
						value={saveKeyword}
						onChange={(e)=>setSaveKeyword(e.target.value)}
						onKeyDown={(e)=>{
							if(e.key === 'Enter'){
								e.preventDefault();
								save();
							}
						}}
					/>
					<button className="search-button" onClick={save}>등록</button>
				</div>	
			</div>
			<div className="search-wrapper">
				<div className="search-input-container">
					<span className="search-icon">🔍</span>
					<input 
						ref={inputRef}
						type="text" 
						className="search-input" 
						value={keyword} 
						onChange={handleInputChange} 
						placeholder="검색어를 입력해주세요" 
						autoComplete="off"
						onFocus={() => keyword && setShowDropdown(true)}
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
								onClick={() => handleResultClick(result.title)}
							>
								<p className="search-result-item-title">{result.title}</p>
								
							</div>
						))
					) : debouncedKeyword ? (
						<div className="no-results">검색 결과가 없습니다</div>
					) : null}
				</div>
			</div>
			<div className="p-4">
				<h1 className="text-sm font-bold mb-4 text-white">현재 상품 목록</h1>
				{error && (
					<div className="error-message" style={{ color: '#dc3545', textAlign: 'center', marginBottom: '15px' }}>
						{error}
					</div>
				)}
				<ul className="space-y-2">
					{titles.map((title, idx) => (
						<li key={idx} className="product-list-item">
							<span className="text-white">{title.title}</span>
							<button 
								className="delete-button" 
								onClick={(e) => {
									e.stopPropagation();
									deleteTitle(title.id, title.title);
								}}
							>
								🗑️ 삭제
							</button>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default Search;
