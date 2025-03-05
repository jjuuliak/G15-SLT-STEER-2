import secrets
import string

import bcrypt
from fastapi_jwt import JwtAccessBearer


# TODO: Maybe this should not be random to work over server restart
characters = string.ascii_letters + string.digits + string.punctuation
access_security = JwtAccessBearer(secret_key="".join(secrets.choice(characters) for _ in range(32)), auto_error=True)
del characters


class AuthService:

    @staticmethod
    def get_access_security():
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