from rest_framework import serializers
from task_app.models import User, Task


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'age']

    def validate_age(self, value):
        if value < 18:
            raise serializers.ValidationError("User must be at least 18 years old.")
        return value


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'user', 'name', 'desc']

    def validate_user(self, value):
        if not User.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("User not found.")
        return value
