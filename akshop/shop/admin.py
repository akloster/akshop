from django.contrib import admin
from akshop.shop.models import Product

class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'description')
admin.site.register(Product, ProductAdmin)