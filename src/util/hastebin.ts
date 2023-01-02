export async function hasteBin(contents: string, url: string = "https://hastebin.com") {
    const request = await fetch(url + "/documents", { method: "POST", body: contents });
    const json: {key: string} = await request.json();
    return url + "/" + json.key;
}
