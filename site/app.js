$(document).ready(() => {

    $('#submitButton').click(function(e) {
        e.preventDefault();

        $.ajax({
            type: 'GET',
            url: "/piyango",    
            dataType: 'json',
            success: function(res) {
                console.log(res);
            }
        });
    });
});