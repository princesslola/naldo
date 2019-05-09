ACC.naldoTheme = {

	// _autoload: [
	// 	["bindCarousel", $(".js-owl-carousel").length >0],
	// 	"bindJCarousel"
	// ],

	// carouselConfig:{
	// 	"default":{
	// 		navigation:true,
	// 		navigationText : ["<span class='glyphicon glyphicon-chevron-left'></span>", "<span class='glyphicon glyphicon-chevron-right'></span>"],
	// 		pagination:false,			itemsCustom : [[0, 2], [640, 4], [1024, 5], [1400, 7]]
	// 	},

	// },

	checkoutNewAccount: function(){
		$('.js_checkout-new-account').on('click', function(e){
			e.preventDefault();
			$('.js_loginContainer').addClass('hidden');
			$('.js_registerContainer').removeClass('hidden');

		});
	}
}

// Address Verification
$(document).ready(function ()
{
	with (ACC.naldoTheme)
	{

		checkoutNewAccount();
	
	}
});

