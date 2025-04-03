import { Helmet } from "react-helmet-async";

const PageMetaData = ({ title }: { title: string }) => {
	return (
		<Helmet>
			<title>
				{" "}
				{title || "Default Title"} | Absolin Software Solutions{" "}
			</title>
		</Helmet>
	);
};

export default PageMetaData;
