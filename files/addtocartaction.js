ACC.addtocartaction = {

    _autoload: [
        "bindClickAddToCartButton",
        "bindWarrantyOptionSelect"
    ],

    bindClickAddToCartButton:function(){
        $( "#addToCartForm" ).submit(function( event ) {
            //var warrantyCodeRadio = $('#warrantyCodeRadio');
            var warrantyCodeRadio = $('input[name=warrantyCodeRadio]:checked');

            var inputWarrantyCodePost = $('#warrantyCodePost');

            if (warrantyCodeRadio && inputWarrantyCodePost) {
                var warrantyCodeVal = parseInt(warrantyCodeRadio.val());

                inputWarrantyCodePost.val(warrantyCodeVal);
            }

            var inputQty = $('#qty.addToCartFormQty');
            var exampleNumberInput = $('#example-number-input');
            if (inputQty && exampleNumberInput) {
                inputQty.val(exampleNumberInput.val());
            }
        });

    },

    bindWarrantyOptionSelect:function(){
        $( "input[name=warrantyCodeRadio]" ).change(function( event ) {
            // Obtenemos el valor de la garantia seleccionada
            var warrantyCodeRadio = $('input[name=warrantyCodeRadio]:checked');
            var warrantyCodeVal = warrantyCodeRadio.val();
            var selectedWarrantyPriceId = "warrantyPrice" + warrantyCodeVal;
            var selectedWarrantyPrice = $('#' + selectedWarrantyPriceId);
            var selectedWarrantyPriceValue = parseFloat(selectedWarrantyPrice.val());

            // Obtenemos el precio del producto
            var originalProductPrice = $('#originalProductPrice');
            var originalProductPriceVal = parseFloat(originalProductPrice.val());

            // Sumamos el precio del producto a la garantia
            var currentPrice = originalProductPriceVal + selectedWarrantyPriceValue;

            // Precio para mostrar en pantalla
            var priceToShow = "$" + (currentPrice.toFixed(0));
            var productPriceP = $('#product-price');
            productPriceP.html(priceToShow.replace(".", ","));

            // En caso que se haya aplicado una promocion actualizamos tambien el precio tachado
            if (! $('#product-old-price').is(":empty")) {
                var originalProductPriceWithoutDiscountVal = parseFloat($('#originalProductPriceWithoutDiscount').val());
                var currentPriceWithoutDiscount = originalProductPriceWithoutDiscountVal + selectedWarrantyPriceValue;
                var priceWithoutDiscountToShow = "$" + (currentPriceWithoutDiscount.toFixed(0));
                $("#product-old-price").text(priceWithoutDiscountToShow.replace(".", ","));
            }

            // Precio para los calculos
            var currentProductPrice = $('#currentProductPrice');
            currentProductPrice.val(currentPrice);

            $("#comboCuotas").trigger( "change" );
        });

    }
}

$(document).ready(function ()
{
	with (ACC.addtocartaction)
	{

	}
});


