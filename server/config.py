import datetime
import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY")
    SQLALCHEMY_TRACK_MODIFICATION = False


class DevConfig(Config):
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    JWT_ACCESS_TOKEN_EXPIRES = datetime.timedelta(days=30)
    JWT_REFRESH_TOKEN_EXPIRES = datetime.timedelta(days=30)
    DEBUG = True
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_DATABASE_URI = f'postgresql://{os.getenv("DB_USER")}:{os.getenv("DB_PASSWORD_LOCAL")}@{os.getenv("DB_HOST_LOCAL")}/{os.getenv("DB_NAME")}'


class ProdConfig(Config):
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    JWT_ACCESS_TOKEN_EXPIRES = datetime.timedelta(days=30)
    JWT_REFRESH_TOKEN_EXPIRES = datetime.timedelta(days=30)
    DEBUG = False
    SQLALCHEMY_ECHO = False
    SQLALCHEMY_DATABASE_URI = f'postgresql://{os.getenv("DB_USER")}:{os.getenv("DB_PASSWORD_SERVER")}@{os.getenv("DB_HOST_SERVER")}/{os.getenv("DB_NAME")}'
