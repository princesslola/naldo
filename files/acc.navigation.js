


var oDoc = document;

ACC.navigation = {

    _autoload: [
        "offcanvasNavigation",
        "myAccountNavigation",
        "orderToolsNavigation"
    ],

    offcanvasNavigation: function(){

        enquire.register("screen and (max-width:"+screenSmMax+")", {

            match : function() {

                $(document).on("click",".js-enquire-offcanvas-navigation .js-enquire-has-sub .js_nav__link--drill__down",function(e){
                    e.preventDefault();
                    $(".js-userAccount-Links").hide();
                    $(".js-enquire-offcanvas-navigation ul.js-offcanvas-links").addClass("active");
                    $(".js-enquire-offcanvas-navigation .js-enquire-has-sub").removeClass("active");
                    $(this).parent(".js-enquire-has-sub").addClass("active");
                });


                $(document).on("click",".js-enquire-offcanvas-navigation .js-enquire-sub-close",function(e){
                    e.preventDefault();
                    $(".js-userAccount-Links").show();
                    $(".js-enquire-offcanvas-navigation ul.js-offcanvas-links").removeClass("active");
                    $(".js-enquire-offcanvas-navigation .js-enquire-has-sub").removeClass("active");
                });

            },

            unmatch : function() {

                $(".js-userAccount-Links").show();
                $(".js-enquire-offcanvas-navigation ul.js-offcanvas-links").removeClass("active");
                $(".js-enquire-offcanvas-navigation .js-enquire-has-sub").removeClass("active");

                $(document).off("click",".js-enquire-offcanvas-navigation .js-enquire-has-sub > a");
                $(document).off("click",".js-enquire-offcanvas-navigation .js-enquire-sub-close");


            }


        });

    },

    myAccountNavigation: function(){

        //copy the site logo
        $('.js-mobile-logo').html( $('.js-site-logo a').clone());

        //Add the order form img in the navigation
        $('.nav-form').html($('<span class="glyphicon glyphicon-list-alt"></span>'));


        var aAcctData = [];
        var sSignBtn = "";

        //my account items
        var oMyAccountData = $(".accNavComponent");

        //the my Account hook for the desktop
        var oMMainNavDesktop = $(".js-secondaryNavAccount > ul");

        //offcanvas menu for tablet/mobile
        var oMainNav = $(".navigation--bottom > ul.nav__links.nav__links--products");

        if(oMyAccountData){
            var aLinks = oMyAccountData.find("a");
            for(var i = 0; i < aLinks.length; i++){
                aAcctData.push({link: aLinks[i].href, text: aLinks[i].title});
            }
        }

        var navClose = '';
        navClose += '<div class="close-nav">';
        navClose += '<button type="button" class="js-toggle-sm-navigation btn"><span class="glyphicon glyphicon-remove"></span></button>';
        navClose += '</div>';


        //create Sign In/Sign Out Button
        if($(".liOffcanvas a") && $(".liOffcanvas a").length > 0){
            sSignBtn += '<li class=\"auto liUserSign\" ><a class=\"userSign\" href=\"' + $(".liOffcanvas a")[0].href + '\">' + $(".liOffcanvas a")[0].innerHTML + '</a></li>';
        }

        //create Welcome User + expand/collapse and close button
        //This is for mobile navigation. Adding html and classes.
        var oUserInfo = $(".nav__right ul li.logged_in");
        //Check to see if user is logged in
        if(oUserInfo && oUserInfo.length === 1)
        {
            var sUserBtn = '';
            sUserBtn += '<li class=\"auto \">';
            sUserBtn += '<div class=\"userGroup\">';
            sUserBtn += '<span class="glyphicon glyphicon-user myAcctUserIcon"></span>';
            sUserBtn += '<div class=\"userName\">' + oUserInfo[0].innerHTML + '</div>';
            if(aAcctData.length > 0){
                sUserBtn += '<a class=\"collapsed js-nav-collapse\" id="signedInUserOptionsToggle" data-toggle=\"collapse\"  data-target=\".offcanvasGroup1\">';
                sUserBtn += '<span class="glyphicon glyphicon-chevron-up myAcctExp"></span>';
                sUserBtn += '</a>';
            }
            sUserBtn += '</div>';
            sUserBtn += navClose;

            $('.js-sticky-user-group').html(sUserBtn);


            $('.js-userAccount-Links').append(sSignBtn);
            $('.js-userAccount-Links').append($('<li class="auto"><div class="myAccountLinksContainer js-myAccountLinksContainer"></div></li>'));



            //FOR DESKTOP
            // var myAccountHook = $('<a class=\"myAccountLinksHeader collapsed js-myAccount-toggle\" data-toggle=\"collapse\" data-parent=".nav__right" href=\"#accNavComponentDesktopOne\">' + oMyAccountData.data("title") + '</a>');
            // myAccountHook.insertBefore(oMyAccountData);

            //FOR MOBILE
            //create a My Account Top link for desktop - in case more components come then more parameters need to be passed from the backend
            var myAccountHook = [];
            myAccountHook.push('<div class="sub-nav">');
            myAccountHook.push('<a id="signedInUserAccountToggle" class=\"myAccountLinksHeader collapsed js-myAccount-toggle\" data-toggle=\"collapse\" data-target=".offcanvasGroup2">');
            myAccountHook.push(oMyAccountData.data("title"));
            myAccountHook.push('<span class="glyphicon glyphicon-chevron-down myAcctExp"></span>');
            myAccountHook.push('</a>');
            myAccountHook.push('</div>');

            $('.js-myAccountLinksContainer').append(myAccountHook.join(''));

            //add UL element for nested collapsing list
            $('.js-myAccountLinksContainer').append($('<ul data-trigger="#signedInUserAccountToggle" class="offcanvasGroup2 offcanvasNoBorder collapse js-nav-collapse-body subNavList js-myAccount-root sub-nav"></ul>'));


            //offcanvas items
            //TODO Follow up here to see the output of the account data in the offcanvas menu
            for(var i = aAcctData.length - 1; i >= 0; i--){
                var oLink = oDoc.createElement("a");
                oLink.title = aAcctData[i].text;
                oLink.href = aAcctData[i].link;
                oLink.innerHTML = aAcctData[i].text;

                var oListItem = oDoc.createElement("li");
                oListItem.appendChild(oLink);
                oListItem = $(oListItem);
                oListItem.addClass("auto ");
                $('.js-myAccount-root').append(oListItem);
            }

        } else {
            var navButtons = (sSignBtn.substring(0, sSignBtn.length - 5) + navClose) + '</li>';
            $('.js-sticky-user-group').html(navButtons);
        }

        // Creamos un nuevo array con los items del menu ordenados
        var orderedAAcctData = [{option: "update-profile"}, {option: "user-wishlist"}, {option: "orders"}, {option: "logout"}];
        for (var i = 0; i < orderedAAcctData.length; i++) {
            for (var j = 0; j < aAcctData.length; j++) {
                if (aAcctData[j].link.includes(orderedAAcctData[i].option)) {
                    orderedAAcctData[i].text = aAcctData[j].text;
                    orderedAAcctData[i].link = aAcctData[j].link;
                    break;
                }
            }
        }

        //desktop
        for(var i = 0; i < orderedAAcctData.length; i++){
            var oLink = oDoc.createElement("a");
            oLink.title = orderedAAcctData[i].text;
            oLink.href = orderedAAcctData[i].link;
            oLink.innerHTML = orderedAAcctData[i].text;

            var oListItem = oDoc.createElement("li");
            oListItem.appendChild(oLink);
            oListItem = $(oListItem);
            oListItem.addClass("auto");
            if(oMMainNavDesktop != null && oMMainNavDesktop.get(0) != null){
                oMMainNavDesktop.get(0).appendChild(oListItem.get(0));
            }
        }

        //hide and show contnet areas for desktop
        $('.js-secondaryNavAccount').on('shown.bs.collapse', function () {

            if($('.js-secondaryNavCompany').hasClass('in')){
                $('.js-myCompany-toggle').click();
            }

        });

        $('.js-secondaryNavCompany').on('shown.bs.collapse', function () {

            if($('.js-secondaryNavAccount').hasClass('in')){
                $('.js-myAccount-toggle').click();
            }

        });

        //change icons for up and down


        $('.js-nav-collapse-body').on('hidden.bs.collapse', function(e){

            var target = $(e.target);
            var targetSpan = target.attr('data-trigger') + ' > span';
            if(target.hasClass('in')) {
                $(targetSpan).removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
            }
            else {
                $(targetSpan).removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
            }

        });

        $('.js-nav-collapse-body').on('show.bs.collapse', function(e){
            var target = $(e.target)
            var targetSpan = target.attr('data-trigger') + ' > span';
            if(target.hasClass('in')) {
                $(targetSpan).removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');

            }
            else {
                $(targetSpan).removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
            }

        });

        //$('.offcanvasGroup1').collapse();


    },

    orderToolsNavigation: function(){
        $('.js-nav-order-tools').on('click', function(e){
            $(this).toggleClass('js-nav-order-tools--active');
        });
    }
};

