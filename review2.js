var machinery = machinery || {};

$('.machinery-results').after($('.machinery-results__navigation'));

machinery.init = function() {
    machinery.bind.resetForm();
    if (window.location.search.length) {
        machinery.bind.filterByDealer(window.location.search);
    }
    machinery.bind.loadForm();
    machinery.bind.loadMachinery();
    machinery.bind.resetOptions();
    machinery.bind.postalFormat();
    machinery.bind.sortMachinery.init();
    machinery.bind.filter();
    //$(window).bind("pageshow", function() {
    //  $('.user-input, .dropdown-input').each(function() {
    //    $(this).val('').attr('data-selected', '');
    //    $(this).data('selected', '');
    //  });
    //});
}

machinery.filterArray = {};
machinery.bind = {};

machinery.bind.filterByDealer = function(dealer) {
    var dealerCode = dealer.substr(dealer.indexOf('=') + 1);
    //var dealerMatch = true;
    $('.dealer-filter').find('.dropdown-link').each(function() {
        var inputID = $(this).data('id').toLowerCase();
        var dlrID = inputID.substr(inputID.indexOf('-') + 1);
        if (dlrID == dealerCode) {
            var dealerText = $(this).data('text');
            $('input[id="dealer"]').val(dealerText).attr('data-selected', dealerText).data('selected', dealerText).addClass('populated');
            return false;
        }
    });
    setTimeout(function() {
        $('.go').trigger('click');
        $('.expand').trigger('click');
        if (!$('.reset-options').hasClass('active')) {
            $('.reset-options').addClass('active');
        }
    }, 400);
}

machinery.bind.resetForm = function() {
    //$('.machinery-search input').val('');
    $('.user-input, .dropdown-input').each(function() {
        $(this).val('').attr('data-selected', '');
        $(this).data('selected', '');
    });
}

