from django.core.management.base import BaseCommand

from properties.models import Region, City, District, Developer, Agent, Property


class Command(BaseCommand):
    help = "Seed realistic demo data for Yerevan, Tsaghkadzor, Armavir"

    def handle(self, *args, **options):
        if Property.objects.exists():
            self.stdout.write("Demo data already present, skipping.")
            return

        yerevan_region, _ = Region.objects.get_or_create(name="Yerevan")
        kotayk_region, _ = Region.objects.get_or_create(name="Kotayk")
        armavir_region, _ = Region.objects.get_or_create(name="Armavir")

        yerevan, _ = City.objects.get_or_create(region=yerevan_region, name="Yerevan")
        tsaghkadzor, _ = City.objects.get_or_create(region=kotayk_region, name="Tsaghkadzor")
        armavir_city, _ = City.objects.get_or_create(region=armavir_region, name="Armavir")

        districts = {}
        for name in ["Kentron", "Arabkir", "Ajapnyak", "Avan", "Davtashen", "Erebuni",
                     "Kanaker-Zeytun", "Malatia-Sebastia", "Nor Nork", "Nork-Marash", "Shengavit"]:
            districts[name], _ = District.objects.get_or_create(city=yerevan, name=name)
        districts["Tsaghkadzor Center"], _ = District.objects.get_or_create(city=tsaghkadzor, name="Center")
        districts["Armavir Center"], _ = District.objects.get_or_create(city=armavir_city, name="Center")

        dev, _ = Developer.objects.get_or_create(name="Narion Development", defaults={
            "description": "Sample developer for demo data",
        })
        agent, _ = Agent.objects.get_or_create(name="Ani Petrosyan", defaults={
            "phone": "+374 55 123456", "email": "ani@narion.am",
        })

        sample = [
            dict(title_en="Modern 2-bedroom apartment", district=districts["Arabkir"],
                 latitude=40.1936, longitude=44.4922, listing_type="sale", market_type="secondary",
                 property_type="apartment", price=65000, currency="USD", area_sqm=78, rooms=3, bedrooms=2),
            dict(title_en="Cozy studio near Republic Square", district=districts["Kentron"],
                 latitude=40.1772, longitude=44.5126, listing_type="rent", market_type="secondary",
                 property_type="apartment", price=350000, currency="AMD", area_sqm=40, rooms=1, bedrooms=1),
            dict(title_en="New-build apartment in Davtashen", district=districts["Davtashen"],
                 latitude=40.2126, longitude=44.4599, listing_type="sale", market_type="primary",
                 property_type="apartment", price=98000, currency="USD", area_sqm=95, rooms=4, bedrooms=3, developer=dev),
            dict(title_en="Family house in Nor Nork", district=districts["Nor Nork"],
                 latitude=40.1961, longitude=44.5535, listing_type="sale", market_type="secondary",
                 property_type="house", price=230000, currency="USD", area_sqm=180, rooms=6, bedrooms=4),
            dict(title_en="Mountain-view chalet in Tsaghkadzor", district=districts["Tsaghkadzor Center"],
                 latitude=40.5378, longitude=44.7217, listing_type="sale", market_type="secondary",
                 property_type="villa", price=590000, currency="USD", area_sqm=340, rooms=8, bedrooms=5),
            dict(title_en="Countryside plot near Armavir", district=districts["Armavir Center"],
                 latitude=40.1512, longitude=44.0432, listing_type="sale", market_type="secondary",
                 property_type="land", price=45000, currency="USD", area_sqm=1200),
        ]

        for data in sample:
            Property.objects.create(agent=agent, is_published=True, **data)

        self.stdout.write(self.style.SUCCESS(f"Seeded {len(sample)} demo properties."))
