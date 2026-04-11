import bcrypt

UTF_8 = "utf-8"


def hash_password(raw_password: str) -> str:
    hashed = bcrypt.hashpw(raw_password.encode(UTF_8), bcrypt.gensalt())
    return hashed.decode(UTF_8)


def verify_password(raw_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(raw_password.encode(UTF_8), hashed_password.encode(UTF_8))
