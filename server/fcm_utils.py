from typing import Any
import firebase_admin
from firebase_admin import messaging, credentials
import json
import os
from dotenv import load_dotenv

load_dotenv()

# Load the JSON configuration file
with open("./serviceAccountKey.json", "r") as f:
    serviceAccountKey = json.load(f)

# Update the values in the configuration file
serviceAccountKey["type"] = os.getenv("TYPE")
serviceAccountKey["project_id"] = os.getenv("PROJECT_ID")
serviceAccountKey["private_key_id"] = os.getenv("PRIVATE_KEY_ID")
serviceAccountKey["private_key"] = os.getenv("PRIVATE_KEY")
serviceAccountKey["client_email"] = os.getenv("CLIENT_EMAIL")
serviceAccountKey["client_id"] = os.getenv("CLIENT_ID")
serviceAccountKey["auth_uri"] = os.getenv("AUTH_URI")
serviceAccountKey["token_uri"] = os.getenv("TOKEN_URI")
serviceAccountKey["auth_provider_x509_cert_url"] = os.getenv(
    "AUTH_PROVIDER_X509_CERT_URL"
)
serviceAccountKey["client_x509_cert_url"] = os.getenv("CLIENT_X509_CERT_URL")
serviceAccountKey["universe_domain"] = os.getenv("UNIVERSE_DOMAIN")

with open("./serviceAccountKey.json", "w") as f:
    json.dump(serviceAccountKey, f, indent=2)


class FcmUtils:
    def __init__(self):
        # Initialize Firebase app
        firebase_cred = credentials.Certificate("./serviceAccountKey.json")
        firebase_admin.initialize_app(firebase_cred)

    # send_to_token
    # Send a message to a specific token
    # registration_token: The token to send the message to
    # data: The data to send to the token, should be dictionary
    # example
    def send_to_token(self, registration_token, title, body, data=None):
        message = messaging.Message(
            notification=messaging.Notification(
                title=title,
                body=body,
            ),
            data=data,
            token=registration_token,
        )
        response = messaging.send(message)
        print(response)
        return response

    # send_to_token_multicast
    # Send a message to a specific tokens
    # registration_tokens: The tokens to send the message to
    # data: The data to send to the tokens, should be dictionary
    def send_to_token_multicast(self, registration_tokens, title, body, data=None):
        # registration_tokens has to be a list
        assert isinstance(registration_tokens, list)

        message = messaging.MulticastMessage(
            notification=messaging.Notification(
                title=title,
                body=body,
            ),
            data=data,
            tokens=registration_tokens,
        )
        response = messaging.send_multicast(message)
        print(response)
        # See the BatchResponse reference documentation
        # for the contents of response.
        return response
