ACC.paymentDetails = {
	_autoload: [
		"showRemovePaymentDetailsConfirmation"
	],
	
	showRemovePaymentDetailsConfirmation: function ()
	{
		$(document).on("click", ".removePaymentDetailsButton", function ()
		{
			var paymentId = $(this).data("paymentId");
			var popupTitle = $(this).data("popupTitle");

			ACC.colorbox.open(popupTitle,{
				inline: true,
				href: "#popup_confirm_payment_removal_" + paymentId,
				onComplete: function ()
				{
					$(this).colorbox.resize();
				}
			});

		})
	}
}

$(document).ready(function() {
	var payment_cards_active = 'checkout-payment-cards-active';
    $('.payment-cards a').click(function() {
        $('.payment-cards a img').removeClass(payment_cards_active);
        $(this).find('img').addClass(payment_cards_active);
    });
});