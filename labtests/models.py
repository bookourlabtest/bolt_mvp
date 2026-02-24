from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=50)
    def __str__(self):
        return self.name

class Vendor(models.Model):
    name = models.CharField(max_length=100)
    rating = models.FloatField()
    reviews = models.IntegerField()
    is_nabl_certified = models.BooleanField(default=False)
    home_collection = models.BooleanField(default=False)
    online_report = models.BooleanField(default=True)
    offline_report = models.BooleanField(default=False)
    def __str__(self):
        return self.name

class LabTest(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    parameters = models.IntegerField()
    turnaround_hours = models.IntegerField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    fasting = models.BooleanField(default=False)
    def __str__(self):
        return self.name

class TestPricing(models.Model):
    test = models.ForeignKey(LabTest, on_delete=models.CASCADE)
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    discount_percent = models.IntegerField(default=0)
    report_eta_hours = models.IntegerField()
    eta = models.CharField(max_length=50, default='24 hours')
    original_price = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    def __str__(self):
        return f"{self.test.name} - {self.vendor.name}"