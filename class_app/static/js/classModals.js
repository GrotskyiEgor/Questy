$(() => {
    const menuOptions = $('.menu-options')
    const modalBg = $('#modal-bg')
    const joinForm = $('#join-form')
    const createForm = $('#create-form')

    $('.add-btn').on('click', () => {
        menuOptions.css('display', menuOptions.css('display') === 'flex' ? 'none' : 'flex')
    })

    $('#join-course-button').on('click', () => {
        joinForm.css('display', 'block')
        createForm.css('display', 'none') 
        modalBg.css('display', 'flex')
        menuOptions.css('display', 'none')

        $('#modal-bg').fadeIn(200)
    })

    $('#create-course-button').on('click', () => {
        createForm.css('display', 'block') 
        joinForm.css('display', 'none')
        modalBg.css('display', 'flex')
        menuOptions.css('display', 'none')

        $('#modal-bg').fadeIn(200)
    })

    $('.back-btn').on('click', () => {
        modalBg.fadeOut(200)
    })   

    $('#modal-bg').on('click', function(element) {
        if ($(element.target).is('#modal-bg')){
            $(this).fadeOut(200)
        }
    })

    // Зміна вибору кольору
    $('#color-type').on('change', function (){
        const colorType = $(this).val();

        if (colorType === 'single') {
            $('#color-single').css('display', 'flex')
            $('#color-gradient').css('display', 'none')
        } else if(colorType === "gradient"){
            $('#color-single').css('display', 'none')
            $('#color-gradient').css('display', 'flex')
        }
    })

    // Класи та їх видалення
    $(document).on("click", function(element) {
        const actions = $(element.target).closest(".class-actions")

        $(".class-actions").removeClass('show')

        if (actions.length && $(element.target).closest(".more-class-actions").length) {
            actions.toggleClass("show")
        }
    });
})

document.addEventListener("DOMContentLoaded", () => {
    const infoText = document.getElementById("select-info")
    const btnMyClasses = document.querySelector(".my-classes")
    const btnClasses = document.querySelector(".classes")

    function hideInfo() {
        if (infoText) infoText.classList.add("hidden")
    }

    if (btnMyClasses) btnMyClasses.addEventListener("click", hideInfo)
    if (btnClasses) btnClasses.addEventListener("click", hideInfo)
})
