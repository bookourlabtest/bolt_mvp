from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.contrib import messages
from django.contrib.sessions.models import Session
from django.urls import reverse
from django.db.models import Min, Q
from .models import Category, Vendor, LabTest, TestPricing
import json
from decimal import Decimal


def get_cart_items_count(request):
    """Get the total number of items in cart"""
    cart = request.session.get('cart', {})
    return sum(item['quantity'] for item in cart.values())


def get_cart_total(request):
    """Get the total price of items in cart"""
    cart = request.session.get('cart', {})
    total = 0
    for item in cart.values():
        total += item['price'] * item['quantity']
    return total


def home(request):
    """Home page view"""
    # Get popular tests (first 6 tests)
    tests = LabTest.objects.all()[:6]

    # Add lowest offer information for each test
    for test in tests:
        lowest_offer = TestPricing.objects.filter(test=test).aggregate(
            min_price=Min('price')
        )['min_price']

        if lowest_offer:
            test.lowest_offer = TestPricing.objects.filter(
                test=test, price=lowest_offer
            ).first()
            test.offers = list(TestPricing.objects.filter(test=test))
            test.offers_count = len(test.offers)
        else:
            test.lowest_offer = None
            test.offers = []
            test.offers_count = 0

    context = {
        'tests': tests,
        'cart_items_count': get_cart_items_count(request),
    }
    return render(request, 'home.html', context)


def browse_tests(request):
    """Browse tests page with filtering and search"""
    # Get all tests with their pricing
    tests = LabTest.objects.all().prefetch_related('testpricing_set__vendor')

    # Search functionality
    search_query = request.GET.get('search', '')
    if search_query:
        tests = tests.filter(
            Q(name__icontains=search_query) |
            Q(description__icontains=search_query)
        )

    # Category filter
    selected_category = request.GET.get('category', 'All Tests')
    if selected_category != 'All Tests':
        tests = tests.filter(category__name=selected_category)

    # Price range filter
    min_price = request.GET.get('min_price', 0)
    max_price = request.GET.get('max_price', 5000)
    if min_price or max_price:
        try:
            min_price = int(min_price)
            max_price = int(max_price)
            # Filter tests that have at least one offer in the price range
            test_ids = []
            for test in tests:
                offers = TestPricing.objects.filter(test=test)
                if any(min_price <= offer.price <= max_price for offer in offers):
                    test_ids.append(test.id)
            tests = tests.filter(id__in=test_ids)
        except ValueError:
            pass

    # Feature filters
    home_collection = request.GET.get('home_collection') == 'on'
    online_report = request.GET.get('online_report') == 'on'

    if home_collection or online_report:
        test_ids = []
        for test in tests:
            offers = TestPricing.objects.filter(test=test)
            has_matching_offer = False

            for offer in offers:
                if home_collection and not offer.vendor.home_collection:
                    continue
                if online_report and not offer.vendor.online_report:
                    continue
                has_matching_offer = True
                break

            if has_matching_offer:
                test_ids.append(test.id)

        tests = tests.filter(id__in=test_ids)

    # Sorting
    sort_by = request.GET.get('sort', 'popular')
    if sort_by == 'price-low':
        # Sort by lowest price
        tests = sorted(tests, key=lambda t: min((o.price for o in TestPricing.objects.filter(test=t)), default=0))
    elif sort_by == 'price-high':
        # Sort by highest price
        tests = sorted(tests, key=lambda t: max((o.price for o in TestPricing.objects.filter(test=t)), default=0), reverse=True)
    elif sort_by == 'eta':
        # Sort by fastest ETA (simplified)
        tests = sorted(tests, key=lambda t: min((o.report_eta_hours for o in TestPricing.objects.filter(test=t)), default=24))

    # Add offer information for each test
    for test in tests:
        offers = list(TestPricing.objects.filter(test=test).select_related('vendor'))
        test.offers = offers
        if offers:
            test.lowest_offer = min(offers, key=lambda o: o.price)
            test.offers_count = len(offers)
        else:
            test.lowest_offer = None
            test.offers_count = 0

    # Get all categories for filter
    categories = ['All Tests'] + list(Category.objects.values_list('name', flat=True))

    context = {
        'tests': tests,
        'categories': categories,
        'selected_category': selected_category,
        'search_query': search_query,
        'sort_by': sort_by,
        'cart_items_count': get_cart_items_count(request),
    }
    return render(request, 'browse_tests.html', context)


