from django.contrib import admin
from .models import Category, Vendor, LabTest, TestPricing

admin.site.register(Category)
admin.site.register(Vendor)
admin.site.register(LabTest)
admin.site.register(TestPricing)