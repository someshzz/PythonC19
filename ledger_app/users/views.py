from rest_framework.viewsets import ModelViewSet

from .models import Account, User
from .serializers import AccountSerializer, UserSerializer


class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class AccountViewSet(ModelViewSet):
    # This is allowing the ModelViewSet to perform a JOIN on user and account table
    queryset = Account.objects.select_related('user').all()
    serializer_class = AccountSerializer
