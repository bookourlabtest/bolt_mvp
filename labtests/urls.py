from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('tests/', views.browse_tests, name='browse_tests'),
    path('tests/<int:test_id>/', views.test_details, name='test_details'),
    path('checkout/', views.checkout, name='checkout'),
    path('checkout/success/', views.checkout_success, name='checkout_success'),

    # API endpoints
    path('api/cart/add/', views.add_to_cart, name='add_to_cart'),
    path('api/cart/count/', views.cart_count, name='cart_count'),
]