import fs from 'fs';

async function getEpisodes(pageNumber) {
	console.log(`Fetching page number ${pageNumber} from API...`);
	const response = await fetch(`https://branthansen.libsyn.com//page/${pageNumber}/render-type/json`);
	return await response.json();
}

async function main() {
	const allEpisodes = [];
	let pageNumber = 0;
	while (true) {
		const pageEpisodes = await getEpisodes(pageNumber++);
		pageEpisodes.forEach(episode => allEpisodes.push(cleanJSON(episode)));
		if (pageEpisodes.length === 0) break;
	}
	fs.writeFileSync("./db.json", JSON.stringify(allEpisodes));
}

function cleanJSON(json) {
	return {
		id: json.item_id,
		title: json.item_title,
		release_date: json.release_date,
		description: json.item_body_clean,
		url: json.full_item_url,
		audio_url: json.primary_content?.url_secure ?? null
	};
}

main();