def test_details(request, test_id):
    """Test details page"""
    test = get_object_or_404(LabTest.objects.prefetch_related('testpricing_set__vendor'), pk=test_id)

    # Get all offers for this test
    offers = list(TestPricing.objects.filter(test=test).select_related('vendor'))

    # Sorting
    sort_by = request.GET.get('sort', 'price')
    if sort_by == 'price':
        offers.sort(key=lambda o: o.price)
    elif sort_by == 'eta':
        offers.sort(key=lambda o: o.report_eta_hours)
    elif sort_by == 'rating':
        offers.sort(key=lambda o: o.vendor.rating, reverse=True)

    context = {
        'test': test,
        'offers': offers,
        'sort_by': sort_by,
        'cart_items_count': get_cart_items_count(request),
    }
    return render(request, 'test_details.html', context)


def checkout(request):
    """Checkout page"""
    cart = request.session.get('cart', {})

    if not cart:
        # Show empty cart message instead of redirecting
        messages.info(request, 'Your cart is empty. Add some tests to proceed with checkout.')
        cart_items = []
        subtotal = Decimal('0')
        discount = Decimal('0')
        gst = Decimal('0')
        total = Decimal('0')
    else:
        # Get test and offer details for cart items
        cart_items = []
        subtotal = 0

        for key, item in cart.items():
            try:
                test = LabTest.objects.get(id=item['test_id'])
                offer = TestPricing.objects.select_related('vendor').get(
                    test_id=item['test_id'],
                    vendor_id=item['offer_id']
                )

                cart_item = {
                    'test': test,
                    'offer': offer,
                    'quantity': item['quantity'],
                    'total': offer.price * item['quantity']
                }
                cart_items.append(cart_item)
                subtotal += cart_item['total']
            except (LabTest.DoesNotExist, TestPricing.DoesNotExist):
                # Remove invalid cart items
                del cart[key]

        # Calculate totals
        discount = round(subtotal * Decimal('0.05'))  # 5% discount
        gst = round((subtotal - discount) * Decimal('0.18'))  # 18% GST
        total = subtotal - discount + gst

    if request.method == 'POST':
        # Handle checkout form submission
        step = request.POST.get('step')

        if step == 'details':
            # Validate details and move to payment
            if not cart:
                messages.error(request, 'Cannot proceed with empty cart.')
                return redirect('checkout')
            return render(request, 'checkout.html', {
                'cart_items': cart_items,
                'subtotal': subtotal,
                'discount': discount,
                'gst': gst,
                'total': total,
                'step': 'payment',
                'cart_items_count': get_cart_items_count(request),
            })
        elif step == 'payment':
            # Process payment (mock)
            if not cart:
                messages.error(request, 'Cannot proceed with empty cart.')
                return redirect('checkout')
            # Clear cart and redirect to success
            request.session['cart'] = {}
            request.session.modified = True
            messages.success(request, 'Payment successful! Your booking has been confirmed.')
            return redirect('checkout_success')

    context = {
        'cart_items': cart_items,
        'subtotal': subtotal,
        'discount': discount,
        'gst': gst,
        'total': total,
        'step': request.GET.get('step', 'details'),
        'cart_items_count': get_cart_items_count(request),
    }
    return render(request, 'checkout.html', context)


def checkout_success(request):
    """Checkout success page"""
    # Generate a mock booking ID
    import random
    import string
    booking_id = 'BOLT-' + ''.join(random.choices(string.ascii_uppercase + string.digits, k=9))

    context = {
        'booking_id': booking_id,
        'cart_items_count': get_cart_items_count(request),
    }
    return render(request, 'checkout_success.html', context)


# API endpoints for cart functionality

def add_to_cart(request):
    """API endpoint to add item to cart"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            test_id = data.get('test_id')
            offer_id = data.get('offer_id')

            if not test_id or not offer_id:
                return JsonResponse({'success': False, 'error': 'Missing test_id or offer_id'})

            # Get the offer details
            offer = TestPricing.objects.select_related('test', 'vendor').get(
                test_id=test_id, vendor_id=offer_id
            )

            cart = request.session.get('cart', {})
            cart_key = f"{test_id}_{offer_id}"

            if cart_key in cart:
                cart[cart_key]['quantity'] += 1
            else:
                cart[cart_key] = {
                    'test_id': test_id,
                    'offer_id': offer_id,
                    'price': float(offer.price),
                    'quantity': 1,
                }

            request.session['cart'] = cart
            request.session.modified = True

            return JsonResponse({
                'success': True,
                'cart_count': get_cart_items_count(request)
            })

        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})

    return JsonResponse({'success': False, 'error': 'Invalid method'})


def cart_count(request):
    """API endpoint to get cart count"""
    return JsonResponse({'count': get_cart_items_count(request)})
