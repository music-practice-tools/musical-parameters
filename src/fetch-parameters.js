export async function fetchParameters(fileURI) {
    return fetch(fileURI)
    .then((response) => {
        if (!response.ok) {
            throw new ErrorEvent("File error", {
            message: `fetching parameters file:\n\n${fileURI}\n\ncode: ${response.status}`
            });
        }
        return response.text();
    })
}