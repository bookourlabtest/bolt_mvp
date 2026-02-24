from django.core.management.base import BaseCommand
from labtests.models import Category, Vendor, LabTest, TestPricing

class Command(BaseCommand):
    help = 'Populate database with sample data'

    def handle(self, *args, **options):
        # Create categories
        categories_data = [
            {'name': 'Blood Tests'},
            {'name': 'Heart Health'},
            {'name': 'Diabetes'},
            {'name': 'Thyroid'},
            {'name': 'Liver Function'},
            {'name': 'Kidney Function'},
            {'name': 'Hormone Tests'},
            {'name': 'Infection Tests'},
        ]

        categories = {}
        for cat_data in categories_data:
            cat, created = Category.objects.get_or_create(name=cat_data['name'])
            categories[cat_data['name']] = cat
            if created:
                self.stdout.write(f'Created category: {cat.name}')

        # Create vendors
        vendors_data = [
            {
                'name': 'PathLabs',
                'rating': 4.5,
                'reviews': 2500,
                'is_nabl_certified': True,
                'home_collection': True,
                'online_report': True,
                'offline_report': True,
            },
            {
                'name': 'Dr. Lal PathLabs',
                'rating': 4.7,
                'reviews': 3200,
                'is_nabl_certified': True,
                'home_collection': True,
                'online_report': True,
                'offline_report': True,
            },
            {
                'name': 'Thyrocare',
                'rating': 4.3,
                'reviews': 1800,
                'is_nabl_certified': True,
                'home_collection': True,
                'online_report': True,
                'offline_report': False,
            },
            {
                'name': 'Metropolis Healthcare',
                'rating': 4.6,
                'reviews': 2900,
                'is_nabl_certified': True,
                'home_collection': True,
                'online_report': True,
                'offline_report': True,
            },
            {
                'name': 'Redcliffe Labs',
                'rating': 4.4,
                'reviews': 1500,
                'is_nabl_certified': True,
                'home_collection': True,
                'online_report': True,
                'offline_report': True,
            },
        ]

        vendors = {}
        for vendor_data in vendors_data:
            vendor, created = Vendor.objects.get_or_create(
                name=vendor_data['name'],
                defaults=vendor_data
            )
            vendors[vendor_data['name']] = vendor
            if created:
                self.stdout.write(f'Created vendor: {vendor.name}')

        # Create tests
        tests_data = [
            {
                'name': 'Complete Blood Count (CBC)',
                'description': 'Measures different components of blood including RBC, WBC, hemoglobin, hematocrit, and platelets.',
                'category': 'Blood Tests',
                'parameters': 28,
                'fasting': False,
            },
            {
                'name': 'Lipid Profile',
                'description': 'Tests cholesterol levels including HDL, LDL, triglycerides, and total cholesterol.',
                'category': 'Heart Health',
                'parameters': 8,
                'fasting': True,
            },
            {
                'name': 'Thyroid Profile Total',
                'description': 'Comprehensive thyroid function test including T3, T4, and TSH levels.',
                'category': 'Thyroid',
                'parameters': 3,
                'fasting': False,
            },
            {
                'name': 'HbA1c (Glycated Hemoglobin)',
                'description': 'Measures average blood sugar levels over the past 2-3 months.',
                'category': 'Diabetes',
                'parameters': 1,
                'fasting': False,
            },
            {
                'name': 'Liver Function Test (LFT)',
                'description': 'Assesses liver health and function through various enzyme and protein levels.',
                'category': 'Liver Function',
                'parameters': 11,
                'fasting': False,
            },
            {
                'name': 'Kidney Function Test (KFT)',
                'description': 'Evaluates kidney function through creatinine, urea, and other markers.',
                'category': 'Kidney Function',
                'parameters': 5,
                'fasting': False,
            },
            {
                'name': 'Vitamin D Test',
                'description': 'Measures vitamin D levels in the blood.',
                'category': 'Hormone Tests',
                'parameters': 1,
                'fasting': False,
            },
            {
                'name': 'Dengue NS1 Antigen',
                'description': 'Detects dengue virus NS1 antigen in blood.',
                'category': 'Infection Tests',
                'parameters': 1,
                'fasting': False,
            },
        ]

        tests = {}
        for test_data in tests_data:
            test, created = LabTest.objects.get_or_create(
                name=test_data['name'],
                defaults={
                    'description': test_data['description'],
                    'category': categories[test_data['category']],
                    'parameters': test_data['parameters'],
                    'turnaround_hours': 24,  # Default value
                    'fasting': test_data['fasting'],
                }
            )
            tests[test_data['name']] = test
            if created:
                self.stdout.write(f'Created test: {test.name}')

        # Create pricing
        pricing_data = [
            # CBC
            {'test': 'Complete Blood Count (CBC)', 'vendor': 'PathLabs', 'price': 350, 'original_price': 500, 'discount_percent': 30, 'report_eta_hours': 24, 'eta': '24 hours'},
            {'test': 'Complete Blood Count (CBC)', 'vendor': 'Dr. Lal PathLabs', 'price': 400, 'original_price': 550, 'discount_percent': 27, 'report_eta_hours': 12, 'eta': '12 hours'},
            {'test': 'Complete Blood Count (CBC)', 'vendor': 'Thyrocare', 'price': 320, 'original_price': 450, 'discount_percent': 29, 'report_eta_hours': 36, 'eta': '36 hours'},
            {'test': 'Complete Blood Count (CBC)', 'vendor': 'Metropolis Healthcare', 'price': 380, 'original_price': 520, 'discount_percent': 27, 'report_eta_hours': 18, 'eta': '18 hours'},
            {'test': 'Complete Blood Count (CBC)', 'vendor': 'Redcliffe Labs', 'price': 340, 'original_price': 480, 'discount_percent': 29, 'report_eta_hours': 24, 'eta': '24 hours'},

            # Lipid Profile
            {'test': 'Lipid Profile', 'vendor': 'PathLabs', 'price': 450, 'original_price': 600, 'discount_percent': 25, 'report_eta_hours': 24},
            {'test': 'Lipid Profile', 'vendor': 'Dr. Lal PathLabs', 'price': 500, 'original_price': 650, 'discount_percent': 23, 'report_eta_hours': 12},
            {'test': 'Lipid Profile', 'vendor': 'Thyrocare', 'price': 420, 'original_price': 550, 'discount_percent': 24, 'report_eta_hours': 36},
            {'test': 'Lipid Profile', 'vendor': 'Metropolis Healthcare', 'price': 480, 'original_price': 620, 'discount_percent': 23, 'report_eta_hours': 18},
            {'test': 'Lipid Profile', 'vendor': 'Redcliffe Labs', 'price': 440, 'original_price': 580, 'discount_percent': 24, 'report_eta_hours': 24},

            # Thyroid Profile
            {'test': 'Thyroid Profile Total', 'vendor': 'PathLabs', 'price': 380, 'original_price': 500, 'discount_percent': 24, 'report_eta_hours': 24},
            {'test': 'Thyroid Profile Total', 'vendor': 'Dr. Lal PathLabs', 'price': 420, 'original_price': 550, 'discount_percent': 24, 'report_eta_hours': 12},
            {'test': 'Thyroid Profile Total', 'vendor': 'Thyrocare', 'price': 350, 'original_price': 450, 'discount_percent': 22, 'report_eta_hours': 36},
            {'test': 'Thyroid Profile Total', 'vendor': 'Metropolis Healthcare', 'price': 400, 'original_price': 520, 'discount_percent': 23, 'report_eta_hours': 18},
            {'test': 'Thyroid Profile Total', 'vendor': 'Redcliffe Labs', 'price': 370, 'original_price': 480, 'discount_percent': 23, 'report_eta_hours': 24},

            # HbA1c
            {'test': 'HbA1c (Glycated Hemoglobin)', 'vendor': 'PathLabs', 'price': 280, 'original_price': 350, 'discount_percent': 20, 'report_eta_hours': 24},
            {'test': 'HbA1c (Glycated Hemoglobin)', 'vendor': 'Dr. Lal PathLabs', 'price': 320, 'original_price': 400, 'discount_percent': 20, 'report_eta_hours': 12},
            {'test': 'HbA1c (Glycated Hemoglobin)', 'vendor': 'Thyrocare', 'price': 260, 'original_price': 320, 'discount_percent': 19, 'report_eta_hours': 36},
            {'test': 'HbA1c (Glycated Hemoglobin)', 'vendor': 'Metropolis Healthcare', 'price': 300, 'original_price': 380, 'discount_percent': 21, 'report_eta_hours': 18},
            {'test': 'HbA1c (Glycated Hemoglobin)', 'vendor': 'Redcliffe Labs', 'price': 270, 'original_price': 340, 'discount_percent': 21, 'report_eta_hours': 24},

            # LFT
            {'test': 'Liver Function Test (LFT)', 'vendor': 'PathLabs', 'price': 520, 'original_price': 700, 'discount_percent': 26, 'report_eta_hours': 24},
            {'test': 'Liver Function Test (LFT)', 'vendor': 'Dr. Lal PathLabs', 'price': 580, 'original_price': 750, 'discount_percent': 23, 'report_eta_hours': 12},
            {'test': 'Liver Function Test (LFT)', 'vendor': 'Thyrocare', 'price': 480, 'original_price': 650, 'discount_percent': 26, 'report_eta_hours': 36},
            {'test': 'Liver Function Test (LFT)', 'vendor': 'Metropolis Healthcare', 'price': 550, 'original_price': 720, 'discount_percent': 24, 'report_eta_hours': 18},
            {'test': 'Liver Function Test (LFT)', 'vendor': 'Redcliffe Labs', 'price': 500, 'original_price': 680, 'discount_percent': 26, 'report_eta_hours': 24},

            # KFT
            {'test': 'Kidney Function Test (KFT)', 'vendor': 'PathLabs', 'price': 320, 'original_price': 420, 'discount_percent': 24, 'report_eta_hours': 24},
            {'test': 'Kidney Function Test (KFT)', 'vendor': 'Dr. Lal PathLabs', 'price': 360, 'original_price': 470, 'discount_percent': 23, 'report_eta_hours': 12},
            {'test': 'Kidney Function Test (KFT)', 'vendor': 'Thyrocare', 'price': 300, 'original_price': 400, 'discount_percent': 25, 'report_eta_hours': 36},
            {'test': 'Kidney Function Test (KFT)', 'vendor': 'Metropolis Healthcare', 'price': 340, 'original_price': 450, 'discount_percent': 24, 'report_eta_hours': 18},
            {'test': 'Kidney Function Test (KFT)', 'vendor': 'Redcliffe Labs', 'price': 310, 'original_price': 410, 'discount_percent': 24, 'report_eta_hours': 24},

            # Vitamin D
            {'test': 'Vitamin D Test', 'vendor': 'PathLabs', 'price': 1200, 'original_price': 1500, 'discount_percent': 20, 'report_eta_hours': 24},
            {'test': 'Vitamin D Test', 'vendor': 'Dr. Lal PathLabs', 'price': 1350, 'original_price': 1650, 'discount_percent': 18, 'report_eta_hours': 12},
            {'test': 'Vitamin D Test', 'vendor': 'Thyrocare', 'price': 1100, 'original_price': 1400, 'discount_percent': 21, 'report_eta_hours': 36},
            {'test': 'Vitamin D Test', 'vendor': 'Metropolis Healthcare', 'price': 1250, 'original_price': 1550, 'discount_percent': 19, 'report_eta_hours': 18},
            {'test': 'Vitamin D Test', 'vendor': 'Redcliffe Labs', 'price': 1150, 'original_price': 1450, 'discount_percent': 21, 'report_eta_hours': 24},

            # Dengue
            {'test': 'Dengue NS1 Antigen', 'vendor': 'PathLabs', 'price': 450, 'original_price': 550, 'discount_percent': 18, 'report_eta_hours': 6},
            {'test': 'Dengue NS1 Antigen', 'vendor': 'Dr. Lal PathLabs', 'price': 500, 'original_price': 600, 'discount_percent': 17, 'report_eta_hours': 4},
            {'test': 'Dengue NS1 Antigen', 'vendor': 'Thyrocare', 'price': 420, 'original_price': 520, 'discount_percent': 19, 'report_eta_hours': 8},
            {'test': 'Dengue NS1 Antigen', 'vendor': 'Metropolis Healthcare', 'price': 480, 'original_price': 580, 'discount_percent': 17, 'report_eta_hours': 6},
            {'test': 'Dengue NS1 Antigen', 'vendor': 'Redcliffe Labs', 'price': 430, 'original_price': 530, 'discount_percent': 19, 'report_eta_hours': 6},
        ]

        for price_data in pricing_data:
            test = tests[price_data['test']]
            vendor = vendors[price_data['vendor']]

            pricing, created = TestPricing.objects.get_or_create(
                test=test,
                vendor=vendor,
                defaults={
                    'price': price_data['price'],
                    'discount_percent': price_data['discount_percent'],
                    'report_eta_hours': price_data['report_eta_hours'],
                    'eta': price_data.get('eta', '24 hours'),
                    'original_price': price_data.get('original_price'),
                }
            )

            if created:
                self.stdout.write(f'Created pricing: {test.name} - {vendor.name} - ₹{pricing.price}')

        self.stdout.write(self.style.SUCCESS('Successfully populated database with sample data'))