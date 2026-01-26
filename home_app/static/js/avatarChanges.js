$(document).ready(function () {
    $('input[type="radio"]').on('change', function () {

        const fieldName = $(this).attr('name');   
        const fieldValue = $(this).val();   
        const csrfToken = $('#csrf_token').val();      

        $.ajax({
            url: window.location.pathname, 
            method: 'POST',
            data: {
                ajax: true,                  
                field: fieldName,
                value: fieldValue,
                csrf_token: csrfToken
            }
        });
    });
});