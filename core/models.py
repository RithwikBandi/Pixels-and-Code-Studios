from django.db import models


class ContactMessage(models.Model):
    """Project inquiry submitted from the contact page."""

    name = models.CharField(max_length=120)
    email = models.EmailField()
    service = models.CharField(max_length=80, blank=True)
    budget = models.CharField(max_length=40, blank=True)
    message = models.TextField(max_length=4000)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.name} <{self.email}> — {self.created_at:%Y-%m-%d}'
