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

    # Chat endpoints
    path('api/chat/message/', views.chat_message, name='chat_message'),
    path('api/chat/history/', views.chat_history, name='chat_history'),
    
    # Tests + Bookings API
    path('api/tests/', views.api_tests_list, name='api_tests_list'),
    path('api/tests/<int:test_id>/', views.api_test_detail, name='api_test_detail'),
    path('api/bookings/', views.api_bookings, name='api_bookings'),
]