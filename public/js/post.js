$('.newPost').on('submit', function(e) {
    e.preventDefault();
    const title = $('#post-title').val();
    const description = $("#post-description").val();
    const data = { title, description };
    $.ajax({
        url: "/create-post",
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function(response) {
            const row = `<tr>
                        <td scope="row">${response.post.title}</td>
                        <td scope="row">${response.post.description} </td>
                        <td scope="row">Img</td>
                        <td scope="row">
                            <a id="editPost" class="btn btn-warning float-right"> Изменить  &#9998;</a>
                            <a id="deletePost" class="btn btn-primary float-right"> Удалить  &#10008;</a>
                        </td>
                    </tr>`;

            if (response.length > 0) {
                response.forEach(function(error) {
                    $('#statusDiv').addClass('alert-danger').show().text(error.message).hide(5000);
                });
            }
            if (response.status === true) {
                $('#statusDiv').addClass('alert-success').show().text(response.message).hide(5000);
                $('.table').prepend(row);
            }
        },
        error: function(err) {
            console.error(err);
        }
    })
});