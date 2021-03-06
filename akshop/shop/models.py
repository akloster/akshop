from django.db import models
from django.db.models import CharField, TextField, ImageField, SlugField
from django.utils.translation import gettext_lazy as _
from django.urls import reverse
from djmoney.models.fields import MoneyField
from djmoney.money import Money

class Product(models.Model):
    name = CharField(_("Product Name"), max_length=300)
    slug = SlugField(_("Slug"), max_length=100, allow_unicode=True) 
    description = TextField(_("Description"), blank=True)
    small_image = ImageField(_("Small Image"), upload_to="products")
    price = MoneyField(max_digits=10, decimal_places=2, default=Money(10, "EUR"),null=True, default_currency="EUR")

    class Meta:
        verbose_name = _("Product")
        verbose_name_plural = _("Products")
    def __str__(self):
        return "Product %s" % self.slug
    def get_absolute_url(self):
        """Get url for the product's detail view.

        Returns:
            str: URL for product detail.

        """
        return reverse("shop:product-detail", kwargs={"slug": self.slug})