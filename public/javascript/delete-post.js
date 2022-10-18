async function deletePostHandler(event) {
    event.preventDefault();

    const post_id = window.location.toString().split('/')[
        window.location.toString().split('/').length -1 
    ];
    
    let response = await fetch(`/api/posts/${post_id}`, {
        method: 'delete'
    });

    if (response.ok) {
        document.location.replace('/dashboard');
    } else {
        alert(response.statusText);
    }
};

document.querySelector('.delete-post-btn').addEventListener('click', deletePostHandler);