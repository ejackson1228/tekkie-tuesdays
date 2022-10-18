async function newFormhandler(event) {
    event.preventDefault();

    const title = document.querySelector('#post-title').value.trim();
    const description = document.querySelector('#post-description').value.trim();
    const article_url = document.querySelector('#post-article-url').value.trim();

    let response = await fetch('/api/posts', {
        method: 'post',
        body: JSON.stringify({
            title,
            description,
            article_url
        }),
        headers: {'Content-Type': 'application/json'}
    });

    console.log(response);
    if (response.ok) {
        document.location.replace('/dashboard');
    } else {
        alert(response.statusText);
    }
};

document.querySelector('.new-post').addEventListener('submit', newFormhandler);