// Error Handling Functions
function setError(error) {
    const errorElement = document.getElementById("nano-error");
    if (errorElement) {
        errorElement.dataset.error = error;
    } else {
        console.error("Error:", error);
    }
}

function createErrorElement() {
    const errorElement = document.createElement('div');
    errorElement.id = 'nano-error';
    errorElement.style.display = 'none';
    document.body.appendChild(errorElement);
}

// Sidebar Creation Functions
function createSidebar() {
    const sidebar = document.createElement('div');
    sidebar.id = 'ai-sidebar';
    sidebar.style.position = 'fixed';
    sidebar.style.top = '0';
    sidebar.style.right = '0';
    sidebar.style.width = '300px';
    sidebar.style.height = '100%';
    sidebar.style.backgroundColor = '#f9f9f9';
    sidebar.style.borderLeft = '1px solid #ccc';
    sidebar.style.overflowY = 'auto';
    sidebar.style.padding = '10px';
    sidebar.style.zIndex = '10000';
    sidebar.style.color = 'black'; // Set text color to black
    sidebar.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
    sidebar.style.transition = 'width 0.3s ease, opacity 0.3s ease'; // Smooth transition for expand/collapse

    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.paddingBottom = '10px';
    header.style.marginBottom = '10px';

    const title = document.createElement('h2');
    title.textContent = 'Wednesday: AI Sidebar';
    title.style.margin = '0';
    title.style.fontSize = '18px';
    title.style.color = '#333';

    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Minimize';
    toggleButton.style.backgroundColor = '#007BFF';
    toggleButton.style.border = 'none';
    toggleButton.style.color = 'white';
    toggleButton.style.padding = '5px 10px';
    toggleButton.style.borderRadius = '5px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.fontSize = '12px';
    toggleButton.onclick = () => {
        if (sidebar.style.width === '300px') {
            sidebar.style.width = '0';
            sidebar.style.opacity = '0';
            toggleButton.style.display = 'none';
            expandButton.style.display = 'block';
            window.speechSynthesis.cancel(); // Stop ongoing speech synthesis
        } else {
            sidebar.style.width = '300px';
            sidebar.style.opacity = '1';
            toggleButton.style.display = 'block';
            expandButton.style.display = 'none';
        }
    };

    const expandButton = document.createElement('button');
    expandButton.innerHTML = 'W'; // Unicode for right arrow
    expandButton.style.position = 'fixed';
    expandButton.style.right = '0';
    expandButton.style.top = '50%';
    expandButton.style.position = '10px';

    expandButton.style.transform = 'translateY(-50%)';
    expandButton.style.backgroundColor = '#007BFF';
    expandButton.style.border = 'none';
    expandButton.style.color = 'white';
    expandButton.style.borderRadius = '5px 0 0 5px';
    expandButton.style.cursor = 'pointer';
    expandButton.style.display = 'none';
    expandButton.style.width = '30px'; // Ensure the button is wide enough
    expandButton.style.height = '30px'; // Ensure the button is tall enough
    expandButton.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)'; // Add shadow for better visibility

    // Ensure padding is set to 0 to avoid clickable area issues
    expandButton.style.padding = '0';
    expandButton.style.boxSizing = 'border-box'; // Ensure that width/height includes border and padding if any

    expandButton.onclick = () => {
        sidebar.style.width = '300px';
        sidebar.style.opacity = '1';
        toggleButton.style.display = 'block';
        expandButton.style.display = 'none';
    };

    header.appendChild(title);
    header.appendChild(toggleButton);
    sidebar.appendChild(header);
    document.body.appendChild(sidebar);
    document.body.appendChild(expandButton);

    return sidebar;
}

// Social Tabs Creation Functions
function createSocialTabs() {
    const socialContainer = document.createElement('div');
    socialContainer.style.marginTop = '20px';
    socialContainer.id = 'social-container'; // ID for easier querying

    const tabs = document.createElement('div');
    tabs.style.display = 'flex';
    tabs.style.justifyContent = 'space-around';
    tabs.style.marginBottom = '10px';

    const content = document.createElement('div');
    content.style.paddingTop = '10px';
    content.className = 'social-content'; // Add class for easier querying

    socialContainer.appendChild(tabs);
    socialContainer.appendChild(content);

    return socialContainer;
}

// Loader Creation Function
function createLoader() {
    const loader = document.createElement('div');
    loader.className = 'loader';
    loader.style.width = '100%';
    loader.style.height = '20px';
    loader.style.background = '#f6f7f8';
    loader.style.backgroundImage = 'linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%)';
    loader.style.backgroundRepeat = 'no-repeat';
    loader.style.backgroundSize = '200% 100%';
    loader.style.animation = 'shimmer 1.5s infinite';
    return loader;
}

