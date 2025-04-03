export const deepMergeObjects = <T>(list: T[]): T => {
	let object: T = {} as T;
	list.forEach((l) => {
		object = {
			...object,
			...l,
		};
	});
	return object;
};

type Params = {
	[key: string]: any;
};

export function getFilterParams(
	params: Params,
	extraExcludeKeys: string[] = []
) {
	const defaultExcludeKeys = ["page", "page_size", "search", "no_of_pages"];
	const excludeKeys = [...defaultExcludeKeys, ...extraExcludeKeys];

	return Object.fromEntries(
		Object.entries(params).filter(([key]) => !excludeKeys.includes(key))
	);
}

export function downloadFileByUrl(file: string): void {
	if (!file) {
		console.error("Invalid file data.");
		return;
	}

	// Extract the file name from the URL
	const fileName = file.split("/").pop() || "downloaded_file";

	// Create an anchor element
	const anchor = document.createElement("a");
	anchor.href = file; // Set the URL of the file
	anchor.download = fileName; // Set the desired file name

	// Append the anchor to the body
	document.body.appendChild(anchor);

	// Trigger a click event on the anchor
	anchor.click();

	// Remove the anchor from the DOM
	document.body.removeChild(anchor);
}

export function findItemInTree<T extends { id: string; children?: T[] }>(
	tree: T[],
	targetId: string
): T | null {
	for (const node of tree) {
		if (node.id === targetId) {
			return node; // Found the item
		}
		if (node.children) {
			const found = findItemInTree(node.children, targetId);
			if (found) return found; // Found in children, return it
		}
	}
	return null; // Not found
}

export function debounce<T extends (...args: any[]) => void>(
	func: T,
	delay: number
): (...args: Parameters<T>) => void {
	let timer: ReturnType<typeof setTimeout>;
	return function (this: unknown, ...args: Parameters<T>) {
		clearTimeout(timer);
		timer = setTimeout(() => func.apply(this, args), delay);
	};
}
