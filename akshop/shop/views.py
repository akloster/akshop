from django.shortcuts import render
from django.views.generic import DetailView, ListView
from .models import Product
from django.http import JsonResponse
from django.template.loader import render_to_string
from django.db.models import Q


class ProductDetailView(DetailView):
    model = Product
    slug_field = "slug"
    slug_url_kwarg = "slug"
    template_name="shop/product-detail.html"

product_detail_view = ProductDetailView.as_view()

class ProductListView(ListView):
    model = Product
    template_name="shop/product-list.html"
    paginate_by = 3
    def get_queryset(self):
        terms = str(self.request.GET.get("terms","")).split()
        queryset = Product.objects.all()
        q = Q()
        for t in terms:
            q |= Q(name__icontains=t, description__icontains=t)
            queryset = queryset.filter(q)

        return queryset


    def render_to_response(self, context, **kwargs):
        x = super().render_to_response(context, **kwargs)
        s = render_to_string(self.template_name, context, self.request) 
        paginator = context["paginator"]
        page = context["page_obj"]
        data = dict(
            html=s,
            is_paginated=len(paginator.page_range)>1,
            has_next=page.has_next(),
            next_page = page.next_page_number() if page.has_next() else None,
            previous_page = page.previous_page_number() if page.has_previous() else None,
            has_previous=page.has_previous(),
            pages=list(paginator.page_range),
        )
        return JsonResponse(data)

product_list_view = ProductListView.as_view()

def get_cart(request):
    cart = request.session.get("cart", [])
    return cart

def add_product_to_cart_view(request):
    """ Will throw 404 or 500 on invalid product, depending on id. """
    id = int(request.POST["id"])
    product = Product.objects.get(id=id)
    cart = get_cart(request)
    if id not in cart:
        cart.append(id)
        request.session["cart"] = cart
    data = make_cart_data(request)
    return JsonResponse(data)

def remove_product_from_cart_view(request):
    """ Will throw 404 or 500 on invalid product, depending on id. """
    id = int(request.POST["id"])
    product = Product.objects.get(id=id)
    cart = get_cart(request)
    if id in cart:
        cart.remove(id)
        request.session["cart"] = cart
    data = make_cart_data(request)
    return JsonResponse(data)

def make_cart_data(request):
    cart = get_cart(request)
    products = Product.objects.in_bulk(cart)
    data = dict(cart=[dict(name=product.name,
                           description=product.description,
                           small_image=product.small_image.url,
                           url=product.get_absolute_url(),
                           id=product.id 
                            ) for product in products.values()])
    return data

def get_cart_json(request):
    data = make_cart_data(request)
    return JsonResponse(data)