// Fetch Links Functions
async function fetchRedditLinks(query) {
    try {
        const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&sort=relevance&t=all`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.data.children.slice(0, 10).map(post => ({
            title: post.data.title,
            url: `https://www.reddit.com${post.data.permalink}`
        }));
    } catch (error) {
        console.error("Error fetching Reddit links:", error);
        return [];
    }
}

async function fetchSearchEngineLinks(query) {
    try {
        const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.RelatedTopics.slice(0, 2).map(result => ({
            title: result.Text,
            url: result.FirstURL
        }));
    } catch (error) {
        console.error("Error fetching search engine links:", error);
        return [];
    }
}

async function fetchSocialLinks(source) {
    const selectedText = window.getSelection().toString().trim();
    if (source === 'reddit') {
        return await fetchRedditLinks(selectedText);
    } else if (source === 'searchEngine') {
        return await fetchSearchEngineLinks(selectedText);
    }
    return [];
}

// AI Summarization Function
async function summarizeContent(session, text) {
    try {
        const result = await session.prompt(`Summarize this content in 100 words: ${text}`);
        return result;
    } catch (err) {
        console.error("Error in AI API call:", err.message);
        return "Failed to generate summary. Please try again later.";
    }
}

// Text-to-Speech Functions
function speak(text, voice) {
    if ('speechSynthesis' in window) {
        const synthesis = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = voice; // Set the selected voice
        utterance.rate = 1; // Speed of speech
        utterance.pitch = 1; // Pitch of speech
        utterance.volume = 1; // Volume of speech
        synthesis.speak(utterance);
        return utterance;
    } else {
        console.error('Speech Synthesis not supported in this browser.');
    }
}

function createAudioButton(utterance, summary, voice) {
    const buttonContainer = document.createElement('div');

    const muteButton = document.createElement('button');
    const muteIcon = document.createElement('img');
    try {
        muteIcon.src = chrome.runtime.getURL('icons/volume.png');
    } catch (error) {
        console.error("Error getting icon URL:", error);
        muteIcon.src = ''; // Set a default or placeholder image
    }
    muteIcon.alt = 'Mute';
    muteIcon.style.width = '20px';
    muteIcon.style.height = '20px';
    muteButton.appendChild(muteIcon);

    muteButton.style.backgroundColor = '#f9f9f9';
    muteButton.style.border = 'none';
    muteButton.style.color = 'white';
    muteButton.style.padding = '5px';
    // muteButton.style.borderRadius = '5px';
    muteButton.style.cursor = 'pointer';
    muteButton.style.fontSize = '12px';
    // muteButton.style.marginLeft = '10px';

    muteButton.onclick = () => {
        if (utterance) {
            window.speechSynthesis.cancel();
            try {
                muteIcon.src = chrome.runtime.getURL('icons/volume-down.png');
            } catch (error) {
                console.error("Error getting icon URL:", error);
                // Handle the error (e.g., set a default image)
            }
        }
    };

    const replayButton = document.createElement('button');
    const replayIcon = document.createElement('img');
    try {
        replayIcon.src = chrome.runtime.getURL('icons/repeat.png');
    } catch (error) {
        console.error("Error getting icon URL:", error);
        replayIcon.src = ''; // Set a default or placeholder image
    }
    replayIcon.alt = 'Replay';
    replayIcon.style.width = '20px';
    replayIcon.style.height = '20px';
    replayButton.appendChild(replayIcon);

    replayButton.style.backgroundColor = '#f9f9f9';
    replayButton.style.border = 'none';
    replayButton.style.color = 'white';
    replayButton.style.padding = '5px';
    // replayButton.style.borderRadius = '5px';
    replayButton.style.cursor = 'pointer';
    replayButton.style.fontSize = '12px';
    replayButton.style.marginLeft = '10px';

    replayButton.onclick = () => {
        window.speechSynthesis.cancel();
        speak(summary, voice);
    };

    buttonContainer.appendChild(muteButton);
    buttonContainer.appendChild(replayButton);

    return buttonContainer;
}