//***************************LLAME A LAS FUNCIONES****************************

$(document).ready(function(){
    menu();
    cambioWidth();
    searchWidth();
    //userDes();
    //carrouselQuery();
    //navTop();
    footerCambio();
});


//*********************FOOTER***********************
function footerCambio(){
    $('footer').css({'width':'100%'})
}

//************************** ICON MENU SEARCH *****************************
function mini_form_hide(){

    $('#search-query-e').animate({height: 'hide', opacity:0}, 300);
    $('.top-search').removeClass('active');

}
function mini_form_show(){
    $('#search-query-e').animate({height: 'show', opacity:1}, 300);
    $('.top-search').addClass('active');
    $('.form-search .input-text').trigger('focus');

};

function searchWidth(){
$('.button-search-mob-e').on("click", function(){
    if ( $('#search-query-e').css('display') == 'none' ) {
        mini_form_show();
    } else {
        mini_form_hide();
    }
});

};



//***************************NAVBAR MOBILE**********************************
var contador=1;

$('nav').css('left','-100%');
function menu(){
    $('.button-open-menu').click(function(){
        if(contador == 1){
            $('nav').animate({
                left:'0'
            })
            contador=0;
        }else{
            contador=1;
            $('nav').animate({
                left:'-100%'
            })

        }
    });
}
//************************PRUEBA 1**********************************
function cambioWidth(){
    $(window).on('resize', function(){
        var win = $(this); //this = window
        if (win.width() >= 425) {
            $('.branding-mobile').css(
              'background-color','white'

            );


       }
      if (win.width() >= 1023) {
           $('.navigation ').css({
                'background-color':'white',
               left:'0'
          });
           $("nav").removeAttr("style");

       }
   });
};
//*********************************PRUEBA 2**********************************************
function userDes(){
    $(window).scroll(function(){
        var $pos=1;
        var $just=$(window).scrollTop();
        console.log($just);
        if ($just > $pos ){
           console.log('en hora buena');
           //$('#accNavComponentDesktopOne').css({'background-color':'teal',
                                                // 'z-index':'9999 !important'
                                                  //});
           //$('nav').css({'z-index':'100 !important'});
           //$('.affix').css({'z-index':'100 !important'});
           //$('.nav__links').css({'z-index':'100 !important'});
           //$('.navigation navigation--top').addClass('.affix-top');

       }else{
           console.log('en hora maa');
           //$('#accNavComponentDesktopOne').css({'background-color':'white',
           //    'z-index':'9999'
           //});
           // $('nav').css({'z-index':'100 !important'});
           // $('.affix').css({'z-index':'100 !important'});

       }
    });
}

