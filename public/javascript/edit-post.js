async function editFormHandler(event) {
    event.preventDefault();

    const post_id = window.location.toString().split('/')[
        window.location.toString().split('/').length -1
    ];

    const post_title = document.querySelector('input[name="post-title"]').value.trim();
    const post_description = document.querySelector('input[name="post-description"]').value.trim();

    let response = await fetch(`/api/posts/${post_id}`, {
        method: 'put',
        body: JSON.stringify({
            title: post_title,
            description: post_description
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        document.location.replace('/dashboard');
    } else {
        alert(response.statusText);
    }
};

document.querySelector('.edit-post').addEventListener('submit', editFormHandler);