import random
import string

def generar_pwd_seguro():
    mayuscula = random.choice(string.ascii_uppercase)
    minuscula = random.choice(string.ascii_lowercase)
    numero = random.choice(string.digits)

    restantes = random.choices("abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTVWXYZ98765432", k=5)

    pwd = list(mayuscula + minuscula + numero + ''.join(restantes))
    random.shuffle(pwd)
    return ''.join(pwd)

# Ejemplo
print(generar_pwd_seguro())