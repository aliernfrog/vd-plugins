export default function fetchImageAsDataURL(url: string, callback: (dataUrl: string) => void) {
    // Fetch url
    fetch(url).then((resp) => {
        // Get it as a blob
        resp.blob().then((blob) => {
            // Turn it into a data URL
            const reader = new FileReader();
            reader.readAsDataURL(blob)
            // Called when data URL is ready
            reader.onloadend = () => {
                callback(reader.result as string)
            }
        })
    })
}
