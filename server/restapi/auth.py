import json
from functools import wraps
from .models import AppUser
from jose import jwt
import requests

AUTH0_DOMAIN = 'bestbid.us.auth0.com'
API_AUDIENCE = 'https://bestbid.us.auth0.com/api/v2/'
ALGORITHMS = ["RS256"]


def is_valid_token(token):
    """
   Fetch user details
   """
    # jwks = requests.get('https://{}/.well-known/jwks.json'.format(AUTH0_DOMAIN)).json() # every time request for fetching jwk
    file = open("jwk.json", 'r')
    jwks = json.loads(file.read())
    file.close()
    unverified_header = jwt.get_unverified_header(token)
    public_key = None
    for jwk in jwks['keys']:
        if jwk['kid'] == unverified_header['kid']:
            public_key = {
                'kty': jwk['kty'],
                'kid': jwk['kid'],
                'use': jwk['use'],
                'n': jwk['n'],
                'e': jwk['e']
            }

    if public_key is None:
        raise Exception('Public key not found.')
    try:
        payload = jwt.decode(
            token,
            public_key,
            algorithms=ALGORITHMS,
            audience=API_AUDIENCE,
            issuer='https://' + AUTH0_DOMAIN + '/'
        )
        return payload
    except Exception as e:
        print(str(e))
    return None


def get_auth_token(request):
    """
    Obtains the Access Token from the Authorization Header
    and do Basic format checkups
    """
    auth = request.headers.get("Authorization", None)
    if not auth:
        return {"code": "authorization_header_missing",
                "description":
                    "Authorization header is expected"}, 401

    parts = auth.split()

    if parts[0].lower() != "bearer":
        return {"code": "invalid_header",
                "description":
                    "Authorization header must start with"
                    " Bearer"}, 401
    elif len(parts) == 1:
        return {"code": "invalid_header",
                "description": "Token not found"}, 401
    elif len(parts) > 2:
        return {"code": "invalid_header",
                "description":
                    "Authorization header must be"
                    " Bearer token"}, 401

    token = parts[1]
    return token


def handle_user(request) -> dict:
    try:
        auth_token = get_auth_token(request)
        user_payload = is_valid_token(auth_token)
        user = AppUser.objects.filter(pk=user_payload['sub']).first()
        if not user:
            url = "https://" + AUTH0_DOMAIN + "/userinfo"
            my_headers = {"Authorization": f"Bearer {auth_token}"}
            response = requests.get(url, headers=my_headers, data={})
            user = json.loads(response.text)
            user = AppUser.objects.create(id=user['sub'], name=user['name'], email=user['email'])
        return {"user_id": user.id, "res": True}
    except Exception as e:
        print(str(e))
        return {"user_id": None, "res": False}
