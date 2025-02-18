import bcrypt

class AuthService:

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