interface TitleProps {
  title: string;
  color: string;
  padding: string;
}

const Title = ({title, color, padding} : TitleProps) => {
	return (
		<div style={{padding: padding}}>
			<h1 style={{color: color}}>{title}</h1>
		</div>
	);
};

export default Title;