//******************************PRUEBA 3  NAV TOP**********************************************
function navTop(){



    $(window).scroll(function(){
        var $pos=99;
        var $top=$(window).scrollTop();
        console.log($top);
        if($top > $pos){
            $('nav').css({'background-color':'teal'});
            $('.menu-column').css({'background-color':'yellow',
                                   'display':'block'


                                       });
        }

        else{

            $('.menu-column').css({'background-color':'red',
                                    'position':'absolute',
                                    'display':'none'

                          })
            $('js-mainHeader').css
        }
    })
}


//**************************CARROUSEL  PLAN B **************************************

function minMinImg(){


    verWidthImg();

    var imgCambio= $('.img-fluid-e').height();
    var wen= $(window).width();
    var carCalculo= Math.round((100*(wen/1347)));
    var newHeightEze= Math.round((499*carCalculo)/100);
    console.log(newHeightEze);

    $('#homepage-slider').css({
        'width':wen+'px',
        'height':newHeightEze+'px'
    });
    $('.img-fluid-e').css({
        'width':wen+'px',
        'height':newHeightEze+'px'
    });
    $('.ul-img-e').css({
        'width':wen+'px',
        'paddingLeft':'0px'
    });
    $('.slider_component').css({
        'width':wen+'px',
        'height':newHeightEze+'px'
    })

}

function verWidthImg(){
    $( "div" ).removeClass( "stripViewer" );
    $('.ul-img-e').children().each(function(){
        $(this).find().replaceWith('<!-- ' + $(this)[0].outerHTML + ' -->');
        console.log(this);
        //event.preventDefault();

    });

}


function carrouselQuery(){
    $(window).on('load', function(){
        var win = $(this); //this = window
        var $num=1360;
        if (win.width() >= $num) {
            minMinImg();
        }else{
            return null;
        }
    });
}


