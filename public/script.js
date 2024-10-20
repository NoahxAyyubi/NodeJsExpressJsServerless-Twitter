document.addEventListener("DOMContentLoaded", () => {
    const tweetButton = document.querySelector(".tweetbox__tweetButton");
    const tweetInput = document.querySelector(".tweetbox__input input");
    const feed = document.querySelector(".feed");

    async function fetchTweets() {
        try {
            const response = await fetch('/api/data'); // Fetch from your server
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            // 'http://localhost:3000/data' for local
            data.tweets.reverse().forEach(tweet => {
                const tweetElement = createTweetElement(tweet);
                feed.appendChild(tweetElement);
            });
        } catch (error) {
            console.error('Error fetching tweets:', error);
        }
    }
    function createTweetElement(tweet) {
        const tweetElement = document.createElement("div");
        tweetElement.classList.add("post");
    
        tweetElement.innerHTML = `
            <div class="post__avatar">
                <img src="/IMG_0135-modified.png" alt="Avatar"> <!-- Adjusted image path -->
            </div>
            <div class="post__body">
                <div class="post__header">
                    <div class="post__headerText">
                        <h3>
                            ${tweet.user}
                            <span class="post__headerSpecial">
                                <span class="material-icons post__badge">verified</span>
                                @${tweet.userHandle}
                            </span>
                        </h3>
                    </div>
                    <div class="post__headerDescription">
                        <p>${tweet.content}</p>
                    </div>
                    ${tweet.image ? `<img src="${tweet.image}" alt="">` : ''}
                    <div class="post__footer">
                        <span class="material-icons">repeat</span>
                        <span class="material-icons">favorite_border</span>
                        <span class="material-icons">publish</span>
                    </div>
                </div>
            </div>
        `;
    
        return tweetElement;
    }
    

    tweetButton.addEventListener("click", async (event) => {
        event.preventDefault();
        const chirpSound = new Audio('/chirp.mp3');
        chirpSound.play();
        const tweetText = tweetInput.value.trim();

        if (tweetText) {
            const newTweet = { content: tweetText };

            try {
                const response = await fetch('/api/tweets', { 
                //    'http://localhost:3000/tweets' for  local
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newTweet)
                });

                if (response.ok) {
                    const addedTweet = await response.json();
                    const newTweetElement = createTweetElement(addedTweet);
                    feed.insertBefore(newTweetElement, document.querySelector('.tweetbox').nextSibling);
                    tweetInput.value = "";
                } else {
                    console.error('Failed to post the tweet');
                }
            } catch (error) {
                console.error('Error posting tweet:', error);
            }
        }
    });

    fetchTweets(); // Fetch tweets on page load
});
