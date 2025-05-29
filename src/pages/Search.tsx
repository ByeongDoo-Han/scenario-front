import { useState, useEffect, useRef, useCallback } from "react";
import "./Search.css";
import axios from "axios";
import About from "./About";

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
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && 
				inputRef.current && !inputRef.current.contains(event.target as Node)) {
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

	const save = () => {
		if (!saveKeyword) return;
		setSaveKeyword(saveKeyword);
		try{
			const encoded = encodeURIComponent(saveKeyword);
			const res = async () => await axios.post(`${DEV_URL}/api/v1/save`, {title: encoded});
			console.log(res);
		}
		catch(error){
			console.error("Save keyword error:", error);
		}
		
	}

	const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setKeyword(value);
		if (value.length > 0) {
			setShowDropdown(true);
		}
	}, []);

	const handleResultClick = useCallback((title: string) => {
		setKeyword(title);
		setShowDropdown(false);
		// You can add navigation or other actions here
	}, []);

	return (
		
		<div className="search-container">
			<About/>
			<h1 className="search-title">ElasticSearch 검색</h1>
			<div className="search-wrapper">
			<div className="search-input-container">
					<input 
						ref={inputRef}
						type="text" 
						className="search-input" 
						placeholder="등록할 단어를 입력해주세요" 
						autoComplete="off"
						value={saveKeyword}
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
								onClick={() => handleResultClick(result)}
							>
								<p className="search-result-item-title">{result}</p>
							</div>
						))
					) : debouncedKeyword ? (
						<div className="no-results">검색 결과가 없습니다</div>
					) : null}
				</div>
			</div>
		</div>
	);
};

export default Search;
