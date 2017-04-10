/*-----------------------------------------------------------
PRODUCT-MANUALS.JS 
-------------------------------------------------------------*/

var manuals = manuals || {};

manuals.init = function() {
    manuals.emptyChk();
    manuals.dropdown();
};

manuals.dropdown = manuals.dropdown || {};
manuals.dropdown = function() {
    // Open dropdowns
    $(document).on('click', '.dropdown .dropdown-arrow', function(e) {
        e.stopPropagation();
        $('.dropdown').removeClass('active');
        $('.dropdown-list').removeClass('active');
        $(this).closest('.dropdown').addClass('active');
        $(this).next('.dropdown-list').addClass('active');
    });

    // Close dropdowns
    $(document).on('click', '.dropdown.active .dropdown-arrow', function(e) {
        e.stopPropagation();
        $('.dropdown').removeClass('active');
        $('.dropdown-list').removeClass('active');
        $(this).closest('.dropdown').removeClass('active');
        $(this).next('.dropdown-list').removeClass('active');
    });

    $('html').click(function(e) {
        if (!$(e.target).hasClass('dropdown-arrow')) {
            $('.dropdown').removeClass('active');
            $('.dropdown-list').removeClass('active');
        }
    });

    // Handle dropdowns and set data to dropdowns
    $(document).on('click', '.dropdown-link', function(e) {
        e.preventDefault();
        var item = $(this),
            itemId = item.data('id'),
            selected = item.closest('.dropdown').find('.dropdown-input');
        //console.log(itemId);
        if (itemId == 'all') {
            selected.val(item.data('label')).attr('data-selected', itemId);
        } else {
            selected.val(itemId).attr('data-selected', itemId);
        }

        manuals.filter(itemId);
    });
}

manuals.filter = manuals.filter || {};
manuals.filter = function(filter) {
    var type = $('.product-manuals__type'),
        blk = $('.product-manuals__block');
    if (filter) {
        type.hide();
        blk.find("[data-id='" + filter + "']").show();
        //console.log(filter);
        if (filter == 'all') {
            type.show();
        }
    }
}

manuals.emptyChk = manuals.emptyChk || {};
manuals.emptyChk = function() {
    $('.product-manuals__series').each(function() {
        if ($(this).find('.cta-download').length <= 0) {
            $(this).addClass('hide');
        }
    });
}