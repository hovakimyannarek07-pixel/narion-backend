from django.db import migrations, models
from django.db.models import deletion


class Migration(migrations.Migration):
    dependencies = [("properties", "0001_initial")]

    operations = [
        migrations.AlterField(
            model_name="inquiry",
            name="property",
            field=models.ForeignKey(
                to="properties.property",
                related_name="inquiries",
                on_delete=deletion.CASCADE,
                null=True,
                blank=True,
            ),
        ),
    ]
