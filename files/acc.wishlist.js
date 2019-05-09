ACC.wishlist = {
    addUrl: "/wishlist-handler/add-to-wl",
    removeUrl: "/wishlist-handler/remove-from-wl",
    verifyUrl: "/wishlist-handler/verify-product",

    callEntryAction: function (url, productCode) {
        $.ajax({
            url: url,
            data: {productCode: productCode},
            type: "get",
            success: function (response) {
                var resultJSON = jQuery.parseJSON(response);
                if (resultJSON.isWished == 'true') {
                    $("#checkbox_" + productCode)[0].checked = true;
                }
                if (resultJSON.loged == 'false') {
                    window.location.replace("/login");
                }
            }
        });
    },

    handleIconClick: function (iconCheck, productCode) {
        if (iconCheck.checked) {
            ACC.wishlist.callEntryAction(ACC.wishlist.addUrl, productCode);
        } else {
            ACC.wishlist.callEntryAction(ACC.wishlist.removeUrl, productCode);
            $("#wishedProduct_"+productCode).remove();
        }
    }
};