// Main Function
window.addEventListener("load", async function() {
    createErrorElement();

    try {
        const hasAI = window.ai != null;
        const hasNano = (hasAI && (await window.ai.canCreateTextSession())) === "readily";

        if (!hasNano) {
            setError(!hasAI ? "not supported in this browser" : "not ready yet");
            return;
        }

        const session = await window.ai.createTextSession();
        const sidebar = createSidebar();
        const socialTabs = createSocialTabs();
        sidebar.appendChild(socialTabs);

        let defaultVoice;
        const setDefaultVoice = () => {
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                defaultVoice = voices[0];
            }
        };

        setDefaultVoice();
        window.speechSynthesis.onvoiceschanged = setDefaultVoice;

        document.addEventListener('mouseup', async function(event) {
            const selectedText = window.getSelection().toString().trim();
            if (selectedText && !sidebar.contains(event.target)) {
                window.speechSynthesis.cancel(); // Stop ongoing speech synthesis

                const summaryElement = document.createElement('p');
                summaryElement.style.fontSize = '14px';
                summaryElement.style.lineHeight = '1.5';
                summaryElement.style.color = '#444';

                // Clear previous summary and socialTabs if any
                while (sidebar.children.length > 1) {
                    sidebar.removeChild(sidebar.lastChild);
                }

                // Append loaders
                const summaryLoader = createLoader();
                sidebar.appendChild(summaryLoader);

                const summary = await summarizeContent(session, selectedText);
                console.log("Summary:", summary); // Debugging log

                summaryElement.textContent = summary;
                if (sidebar.contains(summaryLoader)) {
                    sidebar.replaceChild(summaryElement, summaryLoader);
                } else {
                    sidebar.appendChild(summaryElement);
                }

                // Add error check
                if (summary === "Failed to generate summary. Please try again later.") {
                    const errorMessage = document.createElement('p');
                    errorMessage.style.color = 'red';
                    errorMessage.textContent = summary;
                    sidebar.appendChild(errorMessage);
                } else {
                    // Speak the summary
                    const utterance = speak(summary, defaultVoice);
                    const audioButtons = createAudioButton(utterance, summary, defaultVoice);
                    summaryElement.appendChild(audioButtons);
                }

                // Fetch search engine links first
                const searchEngineLinks = await fetchSocialLinks('searchEngine');
                searchEngineLinks.forEach(link => {
                    const linkElement = document.createElement('a');
                    linkElement.href = link.url;
                    linkElement.target = '_blank'; // Open in new tab
                    linkElement.rel = 'noopener noreferrer'; // Security measure
                    linkElement.textContent = link.title;
                    linkElement.style.display = 'block';
                    linkElement.style.marginBottom = '10px';
                    linkElement.style.padding = '10px';
                    linkElement.style.border = '1px solid #ddd';
                    linkElement.style.borderRadius = '5px';
                    linkElement.style.backgroundColor = '#f9f9f9';
                    linkElement.style.color = '#007BFF';
                    linkElement.style.textDecoration = 'none';
                    linkElement.style.transition = 'background-color 0.3s ease';

                    linkElement.onmouseover = () => {
                        linkElement.style.backgroundColor = '#e9e9e9';
                        linkElement.style.textDecoration = 'underline';
                    };

                    linkElement.onmouseout = () => {
                        linkElement.style.backgroundColor = '#f9f9f9';
                        linkElement.style.textDecoration = 'none';
                    };

                    sidebar.appendChild(linkElement);
                });

                // Fetch Reddit links in the background
                const source = 'reddit';
                const loader = createLoader();
                sidebar.appendChild(loader);

                const links = await fetchSocialLinks(source);
                if (sidebar.contains(loader)) {
                    sidebar.removeChild(loader);
                }

                // Clear previous error message or no links message if any
                const previousErrorMessage = sidebar.querySelector('.error-message');
                if (previousErrorMessage) {
                    sidebar.removeChild(previousErrorMessage);
                }

                if (links.length === 0) {
                    const noLinksMessage = document.createElement('p');
                    noLinksMessage.textContent = 'No Reddit links found.';
                    noLinksMessage.className = 'error-message';
                    sidebar.appendChild(noLinksMessage);
                } else {
                    const redditHeader = document.createElement('h3');
                    redditHeader.textContent = 'Relevant Reddit Links';
                    redditHeader.style.marginTop = '20px';
                    sidebar.appendChild(redditHeader);

                    for (const link of links) {
                        const linkElement = document.createElement('a');
                        linkElement.href = link.url;
                        linkElement.target = '_blank'; // Open in new tab
                        linkElement.rel = 'noopener noreferrer'; // Security measure
                        linkElement.textContent = link.title;
                        linkElement.style.display = 'block';
                        linkElement.style.marginBottom = '10px';
                        linkElement.style.padding = '10px';
                        linkElement.style.border = '1px solid #ddd';
                        linkElement.style.borderRadius = '5px';
                        linkElement.style.backgroundColor = '#f9f9f9';
                        linkElement.style.color = '#007BFF';
                        linkElement.style.textDecoration = 'none';
                        linkElement.style.transition = 'background-color 0.3s ease';

                        linkElement.onmouseover = () => {
                            linkElement.style.backgroundColor = '#e9e9e9';
                            linkElement.style.textDecoration = 'underline';
                        };

                        linkElement.onmouseout = () => {
                            linkElement.style.backgroundColor = '#f9f9f9';
                            linkElement.style.textDecoration = 'none';
                        };

                        sidebar.appendChild(linkElement);
                    }
                }
            }
        });

        setError('');
    } catch (err) {
        console.error("Error:", err.message);
        setError(err.message);
    }
});

// CSS for shimmer effect
const style = document.createElement('style');
style.innerHTML = `
@keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
}
.loader {
    width: 100%;
    height: 20px;
    background: #f6f7f8;
    background-image: linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%);
    background-repeat: no-repeat;
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
}
`;
document.head.appendChild(style);
