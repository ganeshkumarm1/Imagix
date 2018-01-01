var baseURL = "https://imagix.herokuapp.com/image";

$(document).ready(function() {
    $('#copy').on('click', function() {
        $('#image-url input').select();
        document.execCommand("copy");
    });

    $('#upload-picture').on("click" , function () {
        $('#image').trigger("click");
    });

    var fileSize = 0;
    $('#image').bind('change', function() {
        fileSize = this.files[0].size / 1024;
        $('form').submit();
    });
    
    $('#submit').on('click', function() {
        $('form').submit();
    });

	$('form').on('submit', function(e) {
	 	e.preventDefault();
        if(fileSize <= 200)
        {
            var formData = new FormData($(this)[0]);
            if($('#image').val() != "")
            {
                $('#upload-picture').text("UPLOADING...")
                $('#upload-picture').attr('disabled', true);
                $.ajax({
                    url: '/upload',
                    type: 'POST',
                    data: formData,
                    success: function(response) {
                        $('.error .server-error').hide();            
                        $('#image-url input').val(`${baseURL}/${response.id}`);
                        $('#image-embed').text(`<img src="${baseURL}/${response.id}" />`)
                        $('#preview').attr('src', baseURL + '/' + response.id);
                        $('#imagix-modal').modal();
                        $('#upload-picture').text("UPLOAD PICTURE");
                        $('#upload-picture').attr('disabled', false);
                        $('#image').val("");
                    },
                    error: function(response) {
                        $('#upload-picture').text("UPLOAD PICTURE");
                        $('#upload-picture').attr('disabled', false);
                        $('.error .server-error').show();            
                        $('#image').val("");
                    },
                    cache: false,
                    contentType: false,
                    processData: false
                });
            }
            else
            {
                alert('must not be empty');
            }
            $('.size-limit').hide();
        }
        else
        {
            $('.size-limit').show();
        }
    });
});

