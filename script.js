document.addEventListener('DOMContentLoaded', function () {
    const generateButton = document.getElementById('generate-button');
    const categoryInput = document.getElementById('category-input');
    const loadingSpinner = document.getElementById('loading-spinner');
    const wallpaperContainer = document.getElementById('wallpaper-container');

    generateButton.addEventListener('click', function () {
        // Set a default category if none is entered
        const category = categoryInput.value.trim() || 'nature';
        generateWallpaper(category);
    });

    async function generateWallpaper(category) {
        loadingSpinner.style.display = 'inline-block';
        wallpaperContainer.innerHTML = ''; // Clear previous image
        
        try {
            const response = await fetch('https://api.bfl.ml/v1/flux-pro-1.1', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'x-key': '84d4f581-e459-441d-a55f-46eb6382cb8b', // Use your API key
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: `A ${category} scene with vibrant colors and vivid details.`,
                    width: 1024,
                    height: 768,
                }),
            });
            
            const data = await response.json();
            const requestId = data.id;

            // Polling to check the result
            await pollForResult(requestId);
        } catch (error) {
            loadingSpinner.style.display = 'none';
            wallpaperContainer.innerHTML = '<p>Error generating image. Please try again later.</p>';
            console.error('Error:', error);
        }
    }

    async function pollForResult(requestId) {
        while (true) {
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait for 0.5 seconds

            const result = await fetch(`https://api.bfl.ml/v1/get_result?id=${requestId}`, {
                headers: {
                    'accept': 'application/json',
                    'x-key': '84d4f581-e459-441d-a55f-46eb6382cb8b', // Use your API key
                },
            }).then(res => res.json());

            if (result.status === "Ready") {
                loadingSpinner.style.display = 'none';
                const imageUrl = result.result.sample; // Make sure this points to the correct image URL
                wallpaperContainer.innerHTML = `<img src="${imageUrl}" alt="Generated Wallpaper">`;
                break;
            } else {
                console.log(`Status: ${result.status}`);
            }
        }
    }
});
