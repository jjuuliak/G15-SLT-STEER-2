import secrets
import string

import bcrypt
from fastapi_jwt import JwtAccessBearer, JwtRefreshBearer


# TODO: Maybe these should be saved over server restart
characters = string.ascii_letters + string.digits + string.punctuation
access_security = JwtAccessBearer(secret_key="".join(secrets.choice(characters) for _ in range(32)), auto_error=True)
refresh_security = JwtRefreshBearer(secret_key="".join(secrets.choice(characters) for _ in range(64)), auto_error=True)
del characters


invalid_refresh_tokens = set()


class AuthService:

    @staticmethod
    def is_refresh_token_expired(token: str) -> bool:
        """
        Checks if refresh token has expired due to logout
        """

        return token in invalid_refresh_tokens


    @staticmethod
    def set_refresh_token_expired(token: str):
        """
        Mark refresh token as expired due to logout
        """

        invalid_refresh_tokens.add(token)


    @staticmethod
    def get_refresh_security():
        """
        Get refresh token authentication
        """
        return refresh_security


    @staticmethod
    def get_access_security():
        """
        Get access token authentication
        """
        return access_security


    @staticmethod
    def hash_password(password: str) -> str:
        """
        Hashes the given password
        """

        return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode()


    @staticmethod
    def check_password(password: str, hash: str) -> bool:
        """
        Checks if the given password matches the user's stored password hash
        """

        return bcrypt.checkpw(password.encode("utf-8"), hash.encode("utf-8"))
