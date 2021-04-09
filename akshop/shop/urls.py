from django.urls import path

from akshop.shop.views import (
    product_detail_view,
    product_list_view,
    add_product_to_cart_view,
    remove_product_from_cart_view,
    get_cart_json
)

app_name = "akshop.shop"
urlpatterns = [
    path("list/", view=product_list_view, name="product-list"),
    path("add_to_cart/", view=add_product_to_cart_view, name="add-to-cart"),
    path("remove_from_cart/", view=remove_product_from_cart_view, name="remove-from-cart-json"),
    path("get_cart_json/", view=get_cart_json, name="get-cart-json"),
    path("<str:slug>/", view=product_detail_view, name="product-detail"),
]
