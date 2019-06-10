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
                            <td scope="row text-center">
                                <a id="editPost" class="btn btn-info" data-id="${response.post._id}" style="color:white">Изменить</a>
                                <a id="deletePost"class="btn btn-danger" data-id="${response.post._id}" style="color:white">Удалить</a>
                            </td>
                        </tr>`;
            $('#addModal').modal('toggle');
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

$('#deletePost').on('click', function(e) {
    e.preventDefault();
    const postId = $(this).data("id");
    $.ajax({
        url: '/delete-post/' + postId,
        type: "DELETE",
        contentType: "application/json",
        success: function(response) {
            if (confirm('Вы действительно хотите удалить запись?')) {
                $('#statusDiv').addClass('alert-success').show().text(response.message).hide(5000);
                $('.postData').fadeOut(500);
            }
        }
    })
});