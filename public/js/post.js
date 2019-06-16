$('.newPost').on('submit', function(e) {
    e.preventDefault();
    const data = new FormData($(this)[0]);
    $.ajax({
        url: "/create-post",
        type: "POST",
        data: data,
        processData: false,
        contentType: false,
        success: function(response) {
            $('#addModal').modal('toggle');
            if (response.length > 0) {
                response.forEach(function(error) {
                    $('#statusDiv').addClass('alert-danger').show().text(error.message).hide(5000);
                });
            }
            if (response.status === true) {
                $('#statusDiv').addClass('alert-success').show().text(response.message).hide(5000);
                $('.table').prepend(rows(response));
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
                $('#postData').fadeOut(500);
            }
        },
        error: function(err) {
            console.log(err);
        }
    })
});

$('#editPost').on('click', function(e) {
    e.preventDefault();
    const _id = $(this).data("id");
    const getCurrentTitle = $(this).data("title");
    const getCurrentDescription = $(this).data("description");
    const editTitle = $('#edit-title').val(getCurrentTitle);
    const editDescription = $('#edit-description').val(getCurrentDescription);
    const postId = $('#post_id').val(_id);


});

$('.editPost').on('submit', function(e) {
    e.preventDefault();
    const _id = $('#post_id').val();
    const title = $('#edit-title').val();
    const description = $('#edit-description').val();
    const data = { _id, title, description };
    console.log(JSON.stringify(data));
    $.ajax({
        url: "/create-post",
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function(response) {
            $('#editModal').modal('toggle');
            if (response.status === true) {
                $('#statusDiv').addClass('alert-success').show().text(response.message).hide(5000);
                $('#postData').replaceWith(rows(response));
            }
        },
        error: function(err) {
            console.log(err);
        }
    });
});

let rows = (response) => {
    return `<tr id="postData">
                <td scope="row">${response.post.title}</td>
                <td scope="row">${response.post.description} </td>
                <td scope="row">Img</td>
                <td scope="row text-center">
                <a id="editPost" class="btn btn-info" data-id="${response.post._id}" data-title="${response.post.title}" data-description="${response.post.description}"  data-toggle="modal" data-target="#editModal" style="color:white">
                     Изменить
                </a>
                    <a id="deletePost"class="btn btn-danger" data-id="${response.post._id}" style="color:white">Удалить</a>
                </td>
             </tr>`
}