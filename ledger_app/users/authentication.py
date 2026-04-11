import jwt
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.request import Request

from .jwt_util import verify_token_and_get_claims
from .models import User


class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request: Request):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return None  # No token provided — let DRF permission classes decide

        token = auth_header.split(" ", 1)[1]

        try:
            claims = verify_token_and_get_claims(token)
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token has expired.")
        except jwt.InvalidTokenError:
            raise AuthenticationFailed("Invalid token.")

        try:
            user = User.objects.get(id=claims["user_id"])
        except User.DoesNotExist:
            raise AuthenticationFailed("User not found.")

        return (user, token)