machinery.bind.loadForm = function() {
        var dteNow = new Date();
        var intYear = dteNow.getFullYear();
        var expendBtn = PreferredCulture == "fr-CA" ? "PLUS D'OPTIONS" : "More Options";
        var collapseBtn = PreferredCulture == "fr-CA" ? "MOINS D'OPTIONS" : "Fewer Options";

        $('.expand').on('click keydown', function(e) {
            if (e.type == 'click' || e.keyCode == 13) {
                e.preventDefault();
                $('.machinery-search__expand, .machinery-search__initial').toggleClass('active');
                $(this).text(expendBtn);
                if ($('.machinery-search__initial').hasClass('active')) {
                    $(this).text(collapseBtn);
                    if (e.keyCode == 13) {
                        setTimeout(function() {
                            $('.machinery-search__expand .dropdown').first().find('.dropdown-arrow').focus();
                        }, 300);
                    }
                }
            }
        });

        // Open dropdowns
        $(document).on('click', '.dropdown .dropdown-arrow', function(e) {
            e.stopPropagation();
            e.preventDefault();
            $('.dropdown').removeClass('active');
            $('.dropdown-list').removeClass('active');
            $(this).closest('.dropdown').addClass('active');
            $(this).next('.dropdown-list').addClass('active');
            $(this).attr('aria-expanded', 'true');
        });

        //$(document).on('focus', '.dropdown .dropdown-arrow', function(){
        //$(this).closest('.dropdown').addClass('active');
        //  $(this).next('.dropdown-list').addClass('active');
        //}

        $(document).on('blur', '.dropdown-items .dropdown-item:last-child .dropdown-link', function() {
                console.log('blur');
                $(this).closest('.dropdown-list').removeClass('active');
                $(this).closest('.dropdown-list').prev('.dropdown-arrow').attr('aria-expanded', 'false');
            }

            // Close dropdowns
            $(document).on('click', '.dropdown.active .dropdown-arrow', function(e) {
                e.stopPropagation();
                e.preventDefault();
                $('.dropdown').removeClass('active');
                $('.dropdown-list').removeClass('active');
                $(this).closest('.dropdown').removeClass('active');
                $(this).next('.dropdown-list').removeClass('active');
                $(this).attr('aria-expanded', 'false');
            });

            $('html').click(function(e) {
                if (!$(e.target).hasClass('dropdown-arrow')) {
                    $('.dropdown').removeClass('active');
                    $('.dropdown-list').removeClass('active');
                    $('.dropdown-arrow').attr('aria-expanded', 'false');
                }
            });

            // Handle dropdowns and set data to dropdowns
            $(document).on('click', '.dropdown-link', function(e) {
                e.preventDefault();
                var item = $(this);
                var itemTxt = item.data('text');
                var isDistance = item.data('id').indexOf('distance') != -1 ? true : false;

                var selected = item.closest('.dropdown').find('.dropdown-input');
                selected.val(itemTxt).attr('data-selected', itemTxt);
                selected.val(itemTxt).data('selected', itemTxt);
                if (selected.val().length) {
                    selected.addClass('populated');
                } else {
                    selected.removeClass('populated');
                }
                if (!isDistance) {
                    if ($('.go').hasClass('inactive')) {
                        $('.go').removeClass('inactive');
                    }
                    if (!$('.reset-options').hasClass('active')) {
                        $('.reset-options').addClass('active');
                    }
                }
            });

            // Mobile sorting
            $(document).on('click', '.dropdown-link-sort', function(e) {
                e.preventDefault();
                var item = $(this);
                var itemTxt = item.data('text');
                var itemSortBy = item.attr('data-order');
                var selected = item.closest('.dropdown').find('.dropdown-input-sort');

                selected.val(itemTxt).attr('data-selected', itemTxt);
                selected.val(itemTxt).data('selected', itemTxt);

                $('.sort-btn.machinery-results__sort-link').attr('data-order', itemSortBy);
                $('.sort-btn.machinery-results__sort-link').attr('data-id', item.attr('data-id'));
                if (!$('.reset-options').hasClass('active')) {
                    $('.reset-options').addClass('active');
                }
            });

            // Handle inputs and set data to inputs
            $('.user-input').on('change', function() {
                var input = $(this);
                if (input.val().length) {
                    input.addClass('populated');
                } else {
                    input.removeClass('populated');
                }
            });

            $('.user-input').on('change', function() {
                var input = $(this);
                var value = input.val();
                //input.attr('data-selected', value);
                input.data('selected', value);
            });

            $('.user-input').on('keypress', function(e) {
                if (e.keyCode == 13) {
                    e.preventDefault();
                }
            });

            var prefix = PreferredCulture == "fr-CA" ? "" : "$ ";
            var postfix = PreferredCulture == "fr-CA" ? " $" : "";
            var separator = PreferredCulture == "fr-CA" ? " " : ",";
            var max = PreferredCulture == "fr-CA" ? " +" : " +";
            //to = 

            // Range Sliders
            $("#range-price").ionRangeSlider({
                keyboard: true,
                min: 0,
                max: 400000,
                from: 0,
                to: 400000,
                type: 'double',
                step: 50000,
                grid: false,
                prettify_enabled: true,
                prettify_separator: separator,
                force_edges: true,
                prefix: prefix,
                postfix: postfix,
                max_postfix: max,
                onStart: function() {},
                onChange: function(data) {
                        //var slider = $('#range-price').data('ionRangeSlider');
                        //slider.update({
                        //  postfix: ' $',
                        //  max_postfix: ' +'
                        //});
                    }
                    //onChange: machinery.bind.priceRangeCheck(postfix, max)
            });

            $("#range-year").ionRangeSlider({
                keyboard: true,
                min: 1970,
                max: intYear,
                from: 1970,
                to: intYear,
                type: 'double',
                step: 5,
                grid: false,
                prettify_enabled: false,
                force_edges: true
            });

            // Handle 'GO' buttons state
            $('.user-input').on('keyup', function() {
                var usrIpt = $('.user-input').val().length;
                var dropdownIpt = $('.dropdown-input');
                var value = $(this).val().length;

                if (value != 0 || usrIpt != 0 || value === 0 && usrIpt != 0) {
                    $('.go').removeClass('inactive');
                } else if (value === 0 && usrIpt === 0 && !$('.dropdown-input').hasClass('populated')) {
                    $('.go').addClass('inactive');
                }
            });

            $('#range-price').on('change', function(postfix, max) {
                //console.log(from + " - " + to);
                //if(PreferredCulture == "fr-CA"){
                //  console.log('postfix', postfix, 'max', max);
                //  postfix = ' $';
                //  max = ' +';
                //}
            });

            $('#range-price, #range-year').on('change', function() {
                if ($('.go').hasClass('inactive')) {
                    $('.go').removeClass('inactive');
                }
            });

            // Reset options button
            $('.user-input, #range-year, #range-price').on('change', function() {
                if (!$('.reset-options').hasClass('active')) {
                    $('.reset-options').addClass('active');
                }
            });

            $('.reset-options').on('click', function(e) {
                e.preventDefault();
                if ($('.reset-options').hasClass('active')) {
                    $('.reset-options').removeClass('active');
                }
            });
        }

        machinery.bind.otherCheck = function() {
                var dataText = PreferredCulture == "fr-CA" ? "Autres" : "Other";

                // Moves 'Other' to bottom of Categories list.
                var otherLabel = $('label[for="category"]');
                var other = otherLabel.siblings('.dropdown-list').find($('.dropdown-link[data-text="' + dataText + '"]'));
                other.parent('.dropdown-item').appendTo(other.closest('.dropdown-items'); other.addClass('testing');
                    // Sets data-category to 'Other' if item is not in main drop down.
                    var catChkArr = [];
                    var tiles = $('.machinery-tile');
                    var catChkItem = otherLabel.siblings('.dropdown-list').find('.dropdown-item'); $(catChkItem).each(function() {
                        catChkArr.push($(this).find('.dropdown-link').data('text'));
                    }); $(tiles).each(function() {
                        var cat = $(this).data('category');
                        if ($.inArray(cat, catChkArr) == -1) {
                            $(this).data('category', dataText).attr('data-category', dataText);
                        };
                    });
                }

                machinery.bind.priceRangeCheck = function(postfix, max) {
                    if (PreferredCulture == "fr-CA") {
                        //console.log('test',postfix, max);
                        postfix = ' $';
                        max = ' +';
                    }
                }

                machinery.bind.resetOptions = function() {
                    var rangePrice = $('#range-price').data('ionRangeSlider');
                    var rangeYear = $('#range-year').data('ionRangeSlider');


                    $('.reset-options').on('click', function(e) {
                        e.preventDefault();
                        machinery.bind.filtered = false;
                        machinery.filterArray = {};
                        machinery.bind.sortMachinery.sortName = 'date';

                        $('.user-input, .dropdown-input').each(function() {
                            $(this).val('').attr('data-selected', '');
                            $(this).data('selected', '');
                        });

                        var tileLength = $('.machinery-tile').length;
                        rangePrice.reset();
                        rangeYear.reset();
                        machinery.bind.pagination(tileLength);

                        if ($('.user-input').hasClass('populated')) {
                            $('.user-input').removeClass('populated');
                        }
                        if (!$('.go').hasClass('inactive')) {
                            $('.go').addClass('inactive');
                        }
                        if ($('.error-postal__format').hasClass('active')) {
                            $('.error-postal__format').removeClass('active');
                        }

                        $('.machinery-tile').attr("data-distance", "");
                        $(".machinery-tile__item[data-id='distance'] span").html("");

                        $('.machinery-tile').removeClass('matched');

                    });
                }

                machinery.bind.filtered = false;

                machinery.bind.filter = function() {
                    var Filter = Filter || {};
                    Filter.match = function(tileObj, filterVal, filterName) {

                        if ($(tileObj).data(filterName) != "") {
                            var str = $(tileObj).data(filterName).toString();
                            var valueRegex = new RegExp(filterVal, "i");
                            var valueResult = str.search(valueRegex);
                            //console.log('valueResult', valueResult);
                            return valueResult > -1;
                        } else {
                            return true;
                        }

                    };

                    Filter.inRange = function(tileObj, filterValMin, filterValMax, filterName) {
                        //console.log(filterName, $(tileObj).data(filterName));
                        if ($(tileObj).data(filterName) >= 0) {
                            //console.log();
                            //console.log('filterValMin', filterValMin);
                            // console.log(filterName, $(tileObj).data(filterName));
                            return $(tileObj).data(filterName) >= filterValMin && $(tileObj).data(filterName) <= filterValMax;
                        } else {
                            return true;
                        }
                    };

                    Filter.compare = function(array) {
                        var tiles = $('.machinery-tile');
                        var filterInput = array; // get the filter input as array.

                        var totalMatches = 0;
                        var matchItems = [];
                        // var hasPostalEntry = filterInput["postal-code"]!=undefined ? true :false;
                        //console.log("filterInput", filterInput);

                        tiles.removeClass('matched');

                        machinery.bind.filtered = true;

                        $.each(tiles, function(i) {
                            var match1 = false;
                            var match2;
                            // console.log(tiles[i]);

                            $.each(filterInput, function(j) {
                                var thisKey = j;

                                if (thisKey != "postal-code") {

                                    if (thisKey == "distance") {
                                        if (filterInput["postal-code"] != undefined) {
                                            var maxVal = filterInput[thisKey].replace(/\s[k][m][s]|\s[k][m]/g, "");

                                            match1 = Filter.inRange(tiles[i], 0, maxVal, thisKey);
                                        } else {
                                            match1 = true;
                                        }

                                    } else if (thisKey == "price" || thisKey == "year") {
                                        var minVal = machinery.filterArray[thisKey][0] == 0 ? 1 : machinery.filterArray[thisKey][0]; // get filter minimum value
                                        var maxVal = machinery.filterArray[thisKey][1]; // get filter maximum value
                                        //console.log('minval', minVal);
                                        match1 = Filter.inRange(tiles[i], minVal, maxVal, thisKey);

                                    } else {
                                        match1 = Filter.match(tiles[i], filterInput[thisKey], thisKey);
                                        console.log('filterInput[thisKey]', filterInput[thisKey]);
                                        //if filterInput[thisKey] = Other
                                    }

                                    if (match1 && (match2 || match2 == undefined)) {
                                        match2 = match1;
                                    } else {
                                        match2 = false;
                                    }
                                    // console.log(thisKey, match2);
                                }
                            });

                            if (match2) {
                                totalMatches++;
                                $(tiles[i]).addClass("matched");
                                $(tiles[i]).show();
                            } else {
                                $(tiles[i]).removeClass("matched");
                                $(tiles[i]).hide();
                            }
                        });

                        if (totalMatches < 1) {

                        }

                        machinery.bind.pagination(totalMatches, true);
                        //machinery.bind.sortMachinery(true);
                        $('.user-input, .dropdown-input').each(function() {
                            var val = $(this).data('selected');
                        });
                    };

                    //$('.go').on('click', function(e){
                    $(document).on('click', '.go', function(e) {
                        e.preventDefault();
                        console.log('clicked');
                        machinery.filterArray = {};

                        $('.user-input, .dropdown-input').each(function() {
                            var key = $(this).attr('id');
                            var val = $(this).data('selected');
                            if (val) {
                                machinery.filterArray[key] = val;
                            }
                        });

                        $("#range-year").each(function() {
                            var $this = $(this),
                                from = $this.data("from"),
                                to = $this.data("to");
                            machinery.filterArray["year"] = [from, to];
                        });

                        $("#range-price").each(function() {
                            var $this = $(this),
                                from = $this.data("from"),
                                to = $this.data("to");
                            machinery.filterArray["price"] = [from, to];
                        });

                        var postVal = $('#postal-code').val();

                        if (postVal) {
                            if (machinery.bind.postalValidation()) {

                                var postOne = postVal.substr(0, 3),
                                    postTwo = postVal.substr(4, 7),
                                    separator = '%20',
                                    postal = postOne + separator + postTwo,
                                    tiles = $('.machinery-tile'),
                                    tileMatch = $('.machinery-tile').attr('data-dealercode');

                                $.getJSON('/DealerFinder.ashx?um=true&postalCode=' + postal, function(data) {

                                    if (data != undefined) {
                                        $.each(tiles, function(index) {
                                            var dealercode = $(this).data("dealercode");
                                            var distances = data[dealercode];
                                            var distancesContainer = $(this).find(".machinery-tile__item[data-id='distance']");

                                            $(this).attr("data-distance", distances);
                                            if (distances != undefined) {
                                                $(distancesContainer).find("span").html(distances + " kms");
                                            } else {
                                                $(distancesContainer).find("span").html("-- kms");
                                            }
                                        });

                                        Filter.compare(machinery.filterArray)

                                        var parent = $('.machinery-results .content-width');
                                        var item = $('.machinery-tile.matched');

                                        machinery.bind.sortMachinery.sortName = "distance";

                                        // console.log("postal code search", machinery.bind.filtered);

                                        machinery.bind.sortMachinery.toSort(parent, item, "asc", "distance", machinery.bind.filtered);

                                    } else {
                                        machinery.bind.postalValidationError(false);
                                    }

                                });
                            }

                        } else {

                            $('.machinery-tile').attr("data-distance", "");
                            $(".machinery-tile__item[data-id='distance'] span").html("");

                            Filter.compare(machinery.filterArray);
                        }
                    });
                }

                machinery.bind.postalValidation = function() {
                    var value = $('#postal-code').val();
                    var regex = /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]( )?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i;
                    // var regex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
                    var match = regex.exec(value);
                    if (match) {
                        if (value.indexOf(" ") !== -1) {
                            machinery.bind.postalValidationError(true);
                            return true;
                        }
                    } else {
                        machinery.bind.postalValidationError(false);
                        return false;
                    }
                }

                machinery.bind.postalValidationError = function(show) {
                    if (show) {
                        $('.error-postal__format').removeClass('active');
                    } else {
                        $('.error-postal__format').addClass('active');
                        $('#postal-code').focus();
                    }
                }

                machinery.bind.postalFormat = function() {
                    var txtStr = $('#postal-code').text();
                    $('#postal-code').on('keypress', function(e) {
                        var thisLength = $(this).val();
                        var length = thisLength.length;
                        thisLength = thisLength + ' ';
                        if (e.keyCode != 8) {
                            if (length === 3) {
                                $(this).val(thisLength);
                            }
                        }
                    });
                    $('#postal-code').on('keydown', function(e) {
                        if (e.keyCode == 32) {
                            console.log('space');
                            $(this).val($(this).val() + '');
                            return false;
                        }
                        //if(/ $/.test(txtStr)){
                        //  console.log('spacer');
                        //}
                    });
                }

                machinery.bind.loadMachinery = function() {

                        var machineryArray = [];
                        var counter = 0;
                        $.getJSON('/UsedMachinery.ashx?lang=' + PreferredCulture, function(data) {
                                $.each(data, function(i, item) {
                                    counter++;
                                    var machineryItem = {
                                        machineryDetails: {
                                            MachineryUMID: data[i].UMID,
                                            MachineryPostDate: data[i].PostDate,
                                            MachineryMake: data[i].Make,
                                            MachineryModel: data[i].Model,
                                            MachineryPrice: data[i].Price,
                                            MachineryPriceNum: data[i].PriceNum,
                                            MachineryYear: data[i].Year,
                                            MachineImageURL: data[i].ImageURL,
                                            MachineryCategory: data[i].Category,
                                            MachineryHorsePower: data[i].Horsepower,
                                            MachineryHours: data[i].Hours,
                                            MachineryDealer: data[i].Dealer,
                                            MachineryID: counter
                                        }
                                    }
                                    machineryArray.push(machineryItem.machineryDetails);
                                });
                                machinery.bind.showMachinery(machineryArray);
                            }
                        }

                        machinery.bind.showMachinery = function(machineryArray) {
                                var machineryResults = $('.machinery-results .content-width');
                                var machineryTile = $('.machinery-tile');

                                // Set default sorting
                                var isClicked = $('.machinery-results__sort-link');
                                if (!$(isClicked).hasClass('active')) {
                                    machineryArray.sort(function(a, b) {
                                        //return b.MachineryPrice.localeCompare(a.MachineryPrice);
                                        return b.MachineryPostDate.localeCompare(a.MachineryPostDate);
                                    });
                                }

                                // Handlebars Helpers

                                // Data model format (fix)
                                Handlebars.registerHelper('formatString', function(str) {

                                    str = Handlebars.Utils.escapeExpression(str);
                                    return str;
                                    //}    
                                });

                                // Data date format
                                Handlebars.registerHelper('formatDate', function(date) {
                                    var date = date.slice(0, 10);
                                    return date;
                                });

                                // Build image path
                                Handlebars.registerHelper('imagePath', function(pathID, pathURL) {
                                    var basePth = 'https://info.kubota.ca/images/usedmachinery/';
                                    var finalPath = basePth + pathID + '/' + pathURL;
                                    //console.log(pathURL);
                                    return finalPath;
                                });

                                // Check if value > 0
                                Handlebars.registerHelper('valCheck', function(val) {
                                    if !(val > 0) {
                                        val = '--';
                                    }
                                    return val;
                                });

                                // Phone format
                                Handlebars.registerHelper('formatPhone', function(val) {
                                    const phoneStr = val;
                                    const parOpen = ['(', phoneStr].join('');
                                    const phoneFormat = [parOpen.slice(0, 4), ')', parOpen.slice(4)].join('');
                                    return phoneFormat;
                                });

                                // Currency format
                                Handlebars.registerHelper('formatCurrency', function(val) {
                                    var priceValue = val;
                                    var priceItm = '$' + priceValue.toFixed().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                                    if !(val > 0) {
                                        priceItm = '--';
                                    }
                                    return priceItm;
                                });

                                // format no price
                                Handlebars.registerHelper('formatNoPrice', function(val) {
                                        var priceValue = val == 0 ? "--" : val;
                                        return priceValue;
                                    }

                                    // Strip currency sign for data values
                                    Handlebars.registerHelper('stripCurrency', function(val) {
                                        var priceValue;
                                        if (typeof val !== 'undefined' && val) {
                                            if (PreferredCulture == 'fr-CA') {
                                                priceValue = val.replace(/\s|\$/g, "");
                                            } else {
                                                priceValue = val.replace(/\$|(\,)/g, "");
                                            }
                                            return priceValue;
                                        }
                                    });

                                    Handlebars.registerHelper('trimHorsePower', function(val) {
                                        var power = val.replace(/[.]\d[0]\s[–]\s/g, "-").replace(/[0-9]\s/g, " ");
                                        return power;
                                    });

                                    // Hours format
                                    Handlebars.registerHelper('formatHours', function(val) {
                                        var hoursValue = val;
                                        var hoursItm = hoursValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                        return hoursItm + ' ' + 'Hours';
                                    });

                                    // Build URL
                                    Handlebars.registerHelper('urlPath', function(make, model, umid) {
                                        var umfPath = 'used-machinery-finder/';
                                        var strChk = ' - ';
                                        var makeURL = make.replace(' ', '');
                                        var modelURL = model;

                                        if (/^[a-zA-Z0-9- ]*$/.test(modelURL) == false) {
                                            modelURL = '-';
                                        }

                                        var umidURL = umid;
                                        if (modelURL.indexOf(strChk) != -1) {
                                            modelURL = modelURL.replace(strChk, '-');
                                        }
                                        modelURL = modelURL.replace(/\s/g, '-');
                                        var path = umfPath + makeURL + '_' + modelURL.toString() + '_' + umidURL;
                                        // console.log('path ', path);
                                        return path;
                                    });

                                    var source = $('#machinery-tiles').html();
                                    var template = Handlebars.compile(source);
                                    var data = machineryArray; machineryResults.append(template(data));
                                    //console.log(data);

                                    $('.machiney-tile').each(function() {
                                        // console.log('as');
                                        $('.machinery-tile__image').error(function() {
                                            // console.log('image');
                                        });
                                    });

                                    machinery.bind.pagination(machineryArray.length); machinery.bind.errChk(); machinery.bind.otherCheck();
                                }

                                machinery.bind.sortMachinery = {};

                                machinery.bind.sortMachinery.sortName = 'date';

                                machinery.bind.sortMachinery.init = function() {

                                    $(document).on('click', '.machinery-results__sort-link', function(e) {
                                        e.preventDefault();

                                        var parent = $('.machinery-results .content-width');
                                        var matchItem = $('.machinery-tile.matched');
                                        var allTiles = $('.machinery-tile');
                                        var filtered = machinery.bind.filtered;
                                        var item = filtered ? matchItem : allTiles;
                                        var sort = $(this);
                                        var sortName = machinery.bind.sortMachinery.sortName;
                                        var sortBy = '';
                                        var name = sort.attr('data-id');
                                        var sortBtn = $('.dropdown .sort-btn');
                                        var sortMobile = (sort.hasClass('dropdown-link-sort') || sort.hasClass('sort-btn')) ? true : false;

                                        $('.machinery-results__sort-link').removeClass('active');

                                        if (sortMobile) {
                                            sortBtn.addClass('active');

                                            if (sort.hasClass('sort-btn')) {
                                                sortBy = sortBtn.attr('data-order') == 'asc' ? 'dec' : 'asc';
                                            } else {
                                                sortBy = sortBtn.attr('data-order');
                                                sortName = name.toString();
                                            }
                                            $('.dropdown-link-sort.machinery-results__sort-link').attr('data-order', sortBy);
                                            sortBtn.attr('data-order', sortBy);

                                            // console.log(sortMobile, sortBy);
                                        } else {
                                            sort.addClass('active');
                                            sort.attr('data-order', sort.attr('data-order') == 'asc' ? 'dec' : 'asc');

                                            sortBy = sort.attr('data-order');
                                            sortName = name.toString();

                                            // console.log(sortMobile, sortBy);
                                        }
                                        //if(sort.hasClass('sort-btn')){
                                        //  console.log('asas');
                                        //  sortName = $('.dropdown-input-sort').attr('id');
                                        //}

                                        if (filtered) {
                                            allTiles.hide();
                                            item.show();
                                        }

                                        machinery.bind.sortMachinery.sortName = sortName;
                                        // console.log("filtered", filtered);
                                        // console.log("item[0]", $(item[0]).data('distance'));
                                        // console.log("item[0]", $(item[0]).data('distance').length);

                                        if (name != 'distance' || (name == 'distance' && ($(item[0]).data('distance').length > 0) || $(item[0]).data('distance') > 0)) {
                                            // console.log("item[0]", $(item[0]));
                                            machinery.bind.sortMachinery.toSort(parent, item, sortBy, sortName, filtered);
                                        }

                                    });

                                    $(document).on('click', '.machinery-results__sort-link.sort-btn', function(e) {
                                        e.preventDefault();
                                        //  var sortTerm = $('.dropdown-input-sort').data('selected');
                                        //  console.log(sortTerm);
                                    })
                                }

                                machinery.bind.sortMachinery.toSort = function(parent, item, sortBy, sortName, filtered) {
                                    // console.log("sorting bind val", machinery.bind.filtered);
                                    // console.log("sorting filtered", filtered);

                                    item.sort(function(a, b) {
                                        // For PRICE/YEAR
                                        if (sortName == 'price' || sortName == 'year' || sortName == 'distance') {
                                            if (sortBy == 'asc') {
                                                return $(a).data(sortName) - $(b).data(sortName);
                                            } else {
                                                return $(b).data(sortName) - $(a).data(sortName);
                                            }
                                        }
                                        // For DATE/MAKE
                                        if (sortName == 'date' || sortName == 'make') {
                                            if (sortBy == 'asc') {
                                                return $(a).data(sortName).localeCompare($(b).data(sortName));
                                            } else {
                                                return $(b).data(sortName).localeCompare($(a).data(sortName));
                                            }
                                        }
                                        // For MODEL (fix)
                                        if (sortName === 'model') {
                                            if !($(a).data(sortName) == '4036') {
                                                if (sortBy == 'asc') {
                                                    return $(a).data(sortName).localeCompare($(b).data(sortName));
                                                } else {
                                                    return $(b).data(sortName).localeCompare($(a).data(sortName));
                                                }
                                            }
                                        }
                                    });

                                    item.detach().appendTo(parent);

                                    machinery.bind.pagination(item.length, filtered);
                                }

                                machinery.bind.pagination = function(arrLgth, filtered) {
                                    //how many items per page to show
                                    var showPerPage = 10;
                                    //var showPerPage =  Math.ceil(arrLgth/3);
                                    var numItems = arrLgth;
                                    var prepage = PreferredCulture == "fr-CA" ? "Précédent" : "Previous";
                                    var nextpage = PreferredCulture == "fr-CA" ? "Suivante" : "Next";

                                    var navigation = '<a class="previous inline--link-reverse inactive" href=""><i class="fa fa-caret-left" aria-hidden="true"></i>' + prepage + '</a>';
                                    var curLnk = 1;
                                    for (var i = 0; i < numItems; i = i + showPerPage) {
                                        navigation += '<a class="page-number" href="" data-start="' + i + '" data-end="' + (i + showPerPage) + '" data-filtered="' + filtered + '">' + (curLnk) + '</a>';
                                        curLnk++;
                                    }
                                    navigation += '<p class="mobile-pagination"><span class="mobile-pagination__current">1</span>/<span class="mobile-pagination__total">' + curLnk + '</span></p>'
                                    navigation += '<a class="next inline--link-reverse" href="">' + nextpage + '<i class="fa fa-caret-right" aria-hidden="true"></i></a>';
                                    $('.machinery-results__navigation .content-width').html(navigation);

                                    showTile(0, showPerPage, filtered);

                                    if (arrLgth < 11) {
                                        $('.next').addClass('inactive');
                                        $('.mobile-pagination').addClass('inactive');
                                    }

                                    if (arrLgth < 1) {
                                        if ($('.machinery-no-results').hasClass('active')) {
                                            $('.machinery-no-results').fadeTo('fast', 0).delay(250).fadeTo('fast', 1);
                                        } else {
                                            $('.machinery-no-results').addClass('active');
                                        }
                                    } else {
                                        $('.machinery-no-results').removeClass('active');
                                    }

                                    function showTile(startIndex, endIndex, filtered) {
                                        if (filtered && filtered != 'undefined') {
                                            $('.machinery-tile.matched').hide().slice(startIndex, endIndex).show();
                                        } else {
                                            $('.machinery-tile').hide().slice(startIndex, endIndex).show();
                                        }
                                    }

                                    $('.page-number').click(function(e) {
                                        e.preventDefault();
                                        $('.page-number.active').removeClass('active');
                                        $(this).addClass('active');

                                        //update mobile pagination
                                        $('.mobile-pagination .mobile-pagination__current').text($(this).text());
                                        var IndexData = $(this).data();

                                        showTile(IndexData.start, IndexData.end, IndexData.filtered);
                                    }).first().addClass('active');

                                    $('.previous, .next').click(function(e) {
                                        e.preventDefault();
                                        var traverse = $(this).is('.previous') ? 'prev' : 'next';
                                        $('.page-number.active')[traverse]('.page-number').click();
                                    });

                                    $('.previous, .next, .page-number').click(function(e) {
                                        e.preventDefault();
                                        if ($('.page-number:first').hasClass('active')) {
                                            $('.previous').addClass('inactive');
                                        } else {
                                            $('.previous').removeClass('inactive');
                                        }
                                        if ($('.page-number:last').hasClass('active')) {
                                            $('.next').addClass('inactive');
                                        } else {
                                            $('.next').removeClass('inactive');
                                        }
                                    });
                                }

                                machinery.bind.errChk = function() {
                                    // Check for broken images and replace with placeholder
                                    //document.getElementsByClassName('machinery-tile__image').style.backgroundImage="url(/getmedia/9035f96a-2dd9-4537-bcbf-a3eaf99d616d/no-photo)')";
                                    $('.machinery-tile__image').each(function() {
                                        //var img = $(this).css('background-image');
                                        $(this).on('error', function() {
                                            $(this).css('background-image', 'url(/getmedia/9035f96a-2dd9-4537-bcbf-a3eaf99d616d/no-photo)');
                                        });
                                    });
                                }